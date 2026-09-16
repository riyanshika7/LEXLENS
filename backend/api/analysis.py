"""Document analysis, graph pathfinding, and algorithmic search endpoints."""

from fastapi import APIRouter, HTTPException, Query, status
from backend.schemas.analysis import DocumentAnalysisResponse
from backend.services.graph_router import PathResult, build_default_contract_graph
from backend.services.search_utils import binary_search_chunk_by_offset
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


@router.get("/{doc_id}/dependency-path", response_model=PathResult)
async def get_contract_dependency_path(
    doc_id: str,
    path_type: str = Query("critical", pattern="^(critical|cure)$", description="Path type: 'critical' for liability escalation, 'cure' for remedy trajectory"),
    start_node: str = Query("notice_inquiry", description="Starting clause node"),
    target_node: str = Query("liquidated_damages", description="Target clause node"),
):
    """Compute critical risk escalation path or optimal cure path in O(E log V) using binary min-heaps (heapq)."""
    doc = doc_store.get_document(doc_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{doc_id}' not found.",
        )

    graph = build_default_contract_graph()

    if path_type == "cure":
        target = target_node if target_node != "liquidated_damages" else "settlement_release"
        result = graph.find_optimal_cure_path(start_node, target)
    else:
        target = target_node if target_node != "settlement_release" else "liquidated_damages"
        result = graph.find_critical_risk_path(start_node, target)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No valid trajectory found between '{start_node}' and '{target_node}'.",
        )

    return result


@router.get("/{doc_id}/search-offset")
async def search_chunk_at_offset(
    doc_id: str,
    offset: int = Query(..., ge=0, description="Character offset in full document text"),
):
    """Find exact containing text chunk using O(log N) binary search over sorted chunk offsets."""
    doc = doc_store.get_document(doc_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{doc_id}' not found.",
        )

    chunk = binary_search_chunk_by_offset(doc.chunks, offset)
    if not chunk:
        return {"found": False, "offset": offset, "chunk": None}

    return {
        "found": True,
        "offset": offset,
        "chunk_id": chunk.chunk_id,
        "page_number": chunk.page_number,
        "section_title": chunk.section_title,
        "char_start": chunk.char_start,
        "char_end": chunk.char_end,
        "algorithm": "O(log N) Binary Search",
    }
