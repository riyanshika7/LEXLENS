"""Algorithmic Binary Search Utilities with guaranteed O(log N) runtime.

Provides logarithmic binary search over sorted document chunk offsets,
clause page numbers, and index structures.
"""

import bisect
from typing import Callable, List, Optional, TypeVar
from backend.schemas.analysis import ClauseItem
from backend.schemas.document import DocumentChunk

T = TypeVar("T")


def binary_search_chunk_by_offset(
    chunks: List[DocumentChunk], char_offset: int
) -> Optional[DocumentChunk]:
    """Find the document chunk containing a specific character offset in O(log N) time.
    
    Assumes chunks are ordered by char_start.
    """
    if not chunks:
        return None

    start_offsets = [c.char_start for c in chunks]
    idx = bisect.bisect_right(start_offsets, char_offset) - 1

    if 0 <= idx < len(chunks):
        chunk = chunks[idx]
        if chunk.char_start <= char_offset <= chunk.char_end:
            return chunk

    return None


def binary_search_clauses_by_page(
    clauses: List[ClauseItem], target_page: int
) -> List[ClauseItem]:
    """Extract all clauses belonging to a specific page number in O(log N + K) time.
    
    Assumes clauses are sorted by page_number.
    """
    if not clauses:
        return []

    page_numbers = [c.page_number for c in clauses]
    left_idx = bisect.bisect_left(page_numbers, target_page)
    right_idx = bisect.bisect_right(page_numbers, target_page)

    return clauses[left_idx:right_idx]


def binary_search_key(
    items: List[T], target: float, key_fn: Callable[[T], float]
) -> Optional[T]:
    """Generic O(log N) binary search returning item matching target key."""
    if not items:
        return None

    keys = [key_fn(x) for x in items]
    idx = bisect.bisect_left(keys, target)

    if idx < len(items) and keys[idx] == target:
        return items[idx]

    return None
