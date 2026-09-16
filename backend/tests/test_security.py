"""Tests for security validation, sanitizer, and protective middleware."""

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from backend.config import settings
from backend.main import app
from backend.security.sanitizer import sanitize_filename, validate_file_security

client = TestClient(app)


def test_sanitize_filename():
    """Verify filename sanitization strips directory traversal and dangerous characters."""
    assert "passwd" in sanitize_filename("../../etc/passwd")
    assert ".." not in sanitize_filename("../../etc/passwd")
    assert "\\" not in sanitize_filename("..\\windows\\system32")
    assert sanitize_filename("my contract.pdf").endswith(".pdf")


def test_zero_byte_rejection():
    """Ensure zero-byte file uploads are rejected with status 400."""
    with pytest.raises(HTTPException) as exc_info:
        validate_file_security("empty.txt", b"", "text/plain")
    assert exc_info.value.status_code == 400
    assert "empty" in exc_info.value.detail.lower()


def test_oversized_file_rejection():
    """Ensure uploads exceeding MAX_FILE_SIZE_BYTES are rejected with status 413."""
    oversized = b"x" * (settings.MAX_FILE_SIZE_BYTES + 1024)
    with pytest.raises(HTTPException) as exc_info:
        validate_file_security("big.txt", oversized, "text/plain")
    assert exc_info.value.status_code == 413


def test_unsupported_extension_rejection():
    """Ensure executable or disallowed extensions are rejected with 415."""
    with pytest.raises(HTTPException) as exc_info:
        validate_file_security("malware.exe", b"fake binary", "application/x-msdownload")
    assert exc_info.value.status_code == 415


def test_corrupt_pdf_magic_bytes():
    """Ensure files masquerading as PDFs without %PDF- magic bytes are rejected."""
    with pytest.raises(HTTPException) as exc_info:
        validate_file_security("fake.pdf", b"This is not a real PDF header", "application/pdf")
    assert exc_info.value.status_code == 400
    assert "pdf" in exc_info.value.detail.lower()


def test_security_headers_present():
    """Verify OWASP-compliant security headers in HTTP responses."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert "Content-Security-Policy" in response.headers
    assert "X-Request-ID" in response.headers
    assert "X-Response-Time-Ms" in response.headers
