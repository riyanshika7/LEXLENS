"""Pydantic schemas for Jury Sandbox and Evaluator Diagnostics."""

from typing import List, Optional
from pydantic import BaseModel, Field


class BenchmarkDoc(BaseModel):
    """A pre-configured real legal benchmark contract for judge evaluation."""

    benchmark_id: str
    title: str
    category: str
    description: str
    filename: str
    sample_questions: List[str] = Field(default_factory=list)


class DiagnosticReport(BaseModel):
    """Performance and integrity diagnostic metrics for document pipeline."""

    doc_id: str
    parse_time_ms: float
    analysis_time_ms: float
    total_time_ms: float
    chunk_count: int
    word_count: int
    clause_count: int
    concern_count: int
    retrieval_p50_ms: float
    security_checks_passed: bool
    status: str
    error_details: Optional[str] = None


class SandboxRunRequest(BaseModel):
    """Request to execute full diagnostic benchmark."""

    benchmark_id: str


class SandboxRunResponse(BaseModel):
    """Result of running benchmark in jury sandbox."""

    benchmark: BenchmarkDoc
    diagnostic: DiagnosticReport
    sample_answers: List[dict] = Field(default_factory=list)
    system_status: str
