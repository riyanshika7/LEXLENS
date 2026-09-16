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
    """Test full upload, intelligence generation, chat, checklist, and pathfinding lifecycle."""
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
    assert "xai_reasoning" in analysis

    # 2. Query document content
    doc_res = client.get(f"/api/documents/{doc_id}")
    assert doc_res.status_code == 200
    assert len(doc_res.json()["chunks"]) > 0

    # 3. Retrieve analysis
    an_res = client.get(f"/api/analysis/{doc_id}")
    assert an_res.status_code == 200

    # 4. Critical & cure pathfinding endpoints (O(E log V))
    crit_path_res = client.get(f"/api/analysis/{doc_id}/dependency-path?path_type=critical")
    assert crit_path_res.status_code == 200
    assert len(crit_path_res.json()["path_nodes"]) >= 2

    cure_path_res = client.get(f"/api/analysis/{doc_id}/dependency-path?path_type=cure")
    assert cure_path_res.status_code == 200
    assert len(cure_path_res.json()["path_nodes"]) >= 2

    # 5. Algorithmic binary search offset lookup (O(log N))
    search_off_res = client.get(f"/api/analysis/{doc_id}/search-offset?offset=50")
    assert search_off_res.status_code == 200
    assert search_off_res.json()["found"] is True

    # 6. Grounded Copilot Chat
    chat_payload = {
        "doc_id": doc_id,
        "question": "What is the monthly base rent?",
    }
    chat_res = client.post("/api/chat", json=chat_payload)
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert chat_data["is_found_in_document"] is True
    assert len(chat_data["document_evidence"]) > 0

    # 7. Checklist retrieval, custom addition, and toggle
    chk_res = client.get(f"/api/checklist/{doc_id}")
    assert chk_res.status_code == 200
    chk_items = chk_res.json()["items"]
    assert len(chk_items) > 0

    add_custom_res = client.post(
        "/api/checklist/custom",
        json={"doc_id": doc_id, "text": "Consult accountant regarding sales tax.", "priority": "high", "category": "Tax"},
    )
    assert add_custom_res.status_code == 200
    assert add_custom_res.json()["text"] == "Consult accountant regarding sales tax."

    first_item_id = chk_items[0]["item_id"]
    toggle_res = client.post(
        "/api/checklist/toggle",
        json={"item_id": first_item_id, "completed": True},
    )
    assert toggle_res.status_code == 200
    assert toggle_res.json()["completed"] is True

    # 8. Lawyer Brief retrieval & note update
    brief_res = client.get(f"/api/lawyer-brief/{doc_id}")
    assert brief_res.status_code == 200
    assert brief_res.json()["doc_id"] == doc_id

    note_res = client.post(
        "/api/lawyer-brief/notes",
        json={"doc_id": doc_id, "notes": "Need to clarify HVAC maintenance responsibility."},
    )
    assert note_res.status_code == 200
    assert "HVAC" in note_res.json()["user_notes"]


def test_comparison_api_endpoint():
    """Verify document comparison API handles valid pair and non-existent IDs."""
    # Upload doc 1
    content1 = (SAMPLE_DIR / "mutual_nda.txt").read_bytes()
    files1 = {"file": ("nda_v1.txt", io.BytesIO(content1), "text/plain")}
    res1 = client.post("/api/documents/upload", files=files1)
    doc1_id = res1.json()["metadata"]["doc_id"]

    # Upload doc 2
    content2 = (SAMPLE_DIR / "independent_contractor_agreement.txt").read_bytes()
    files2 = {"file": ("contractor_v2.txt", io.BytesIO(content2), "text/plain")}
    res2 = client.post("/api/documents/upload", files=files2)
    doc2_id = res2.json()["metadata"]["doc_id"]

    # Compare docs
    comp_res = client.post("/api/compare", json={"doc1_id": doc1_id, "doc2_id": doc2_id})
    assert comp_res.status_code == 200
    assert comp_res.json()["doc1_id"] == doc1_id

    # Non-existent document 404
    err_res = client.post("/api/compare", json={"doc1_id": "non_existent", "doc2_id": doc2_id})
    assert err_res.status_code == 404


def test_sandbox_benchmarks_and_run():
    """Verify jury testing sandbox loads benchmarks and executes diagnostics."""
    bench_res = client.get("/api/sandbox/benchmarks")
    assert bench_res.status_code == 200
    benchmarks = bench_res.json()
    assert len(benchmarks) >= 3

    run_res = client.post(
        "/api/sandbox/run",
        json={"benchmark_id": "bench_contractor"},
    )
    assert run_res.status_code == 200
    data = run_res.json()
    assert data["system_status"] == "OPERATIONAL"
    assert data["diagnostic"]["status"] == "HEALTHY"
