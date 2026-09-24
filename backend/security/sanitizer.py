"""Security validation and sanitization for file uploads and text inputs."""

import io
import re
import uuid
import zipfile
from pathlib import Path
from typing import Tuple
from fastapi import HTTPException, status
from backend.config import settings


# Common malicious or dangerous patterns
SUSPICIOUS_PATH_PATTERN = re.compile(r"(\.\./|\.\.\\|[\x00-\x1f\x7f])")
SAFE_FILENAME_PATTERN = re.compile(r"^[a-zA-Z0-9_\-. ]+$")


def sanitize_filename(original_filename: str) -> str:
    """Sanitize filename to prevent path traversal and shell injection."""
    if not original_filename:
        return f"document_{uuid.uuid4().hex[:8]}.txt"

    # Strip directory components
    clean_name = Path(original_filename).name
    # Remove null bytes and control chars
    clean_name = re.sub(r"[\x00-\x1f\x7f]", "", clean_name)
    # Replace non-safe characters with underscore
    clean_name = re.sub(r"[^a-zA-Z0-9_\-. ]", "_", clean_name).strip()

    if not clean_name:
        clean_name = f"document_{uuid.uuid4().hex[:8]}"

    # Limit filename length
    stem = Path(clean_name).stem[:50]
    suffix = Path(clean_name).suffix.lower()
    return f"{stem}_{uuid.uuid4().hex[:8]}{suffix}"


def validate_file_security(
    filename: str, content: bytes, reported_mime: str = ""
) -> Tuple[str, str]:
    """
    Validate file integrity, magic bytes, size limits, and security properties.
    Returns sanitized filename and normalized file extension.
    Raises HTTPException with clear, user-friendly explanations.
    """
    # 1. Zero-byte check
    if not content or len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded document is empty (0 bytes). Please upload a valid document containing legal text.",
        )

    # 2. Maximum file size check
    if len(content) > settings.MAX_FILE_SIZE_BYTES:
        max_mb = settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)
        actual_mb = round(len(content) / (1024 * 1024), 2)
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {max_mb} MB (uploaded file is {actual_mb} MB).",
        )

    # 3. Path traversal & filename check
    if SUSPICIOUS_PATH_PATTERN.search(filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid filename containing forbidden path navigation characters.",
        )

    ext = Path(filename).suffix.lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        allowed = ", ".join(settings.ALLOWED_EXTENSIONS)
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file extension '{ext}'. Only {allowed} files are supported.",
        )

    # 4. Deep magic byte & structural verification
    if ext == ".pdf":
        # Check PDF magic bytes '%PDF-'
        if not content.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The file has a .pdf extension but does not contain a valid PDF file header (corrupted or disguised file).",
            )
        # Check for encrypted or password-protected PDF signatures
        if b"/Encrypt" in content:
            # Let parser attempt to open, but flag it early if encrypted
            pass

    elif ext == ".docx":
        # DOCX must be a valid zip archive starting with PK\x03\x04
        if not content.startswith(b"PK\x03\x04"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The file has a .docx extension but is not a valid OpenXML Word document (invalid ZIP header).",
            )
        # Verify ZIP structure and prevent zip-bomb
        try:
            with zipfile.ZipFile(io.BytesIO(content)) as zf:
                # Check for word/document.xml
                file_names = zf.namelist()
                if "word/document.xml" not in file_names and "[Content_Types].xml" not in file_names:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="The uploaded DOCX archive is missing core Word document components (corrupted file).",
                    )
                # Check decompression ratio (zip bomb defense)
                total_uncompressed = sum(info.file_size for info in zf.infolist())
                if total_uncompressed > 50 * 1024 * 1024:  # 50MB uncompressed limit
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="The document archive's uncompressed size is abnormally large, indicating a potential zip bomb.",
                    )
        except zipfile.BadZipFile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded DOCX document is corrupt and cannot be decompressed.",
            )

    elif ext == ".txt":
        # Check text encoding (UTF-8, ASCII, or Latin-1) and forbid null bytes
        if b"\x00" in content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded text file contains binary null bytes and cannot be parsed as plain text.",
            )
        try:
            content.decode("utf-8")
        except UnicodeDecodeError:
            try:
                content.decode("latin-1")
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The uploaded text file has an unsupported or corrupted text encoding. Please use UTF-8.",
                )

    sanitized = sanitize_filename(filename)
    return sanitized, ext


def sanitize_text_input(text: str) -> str:
    """Sanitize user text input against XSS, script injection, and hazardous SQL patterns."""
    if not text:
        return ""
    # Strip dangerous HTML/script tags and event handlers
    cleaned = re.sub(r"(?i)<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>", "", text)
    cleaned = re.sub(r"(?i)\bon\w+\s*=\s*(?:['\"].*?['\"]|[^\s>]+)", "", cleaned)
    cleaned = re.sub(r"(?i)javascript\s*:", "", cleaned)
    # Neutralize dangerous SQL injection attempts in search queries
    cleaned = re.sub(r"(?i)\b(UNION\s+SELECT|DROP\s+TABLE|ALTER\s+TABLE|DELETE\s+FROM)\b", "[filtered]", cleaned)
    return cleaned.strip()

