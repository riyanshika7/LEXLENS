"""Tests for worst-case edge scenarios, corrupt files, SQL injection, XSS, and data spikes."""

import pytest
from fastapi import HTTPException
from backend.security.sanitizer import validate_file_security, sanitize_text_input, sanitize_filename
from backend.services.document_parser import DocumentParser


def test_zero_byte_file_rejection():
    """Verify zero-byte files raise HTTP 400."""
    with pytest.raises(HTTPException) as exc_info:
        validate_file_security("empty.pdf", b"")
    assert exc_info.value.status_code == 400


def test_corrupt_pdf_binary_noise():
    """Verify corrupt PDF without %PDF- magic bytes raises HTTP 400."""
    corrupt_bytes = b"NOT_A_PDF_MAGIC_BYTES_12345"
    with pytest.raises(HTTPException) as exc_info:
        validate_file_security("fake.pdf", corrupt_bytes)
    assert exc_info.value.status_code == 400


def test_corrupt_docx_zip_header():
    """Verify corrupt DOCX without PK header raises HTTP 400."""
    corrupt_docx = b"INVALID_DOCX_HEADER_DATA"
    with pytest.raises(HTTPException) as exc_info:
        validate_file_security("fake.docx", corrupt_docx)
    assert exc_info.value.status_code == 400


def test_sql_injection_sanitization():
    """Verify SQL injection keywords in text input are neutralized."""
    raw_query = "SELECT * FROM users WHERE 1=1 UNION SELECT credit_card FROM payments; DROP TABLE contracts;"
    sanitized = sanitize_text_input(raw_query)
    assert "UNION SELECT" not in sanitized
    assert "DROP TABLE" not in sanitized
    assert "[filtered]" in sanitized


def test_xss_script_tag_stripping():
    """Verify XSS script tags and inline event handlers are stripped."""
    xss_payload = "<script>alert('xss')</script><img src=x onerror=alert(1)>"
    sanitized = sanitize_text_input(xss_payload)
    assert "<script>" not in sanitized
    assert "onerror=" not in sanitized


def test_path_traversal_filename_sanitization():
    """Verify path traversal characters are removed from filename."""
    traversal_fn = "../../../../../etc/passwd"
    sanitized = sanitize_filename(traversal_fn)
    assert ".." not in sanitized
    assert "/" not in sanitized
    assert "passwd" in sanitized


def test_high_volume_text_data_spike():
    """Verify parser gracefully handles large data spikes (500KB text payload)."""
    large_payload = ("Clause 1: Confidentiality obligation.\n" * 10000).encode("utf-8")
    doc_content = DocumentParser.parse_document(
        content=large_payload,
        filename="spike_test.txt",
        ext=".txt",
        doc_id="spike_101",
    )
    assert len(doc_content.chunks) > 0
    assert doc_content.metadata.word_count > 10000


def test_csv_and_sql_parsing():
    """Verify parser handles CSV data and SQL query schema files."""
    csv_bytes = b"Contract_ID,Party,Obligation\n101,Acme Corp,Payment of $5000\n102,Beta LLC,Delivery of goods"
    doc_csv = DocumentParser.parse_document(csv_bytes, "data.csv", ".csv", "csv_001")
    assert "Acme Corp" in doc_csv.raw_text

    sql_bytes = b"CREATE TABLE lease (id INT, tenant VARCHAR(250), rent DECIMAL(10,2));"
    doc_sql = DocumentParser.parse_document(sql_bytes, "schema.sql", ".sql", "sql_001")
    assert "CREATE TABLE lease" in doc_sql.raw_text
