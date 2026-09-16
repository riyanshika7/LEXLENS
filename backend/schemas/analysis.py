"""Pydantic schemas for document analysis, clauses, obligations, and concerns."""

from typing import List, Optional
from pydantic import BaseModel, Field
from backend.schemas.document import DocumentMetadata


class XAIReasoning(BaseModel):
    """Explainable AI (XAI) transparent reasoning details."""

    chain_of_thought: str = Field(
        default="",
        description="Step-by-step reasoning explaining how provisions and risks were categorized",
    )
    threshold_evaluation: str = Field(
        default="",
        description="Quantitative and qualitative threshold evaluation used for risk scoring",
    )
    impact_forecast: str = Field(
        default="",
        description="Projected operational and financial impact for the non-lawyer signer",
    )


class ClauseItem(BaseModel):
    """An extracted and classified legal clause."""

    clause_id: str = Field(..., description="Unique clause identifier")
    category: str = Field(
        ...,
        description="Standard legal category e.g. Termination, Liability, Payment, Confidentiality, Indemnity",
    )
    title: str = Field(..., description="Concise title for the clause")
    excerpt: str = Field(..., description="Verbatim text quote from the uploaded document")
    page_number: int = Field(default=1, description="Page number where clause is located")
    section_title: str = Field(default="General", description="Section heading in document")
    plain_language_explanation: str = Field(
        ..., description="Simple, plain-language translation for a non-lawyer"
    )
    why_it_matters: str = Field(
        ..., description="Practical real-world impact and significance"
    )
    potential_consideration: str = Field(
        ..., description="Key risk, nuance, or ambiguity to be mindful of"
    )
    confidence: float = Field(
        default=0.9, ge=0.0, le=1.0, description="Confidence score of classification"
    )
    ask_a_lawyer: bool = Field(
        default=False,
        description="Flag indicating this provision warrants specific attorney review",
    )


class ObligationItem(BaseModel):
    """An affirmative or negative duty extracted from the document."""

    obligation_id: str = Field(..., description="Unique obligation ID")
    responsible_party: str = Field(
        ..., description="Party responsible (e.g., Tenant, Contractor, Receiving Party, Both)"
    )
    action: str = Field(..., description="What must be done or refrained from doing")
    deadline_or_frequency: str = Field(
        default="Not specified",
        description="Stated timeframe, due date, or recurring frequency",
    )
    source_clause_title: str = Field(default="", description="Related clause")
    page_number: int = Field(default=1, description="Page number in document")
    excerpt: str = Field(default="", description="Verbatim quote establishing duty")


class DeadlineItem(BaseModel):
    """An explicit or conditional date/timeline identified in the document."""

    deadline_id: str = Field(..., description="Unique deadline identifier")
    title: str = Field(..., description="Description of the deadline event")
    date_or_trigger: str = Field(
        ...,
        description="Calendar date or triggering condition (e.g. 'Within 30 days of written notice')",
    )
    is_explicit: bool = Field(
        default=True,
        description="True if an explicit calendar date; False if conditional duration",
    )
    consequence: str = Field(
        default="Not explicitly stated in document",
        description="Result if deadline is missed",
    )
    source_clause_title: str = Field(default="", description="Source clause")
    page_number: int = Field(default=1, description="Page number")


class PotentialConcern(BaseModel):
    """A flagged ambiguous, one-sided, or potentially restrictive provision."""

    concern_id: str = Field(..., description="Unique concern ID")
    title: str = Field(..., description="Brief headline of the concern")
    category: str = Field(
        ..., description="Category: e.g. 'Unclear Provision', 'Potentially Important Clause', 'Requires Review'"
    )
    description: str = Field(
        ..., description="Objective explanation of why this provision calls for attention"
    )
    severity: str = Field(
        default="medium",
        description="Severity indicator: 'low', 'medium', or 'high'",
    )
    document_excerpt: str = Field(
        ..., description="Verbatim excerpt triggering the concern"
    )
    page_number: int = Field(default=1, description="Page number")
    professional_review_advice: str = Field(
        ..., description="Specific question or focal point to discuss with counsel"
    )


class DocumentSummary(BaseModel):
    """Comprehensive structured summary of the document."""

    doc_type: str = Field(..., description="Detected document type (e.g., Commercial Lease Agreement)")
    purpose: str = Field(..., description="Core business or legal purpose of the agreement")
    parties: List[str] = Field(
        default_factory=list,
        description="Identified entities or individuals entering the agreement",
    )
    jurisdiction_statement: str = Field(
        default="Not specified in document",
        description="Governing law or venue stated in document",
    )
    important_dates: List[str] = Field(
        default_factory=list, description="List of primary milestone dates"
    )
    key_obligations: List[str] = Field(
        default_factory=list, description="Primary duties for each party"
    )
    important_clauses: List[str] = Field(
        default_factory=list, description="Most notable provisions"
    )
    potential_concerns: List[str] = Field(
        default_factory=list, description="Provisions requiring careful consideration"
    )
    missing_information: List[str] = Field(
        default_factory=list,
        description="Standard legal protections or details absent from the document",
    )
    questions_to_ask: List[str] = Field(
        default_factory=list,
        description="Recommended clarifying questions to ask the counterparty or lawyer",
    )
    next_steps: List[str] = Field(
        default_factory=list,
        description="Immediate practical actions the user should take",
    )
    xai_reasoning: Optional[XAIReasoning] = Field(
        default=None,
        description="Explainable AI reasoning: chain-of-thought, thresholds, impact forecast",
    )


class DocumentAnalysisResponse(BaseModel):
    """Consolidated document intelligence payload."""

    metadata: DocumentMetadata
    summary: DocumentSummary
    clauses: List[ClauseItem]
    obligations: List[ObligationItem]
    deadlines: List[DeadlineItem]
    concerns: List[PotentialConcern]
    xai_reasoning: Optional[XAIReasoning] = Field(
        default=None,
        description="Consolidated Explainable AI transparency telemetry",
    )
