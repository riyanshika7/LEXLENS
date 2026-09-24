"""Unit tests for GCP Service adapters and local fallbacks."""

from backend.services.gcp_service import GCPService


def test_gcp_service_local_fallback(monkeypatch):
    """Verify GCPService falls back to environment variables or defaults when GCP_PROJECT_ID is unconfigured."""
    service = GCPService()
    service.project_id = None

    # Test get_secret fallback
    secret_val = service.get_secret("TEST_KEY", default="fallback_val")
    assert secret_val == "fallback_val"

    monkeypatch.setenv("TEST_KEY", "env_val_123")
    secret_val_env = service.get_secret("TEST_KEY", default="fallback_val")
    assert secret_val_env == "env_val_123"

    # Test GCS upload fallback
    gcs_url = service.upload_to_gcs("test_blob.txt", b"test content")
    assert gcs_url is None

    # Test structured logging fallback
    service.log_structured_event("test_event", {"status": "ok"})
