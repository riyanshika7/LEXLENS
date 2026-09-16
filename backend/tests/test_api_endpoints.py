"""Integration tests for all REST API endpoints."""

import io
from pathlib import Path
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)
SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_data"


def test_api_health_endpoint():
    """Verify health endpoint returns valid system metrics."""
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "gemini_engine" in data
    assert "version" in data


def test_document_upload_and_full_lifecycle():
    """Test full upload, intelligence generation, chat, and checklist lifecycle."""
    sample_content = (SAMPLE_DIR / "commercial_lease_agreement.txt").read_bytes()

    # 1. Upload document
    files = {"file": ("lease.txt", io.BytesIO(sample_content), "text/plain")}
    data = {
        "jurisdiction_country": "United States",
        "jurisdiction_state": "New York",
    }
    upload_res = client.post("/api/documents/upload", files=files, data=data)
    assert upload_res.status_code == 200
    analysis = upload_res.json()

    doc_id = analysis["metadata"]["doc_id"]
    assert doc_id.startswith("doc_")
    assert len(analysis["clauses"]) > 0
    assert len(analysis["summary"]["doc_type"]) > 0

    # 2. Query document content
    doc_res = client.get(f"/api/documents/{doc_id}")
    assert doc_res.status_code == 200
    assert len(doc_res.json()["chunks"]) > 0

    # 3. Retrieve analysis
    an_res = client.get(f"/api/analysis/{doc_id}")
    assert an_res.status_code == 200

    # 4. Grounded Copilot Chat
    chat_payload = {
        "doc_id": doc_id,
        "question": "What is the monthly base rent?",
    }
    chat_res = client.post("/api/chat", json=chat_payload)
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert chat_data["is_found_in_document"] is True
    assert len(chat_data["document_evidence"]) > 0

    # 5. Checklist retrieval and toggle
    chk_res = client.get(f"/api/checklist/{doc_id}")
    assert chk_res.status_code == 200
    chk_items = chk_res.json()["items"]
    assert len(chk_items) > 0

    first_item_id = chk_items[0]["item_id"]
    toggle_res = client.post(
        "/api/checklist/toggle",
        json={"item_id": first_item_id, "completed": True},
    )
    assert toggle_res.status_code == 200
    assert toggle_res.json()["completed"] is True

    # 6. Lawyer Brief retrieval & note update
    brief_res = client.get(f"/api/lawyer-brief/{doc_id}")
    assert brief_res.status_code == 200
    assert brief_res.json()["doc_id"] == doc_id

    note_res = client.post(
        "/api/lawyer-brief/notes",
        json={"doc_id": doc_id, "notes": "Need to clarify HVAC maintenance responsibility."},
    )
    assert note_res.status_code == 200
    assert "HVAC" in note_res.json()["user_notes"]


def test_sandbox_benchmarks_and_run():
    """Verify jury testing sandbox loads benchmarks and executes diagnostics."""
    bench_res = client.get("/api/sandbox/benchmarks")
    assert bench_res.status_code == 200
    benchmarks = bench_res.json()
    assert len(benchmarks) >= 3

    # Run benchmark
    run_res = client.post(
        "/api/sandbox/run",
        json={"benchmark_id": "bench_contractor"},
    )
    assert run_res.status_code == 200
    run_data = run_res.json()
    assert run_data["diagnostic"]["status"] == "HEALTHY"
    assert run_data["diagnostic"]["clause_count"] > 0
    assert len(run_data["sample_answers"]) > 0
