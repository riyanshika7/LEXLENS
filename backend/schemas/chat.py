"""Pydantic schemas for document-grounded legal copilot chat."""

from typing import List, Optional
from pydantic import BaseModel, Field


class EvidenceCitation(BaseModel):
    """Specific textual proof from the uploaded document."""

    chunk_id: str = Field(..., description="ID of source chunk")
    page_number: int = Field(default=1, description="Page number of citation")
    section_title: str = Field(default="General", description="Section heading")
    exact_excerpt: str = Field(..., description="Verbatim text quote from the document")


class ChatQuery(BaseModel):
    """User inquiry submitted to the Legal Copilot."""

    doc_id: str = Field(..., description="ID of the active analyzed document")
    question: str = Field(..., min_length=2, max_length=1000, description="User's question")
    jurisdiction_country: Optional[str] = Field(default=None, description="Country context")
    jurisdiction_state: Optional[str] = Field(default=None, description="State context")


class GroundedAnswer(BaseModel):
    """Document-grounded, traceable response from the Legal Copilot."""

    answer: str = Field(
        ..., description="Direct, plain-language answer to the user's question"
    )
    document_evidence: List[EvidenceCitation] = Field(
        default_factory=list,
        description="Verbatim excerpts from the document supporting the answer",
    )
    explanation: str = Field(
        ..., description="Contextual explanation clarifying what the text implies"
    )
    uncertainty: str = Field(
        ...,
        description="Explicitly identifies what is ambiguous, missing, or jurisdiction-dependent",
    )
    next_step: str = Field(
        ..., description="Recommended practical verification step or question for counsel"
    )
    confidence: float = Field(
        default=0.9, ge=0.0, le=1.0, description="Confidence score based on document clarity"
    )
    is_found_in_document: bool = Field(
        default=True,
        description="False if the requested information is absent from the uploaded document",
    )
    legal_disclaimer: str = Field(
        default="LexLens is an assistive document intelligence tool and does not provide legal advice. Always consult a qualified attorney for legal counsel.",
        description="Standard protective disclaimer",
    )
