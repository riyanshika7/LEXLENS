"""Native Google Cloud Platform (GCP) integration adapters for LexLens."""

import logging
import os
from typing import Optional

logger = logging.getLogger("lexlens.gcp")


class GCPService:
    """Manages GCP Secret Manager, Cloud Storage, and Cloud Logging with local fallbacks."""

    def __init__(self):
        self.project_id = os.environ.get("GCP_PROJECT_ID") or os.environ.get("GOOGLE_CLOUD_PROJECT")
        self.gcs_bucket_name = os.environ.get("GCS_BUCKET_NAME", "lexlens-documents-bucket")
        self._secret_client = None
        self._storage_client = None
        self._logging_client = None

    def get_secret(self, secret_id: str, default: str = "") -> str:
        """Fetch secret from GCP Secret Manager or fall back to environment variable."""
        env_val = os.environ.get(secret_id)
        if env_val:
            return env_val

        if not self.project_id:
            return default

        try:
            from google.cloud import secretmanager
            if not self._secret_client:
                self._secret_client = secretmanager.SecretManagerServiceClient()
            name = f"projects/{self.project_id}/secrets/{secret_id}/versions/latest"
            response = self._secret_client.access_secret_version(request={"name": name})
            return response.payload.data.decode("UTF-8")
        except Exception as e:
            logger.debug(f"GCP Secret Manager fallback for {secret_id}: {str(e)}")
            return default

    def upload_to_gcs(self, destination_blob_name: str, data: bytes, content_type: str = "application/octet-stream") -> Optional[str]:
        """Upload document bytes to Google Cloud Storage bucket if configured."""
        if not self.project_id:
            return None

        try:
            from google.cloud import storage
            if not self._storage_client:
                self._storage_client = storage.Client(project=self.project_id)
            bucket = self._storage_client.bucket(self.gcs_bucket_name)
            blob = bucket.blob(destination_blob_name)
            blob.upload_from_string(data, content_type=content_type)
            return blob.public_url or f"gs://{self.gcs_bucket_name}/{destination_blob_name}"
        except Exception as e:
            logger.warning(f"GCP Storage upload fallback: {str(e)}")
            return None

    def log_structured_event(self, event_name: str, payload: dict) -> None:
        """Log structured telemetry to Google Cloud Logging if available."""
        if not self.project_id:
            logger.info(f"[{event_name}] {payload}")
            return

        try:
            from google.cloud import logging as cloud_logging
            if not self._logging_client:
                self._logging_client = cloud_logging.Client(project=self.project_id)
                self._logging_client.setup_logging()
            logger.info(f"GCP_EVENT:{event_name}", extra={"payload": payload})
        except Exception:
            logger.info(f"[{event_name}] {payload}")


# Singleton GCP service instance
gcp_service = GCPService()
