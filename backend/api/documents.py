"""Document upload, parsing, and retrieval endpoints."""

import uuid
from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from backend.schemas.analysis import DocumentAnalysisResponse
from backend.schemas.checklist import ChecklistItem
from backend.schemas.document import DocumentContent
from backend.security.sanitizer import validate_file_security
from backend.services.document_parser import DocumentParser
from backend.services.gemini_service import ai_service
from backend.services.lawyer_brief import LawyerBriefService
from backend.services.storage import doc_store

router = APIRouter(prefix="/api/documents", tags=["documents"])


def generate_initial_checklist(doc_id: str, analysis: DocumentAnalysisResponse) -> list[ChecklistItem]:
    """Derive actionable preparation checklist items from parsed intelligence."""
    items: list[ChecklistItem] = []

    # Document-derived deadline tasks
    for d in analysis.deadlines[:3]:
        items.append(
            ChecklistItem(
                item_id=f"chk_d_{uuid.uuid4().hex[:6]}",
                text=f"Confirm timeline for: '{d.title}' ({d.date_or_trigger})",
                category="Dates & Deadlines",
                source_type="document_derived",
                source_citation=d.source_clause_title or f"Page {d.page_number}",
                priority="high",
            )
        )

    # Document-derived high risk / concern clauses
    for c in analysis.concerns[:3]:
        items.append(
            ChecklistItem(
                item_id=f"chk_c_{uuid.uuid4().hex[:6]}",
                text=f"Review flagged provision: '{c.title}' - {c.professional_review_advice}",
                category="Risk Review",
                source_type="document_derived",
                source_citation=f"Page {c.page_number}",
                priority="high" if c.severity == "high" else "medium",
            )
        )

    # General preparation guidance items
    general_tasks = [
        ("Verify correct legal names and registered business entities for all parties.", "Verification", "high"),
        ("Collect any prior agreements, email chains, or addenda referenced in this document.", "Document Collection", "medium"),
        (f"Confirm local jurisdiction rules apply ({analysis.metadata.jurisdiction_country}, {analysis.metadata.jurisdiction_state}).", "Jurisdiction Check", "medium"),
        ("Prepare 3-5 specific written questions before consulting your legal advisor.", "Lawyer Preparation", "high"),
    ]

    for text, cat, prio in general_tasks:
        items.append(
            ChecklistItem(
                item_id=f"chk_g_{uuid.uuid4().hex[:6]}",
                text=text,
                category=cat,
                source_type="general_guidance",
                source_citation=None,
                priority=prio,
            )
        )

    return items


@router.post("/upload", response_model=DocumentAnalysisResponse)
async def upload_document(
    file: UploadFile = File(...),
    jurisdiction_country: str = Form("United States"),
    jurisdiction_state: str = Form("General"),
):
    """
    Secure document upload and intelligence pipeline.
    Validates file integrity, parses PDF/DOCX/TXT, indexes chunks, extracts clauses,
    detects obligations and risks, and prepares actionable checklist and lawyer brief.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is missing from the upload request.",
        )

    # Read binary content
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}",
        )

    # Security validation
    sanitized_name, ext = validate_file_security(
        file.filename, content, file.content_type or ""
    )

    doc_id = f"doc_{uuid.uuid4().hex[:10]}"

    # Parse document
    doc_content = DocumentParser.parse_document(
        content=content,
        filename=sanitized_name,
        ext=ext,
        doc_id=doc_id,
        jurisdiction_country=jurisdiction_country,
        jurisdiction_state=jurisdiction_state,
    )

    # Save to storage and build BM25 retriever index
    doc_store.save_document(doc_content)

    # Run AI Analysis
    summary, clauses, obligations, deadlines, concerns = ai_service.analyze_document(doc_content)

    analysis_response = DocumentAnalysisResponse(
        metadata=doc_content.metadata,
        summary=summary,
        clauses=clauses,
        obligations=obligations,
        deadlines=deadlines,
        concerns=concerns,
    )
    doc_store.save_analysis(doc_id, analysis_response)

    # Generate checklist & lawyer brief
    checklist_items = generate_initial_checklist(doc_id, analysis_response)
    doc_store.save_checklist(doc_id, checklist_items)

    lawyer_brief = LawyerBriefService.generate_brief(
        doc_content, summary, clauses, concerns, deadlines
    )
    doc_store.save_brief(doc_id, lawyer_brief)

    return analysis_response


@router.get("/{doc_id}", response_model=DocumentContent)
async def get_document(doc_id: str):
    """Retrieve full parsed document content and chunks by ID."""
    doc = doc_store.get_document(doc_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{doc_id}' not found.",
        )
    return doc
