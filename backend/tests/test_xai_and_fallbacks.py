"""Tests for Resilient GenAI Pipelines, Structured Outputs, and Explainable AI (XAI)."""

from pathlib import Path
from backend.services.document_parser import DocumentParser
from backend.services.gemini_service import ai_service
from backend.services.legal_nlp_simulator import LegalNLPSimulator

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_data"


def test_xai_reasoning_generation():
    """Verify Explainable AI details (chain_of_thought, threshold_evaluation, impact_forecast)."""
    content = (SAMPLE_DIR / "mutual_nda.txt").read_bytes()
    doc = DocumentParser.parse_document(content, "mutual_nda.txt", ".txt", "test_xai_doc")

    summary, clauses, obligations, deadlines, concerns, xai = ai_service.analyze_document(doc)

    assert xai is not None
    assert len(xai.chain_of_thought) > 20
    assert len(xai.threshold_evaluation) > 20
    assert len(xai.impact_forecast) > 20

    # Ensure XAI fields are non-empty strings with technical reasoning
    assert "Parsed" in xai.chain_of_thought or "chunks" in xai.chain_of_thought
    assert "threshold" in xai.threshold_evaluation.lower()


def test_offline_simulator_resilience():
    """Verify LegalNLPSimulator operates deterministically without external network."""
    content = (SAMPLE_DIR / "commercial_lease_agreement.txt").read_bytes()
    doc = DocumentParser.parse_document(content, "lease.txt", ".txt", "test_sim_doc")

    from backend.services.clause_classifier import ClauseClassifier
    clauses = ClauseClassifier.classify_chunks(doc.chunks)

    summary, obligations, deadlines, concerns, xai = LegalNLPSimulator.analyze_deterministically(doc, clauses)

    assert summary.doc_type == "Commercial Lease Agreement"
    assert len(obligations) >= 1
    assert len(deadlines) >= 1
    assert len(concerns) >= 1
    assert xai is not None
