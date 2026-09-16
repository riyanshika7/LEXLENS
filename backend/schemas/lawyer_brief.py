from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field
from backend.schemas.analysis import ClauseItem


class LawyerBrief(BaseModel):
    """Structured lawyer preparation brief."""

    doc_id: str
    document_title: str
    doc_type: str
    parties: List[str]
    jurisdiction: str
    executive_summary: str
    key_facts_to_verify: List[str] = Field(default_factory=list)
    high_priority_clauses: List[ClauseItem] = Field(default_factory=list)
    questions_for_lawyer: List[str] = Field(default_factory=list)
    documents_to_bring: List[str] = Field(default_factory=list)
    uncertainties: List[str] = Field(default_factory=list)
    user_notes: Optional[str] = Field(
        default="", description="User customized personal notes or context"
    )
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UpdateBriefNotesRequest(BaseModel):
    """Request to update notes on a lawyer brief."""

    doc_id: str
    notes: str = Field(..., max_length=5000)
