"""Application configuration using Pydantic Settings."""

from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """LexLens application settings."""

    APP_NAME: str = "LexLens"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Legal Document Intelligence & Action Copilot"
    APP_TAGLINE: str = "Understand the document. Know your options. Prepare smarter."

    ENV: str = "development"
    DEBUG: bool = False

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # File Upload Limits & Constraints
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".txt"]
    ALLOWED_MIME_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/octet-stream",  # Often sent by browsers for plain text or docx
    ]

    # Storage Paths
    BASE_DIR: Path = Path(__file__).resolve().parent
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    SAMPLE_DATA_DIR: Path = BASE_DIR / "sample_data"

    # Rate Limiting (Token Bucket / Sliding Window)
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60

    # Google Gemini GenAI Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_TIMEOUT_SECONDS: float = 30.0

    # Google Cloud Project info (optional)
    GCP_PROJECT_ID: str = ""
    GCP_REGION: str = "us-central1"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
# Ensure upload directory exists
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
