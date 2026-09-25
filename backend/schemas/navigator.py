"""Schemas for Legal Navigator and Contextual Legal Assistance."""

from typing import List, Optional
from pydantic import BaseModel, Field


class InformationalPathOption(BaseModel):
    """Informational option path for user exploration."""
    title: str = Field(..., description="Title of the informational option path")
    description: str = Field(..., description="Explanation of what this path involves")
    items_to_inspect: List[str] = Field(default_factory=list, description="Sections or items to review")
    questions_to_ask: List[str] = Field(default_factory=list, description="Questions to consider asking")


class MissingInformationItem(BaseModel):
    """Missing or unverified document item detection."""
    item: str = Field(..., description="Description of missing date, unverified placeholder, or missing exhibit")
    why_it_matters: str = Field(..., description="Plain-English explanation of why this information matters")
    suggested_action: str = Field(..., description="Suggested verification step")


class NavigatorRequest(BaseModel):
    """Request payload for Legal Navigator contextual guidance."""
    situation: str = Field(..., description="User's current situation or objective")
    role: str = Field(default="Individual", description="User's role (Tenant, Employee, Contractor, Small Business, Other)")
    doc_type: str = Field(default="General Agreement", description="Contract or document type")
    jurisdiction_country: str = Field(default="Unspecified", description="Country jurisdiction")
    jurisdiction_state: str = Field(default="Unspecified", description="State or province jurisdiction")
    goal: str = Field(default="", description="User's goal or specific question")
    doc_id: Optional[str] = Field(default=None, description="Active uploaded document ID if available")


class NavigatorResponse(BaseModel):
    """Response payload for Legal Navigator assistance."""
    where_you_are: str = Field(..., description="Summary of user's situation and document context")
    document_facts: List[str] = Field(default_factory=list, description="Verbatim grounded document facts with section references")
    ai_interpretation: List[str] = Field(default_factory=list, description="Plain-English interpretation of what the text appears to mean")
    potential_considerations: List[str] = Field(default_factory=list, description="Important provisions requiring attention")
    missing_information: List[MissingInformationItem] = Field(default_factory=list, description="Unverified placeholders or missing schedules")
    informational_paths: List[InformationalPathOption] = Field(default_factory=list, description="Informational options to explore")
    questions_to_consider: List[str] = Field(default_factory=list, description="Tactical questions for counsel or clarification")
    when_to_seek_lawyer: List[str] = Field(default_factory=list, description="Situations where professional legal review is advised")
    jurisdiction_disclaimer: str = Field(..., description="Responsible disclaimer regarding jurisdiction scope")
