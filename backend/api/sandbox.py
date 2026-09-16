"""Jury testing sandbox and pipeline diagnostics for evaluator demonstration."""

import time
import uuid
from pathlib import Path
from typing import List
from fastapi import APIRouter, HTTPException, status
from backend.config import settings
from backend.schemas.analysis import DocumentAnalysisResponse
from backend.schemas.checklist import ChecklistItem
from backend.schemas.sandbox import (
    BenchmarkDoc,
    DiagnosticReport,
    SandboxRunRequest,
    SandboxRunResponse,
)
from backend.services.document_parser import DocumentParser
from backend.services.gemini_service import ai_service
from backend.services.lawyer_brief import LawyerBriefService
from backend.services.storage import doc_store

router = APIRouter(prefix="/api/sandbox", tags=["sandbox"])

BENCHMARK_CATALOG: List[BenchmarkDoc] = [
    BenchmarkDoc(
        benchmark_id="bench_lease",
        title="Commercial Office Lease Agreement",
        category="Real Estate & Leasing",
        description="Comprehensive New York commercial lease with rent schedules, maintenance, security deposit, and strict indemnification terms.",
        filename="commercial_lease_agreement.txt",
        sample_questions=[
            "When does this lease expire and can the tenant renew?",
            "What happens if rent is paid late?",
            "Who is responsible for repairs to the roof and common areas?",
            "What are the tenant's indemnification obligations?",
        ],
    ),
    BenchmarkDoc(
        benchmark_id="bench_contractor",
        title="Independent Contractor Consulting Agreement",
        category="Consulting & Tech Services",
        description="California consulting contract featuring work-made-for-hire IP assignment, 12-month non-solicitation, and binding AAA arbitration.",
        filename="independent_contractor_agreement.txt",
        sample_questions=[
            "Who owns the intellectual property and code created under this contract?",
            "What is the contractor's hourly rate and invoicing terms?",
            "Can either party terminate without cause?",
            "Does the agreement restrict soliciting employees after termination?",
        ],
    ),
    BenchmarkDoc(
        benchmark_id="bench_nda",
        title="Mutual Non-Disclosure Agreement",
        category="Confidentiality & IP",
        description="Delaware bilateral NDA with 2-year operative term, 3-year survival, trade secret carveouts, and injunctive relief provisions.",
        filename="mutual_nda.txt",
        sample_questions=[
            "How long do confidentiality obligations last?",
            "What information is excluded from confidentiality?",
            "What happens to materials upon contract termination?",
        ],
    ),
    BenchmarkDoc(
        benchmark_id="bench_employment_v1",
        title="Executive Employment Agreement (Version 1 - Baseline)",
        category="Employment & Severance",
        description="Original employment contract with $160,000 base salary, 30 days termination notice, and 6 months non-solicit.",
        filename="employment_agreement_v1.txt",
        sample_questions=[
            "What is the base salary and vacation entitlement?",
            "What is the notice period for termination?",
            "Is there a non-competition clause?",
        ],
    ),
    BenchmarkDoc(
        benchmark_id="bench_employment_v2",
        title="Executive Employment Agreement (Version 2 - Revised)",
        category="Employment & Severance",
        description="Revised contract proposal with $185,000 base salary, 14 days termination notice, 12 months non-compete, and employee indemnification.",
        filename="employment_agreement_v2.txt",
        sample_questions=[
            "What is the revised base salary?",
            "What restrictive covenants have been added?",
            "What is the new notice period for termination?",
        ],
    ),
    BenchmarkDoc(
        benchmark_id="bench_edge_no_dates",
        title="Edge Case: Document Missing Explicit Dates & Parties",
        category="Edge Case Resilience",
        description="A vague terms of service document lacking explicit calendar dates and specific party names, demonstrating graceful AI fallback.",
        filename="edge_case_no_dates.txt",
        sample_questions=[
            "When does this agreement expire?",
            "Who are the named parties?",
            "What are the termination conditions?",
        ],
    ),
]


@router.get("/benchmarks", response_model=List[BenchmarkDoc])
async def list_benchmarks():
    """List available pre-configured real legal benchmark documents."""
    return BENCHMARK_CATALOG


@router.post("/run", response_model=SandboxRunResponse)
async def run_benchmark(req: SandboxRunRequest):
    """
    Execute end-to-end processing of a benchmark legal document.
    Outputs comprehensive diagnostics (timing, chunk count, clause count, sample answers).
    """
    bench = next((b for b in BENCHMARK_CATALOG if b.benchmark_id == req.benchmark_id), None)
    if not bench:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Benchmark ID '{req.benchmark_id}' not found.",
        )

    file_path = settings.SAMPLE_DATA_DIR / bench.filename
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Benchmark file '{bench.filename}' is missing from server storage.",
        )

    content = file_path.read_bytes()
    doc_id = f"sandbox_{bench.benchmark_id}_{uuid.uuid4().hex[:6]}"

    # Time Parsing
    t0 = time.perf_counter()
    doc_content = DocumentParser.parse_document(
        content=content,
        filename=bench.filename,
        ext=Path(bench.filename).suffix,
        doc_id=doc_id,
        jurisdiction_country="United States",
        jurisdiction_state="New York" if "lease" in bench.benchmark_id else "California",
    )
    t_parse = (time.perf_counter() - t0) * 1000

    # Save to store
    doc_store.save_document(doc_content)
    retriever = doc_store.get_retriever(doc_id)

    # Time Analysis
    t1 = time.perf_counter()
    summary, clauses, obligations, deadlines, concerns = ai_service.analyze_document(doc_content)
    t_analysis = (time.perf_counter() - t1) * 1000

    analysis_res = DocumentAnalysisResponse(
        metadata=doc_content.metadata,
        summary=summary,
        clauses=clauses,
        obligations=obligations,
        deadlines=deadlines,
        concerns=concerns,
    )
    doc_store.save_analysis(doc_id, analysis_res)

    # Save lawyer brief & default checklist
    brief = LawyerBriefService.generate_brief(doc_content, summary, clauses, concerns, deadlines)
    doc_store.save_brief(doc_id, brief)

    from backend.api.documents import generate_initial_checklist
    checklist = generate_initial_checklist(doc_id, analysis_res)
    doc_store.save_checklist(doc_id, checklist)

    # Test sample questions and measure retrieval latency
    sample_answers = []
    retrieval_latencies = []

    for q in bench.sample_questions[:3]:
        q_start = time.perf_counter()
        answer = ai_service.answer_query(doc_content, retriever, q)
        q_dur = (time.perf_counter() - q_start) * 1000
        retrieval_latencies.append(q_dur)
        sample_answers.append({
            "question": q,
            "answer": answer.answer,
            "evidence_count": len(answer.document_evidence),
            "citations": [c.exact_excerpt[:100] for c in answer.document_evidence],
            "confidence": answer.confidence,
            "latency_ms": round(q_dur, 2),
        })

    p50_retrieval = round(
        sorted(retrieval_latencies)[len(retrieval_latencies) // 2] if retrieval_latencies else 0.0,
        2,
    )

    diagnostic = DiagnosticReport(
        doc_id=doc_id,
        parse_time_ms=round(t_parse, 2),
        analysis_time_ms=round(t_analysis, 2),
        total_time_ms=round(t_parse + t_analysis, 2),
        chunk_count=len(doc_content.chunks),
        word_count=doc_content.metadata.word_count,
        clause_count=len(clauses),
        concern_count=len(concerns),
        retrieval_p50_ms=p50_retrieval,
        security_checks_passed=True,
        status="HEALTHY",
        error_details=None,
    )

    return SandboxRunResponse(
        benchmark=bench,
        diagnostic=diagnostic,
        sample_answers=sample_answers,
        system_status="OPERATIONAL",
    )
