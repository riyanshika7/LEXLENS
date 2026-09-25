"""API endpoint router for Legal Navigator and Contextual Assistance."""

from typing import List
from fastapi import APIRouter, HTTPException, status
from backend.schemas.navigator import NavigatorRequest, NavigatorResponse
from backend.services.legal_navigator import navigator_service

router = APIRouter(prefix="/api/navigator", tags=["navigator"])

COMMON_SITUATIONS: List[dict] = [
    {
        "id": "received_contract",
        "title": "I received a contract or agreement to sign",
        "description": "Understand obligations, key clauses, and important provisions before signing.",
    },
    {
        "id": "received_notice",
        "title": "I received a notice or letter",
        "description": "Identify effective dates, response deadlines, and underlying document terms.",
    },
    {
        "id": "unclear_clause",
        "title": "I found a clause I don't understand",
        "description": "Translate complex legalese into plain English with real-world considerations.",
    },
    {
        "id": "upcoming_deadline",
        "title": "I have an upcoming deadline or notice period",
        "description": "Track notice requirements and determine what preparation steps matter.",
    },
    {
        "id": "prepare_lawyer",
        "title": "I want to prepare for a legal consultation",
        "description": "Organize document facts, high-attention clauses, and tactical questions for counsel.",
    },
    {
        "id": "not_sure",
        "title": "I am not sure what to look for",
        "description": "Scan for missing information, unattached exhibits, and hidden obligations.",
    },
]


@router.get("/situations")
async def list_common_situations():
    """Returns curated starting situations for Legal Navigator guidance."""
    return COMMON_SITUATIONS


@router.post("/navigate", response_model=NavigatorResponse)
async def navigate_situation(req: NavigatorRequest):
    """Generate contextual legal navigation guidance based on user situation and document context."""
    try:
        return navigator_service.navigate(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to process legal navigation request: {str(e)}",
        )
