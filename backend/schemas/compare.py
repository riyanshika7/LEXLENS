"""Pydantic schemas for document version comparison."""

from typing import List, Optional
from pydantic import BaseModel, Field


class ClauseDiff(BaseModel):
    """Semantic comparison difference for a specific clause."""

    category: str = Field(..., description="Clause type (e.g. Termination, Liability)")
    title: str = Field(..., description="Clause heading or title")
    status: str = Field(
        ...,
        description="Status of clause in revised version: 'added', 'removed', 'modified', or 'unchanged'",
    )
    old_text: Optional[str] = Field(default=None, description="Original text excerpt")
    new_text: Optional[str] = Field(default=None, description="Updated text excerpt")
    semantic_change_summary: str = Field(
        ..., description="Plain-language description of what changed conceptually"
    )
    obligation_shift: Optional[str] = Field(
        default=None,
        description="Details on which party gained or lost duties/liability",
    )
    risk_delta: str = Field(
        default="neutral",
        description="Change in user risk profile: 'increased', 'decreased', or 'neutral'",
    )


class ComparisonResult(BaseModel):
    """Full semantic diff report between two document versions."""

    doc1_id: str
    doc2_id: str
    doc1_name: str
    doc2_name: str
    executive_summary: str = Field(
        ..., description="Overview of the key changes between Version 1 and Version 2"
    )
    total_added: int = Field(default=0)
    total_removed: int = Field(default=0)
    total_modified: int = Field(default=0)
    changed_clauses: List[ClauseDiff] = Field(default_factory=list)
    changed_obligations: List[str] = Field(default_factory=list)
    changed_dates: List[str] = Field(default_factory=list)
    changed_payment_terms: List[str] = Field(default_factory=list)


class CompareRequest(BaseModel):
    """Request payload to compare two uploaded documents."""

    doc1_id: str = Field(..., description="ID of baseline/original document")
    doc2_id: str = Field(..., description="ID of revised/updated document")
