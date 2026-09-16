"""Pydantic schemas for action checklist items."""

from typing import List, Optional
from pydantic import BaseModel, Field


class ChecklistItem(BaseModel):
    """An actionable task derived from the document or preparation methodology."""

    item_id: str = Field(..., description="Unique task identifier")
    text: str = Field(..., description="Actionable checklist instruction")
    category: str = Field(
        default="General Preparation",
        description="Category (e.g., Dates & Deadlines, Verification, Document Collection, Lawyer Questions)",
    )
    source_type: str = Field(
        ...,
        description="Either 'document_derived' (grounded in explicit clause) or 'general_guidance' (procedural advice)",
    )
    source_citation: Optional[str] = Field(
        default=None, description="Specific clause title or section reference"
    )
    completed: bool = Field(default=False, description="Completion checkbox status")
    priority: str = Field(
        default="medium", description="Priority level: 'high', 'medium', or 'low'"
    )


class ChecklistResponse(BaseModel):
    """Payload returning all checklist items for a document."""

    doc_id: str
    items: List[ChecklistItem]


class ToggleItemRequest(BaseModel):
    """Request to update item completion status."""

    item_id: str
    completed: bool


class AddCustomItemRequest(BaseModel):
    """Request to append user-defined preparation task."""

    doc_id: str
    text: str = Field(..., min_length=3, max_length=300)
    priority: str = Field(default="medium")
    category: str = Field(default="User Custom")
