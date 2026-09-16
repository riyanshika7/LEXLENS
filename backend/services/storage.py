"""In-memory thread-safe storage repository for active documents, indexes, and sessions."""

from typing import Dict, List, Optional
from backend.schemas.analysis import (
    ClauseItem,
    DeadlineItem,
    DocumentAnalysisResponse,
    DocumentSummary,
    ObligationItem,
    PotentialConcern,
)
from backend.schemas.checklist import ChecklistItem
from backend.schemas.document import DocumentContent
from backend.schemas.lawyer_brief import LawyerBrief
from backend.services.retriever import BM25Retriever


class DocumentStore:
    """In-memory store for documents and derived intelligence during session."""

    def __init__(self):
        self.documents: Dict[str, DocumentContent] = {}
        self.retrievers: Dict[str, BM25Retriever] = {}
        self.analyses: Dict[str, DocumentAnalysisResponse] = {}
        self.checklists: Dict[str, List[ChecklistItem]] = {}
        self.lawyer_briefs: Dict[str, LawyerBrief] = {}

    def save_document(self, doc_content: DocumentContent) -> str:
        doc_id = doc_content.metadata.doc_id
        self.documents[doc_id] = doc_content
        self.retrievers[doc_id] = BM25Retriever(doc_content.chunks)
        return doc_id

    def get_document(self, doc_id: str) -> Optional[DocumentContent]:
        return self.documents.get(doc_id)

    def get_retriever(self, doc_id: str) -> Optional[BM25Retriever]:
        return self.retrievers.get(doc_id)

    def save_analysis(self, doc_id: str, analysis: DocumentAnalysisResponse):
        self.analyses[doc_id] = analysis

    def get_analysis(self, doc_id: str) -> Optional[DocumentAnalysisResponse]:
        return self.analyses.get(doc_id)

    def save_checklist(self, doc_id: str, items: List[ChecklistItem]):
        self.checklists[doc_id] = items

    def get_checklist(self, doc_id: str) -> List[ChecklistItem]:
        return self.checklists.get(doc_id, [])

    def save_brief(self, doc_id: str, brief: LawyerBrief):
        self.lawyer_briefs[doc_id] = brief

    def get_brief(self, doc_id: str) -> Optional[LawyerBrief]:
        return self.lawyer_briefs.get(doc_id)


# Global storage instance
doc_store = DocumentStore()
