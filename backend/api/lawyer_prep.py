"""Lawyer Consultation Brief preparation and export endpoints."""

from fastapi import APIRouter, HTTPException, status
from backend.schemas.lawyer_brief import LawyerBrief, UpdateBriefNotesRequest
from backend.services.storage import doc_store

router = APIRouter(prefix="/api/lawyer-brief", tags=["lawyer-brief"])


@router.get("/{doc_id}", response_model=LawyerBrief)
async def get_lawyer_brief(doc_id: str):
    """Retrieve assembled lawyer preparation brief for a document."""
    brief = doc_store.get_brief(doc_id)
    if not brief:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lawyer brief for document '{doc_id}' not found.",
        )
    return brief


@router.post("/notes", response_model=LawyerBrief)
async def update_brief_notes(req: UpdateBriefNotesRequest):
    """Update personal consultation notes on a lawyer brief."""
    brief = doc_store.get_brief(req.doc_id)
    if not brief:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lawyer brief for document '{req.doc_id}' not found.",
        )
    brief.user_notes = req.notes
    doc_store.save_brief(req.doc_id, brief)
    return brief
