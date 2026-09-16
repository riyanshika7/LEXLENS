"""Document-grounded Legal Copilot chat endpoint with traceable evidence citations."""

from fastapi import APIRouter, HTTPException, status
from backend.schemas.chat import ChatQuery, GroundedAnswer
from backend.services.gemini_service import ai_service
from backend.services.storage import doc_store

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=GroundedAnswer)
async def ask_legal_copilot(query: ChatQuery):
    """
    Answer questions strictly grounded in the uploaded document.
    Returns:
    - plain language answer
    - document evidence citations (page, section, exact quote)
    - contextual explanation
    - stated uncertainty / jurisdiction limitations
    - recommended next step
    - legal safety disclaimer
    """
    doc = doc_store.get_document(query.doc_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{query.doc_id}' not found. Please upload a document first.",
        )

    retriever = doc_store.get_retriever(query.doc_id)
    if not retriever:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Search index for this document is unavailable.",
        )

    answer = ai_service.answer_query(doc, retriever, query.question)
    return answer
