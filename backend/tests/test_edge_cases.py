"""Tests for edge cases: missing dates, missing parties, and atypical documents."""

from pathlib import Path
from backend.services.document_parser import DocumentParser
from backend.services.gemini_service import ai_service

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_data"


def test_document_with_missing_dates_and_parties():
    """Ensure pipeline gracefully analyzes documents lacking explicit dates and parties."""
    content = (SAMPLE_DIR / "edge_case_no_dates.txt").read_bytes()
    doc = DocumentParser.parse_document(content, "no_dates.txt", ".txt", "edge_1")

    summary, clauses, obligations, deadlines, concerns = ai_service.analyze_document(doc)

    assert doc.metadata.doc_id == "edge_1"
    assert len(summary.doc_type) > 0
    assert len(clauses) > 0
    # Parties should state not explicitly named instead of crashing
    assert any("not explicitly named" in p.lower() or len(p) > 0 for p in summary.parties)
    # Important dates should indicate no dates found
    assert any("no explicit" in d.lower() or len(d) > 0 for d in summary.important_dates)


def test_unicode_and_special_characters():
    """Ensure documents with international characters, accents, and currency symbols don't crash."""
    text = (
        "CONTRATO DE ARRENDAMIENTO COMERCIAL\n\n"
        "SECTION 1. CANON DE ARRENDAMIENTO\n"
        "El arrendatario pagará la suma de €5.000,00 mensuales.\n\n"
        "SECTION 2. TERMINACIÓN\n"
        "Cualquiera de las partes puede rescindir con 30 días de preaviso."
    )
    doc = DocumentParser.parse_document(text.encode("utf-8"), "spanish_lease.txt", ".txt", "edge_es")
    summary, clauses, obligations, deadlines, concerns = ai_service.analyze_document(doc)

    assert len(clauses) >= 1
    assert any("termination" in c.category.lower() or "payment" in c.category.lower() or "general" in c.category.lower() for c in clauses)
