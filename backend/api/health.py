from datetime import datetime, timezone
from fastapi import APIRouter
from backend.config import settings
from backend.services.gemini_service import ai_service
from backend.services.storage import doc_store

router = APIRouter(prefix="/api/health", tags=["health"])


@router.get("")
async def health_check():
    """Health check returning system status, active models, and store diagnostics."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "tagline": settings.APP_TAGLINE,
        "environment": settings.ENV,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "gemini_engine": {
            "model": settings.GEMINI_MODEL,
            "live_connected": ai_service.is_live_gemini_active,
            "mode": "Live Google Gemini 2.5" if ai_service.is_live_gemini_active else "High-Precision Local Deterministic NLP",
        },
        "system_metrics": {
            "active_documents": len(doc_store.documents),
            "indexed_retrievers": len(doc_store.retrievers),
        },
    }
