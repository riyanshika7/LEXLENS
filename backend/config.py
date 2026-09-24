"""Application configuration using Pydantic Settings and dynamic secret discovery."""

import os
from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def resolve_secret(secret_id: str, default: str = "") -> str:
    """Dynamically fetch secret from environment variable or Google Cloud Secret Manager."""
    val = os.environ.get(secret_id)
    if val:
        return val

    # Attempt Google Cloud Secret Manager if GCP Project ID is set
    project_id = os.environ.get("GCP_PROJECT_ID")
    if project_id:
        try:
            from google.cloud import secretmanager
            client = secretmanager.SecretManagerServiceClient()
            name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
            response = client.access_secret_version(request={"name": name})
            return response.payload.data.decode("UTF-8")
        except Exception:
            pass

    return default


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
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @property
    def parsed_cors_origins(self) -> List[str]:
        """Return list of allowed CORS origins."""
        if isinstance(self.CORS_ORIGINS, str):
            return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]
        return self.CORS_ORIGINS

    # File Upload Limits & Constraints
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".txt", ".csv", ".sql"]
    ALLOWED_MIME_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/csv",
        "application/sql",
        "application/octet-stream",
    ]

    # Storage Paths
    BASE_DIR: Path = Path(__file__).resolve().parent
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    SAMPLE_DATA_DIR: Path = BASE_DIR / "sample_data"

    # Rate Limiting
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60

    # Google Gemini GenAI Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_TIMEOUT_SECONDS: float = 30.0

    # Google Cloud Project info
    GCP_PROJECT_ID: str = ""
    GCP_REGION: str = "us-central1"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
# Initialize dynamic secrets if absent from env file
if not settings.GEMINI_API_KEY:
    settings.GEMINI_API_KEY = resolve_secret("GEMINI_API_KEY")
if not settings.GCP_PROJECT_ID:
    settings.GCP_PROJECT_ID = resolve_secret("GCP_PROJECT_ID")

settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
