"""Pydantic schemas for document models, chunks, and metadata."""

from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field


class DocumentMetadata(BaseModel):
    """Metadata describing an uploaded legal document."""

    doc_id: str = Field(..., description="Unique document identifier")
    filename: str = Field(..., description="Original filename of the document")
    file_type: str = Field(..., description="File format extension (pdf, docx, txt)")
    size_bytes: int = Field(..., description="File size in bytes")
    page_count: int = Field(default=1, description="Total number of pages")
    word_count: int = Field(default=0, description="Total extracted word count")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    jurisdiction_country: Optional[str] = Field(default="Unspecified", description="Country selected by user")
    jurisdiction_state: Optional[str] = Field(default="Unspecified", description="State or province selected")


class DocumentChunk(BaseModel):
    """A granular chunk of document text indexed for citation and retrieval."""

    chunk_id: str = Field(..., description="Unique ID for this text chunk")
    page_number: int = Field(default=1, description="Page number where chunk appears (1-indexed)")
    section_title: str = Field(default="General", description="Section or article heading")
    text: str = Field(..., description="The textual content of the chunk")
    char_start: int = Field(default=0, description="Character offset start in the full document")
    char_end: int = Field(default=0, description="Character offset end in the full document")


class DocumentContent(BaseModel):
    """Full parsed representation of a legal document."""

    metadata: DocumentMetadata
    raw_text: str
    chunks: List[DocumentChunk]
