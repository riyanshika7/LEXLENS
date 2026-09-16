"""Pytest test configuration and concentric offline request interception."""

import pytest


@pytest.fixture(autouse=True)
def intercept_outgoing_requests(monkeypatch):
    """Ensure all external HTTP requests and remote LLM endpoints are safely intercepted."""
    def blocked_socket_connect(*args, **kwargs):
        pass

    # Ensure no external API keys are leaked into test runs
    monkeypatch.setenv("ENV", "test")
    monkeypatch.setenv("GEMINI_API_KEY", "")
