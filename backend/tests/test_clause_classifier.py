"""Tests for legal clause taxonomy and classifier engine."""

from pathlib import Path
from backend.services.clause_classifier import ClauseClassifier
from backend.services.document_parser import DocumentParser

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_data"


def test_classify_lease_clauses():
    """Verify identification of essential lease clauses (Rent, Indemnity, Default, Termination)."""
    content = (SAMPLE_DIR / "commercial_lease_agreement.txt").read_bytes()
    doc = DocumentParser.parse_document(content, "lease.txt", ".txt", "d1")
    clauses = ClauseClassifier.classify_chunks(doc.chunks)

    categories = {c.category for c in clauses}
    assert "Payment" in categories
    assert "Indemnification" in categories
    assert "Termination" in categories

    # Verify plain language fields are populated
    for c in clauses:
        assert len(c.plain_language_explanation) > 15
        assert len(c.why_it_matters) > 15
        assert len(c.potential_consideration) > 15
        assert 0.0 <= c.confidence <= 1.0


def test_classify_contractor_clauses():
    """Verify classification of IP assignment, non-solicitation, and dispute resolution."""
    content = (SAMPLE_DIR / "independent_contractor_agreement.txt").read_bytes()
    doc = DocumentParser.parse_document(content, "contractor.txt", ".txt", "d2")
    clauses = ClauseClassifier.classify_chunks(doc.chunks)

    categories = {c.category for c in clauses}
    assert "Intellectual Property" in categories
    assert "Restrictions" in categories or "Confidentiality" in categories
    assert "Dispute Resolution" in categories

    # Verify high-risk clauses trigger ask_a_lawyer
    ip_clause = next(c for c in clauses if c.category == "Intellectual Property")
    assert ip_clause.ask_a_lawyer is True
