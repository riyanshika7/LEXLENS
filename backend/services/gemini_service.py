"""Dual-engine AI service supporting Google Gemini 2.5 with a deterministic local legal fallback."""

import json
import logging
import os
from typing import List, Tuple
from backend.config import settings
from backend.schemas.analysis import (
    ClauseItem,
    DeadlineItem,
    DocumentSummary,
    ObligationItem,
    PotentialConcern,
    XAIReasoning,
)
from backend.schemas.chat import EvidenceCitation, GroundedAnswer
from backend.schemas.document import DocumentContent
from backend.services.clause_classifier import ClauseClassifier
from backend.services.legal_nlp_simulator import LegalNLPSimulator
from backend.services.retriever import BM25Retriever, tokenize

logger = logging.getLogger("lexlens.ai")


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
        XAIReasoning,
    ]:
        """Perform comprehensive document intelligence extraction with resilient fallback."""
        clauses = ClauseClassifier.classify_chunks(doc_content.chunks)

        if self.is_live_gemini_active:
            try:
                summary, obligations, deadlines, concerns, xai = self._analyze_with_gemini(doc_content, clauses)
                return summary, clauses, obligations, deadlines, concerns, xai
            except Exception as e:
                logger.warning(f"Gemini API call failed (429/timeout/unavailable): {e}. Fallback to local simulator.")

        summary, obligations, deadlines, concerns, xai = LegalNLPSimulator.analyze_deterministically(doc_content, clauses)
        return summary, clauses, obligations, deadlines, concerns, xai

    def answer_query(
        self, doc_content: DocumentContent, retriever: BM25Retriever, question: str
    ) -> GroundedAnswer:
        """Answer user questions with strict document grounding and verbatim evidence citations."""
        query_tokens = tokenize(question)
        ranked_chunks = retriever.retrieve(question, top_k=4)

        top_chunk_match = False
        if ranked_chunks and query_tokens:
            top_chunk, top_score = ranked_chunks[0]
            chunk_tokens = set(tokenize(top_chunk.text) + tokenize(top_chunk.section_title))
            matched_tokens = [t for t in query_tokens if t in chunk_tokens]
            coverage = len(matched_tokens) / max(len(query_tokens), 1)
            if coverage >= 0.40 or (top_score >= 1.5 and len(matched_tokens) >= 2):
                top_chunk_match = True

        if not ranked_chunks or not top_chunk_match:
            return GroundedAnswer(
                answer="I couldn't find this information in the uploaded document.",
                document_evidence=[],
                explanation="The uploaded document does not appear to contain provisions addressing this specific inquiry.",
                uncertainty="Because this topic is not mentioned in the agreement, general statutory defaults or unwritten terms might apply.",
                next_step="Consult a qualified legal professional to determine whether a missing clause on this subject poses a legal or operational risk.",
                confidence=0.95,
                is_found_in_document=False,
            )

        top_chunk, top_score = ranked_chunks[0]
        citations = [
            EvidenceCitation(
                chunk_id=c.chunk_id,
                page_number=c.page_number,
                section_title=c.section_title,
                exact_excerpt=c.text[:280] + ("..." if len(c.text) > 280 else ""),
            )
            for c, _ in ranked_chunks[:3]
        ]

        answer_body = (
            f"Based on Section '{top_chunk.section_title}' (Page {top_chunk.page_number}), "
            f"the document states: \"{top_chunk.text[:180].strip()}...\""
        )

        return GroundedAnswer(
            answer=answer_body,
            document_evidence=citations,
            explanation=f"This section establishes the operative terms regarding {top_chunk.section_title.lower()}.",
            uncertainty="Legal interpretation depends on jurisdiction and whether any subsequent amendments modify this provision.",
            next_step="Verify whether all conditions described in this section are satisfied.",
            confidence=min(0.85 + (top_score * 0.02), 0.98),
            is_found_in_document=True,
        )

    def _analyze_with_gemini(
        self, doc_content: DocumentContent, clauses: List[ClauseItem]
    ) -> Tuple[DocumentSummary, List[ObligationItem], List[DeadlineItem], List[PotentialConcern], XAIReasoning]:
        """Call live Gemini API with strict structured JSON output and XAI reasoning."""
        prompt = f"""You are LexLens, a legal document intelligence AI. Analyze this legal document.
SAFETY: Do not provide legal advice. Distinguish facts from concerns. If missing, state 'Not found'.

DOCUMENT TEXT (Excerpts):
{doc_content.raw_text[:8000]}

Return a valid JSON object matching this exact schema:
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
  "next_steps": ["string"],
  "xai_reasoning": {{
    "chain_of_thought": "string",
    "threshold_evaluation": "string",
    "impact_forecast": "string"
  }}
}}"""
        response = self._gemini_client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=dict(response_mime_type="application/json"),
        )
        data = json.loads(response.text)

        xai_dict = data.get("xai_reasoning", {})
        xai = XAIReasoning(
            chain_of_thought=xai_dict.get("chain_of_thought", "Evaluated against standard commercial contract benchmarks."),
            threshold_evaluation=xai_dict.get("threshold_evaluation", "Risk evaluated across indemnities, termination, and covenants."),
            impact_forecast=xai_dict.get("impact_forecast", "Follow notice schedules strictly to avoid default events."),
        )

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
            xai_reasoning=xai,
        )

        _, obligations, deadlines, concerns, _ = LegalNLPSimulator.analyze_deterministically(doc_content, clauses)
        return summary, obligations, deadlines, concerns, xai


ai_service = AIService()
