"""Pydantic schemas package for LexLens."""

from backend.schemas.document import DocumentMetadata, DocumentChunk, DocumentContent
from backend.schemas.analysis import (
    ClauseItem,
    ObligationItem,
    DeadlineItem,
    PotentialConcern,
    DocumentSummary,
    DocumentAnalysisResponse,
)
from backend.schemas.chat import EvidenceCitation, ChatQuery, GroundedAnswer
from backend.schemas.checklist import (
    ChecklistItem,
    ChecklistResponse,
    ToggleItemRequest,
    AddCustomItemRequest,
)
from backend.schemas.compare import ClauseDiff, ComparisonResult, CompareRequest
from backend.schemas.lawyer_brief import LawyerBrief, UpdateBriefNotesRequest
from backend.schemas.sandbox import (
    BenchmarkDoc,
    DiagnosticReport,
    SandboxRunRequest,
    SandboxRunResponse,
)

__all__ = [
    "DocumentMetadata",
    "DocumentChunk",
    "DocumentContent",
    "ClauseItem",
    "ObligationItem",
    "DeadlineItem",
    "PotentialConcern",
    "DocumentSummary",
    "DocumentAnalysisResponse",
    "EvidenceCitation",
    "ChatQuery",
    "GroundedAnswer",
    "ChecklistItem",
    "ChecklistResponse",
    "ToggleItemRequest",
    "AddCustomItemRequest",
    "ClauseDiff",
    "ComparisonResult",
    "CompareRequest",
    "LawyerBrief",
    "UpdateBriefNotesRequest",
    "BenchmarkDoc",
    "DiagnosticReport",
    "SandboxRunRequest",
    "SandboxRunResponse",
]
