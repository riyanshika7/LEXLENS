"""Tests for O(log N) Binary Search Utilities over chunks and clauses."""

from backend.schemas.analysis import ClauseItem
from backend.schemas.document import DocumentChunk
from backend.services.search_utils import (
    binary_search_chunk_by_offset,
    binary_search_clauses_by_page,
    binary_search_key,
)


def test_binary_search_chunk_by_offset():
    """Verify O(log N) lookup finds exact containing chunk by character offset."""
    chunks = [
        DocumentChunk(chunk_id="c1", page_number=1, section_title="Preamble", text="Intro", char_start=0, char_end=100),
        DocumentChunk(chunk_id="c2", page_number=1, section_title="Section 1", text="Terms", char_start=102, char_end=350),
        DocumentChunk(chunk_id="c3", page_number=2, section_title="Section 2", text="Remedies", char_start=352, char_end=800),
    ]

    # Offset within second chunk
    match = binary_search_chunk_by_offset(chunks, 200)
    assert match is not None
    assert match.chunk_id == "c2"

    # Offset at exact boundary
    match_boundary = binary_search_chunk_by_offset(chunks, 102)
    assert match_boundary is not None
    assert match_boundary.chunk_id == "c2"

    # Offset out of range
    match_out = binary_search_chunk_by_offset(chunks, 9999)
    assert match_out is None


def test_binary_search_clauses_by_page():
    """Verify O(log N) range search retrieves all clauses on a designated page."""
    clauses = [
        ClauseItem(clause_id="cl_1", category="Payment", title="Rent", excerpt="...", page_number=1, section_title="Sec 1", plain_language_explanation="...", why_it_matters="...", potential_consideration="..."),
        ClauseItem(clause_id="cl_2", category="Notice", title="Notice", excerpt="...", page_number=1, section_title="Sec 2", plain_language_explanation="...", why_it_matters="...", potential_consideration="..."),
        ClauseItem(clause_id="cl_3", category="Termination", title="Exit", excerpt="...", page_number=2, section_title="Sec 3", plain_language_explanation="...", why_it_matters="...", potential_consideration="..."),
        ClauseItem(clause_id="cl_4", category="Indemnity", title="Hold Harmless", excerpt="...", page_number=3, section_title="Sec 4", plain_language_explanation="...", why_it_matters="...", potential_consideration="..."),
    ]

    page_1_clauses = binary_search_clauses_by_page(clauses, 1)
    assert len(page_1_clauses) == 2
    assert {c.clause_id for c in page_1_clauses} == {"cl_1", "cl_2"}

    page_2_clauses = binary_search_clauses_by_page(clauses, 2)
    assert len(page_2_clauses) == 1
    assert page_2_clauses[0].clause_id == "cl_3"

    page_none = binary_search_clauses_by_page(clauses, 99)
    assert len(page_none) == 0


def test_generic_binary_search_key():
    """Verify generic binary_search_key utility."""
    data = [{"val": 10}, {"val": 25}, {"val": 40}, {"val": 99}]
    found = binary_search_key(data, 25, lambda x: x["val"])
    assert found == {"val": 25}

    not_found = binary_search_key(data, 50, lambda x: x["val"])
    assert not_found is None
