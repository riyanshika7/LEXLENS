"""Tests for semantic document comparison engine."""

from pathlib import Path
from backend.services.comparator import DocumentComparator
from backend.services.document_parser import DocumentParser

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_data"


def test_comparison_employment_v1_vs_v2():
    """Verify semantic comparison detects added, removed, and modified clauses."""
    v1_bytes = (SAMPLE_DIR / "employment_agreement_v1.txt").read_bytes()
    v2_bytes = (SAMPLE_DIR / "employment_agreement_v2.txt").read_bytes()

    doc1 = DocumentParser.parse_document(v1_bytes, "employment_v1.txt", ".txt", "doc_v1")
    doc2 = DocumentParser.parse_document(v2_bytes, "employment_v2.txt", ".txt", "doc_v2")

    result = DocumentComparator.compare_documents(doc1, doc2)

    assert result.doc1_id == "doc_v1"
    assert result.doc2_id == "doc_v2"
    assert len(result.changed_clauses) > 0
    assert len(result.executive_summary) > 30

    diff_categories = {d.category: d for d in result.changed_clauses}

    # Verify non-compete / restriction was added or altered
    assert any(cat in diff_categories for cat in ["Restrictions", "Indemnification", "Payment", "Termination"])
