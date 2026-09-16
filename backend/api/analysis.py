"""Document analysis and intelligence retrieval endpoint."""

from fastapi import APIRouter, HTTPException, status
from backend.schemas.analysis import DocumentAnalysisResponse
from backend.services.storage import doc_store

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.get("/{doc_id}", response_model=DocumentAnalysisResponse)
async def get_document_analysis(doc_id: str):
    """Retrieve structured analysis, clauses, obligations, deadlines, and concerns."""
    analysis = doc_store.get_analysis(doc_id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis for document ID '{doc_id}' not found. Please upload or analyze the document first.",
        )
    return analysis
