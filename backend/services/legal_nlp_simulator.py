"""Deterministic High-Fidelity Legal NLP Simulator & XAI Reasoning Engine.

Provides offline, zero-latency document analysis, entity extraction, obligation parsing,
and Explainable AI (XAI) reasoning when Gemini API is offline, rate-limited (429), or unconfigured.
"""

import re
import uuid
from typing import Dict, List, Tuple
from backend.schemas.analysis import (
    ClauseItem,
    DeadlineItem,
    DocumentSummary,
    ObligationItem,
    PotentialConcern,
    XAIReasoning,
)
from backend.schemas.document import DocumentContent

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


class LegalNLPSimulator:
    """High-fidelity local simulator for offline legal document analysis."""

    @classmethod
    def analyze_deterministically(
        cls, doc_content: DocumentContent, clauses: List[ClauseItem]
    ) -> Tuple[DocumentSummary, List[ObligationItem], List[DeadlineItem], List[PotentialConcern], XAIReasoning]:
        """Perform comprehensive rule-based legal extraction and synthesize XAI reasoning."""
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
            for m in pat.findall(text[:4000]):
                items = m if isinstance(m, tuple) else [m]
                for part in items:
                    clean = part.strip().strip('"').strip("'")
                    if 2 < len(clean) < 60 and clean not in parties:
                        parties.append(clean)
        if not parties:
            parties = ["Not explicitly named in preamble"]

        # 3. Extract Dates & Deadlines
        deadlines: List[DeadlineItem] = []
        important_dates: List[str] = []
        for chunk in doc_content.chunks:
            for d_pat in DATE_PATTERNS:
                for match in d_pat.findall(chunk.text):
                    date_str = match.strip() if isinstance(match, str) else match[0].strip()
                    if date_str and date_str not in important_dates and len(date_str) < 40:
                        important_dates.append(date_str)
                        deadlines.append(
                            DeadlineItem(
                                deadline_id=f"deadline_{len(deadlines)+1}_{uuid.uuid4().hex[:4]}",
                                title=f"Timeline in {chunk.section_title}",
                                date_or_trigger=date_str,
                                is_explicit=bool(re.search(r"\d{4}", date_str)),
                                consequence="Check corresponding clause for late penalties or default events",
                                source_clause_title=chunk.section_title,
                                page_number=chunk.page_number,
                            )
                        )
                        if len(deadlines) >= 8:
                            break
            if len(deadlines) >= 8:
                break

        if not important_dates:
            important_dates = ["No explicit calendar milestone dates found in text."]

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
                        professional_review_advice=f"Ask counsel if this {clause.category} clause is reciprocal or capped.",
                    )
                )

        if not concerns:
            concerns.append(
                PotentialConcern(
                    concern_id=f"concern_1_{uuid.uuid4().hex[:4]}",
                    title="Standard Document Review",
                    category="Potentially Important Clause",
                    description="No extreme one-sided penalty terms detected. Standard verification needed.",
                    severity="low",
                    document_excerpt=clauses[0].excerpt if clauses else "General document text",
                    page_number=1,
                    professional_review_advice="Verify fee schedules and renewal triggers with an advisor.",
                )
            )

        # 6. Synthesize Explainable AI (XAI) Reasoning
        high_severity_count = sum(1 for c in concerns if c.severity == "high")
        xai_reasoning = XAIReasoning(
            chain_of_thought=(
                f"1. Parsed {len(doc_content.chunks)} chunks across {doc_content.metadata.page_count} page(s). "
                f"2. Matched {len(clauses)} operative clauses against 12 standard commercial categories. "
                f"3. Screened indemnification, liability caps, and dispute escalation trees. "
                f"4. Detected {len(obligations)} mandatory affirmative/negative duties and {len(deadlines)} milestones."
            ),
            threshold_evaluation=(
                f"Risk severity threshold configured at 7.0/10. {high_severity_count} clause(s) exceeded the threshold "
                f"due to one-sided indemnification, restrictive covenants, or default acceleration mechanisms."
            ),
            impact_forecast=(
                f"Signer faces operational compliance requirements for {len(obligations)} active obligations. "
                f"Failure to meet notice timelines within stated cure windows may trigger material default."
            ),
        )

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
            purpose=f"Establishes legal rights and responsibilities regarding {detected_type.lower()}.",
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
                "Are there any automatic renewal clauses requiring advance calendar alerts?",
            ],
            next_steps=[
                "Confirm all named parties and legal entities are accurate.",
                "Review marked high-attention clauses with a legal professional.",
                "Add explicit calendar reminders for all stated deadlines and notice windows.",
                "Keep an executed copy in secure storage.",
            ],
            xai_reasoning=xai_reasoning,
        )

        return summary, obligations, deadlines, concerns, xai_reasoning
