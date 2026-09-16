"""Action checklist management endpoints."""

import uuid
from fastapi import APIRouter, HTTPException, status
from backend.schemas.checklist import (
    AddCustomItemRequest,
    ChecklistItem,
    ChecklistResponse,
    ToggleItemRequest,
)
from backend.services.storage import doc_store

router = APIRouter(prefix="/api/checklist", tags=["checklist"])


@router.get("/{doc_id}", response_model=ChecklistResponse)
async def get_checklist(doc_id: str):
    """Fetch actionable preparation checklist for document."""
    items = doc_store.get_checklist(doc_id)
    return ChecklistResponse(doc_id=doc_id, items=items)


@router.post("/toggle", response_model=ChecklistItem)
async def toggle_checklist_item(req: ToggleItemRequest):
    """Toggle completion checkbox state of a checklist item."""
    for doc_id, items in doc_store.checklists.items():
        for item in items:
            if item.item_id == req.item_id:
                item.completed = req.completed
                return item

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Checklist item with ID '{req.item_id}' not found.",
    )


@router.post("/custom", response_model=ChecklistItem)
async def add_custom_item(req: AddCustomItemRequest):
    """Add a user-defined preparation task to the checklist."""
    doc = doc_store.get_document(req.doc_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{req.doc_id}' not found.",
        )

    new_item = ChecklistItem(
        item_id=f"chk_usr_{uuid.uuid4().hex[:6]}",
        text=req.text,
        category=req.category or "User Custom",
        source_type="general_guidance",
        source_citation=None,
        completed=False,
        priority=req.priority or "medium",
    )

    items = doc_store.get_checklist(req.doc_id)
    items.append(new_item)
    doc_store.save_checklist(req.doc_id, items)
    return new_item
