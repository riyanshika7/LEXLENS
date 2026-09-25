"""Legal Navigator Service providing contextual guidance, missing info detection, and informational paths."""

import logging
import json
from typing import Optional
from google.genai import types
from backend.config import settings
from backend.schemas.navigator import (
    NavigatorRequest,
    NavigatorResponse,
    InformationalPathOption,
    MissingInformationItem,
)
from backend.services.gemini_service import ai_service
from backend.services.storage import doc_store

logger = logging.getLogger("lexlens.navigator")


class LegalNavigatorService:
    """Service guiding non-lawyers through legal document navigation, missing info, and options."""

    @staticmethod
    def detect_missing_information(raw_text: str) -> list[MissingInformationItem]:
        """Detect missing exhibits, unverified dates, placeholders, or unattached schedules."""
        items = []
        text_lower = raw_text.lower() if raw_text else ""

        # Check for unattached referenced exhibits or schedules
        if "schedule b" in text_lower or "exhibit b" in text_lower:
            items.append(
                MissingInformationItem(
                    item="Schedule B / Exhibit B is referenced in text",
                    why_it_matters="Referenced exhibits or schedules may contain additional binding terms, fee structures, or specifications.",
                    suggested_action="Locate and verify Schedule B before relying on the document as a complete agreement.",
                )
            )
        if "schedule a" in text_lower and "schedule a attached" not in text_lower:
            items.append(
                MissingInformationItem(
                    item="Schedule A attachment status unverified",
                    why_it_matters="The scope of services or property description in Schedule A is crucial for defining deliverables.",
                    suggested_action="Verify that Schedule A is attached and complete.",
                )
            )
        if "[blank]" in text_lower or "___" in text_lower or "[insert" in text_lower:
            items.append(
                MissingInformationItem(
                    item="Unfilled placeholders or blank fields detected",
                    why_it_matters="Unfilled fields leave critical terms like dates, payment amounts, or names undefined.",
                    suggested_action="Ensure all blank fields are completed prior to signing.",
                )
            )

        if not items:
            items.append(
                MissingInformationItem(
                    item="Unverified Third-Party Handbooks or Policies",
                    why_it_matters="References to external employee handbooks or company policies are governed separately.",
                    suggested_action="Request copies of any referenced external company policies.",
                )
            )

        return items

    def navigate(self, req: NavigatorRequest) -> NavigatorResponse:
        """Generate grounded legal navigation response for non-lawyers."""
        doc = doc_store.get_document(req.doc_id) if req.doc_id else None
        doc_text = doc.raw_text[:8000] if doc else ""

        # Responsible jurisdiction disclaimer
        if req.jurisdiction_country == "Unspecified" or req.jurisdiction_state == "Unspecified":
            jurisdiction_msg = "Jurisdiction not fully specified. LexLens provides document-grounded explanations, but jurisdiction-specific legal interpretations require input from qualified counsel."
        else:
            jurisdiction_msg = f"Assistance framed for document context in {req.jurisdiction_state}, {req.jurisdiction_country}. LexLens does not provide state-specific legal advice."

        missing_info = self.detect_missing_information(doc_text)

        # Fallback / Local Deterministic Navigator Response if Gemini API Key missing or offline
        if not ai_service.is_live_gemini_active or not doc_text:
            return self._build_deterministic_navigation(req, doc, missing_info, jurisdiction_msg)

        try:
            prompt = f"""You are LexLens, an AI Legal Assistance Platform for non-lawyers.
USER SITUATION: {req.situation}
USER ROLE: {req.role}
DOCUMENT TYPE: {req.doc_type}
GOAL: {req.goal}
JURISDICTION: {req.jurisdiction_state}, {req.jurisdiction_country}

DOCUMENT TEXT:
{doc_text}

Provide an informational assistance response in JSON format.
Strict rules:
1. Do NOT give legal advice or say "you should sue/sign/terminate".
2. Ground all document_facts in verbatim quotes and section references.
3. Provide 3 Informational Paths (Option A: Continue Reviewing, Option B: Prepare Questions, Option C: Prepare Attorney Consultation).
4. List clear questions to consider.
"""
            response = ai_service.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=NavigatorResponse,
                    temperature=0.2,
                ),
            )
            data = json.loads(response.text)
            res = NavigatorResponse(**data)
            res.jurisdiction_disclaimer = jurisdiction_msg
            if not res.missing_information:
                res.missing_information = missing_info
            return res
        except Exception as e:
            logger.warning(f"Gemini Navigator error fallback: {e}")
            return self._build_deterministic_navigation(req, doc, missing_info, jurisdiction_msg)

    def _build_deterministic_navigation(
        self, req: NavigatorRequest, doc: Optional[dict], missing_info: list, jurisdiction_msg: str
    ) -> NavigatorResponse:
        """Deterministic navigator response when offline or fallback."""
        title = doc.metadata.filename if doc else req.doc_type
        return NavigatorResponse(
            where_you_are=f"Navigating {req.situation} regarding '{title}' as a {req.role}.",
            document_facts=[
                "Document identifies contracting parties and formal operative provisions.",
                "Termination and notice requirements are specified in the operative text.",
                "Indemnification and liability allocation provisions govern dispute risks.",
            ] if doc else ["No document uploaded yet. Upload a document to view verbatim text facts."],
            ai_interpretation=[
                f"This document appears to establish binding terms for {req.role} obligations.",
                "Key areas to inspect include notice deadlines, termination triggers, and payment schedules.",
            ],
            potential_considerations=[
                "Review notice periods to ensure adequate advance warning before changes take effect.",
                "Check for unilateral modification clauses or mandatory arbitration requirements.",
            ],
            missing_information=missing_info,
            informational_paths=[
                InformationalPathOption(
                    title="Option A: Continue Document Inspection",
                    description="Examine specific clauses in the Clause Explorer to understand plain-English meanings.",
                    items_to_inspect=["Termination section", "Payment schedules", "Liability limits"],
                    questions_to_ask=["Does this match my prior verbal agreement?"],
                ),
                InformationalPathOption(
                    title="Option B: Prepare Clarification Questions",
                    description="Organize questions for the other contracting party or your manager/landlord.",
                    items_to_inspect=["Unclear notice timelines", "Blank placeholders"],
                    questions_to_ask=["Can we clarify notice requirements in writing?"],
                ),
                InformationalPathOption(
                    title="Option C: Prepare for Attorney Consultation",
                    description="Synthesize findings into the Lawyer Consultation Dossier to maximize attorney meeting efficiency.",
                    items_to_inspect=["Indemnity clauses", "Non-compete provisions"],
                    questions_to_ask=["How does this clause apply to my specific situation?"],
                ),
            ],
            questions_to_consider=[
                "Are there additional schedules or exhibits referenced that were not provided?",
                "Does the agreement contain strict deadlines or auto-renewal provisions?",
                "What specific questions should I bring to a qualified legal professional?",
            ],
            when_to_seek_lawyer=[
                "When the agreement involves significant financial liability or high-stakes non-compete terms.",
                "When terms are ambiguous or conflict with prior oral promises.",
                "When you are asked to waive fundamental legal rights or agree to broad indemnification.",
            ],
            jurisdiction_disclaimer=jurisdiction_msg,
        )


navigator_service = LegalNavigatorService()
