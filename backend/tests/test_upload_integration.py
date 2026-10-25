import io
import os
import hashlib
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.seed_data import seed_demo_data

client = TestClient(app)

SYNTHETIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "synthetic_demo_applications"))

@pytest.fixture(autouse=True)
def setup_data():
    seed_demo_data()

def test_batch_upload_case_a_pdfs():
    """Test uploading generated synthetic PDFs for Case A to an existing application."""
    case_a_dir = os.path.join(SYNTHETIC_DIR, "case_A_consistent")
    assert os.path.exists(case_a_dir), f"Directory {case_a_dir} does not exist"

    pdf_files = [f for f in os.listdir(case_a_dir) if f.endswith(".pdf")]
    assert len(pdf_files) == 4

    # Prepare multipart files
    files_payload = []
    file_handles = []
    for f in pdf_files:
        path = os.path.join(case_a_dir, f)
        fh = open(path, "rb")
        file_handles.append(fh)
        files_payload.append(("files", (f, fh, "application/pdf")))

    try:
        response = client.post("/api/applications/APP-CASE-A/upload-batch", files=files_payload)
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["application_id"] == "APP-CASE-A"
        assert len(data["uploaded_documents"]) == 4

        # Verify SHA-256 is present and valid
        for doc in data["uploaded_documents"]:
            assert "sha256" in doc
            assert len(doc["sha256"]) == 64
            assert doc["pages_extracted"] >= 1

        # Verify findings count is clean for Case A
        assert data["findings_count"] == 0
        assert len(data["findings"]) == 0
    finally:
        for fh in file_handles:
            fh.close()

def test_create_and_upload_new_institution():
    """Test creating a brand-new application and uploading documents in a single integrated flow."""
    case_c_dir = os.path.join(SYNTHETIC_DIR, "case_C_conflicting")
    pdf_path = os.path.join(case_c_dir, "Application_Form_EoA_2026.pdf")
    assert os.path.exists(pdf_path)

    with open(pdf_path, "rb") as fh:
        response = client.post(
            "/api/applications/create-and-upload",
            data={
                "name": "Aryavart Institute of Advanced Engineering",
                "programme": "Engineering & Technology",
                "proposed_intake": 360,
                "faculty_count": 24,
                "carpet_area_sqm": 4200.0
            },
            files=[("files", ("Application_Form_EoA_2026.pdf", fh, "application/pdf"))]
        )

    assert response.status_code == 200, response.text
    res_data = response.json()
    new_app_id = res_data["application_id"]
    assert new_app_id.startswith("APP-CUSTOM-")
    assert len(res_data["uploaded_documents"]) == 1
    assert res_data["uploaded_documents"][0]["filename"] == "Application_Form_EoA_2026.pdf"

    # Verify that the new application exists in DB
    get_resp = client.get(f"/api/applications/{new_app_id}")
    assert get_resp.status_code == 200
    app_details = get_resp.json()
    assert app_details["application"]["name"] == "Aryavart Institute of Advanced Engineering"
    assert len(app_details["documents"]) >= 1

def test_document_deletion_and_audit():
    """Test removing an attached document triggers audit logging and recalculation."""
    # First upload a document to APP-CASE-A
    case_b_dir = os.path.join(SYNTHETIC_DIR, "case_B_deficient")
    pdf_path = os.path.join(case_b_dir, "Fire_Safety_NOC_Expired.pdf")

    with open(pdf_path, "rb") as fh:
        upload_resp = client.post(
            "/api/applications/APP-CASE-A/upload-batch",
            files=[("files", ("TEST_FIRE_NOC.pdf", fh, "application/pdf"))]
        )
    assert upload_resp.status_code == 200
    doc_id = upload_resp.json()["uploaded_documents"][0]["document_id"]

    # Delete the document
    del_resp = client.delete(f"/api/documents/{doc_id}")
    assert del_resp.status_code == 200
    del_data = del_resp.json()
    assert del_data["status"] == "success"
    assert del_data["removed_doc_id"] == doc_id

    # Verify audit chain has DOCUMENT_REMOVED entry
    audit_resp = client.get("/api/audit/chain")
    assert audit_resp.status_code == 200
    events = [e for e in audit_resp.json() if e["action"] == "DOCUMENT_REMOVED"]
    assert len(events) >= 1
    assert doc_id in events[0]["reason"]

def test_upload_invalid_file_extension():
    """Verify backend enforces PDF-only validation."""
    fake_txt = io.BytesIO(b"Hello AICTE Scrutiny World")
    response = client.post(
        "/api/applications/APP-CASE-A/upload-batch",
        files=[("files", ("unsupported_notes.txt", fake_txt, "text/plain"))]
    )
    assert response.status_code == 400
    assert "AICTE scrutiny portal strictly requires PDF format" in response.json()["detail"]

def test_upload_file_exceeds_size_limit():
    """Verify backend enforces 15MB file size limit."""
    # Create 16MB virtual stream
    large_pdf_data = b"%PDF-1.4 " + (b"0" * (16 * 1024 * 1024))
    large_pdf = io.BytesIO(large_pdf_data)
    response = client.post(
        "/api/applications/APP-CASE-A/upload-batch",
        files=[("files", ("too_large_document.pdf", large_pdf, "application/pdf"))]
    )
    assert response.status_code == 400
    assert "exceeds maximum allowed limit of 15 MB" in response.json()["detail"]

def test_duplicate_file_hash_detection():
    """Verify SHA-256 byte-level hash matches identical files."""
    case_c_dir = os.path.join(SYNTHETIC_DIR, "case_C_conflicting")
    orig_path = os.path.join(case_c_dir, "Fire_Safety_NOC.pdf")
    dup_path = os.path.join(case_c_dir, "Land_Registration_Deed_Duplicate.pdf")

    with open(orig_path, "rb") as f1, open(dup_path, "rb") as f2:
        h1 = hashlib.sha256(f1.read()).hexdigest()
        h2 = hashlib.sha256(f2.read()).hexdigest()

    assert h1 == h2, "Seeded duplicate documents must have byte-identical SHA-256 digests"
