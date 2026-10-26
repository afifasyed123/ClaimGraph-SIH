import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.seed_data import seed_demo_data

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_data():
    seed_demo_data()

def test_campus_reconciliation_seeded_conflicts():
    """Verify that campus reconciliation detects seeded faculty and facility conflicts using Z3"""
    response = client.get("/api/campuses/CAMPUS-VV-01/reconcile")
    assert response.status_code == 200
    data = response.json()

    assert data["campus"]["id"] == "CAMPUS-VV-01"
    assert len(data["institutions"]) == 3
    assert data["conflicts_count"] >= 2

    # Check for faculty conflict
    fac_findings = [f for f in data["cross_institution_findings"] if f["type"] == "cross_institution_faculty_duplicate"]
    assert len(fac_findings) >= 1
    fac_f = fac_findings[0]
    assert "Dr. R. K. Sharma" in fac_f["title"]
    assert len(fac_f["affected_institutions"]) == 2

    # Check for facility conflict
    facil_findings = [f for f in data["cross_institution_findings"] if f["type"] == "cross_institution_facility_overlap"]
    assert len(facil_findings) >= 1
    facil_f = facil_findings[0]
    assert "Central Block A" in facil_f["title"]

    # Check Z3 Solver proof
    solver_res = data["solver_results"]
    assert solver_res["verdict"] == "CONTRADICTION_DETECTED"
    assert solver_res["z3_result"] == "unsat"
    assert len(solver_res["minimal_conflict_core"]) > 0

def test_campus_simulation_resolves_conflict():
    """Verify that campus simulator tests hypothetical corrections in sandbox state"""
    # Simulate reallocating faculty exclusively to Apex
    payload = {
        "campus_id": "CAMPUS-VV-01",
        "faculty_reallocation": "exclusive_apex",
        "facility_repartition": "partition_600_600"
    }
    response = client.post("/api/campuses/CAMPUS-VV-01/simulate", json=payload)
    assert response.status_code == 200
    res = response.json()

    assert res["before"]["conflicts_count"] > res["after"]["conflicts_count"]
    assert res["resolved_count"] >= 1
    assert "Simulation of a hypothetical campus change" in res["disclaimer"]

def test_audit_chain_integrity_verification():
    """Verify cryptographic hash-chained audit trail verification"""
    # 1. Fetch chain
    chain_resp = client.get("/api/audit/chain")
    assert chain_resp.status_code == 200
    records = chain_resp.json()
    assert len(records) >= 2

    # 2. Verify chain cryptographically
    verify_resp = client.post("/api/audit/verify")
    assert verify_resp.status_code == 200
    v_data = verify_resp.json()
    assert v_data["is_valid"] is True
    assert v_data["status"] == "AUTHENTIC_AND_VERIFIED"

def test_deficiency_notice_generation_and_report_verification():
    """Verify deficiency notice generation and public report verification endpoint"""
    # First validate Case C to populate findings
    client.post("/api/applications/APP-CASE-C/validate")

    # Generate notice
    notice_resp = client.post("/api/notices/generate", json={
        "application_id": "APP-CASE-C",
        "reviewer_name": "Senior Scrutiny Officer",
        "clarifications_note": "Please submit Council resolution original minutes."
    })
    assert notice_resp.status_code == 200
    notice = notice_resp.json()
    assert notice["id"].startswith("DEF-NOTICE-")
    assert notice["notice_hash"] is not None
    assert "DEMO NOTICE" in notice["disclaimer"]

    # Verify report via public verification endpoint
    verify_url = f"/api/reports/verify/{notice['id']}"
    rep_resp = client.get(verify_url)
    assert rep_resp.status_code == 200
    rep_data = rep_resp.json()
    assert rep_data["status"] == "VALID_AND_AUTHENTIC"
    assert rep_data["stored_hash"] == notice["notice_hash"]

def test_inspection_priority_ranking():
    """Verify transparent priority calculation for campuses and institutions"""
    resp = client.get("/api/inspection-priority")
    assert resp.status_code == 200
    data = resp.json()
    targets = data["ranked_targets"]
    assert len(targets) >= 1
    # Check that highest score has transparent factors
    top = targets[0]
    assert "priority_score" in top
    assert "factors" in top
    assert len(top["factors"]) > 0

def test_rule_registry_and_provenance():
    """Verify rule registry provenance and demonstration labels"""
    resp = client.get("/api/rules")
    assert resp.status_code == 200
    data = resp.json()
    assert data["rules_count"] >= 10
    for r in data["rules"]:
        assert "version" in r
        assert "source" in r
        assert "Illustrative" in r["source"] or "Demonstration" in r["source"]

def test_preseeded_deficiency_notices_listing():
    """Verify pre-seeded deficiency notices listing and rich field aliases"""
    resp = client.get("/api/notices")
    assert resp.status_code == 200
    notices = resp.json()
    assert len(notices) >= 2
    for n in notices:
        assert "id" in n
        assert "notice_number" in n
        assert "institution_name" in n
        assert "digest" in n
        assert "notice_hash" in n
        assert "findings" in n
        assert "deficiency_items" in n
        assert len(n["findings"]) > 0

