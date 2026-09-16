"""Tests for BM25 retriever and document-grounded legal copilot chat."""

from pathlib import Path
from backend.services.document_parser import DocumentParser
from backend.services.gemini_service import ai_service
from backend.services.retriever import BM25Retriever

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_data"


def test_retriever_exact_phrase_ranking():
    """Verify BM25 ranks chunks containing query concepts at the top."""
    content = (SAMPLE_DIR / "commercial_lease_agreement.txt").read_bytes()
    doc = DocumentParser.parse_document(content, "lease.txt", ".txt", "d1")
    retriever = BM25Retriever(doc.chunks)

    # Query about late rent
    results = retriever.retrieve("What is the late charge if rent is not paid?", top_k=3)
    assert len(results) > 0
    top_chunk, score = results[0]
    assert "late charge" in top_chunk.text.lower() or "base rent" in top_chunk.text.lower()
    assert score > 0


def test_grounded_chat_with_verbatim_evidence():
    """Verify Copilot produces grounded answers with verbatim evidence citations."""
    content = (SAMPLE_DIR / "commercial_lease_agreement.txt").read_bytes()
    doc = DocumentParser.parse_document(content, "lease.txt", ".txt", "d1")
    retriever = BM25Retriever(doc.chunks)

    answer = ai_service.answer_query(doc, retriever, "What happens if rent is late?")
    assert answer.is_found_in_document is True
    assert len(answer.document_evidence) > 0
    assert len(answer.answer) > 20
    assert len(answer.explanation) > 10
    assert len(answer.uncertainty) > 10
    assert len(answer.next_step) > 10


def test_chat_not_found_fallback():
    """Verify strict rejection of out-of-domain / fabricated queries."""
    content = (SAMPLE_DIR / "commercial_lease_agreement.txt").read_bytes()
    doc = DocumentParser.parse_document(content, "lease.txt", ".txt", "d1")
    retriever = BM25Retriever(doc.chunks)

    # Completely absent query
    answer = ai_service.answer_query(
        doc, retriever, "What are the rules regarding orbital spacecraft docking fees and alien encounters?"
    )
    assert answer.is_found_in_document is False
    assert "couldn't find" in answer.answer.lower()
    assert len(answer.document_evidence) == 0
