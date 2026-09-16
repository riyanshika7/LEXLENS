from datetime import datetime, timezone
from typing import List, Optional
from backend.schemas.analysis import (
    ClauseItem,
    DeadlineItem,
    DocumentSummary,
    PotentialConcern,
)
from backend.schemas.document import DocumentContent
from backend.schemas.lawyer_brief import LawyerBrief


class LawyerBriefService:
    """Generates structured, professional consultation dossiers for attorney review."""

    @classmethod
    def generate_brief(
        cls,
        doc_content: DocumentContent,
        summary: DocumentSummary,
        clauses: List[ClauseItem],
        concerns: List[PotentialConcern],
        deadlines: List[DeadlineItem],
        user_notes: Optional[str] = "",
    ) -> LawyerBrief:
        """Synthesize document intelligence into an attorney preparation brief."""
        # High priority clauses: those flagged with ask_a_lawyer or high concern
        high_priority = [c for c in clauses if c.ask_a_lawyer][:5]
        if not high_priority and clauses:
            high_priority = clauses[:3]

        # Strategic questions tailored to this document
        questions = [
            f"Are the {c.category.lower()} conditions standard for our jurisdiction ({doc_content.metadata.jurisdiction_country}, {doc_content.metadata.jurisdiction_state})?"
            for c in high_priority[:3]
        ]
        questions.extend([
            "What is my legal exposure if the counterparty breaches first?",
            "Can we propose a mutual liability cap and reciprocal indemnification?",
            "What happens to my confidential data and intellectual property upon contract expiration?",
            "Are there any mandatory statutory notice periods that override this agreement?",
        ])

        # Essential documents the user should bring to the lawyer meeting
        docs_to_bring = [
            f"Executed or clean copy of this agreement: '{doc_content.metadata.filename}'",
            "Any prior versions, redlines, or negotiation email correspondence",
            "Proof of payments, invoices, or receipts exchanged to date (if applicable)",
            "Identification and corporate entity documents (if signing on behalf of a business)",
            "Any referenced schedules, exhibits, addenda, or employee handbooks",
        ]

        # Key facts requiring user verification before the legal consult
        facts_to_verify = [
            f"Verify exact legal entity names: {', '.join(summary.parties)}",
            f"Verify jurisdiction: {summary.jurisdiction_statement}",
            "Check whether any verbal promises made by the other party are written down in this text (merger/integration clause risk).",
            "Verify all stated bank details, addresses for formal notice, and designated representatives.",
        ]

        # Explicit uncertainties
        uncertainties = [
            "Local jurisdictional case law may interpret ambiguous terms differently than drafted.",
            "Enforceability of non-compete covenants varies widely by state/province.",
            "Tax consequences of payments, royalties, or liquidated damages require specialized tax advice.",
        ]

        return LawyerBrief(
            doc_id=doc_content.metadata.doc_id,
            document_title=doc_content.metadata.filename,
            doc_type=summary.doc_type,
            parties=summary.parties,
            jurisdiction=f"{doc_content.metadata.jurisdiction_country}, {doc_content.metadata.jurisdiction_state}",
            executive_summary=summary.purpose,
            key_facts_to_verify=facts_to_verify,
            high_priority_clauses=high_priority,
            questions_for_lawyer=questions[:7],
            documents_to_bring=docs_to_bring,
            uncertainties=uncertainties,
            user_notes=user_notes or "",
            generated_at=datetime.now(timezone.utc),
        )
