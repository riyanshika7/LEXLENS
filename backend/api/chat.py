"""Document-grounded Legal Copilot chat endpoint with traceable evidence citations."""

import logging
from fastapi import APIRouter, HTTPException, status
from backend.schemas.chat import ChatQuery, GroundedAnswer
from backend.services.gemini_service import ai_service
from backend.services.storage import doc_store

logger = logging.getLogger("lexlens.chat")
router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=GroundedAnswer)
async def ask_legal_copilot(query: ChatQuery):
    """Answer questions strictly grounded in the uploaded document."""
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

    try:
        answer = ai_service.answer_query(doc, retriever, query.question)
        return answer
    except Exception as e:
        logger.warning(f"Error answering query via primary pipeline: {e}. Fallback to defensive response.")
        return GroundedAnswer(
            answer="I couldn't safely extract an answer for this query from the document.",
            document_evidence=[],
            explanation="The processing engine encountered a temporary timeout or parsing variance.",
            uncertainty="Always cross-reference the relevant section of the executed contract directly.",
            next_step="Review the clause explorer or consult a qualified attorney for clarification.",
            confidence=0.5,
            is_found_in_document=False,
        )
