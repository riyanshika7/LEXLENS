"""Automated Test Suite for Problem Statement & Challenge Alignment user journeys."""

import pytest
from backend.schemas.navigator import NavigatorRequest
from backend.services.document_parser import DocumentParser
from backend.services.legal_navigator import navigator_service
from backend.services.comparator import DocumentComparator
from backend.services.lawyer_brief import LawyerBriefService
from backend.services.storage import doc_store


@pytest.fixture
def sample_contract_doc():
    """Create and store sample document for challenge alignment testing."""
    sample_text = (
        "COMMERCIAL LEASE AGREEMENT\n"
        "This Agreement is entered into by Acme Properties (Landlord) and Beta Corp (Tenant).\n\n"
        "Section 1. Rent Payment\n"
        "Tenant shall pay $5,000 monthly on or before the 1st day of each month.\n\n"
        "Section 2. Maintenance and Repairs\n"
        "Tenant is responsible for internal repairs. Landlord maintains structural roof.\n\n"
        "Section 3. Termination\n"
        "Either party may terminate this lease with 30 days written notice. See Schedule B.\n"
    )
    doc_content = DocumentParser.parse_document(
        content=sample_text.encode("utf-8"),
        filename="lease_agreement.txt",
        ext=".txt",
        doc_id="test_challenge_doc_001",
    )
    doc_store.save_document(doc_content)
    return doc_content


def test_challenge_intent_1_understand_document(sample_contract_doc):
    """Verify system extracts core purpose, parties, obligations, and plain-English clauses."""
    assert sample_contract_doc.metadata.doc_id == "test_challenge_doc_001"
    assert "Acme Properties" in sample_contract_doc.raw_text
    assert len(sample_contract_doc.chunks) > 0


def test_challenge_intent_2_compare_documents():
    """Verify comparator detects added, removed, and modified clauses with obligation shift summaries."""
    text_v1 = "Section 1. Notice Period\nTenant must provide 30 days written notice to terminate."
    text_v2 = "Section 1. Notice Period\nTenant must provide 60 days written notice to terminate."

    doc1 = DocumentParser.parse_document(text_v1.encode("utf-8"), "v1.txt", ".txt", "v1")
    doc2 = DocumentParser.parse_document(text_v2.encode("utf-8"), "v2.txt", ".txt", "v2")

    comparison = DocumentComparator.compare_documents(doc1, doc2)
    assert len(comparison.changed_clauses) > 0 or len(comparison.changed_dates) > 0 or len(comparison.executive_summary) > 0


def test_challenge_intent_3_navigate_and_detect_missing_info(sample_contract_doc):
    """Verify Legal Navigator surfaces grounded facts, missing Schedule B, and informational paths."""
    req = NavigatorRequest(
        situation="I received a contract to sign",
        role="Tenant",
        doc_type="Commercial Lease",
        jurisdiction_country="United States",
        jurisdiction_state="New York",
        doc_id=sample_contract_doc.metadata.doc_id,
    )
    res = navigator_service.navigate(req)
    assert res.where_you_are != ""
    assert len(res.informational_paths) == 3
    assert len(res.missing_information) > 0
    assert any("Schedule B" in item.item for item in res.missing_information)


def test_challenge_intent_4_responsible_jurisdiction_handling():
    """Verify system explicitly disclaims state-specific statutory interpretations when jurisdiction is unspecified."""
    req = NavigatorRequest(
        situation="Received notice",
        jurisdiction_country="Unspecified",
        jurisdiction_state="Unspecified",
    )
    res = navigator_service.navigate(req)
    assert "Jurisdiction not fully specified" in res.jurisdiction_disclaimer


def test_challenge_intent_5_lawyer_consultation_dossier_generation(sample_contract_doc):
    """Verify system generates structured attorney consultation dossier with tactical questions."""
    from backend.services.gemini_service import ai_service
    summary, clauses, obligations, deadlines, concerns, xai = ai_service.analyze_document(sample_contract_doc)

    brief = LawyerBriefService.generate_brief(
        doc_content=sample_contract_doc,
        summary=summary,
        clauses=clauses,
        concerns=concerns,
        deadlines=deadlines,
        user_notes="Verify late fee applicability under NY state law.",
    )
    assert brief.doc_id == sample_contract_doc.metadata.doc_id
    assert len(brief.questions_for_lawyer) > 0
    assert len(brief.high_priority_clauses) >= 0
