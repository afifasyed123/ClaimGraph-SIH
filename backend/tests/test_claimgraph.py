import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.seed_data import seed_demo_data

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_data():
    seed_demo_data()

def test_case_a_consistent():
    """Case A produces zero seeded discrepancies on configured checks (PRD Section 6 & 11)"""
    resp = client.post("/api/applications/APP-CASE-A/validate")
    assert resp.status_code == 200
    data = resp.json()
    assert data["findings_count"] == 0
    assert len(data["findings"]) == 0

def test_case_b_incomplete():
    """Case B produces exactly one missing document, one incomplete field, and one expired finding"""
    resp = client.post("/api/applications/APP-CASE-B/validate")
    assert resp.status_code == 200
    data = resp.json()
    findings = data["findings"]
    types = [f["type"] for f in findings]
    
    assert "missing_document" in types
    assert "missing_field" in types
    assert "expired_document" in types
    assert len(findings) == 3

def test_case_c_inconsistent():
    """Case C produces field conflict, historical/ratio inconsistency, and duplicate indicator"""
    resp = client.post("/api/applications/APP-CASE-C/validate")
    assert resp.status_code == 200
    data = resp.json()
    findings = data["findings"]
    types = [f["type"] for f in findings]

    assert "field_mismatch" in types
    assert "duplicate_file" in types
    assert any(t in ["history_mismatch", "infra_gap"] for t in types)

def test_change_impact_simulator_360_to_480():
    """
    Simulator re-runs only dependent rules and returns correct newly flagged findings.
    FR-G1 to FR-G6: 360 -> 480 intake scenario on Case A.
    """
    resp = client.post("/api/applications/APP-CASE-A/simulate", json={
        "changed_field": "proposed_intake",
        "new_value": 480
    })
    assert resp.status_code == 200
    sim = resp.json()
    
    # When intake increases to 480 with only 24 faculty, ratio is 1:20 (exceeds 1:15)
    assert len(sim["newly_flagged"]) > 0
    assert sim["disclaimer"] == "Simulation of a proposed change. Not an AICTE decision."
    
    # Verify stored application in DB was NOT overwritten (FR-G6)
    app_check = client.get("/api/applications/APP-CASE-A").json()
    assert app_check["application"]["proposed_intake"] == 360

def test_reviewer_action_recorded_in_audit_trail():
    """Every reviewer action creates an audit entry with action, timestamp, and reason (FR-F2)"""
    # First validate Case B to have findings
    client.post("/api/applications/APP-CASE-B/validate")
    findings = client.get("/api/applications/APP-CASE-B/findings").json()
    assert len(findings) > 0
    target_fnd = findings[0]["id"]

    # Record action
    act_resp = client.post(f"/api/findings/{target_fnd}/actions", json={
        "action": "Additional evidence required",
        "reason": "Official municipal fire NOC renewal certificate requested from college principal.",
        "actor": "Scrutiny Officer - AICTE Desk #4"
    })
    assert act_resp.status_code == 200
    assert act_resp.json()["status"] == "Recorded in Audit Trail"

    # Verify audit timeline
    audit_resp = client.get("/api/applications/APP-CASE-B/audit")
    assert audit_resp.status_code == 200
    timeline = audit_resp.json()
    assert any(a["finding_id"] == target_fnd and a["action"] == "Additional evidence required" for a in timeline)

def test_no_approve_or_reject_allowed():
    """FR-F4: No approve or reject action exists anywhere in the product."""
    findings = client.get("/api/applications/APP-CASE-B/findings").json()
    target_fnd = findings[0]["id"]

    # Attempt to Approve
    resp_approve = client.post(f"/api/findings/{target_fnd}/actions", json={
        "action": "Approve",
        "reason": "Testing illegal approve"
    })
    assert resp_approve.status_code == 400
    assert "FR-F4" in resp_approve.json()["detail"]

    # Attempt to Reject
    resp_reject = client.post(f"/api/findings/{target_fnd}/actions", json={
        "action": "Reject",
        "reason": "Testing illegal reject"
    })
    assert resp_reject.status_code == 400
    assert "FR-F4" in resp_reject.json()["detail"]
