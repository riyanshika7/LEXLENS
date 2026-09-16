"""Dual-engine AI service supporting Google Gemini 2.5 with a deterministic local legal fallback."""

import json
import logging
import os
import re
import uuid
from typing import Dict, List, Optional, Tuple
from backend.config import settings
from backend.schemas.analysis import (
    ClauseItem,
    DeadlineItem,
    DocumentSummary,
    ObligationItem,
    PotentialConcern,
)
from backend.schemas.chat import EvidenceCitation, GroundedAnswer
from backend.schemas.document import DocumentChunk, DocumentContent
from backend.services.clause_classifier import ClauseClassifier
from backend.services.retriever import BM25Retriever

logger = logging.getLogger("lexlens.ai")


# Precompiled regex patterns for legal entity and term extraction
PARTY_PATTERNS = [
    re.compile(r"between\s+([A-Z][A-Za-z0-9\s,\.\(\)]+?)\s+(?:\(\"[^\"]+\"\)|and)\s+(?:and\s+)?([A-Z][A-Za-z0-9\s,\.\(\)]+?)(?:\s*\(\"[^\"]+\"\)|\s*,|\s*dated)", re.IGNORECASE),
    re.compile(r"by and between\s+([^,]+?)(?:,\s*a\s+[^,]+)?\s+and\s+([^,]+?)(?:,\s*a\s+[^,]+)?", re.IGNORECASE),
    re.compile(r"(?:Landlord|Lessor|Employer|Company|Disclosing Party)\s*:\s*([^\n\r]+)", re.IGNORECASE),
    re.compile(r"(?:Tenant|Lessee|Employee|Contractor|Receiving Party)\s*:\s*([^\n\r]+)", re.IGNORECASE),
]

DATE_PATTERNS = [
    re.compile(r"(?:effective|commencement|dated|starting)\s+(?:as of|date\s*:?)\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})", re.IGNORECASE),
    re.compile(r"(?:expire|expiration|termination|end)\s+(?:date\s*:?|on)\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})", re.IGNORECASE),
    re.compile(r"(?:within\s+\d+\s+(?:days|business days|months)|upon\s+\d+\s+days'\s+written notice)", re.IGNORECASE),
    re.compile(r"\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b"),
]

DOC_TYPE_INDICATORS = {
    "Commercial Lease Agreement": ["lease agreement", "premises", "landlord", "tenant", "rent", "security deposit", "sublease"],
    "Non-Disclosure Agreement (NDA)": ["non-disclosure", "confidentiality agreement", "confidential information", "disclosing party", "receiving party"],
    "Independent Contractor Agreement": ["independent contractor", "consultant", "statement of work", "deliverables", "invoicing", "client"],
    "Employment Agreement": ["employment agreement", "employee", "employer", "base salary", "duties", "at-will employment", "benefits"],
    "Software as a Service (SaaS) Agreement": ["saas", "subscription", "service terms", "uptime", "acceptable use", "end user"],
    "Severance / Separation Agreement": ["severance", "separation agreement", "release of claims", "waiver", "consideration", "separation date"],
}


class AIService:
    """Manages document analysis and conversational Q&A via Gemini with deterministic fallback."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.model_name = settings.GEMINI_MODEL
        self._gemini_client = None

        if self.api_key:
            try:
                from google import genai
                self._gemini_client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Google GenAI client successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize google-genai client: {e}. Fallback active.")

    @property
    def is_live_gemini_active(self) -> bool:
        """Returns True if live Gemini API is configured and operational."""
        return self._gemini_client is not None

    def analyze_document(self, doc_content: DocumentContent) -> Tuple[
        DocumentSummary,
        List[ClauseItem],
        List[ObligationItem],
        List[DeadlineItem],
        List[PotentialConcern],
    ]:
        """Perform comprehensive document intelligence extraction."""
        # Step 1: Classify clauses from chunks
        clauses = ClauseClassifier.classify_chunks(doc_content.chunks)

        # Step 2: Attempt Gemini LLM structured extraction if configured
        if self.is_live_gemini_active:
            try:
                summary, obligations, deadlines, concerns = self._analyze_with_gemini(doc_content, clauses)
                return summary, clauses, obligations, deadlines, concerns
            except Exception as e:
                logger.warning(f"Gemini API call failed: {e}. Falling back to deterministic NLP engine.")

        # Step 3: Local Deterministic NLP Engine
        summary, obligations, deadlines, concerns = self._analyze_deterministically(doc_content, clauses)
        return summary, clauses, obligations, deadlines, concerns

    def _analyze_deterministically(
        self, doc_content: DocumentContent, clauses: List[ClauseItem]
    ) -> Tuple[
        DocumentSummary,
        List[ObligationItem],
        List[DeadlineItem],
        List[PotentialConcern],
    ]:
        """Deterministic, rule-based legal NLP extraction for offline and fallback operation."""
        text = doc_content.raw_text
        text_lower = text.lower()

        # 1. Document Type Detection
        detected_type = "Legal Agreement"
        highest_score = 0
        for doc_type, kws in DOC_TYPE_INDICATORS.items():
            score = sum(1 for kw in kws if kw in text_lower)
            if score > highest_score:
                highest_score = score
                detected_type = doc_type

        # 2. Extract Parties
        parties = []
        for pat in PARTY_PATTERNS:
            matches = pat.findall(text[:4000])
            for m in matches:
                if isinstance(m, tuple):
                    for part in m:
                        clean_part = part.strip().strip('"').strip("'")
                        if len(clean_part) > 2 and len(clean_part) < 60 and clean_part not in parties:
                            parties.append(clean_part)
                elif isinstance(m, str):
                    clean_part = m.strip().strip('"').strip("'")
                    if len(clean_part) > 2 and len(clean_part) < 60 and clean_part not in parties:
                        parties.append(clean_part)

        if not parties:
            parties = ["Not explicitly named in preamble"]

        # 3. Extract Dates & Deadlines
        deadlines: List[DeadlineItem] = []
        important_dates: List[str] = []

        for chunk in doc_content.chunks:
            for d_pat in DATE_PATTERNS:
                matches = d_pat.findall(chunk.text)
                for match in matches:
                    date_str = match.strip() if isinstance(match, str) else match[0].strip()
                    if date_str and date_str not in important_dates and len(date_str) < 40:
                        important_dates.append(date_str)
                        deadlines.append(
                            DeadlineItem(
                                deadline_id=f"deadline_{len(deadlines)+1}_{uuid.uuid4().hex[:4]}",
                                title=f"Timeline in {chunk.section_title}",
                                date_or_trigger=date_str,
                                is_explicit=bool(re.search(r"\d{4}", date_str)),
                                consequence="Check corresponding clause for late penalties or loss of rights",
                                source_clause_title=chunk.section_title,
                                page_number=chunk.page_number,
                            )
                        )
                        if len(deadlines) >= 8:
                            break
            if len(deadlines) >= 8:
                break

        if not important_dates:
            important_dates = ["No explicit calendar milestone dates found in the document text."]

        # 4. Extract Obligations
        obligations: List[ObligationItem] = []
        duty_keywords = [
            ("shall pay", "Payment duty", "Payment of stipulated amounts"),
            ("shall maintain", "Maintenance duty", "Maintain required condition or insurance"),
            ("shall not disclose", "Confidentiality duty", "Refrain from unauthorized disclosure"),
            ("shall provide", "Provision duty", "Furnish documents, reports, or notices"),
            ("shall indemnify", "Indemnification duty", "Defend and hold harmless counterparty"),
            ("agrees to", "Agreement covenant", "Comply with designated terms"),
            ("must deliver", "Delivery duty", "Deliver required notices or deliverables"),
        ]

        for chunk in doc_content.chunks:
            for kw, title, desc in duty_keywords:
                if kw in chunk.text.lower():
                    # Extract sentence
                    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", chunk.text) if kw in s.lower()]
                    excerpt = sentences[0][:200] if sentences else chunk.text[:200]
                    party = "Contracting Party"
                    if "tenant" in chunk.text.lower():
                        party = "Tenant"
                    elif "contractor" in chunk.text.lower():
                        party = "Contractor"
                    elif "employee" in chunk.text.lower():
                        party = "Employee"
                    elif "receiving party" in chunk.text.lower():
                        party = "Receiving Party"

                    obligations.append(
                        ObligationItem(
                            obligation_id=f"ob_{len(obligations)+1}_{uuid.uuid4().hex[:4]}",
                            responsible_party=party,
                            action=desc,
                            deadline_or_frequency="As specified in clause",
                            source_clause_title=chunk.section_title,
                            page_number=chunk.page_number,
                            excerpt=excerpt,
                        )
                    )
                    if len(obligations) >= 8:
                        break
            if len(obligations) >= 8:
                break

        # 5. Extract Potential Concerns
        concerns: List[PotentialConcern] = []
        for clause in clauses:
            if clause.category in ["Indemnification", "Liability", "Restrictions", "Dispute Resolution"]:
                concerns.append(
                    PotentialConcern(
                        concern_id=f"concern_{len(concerns)+1}_{uuid.uuid4().hex[:4]}",
                        title=f"Potentially Important {clause.category} Clause",
                        category="Requires Review",
                        description=clause.why_it_matters,
                        severity="high" if clause.category in ["Indemnification", "Restrictions"] else "medium",
                        document_excerpt=clause.excerpt,
                        page_number=clause.page_number,
                        professional_review_advice=f"Ask a qualified attorney if this {clause.category} term is customary or if it can be negotiated to be mutual and capped.",
                    )
                )

        if not concerns:
            concerns.append(
                PotentialConcern(
                    concern_id=f"concern_1_{uuid.uuid4().hex[:4]}",
                    title="Standard Document Review",
                    category="Potentially Important Clause",
                    description="No extreme one-sided penalty clauses detected, but all commitments require verification.",
                    severity="low",
                    document_excerpt=clauses[0].excerpt if clauses else "General document text",
                    page_number=1,
                    professional_review_advice="Review key financial and termination conditions with an advisor.",
                )
            )

        # 6. Assemble Document Summary
        clause_titles = [c.title for c in clauses[:5]]
        missing_info = []
        if not any("dispute" in c.category.lower() or "arbitration" in c.category.lower() for c in clauses):
            missing_info.append("No explicit dispute resolution or arbitration procedure found.")
        if not any("governing" in c.category.lower() for c in clauses):
            missing_info.append("No explicit choice of governing law or jurisdiction found.")
        if not any("termination" in c.category.lower() for c in clauses):
            missing_info.append("No clear termination or exit conditions detected.")
        if not missing_info:
            missing_info.append("Document appears structurally complete with standard provisions.")

        summary = DocumentSummary(
            doc_type=detected_type,
            purpose=f"Establishes legal rights and responsibilities between the parties regarding {detected_type.lower()}.",
            parties=parties[:4],
            jurisdiction_statement=f"Selected jurisdiction: {doc_content.metadata.jurisdiction_country}, {doc_content.metadata.jurisdiction_state}",
            important_dates=important_dates[:5],
            key_obligations=[o.action for o in obligations[:4]],
            important_clauses=clause_titles,
            potential_concerns=[c.title for c in concerns[:4]],
            missing_information=missing_info,
            questions_to_ask=[
                "Are the notice periods realistically manageable before deadlines trigger?",
                "Is the indemnification clause reciprocal or one-sided?",
                "What happens to pre-existing intellectual property or trade secrets?",
                "Are there any automatic renewal clauses that require advance calendar alerts?",
            ],
            next_steps=[
                "Confirm all named parties, legal entities, and physical addresses are accurate.",
                "Review the marked high-attention clauses with a legal professional.",
                "Add explicit calendar reminders for all stated deadlines and notice windows.",
                "Keep an executed copy in secure storage.",
            ],
        )

        return summary, obligations, deadlines, concerns

    def answer_query(
        self, doc_content: DocumentContent, retriever: BM25Retriever, question: str
    ) -> GroundedAnswer:
        """Answer user questions with strict document grounding and verbatim evidence citations."""
        from backend.services.retriever import tokenize
        query_tokens = tokenize(question)
        ranked_chunks = retriever.retrieve(question, top_k=4)

        # Calculate token coverage: how many query tokens actually appear in top chunk
        top_chunk_match = False
        if ranked_chunks and query_tokens:
            top_chunk, top_score = ranked_chunks[0]
            chunk_tokens = set(tokenize(top_chunk.text) + tokenize(top_chunk.section_title))
            matched_tokens = [t for t in query_tokens if t in chunk_tokens]
            coverage = len(matched_tokens) / max(len(query_tokens), 1)
            # Require at least 40% query token match or high score with multiple keywords
            if coverage >= 0.40 or (top_score >= 1.5 and len(matched_tokens) >= 2):
                top_chunk_match = True

        # If retriever found zero relevance or low coverage
        if not ranked_chunks or not top_chunk_match:
            return GroundedAnswer(
                answer="I couldn't find this information in the uploaded document.",
                document_evidence=[],
                explanation="The uploaded document does not appear to contain provisions addressing this specific inquiry.",
                uncertainty="Because this topic is not mentioned in the agreement, general statutory defaults or unwritten terms might apply. You should ask a lawyer if this is a required term in your jurisdiction.",
                next_step="Consult a qualified legal professional to determine whether a missing clause on this subject poses a legal or operational risk.",
                confidence=0.95,
                is_found_in_document=False,
            )

        top_chunk, top_score = ranked_chunks[0]

        # Extract evidence citations
        citations: List[EvidenceCitation] = []
        for chunk, score in ranked_chunks[:3]:
            # Extract sentence with most overlap
            citations.append(
                EvidenceCitation(
                    chunk_id=chunk.chunk_id,
                    page_number=chunk.page_number,
                    section_title=chunk.section_title,
                    exact_excerpt=chunk.text[:280] + ("..." if len(chunk.text) > 280 else ""),
                )
            )

        # Build grounded response
        evidence_text = top_chunk.text
        section_name = top_chunk.section_title

        answer_body = (
            f"Based on Section '{section_name}' (Page {top_chunk.page_number}), "
            f"the document states: \"{evidence_text[:180].strip()}...\""
        )

        return GroundedAnswer(
            answer=answer_body,
            document_evidence=citations,
            explanation=f"This section establishes the operative terms regarding {section_name.lower()}. It clarifies duties and rights for the parties involved.",
            uncertainty="Legal interpretation depends on jurisdiction and whether any subsequent amendments or riders modify this provision.",
            next_step="Verify whether you have met all conditions described in this section, and consider asking a legal professional how local courts interpret similar language.",
            confidence=min(0.85 + (top_score * 0.02), 0.98),
            is_found_in_document=True,
        )

    def _analyze_with_gemini(
        self, doc_content: DocumentContent, clauses: List[ClauseItem]
    ) -> Tuple[DocumentSummary, List[ObligationItem], List[DeadlineItem], List[PotentialConcern]]:
        """Call live Gemini API to get structured JSON analysis."""
        prompt = f"""You are LexLens, a legal document intelligence AI. Analyze this legal document.
IMPORTANT SAFETY:
- Do not provide legal advice.
- If information is missing, state 'Not found in the uploaded document.'
- Distinguish document facts from potential concerns.

DOCUMENT TEXT (Excerpts):
{doc_content.raw_text[:8000]}

Return a valid JSON object matching this exact structure:
{{
  "doc_type": "string",
  "purpose": "string",
  "parties": ["string"],
  "jurisdiction_statement": "string",
  "important_dates": ["string"],
  "key_obligations": ["string"],
  "important_clauses": ["string"],
  "potential_concerns": ["string"],
  "missing_information": ["string"],
  "questions_to_ask": ["string"],
  "next_steps": ["string"]
}}"""
        response = self._gemini_client.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        data = json.loads(response.text)

        summary = DocumentSummary(
            doc_type=data.get("doc_type", "Legal Contract"),
            purpose=data.get("purpose", "Legal Agreement"),
            parties=data.get("parties", ["Parties"]),
            jurisdiction_statement=data.get("jurisdiction_statement", "Not specified"),
            important_dates=data.get("important_dates", []),
            key_obligations=data.get("key_obligations", []),
            important_clauses=data.get("important_clauses", []),
            potential_concerns=data.get("potential_concerns", []),
            missing_information=data.get("missing_information", []),
            questions_to_ask=data.get("questions_to_ask", []),
            next_steps=data.get("next_steps", []),
        )

        # Fallback to local for obligations and concerns if needed
        _, obligations, deadlines, concerns = self._analyze_deterministically(doc_content, clauses)
        return summary, obligations, deadlines, concerns


# Singleton service instance
ai_service = AIService()
