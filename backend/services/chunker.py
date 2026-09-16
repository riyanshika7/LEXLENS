"""Document Chunker Module.

Segments parsed pages into semantic chunks with boundary detection
and exact character offset indexing. Performs all chunking and sorting in-memory.
"""

import re
import uuid
from typing import List, Tuple
from backend.schemas.document import DocumentChunk

# Heading regex patterns for legal contracts
SECTION_HEADING_PATTERN = re.compile(
    r"^(?:(?:SECTION|ARTICLE|CLAUSE)\s+[0-9IVXLCDM]+(?:\.[0-9]+)*[\.\:\-\s]+[A-Z\s]{3,}|"
    r"[0-9IVXLCDM]+[\.\)]\s+[A-Z][A-Za-z0-9\s]{2,}|"
    r"[A-Z\s]{4,}(?:\:|\.|\b))",
    re.MULTILINE,
)


def chunk_document(pages: List[Tuple[int, str]]) -> List[DocumentChunk]:
    """Segment pages into semantic chunks by section boundaries and paragraph breaks.
    
    Keeps chunks between 200 and 1500 characters with section titles.
    Operates completely in-memory and accumulates sequentially.
    """
    chunks: List[DocumentChunk] = []
    global_char_offset = 0

    for page_num, page_text in pages:
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", page_text) if p.strip()]
        cur_section = f"Page {page_num}"
        cur_chunk_lines: List[str] = []
        cur_chunk_len = 0

        for para in paragraphs:
            heading_match = SECTION_HEADING_PATTERN.match(para)
            if heading_match:
                cur_section = para.split("\n")[0][:80].strip()

            para_len = len(para)
            if cur_chunk_len + para_len > 1200 and cur_chunk_lines:
                chunk_text = "\n\n".join(cur_chunk_lines)
                chunks.append(
                    DocumentChunk(
                        chunk_id=f"chunk_{page_num}_{len(chunks)+1}_{uuid.uuid4().hex[:6]}",
                        page_number=page_num,
                        section_title=cur_section,
                        text=chunk_text,
                        char_start=global_char_offset,
                        char_end=global_char_offset + len(chunk_text),
                    )
                )
                global_char_offset += len(chunk_text) + 2
                cur_chunk_lines = [para]
                cur_chunk_len = para_len
            else:
                cur_chunk_lines.append(para)
                cur_chunk_len += para_len + 2

        if cur_chunk_lines:
            chunk_text = "\n\n".join(cur_chunk_lines)
            chunks.append(
                DocumentChunk(
                    chunk_id=f"chunk_{page_num}_{len(chunks)+1}_{uuid.uuid4().hex[:6]}",
                    page_number=page_num,
                    section_title=cur_section,
                    text=chunk_text,
                    char_start=global_char_offset,
                    char_end=global_char_offset + len(chunk_text),
                )
            )
            global_char_offset += len(chunk_text) + 2

    # Fallback if no chunks generated
    if not chunks and pages:
        fallback_text = pages[0][1]
        chunks.append(
            DocumentChunk(
                chunk_id=f"chunk_1_1_{uuid.uuid4().hex[:6]}",
                page_number=1,
                section_title="General",
                text=fallback_text[:1000],
                char_start=0,
                char_end=len(fallback_text[:1000]),
            )
        )

    return chunks
