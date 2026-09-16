"""Document version comparison endpoint."""

from fastapi import APIRouter, HTTPException, status
from backend.schemas.compare import CompareRequest, ComparisonResult
from backend.services.comparator import DocumentComparator
from backend.services.storage import doc_store

router = APIRouter(prefix="/api/compare", tags=["compare"])


@router.post("", response_model=ComparisonResult)
async def compare_documents(req: CompareRequest):
    """
    Perform semantic comparison between Document Version 1 and Version 2.
    Detects added clauses, removed clauses, modified terms, and shifts in obligations.
    """
    doc1 = doc_store.get_document(req.doc1_id)
    if not doc1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Original document with ID '{req.doc1_id}' not found.",
        )

    doc2 = doc_store.get_document(req.doc2_id)
    if not doc2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Revised document with ID '{req.doc2_id}' not found.",
        )

    result = DocumentComparator.compare_documents(doc1, doc2)
    return result
