import hashlib
import json
import time
from typing import Dict, Any, List, Optional
from .database import get_db_context
from .config import DEMO_DATE

def generate_deficiency_notice(
    application_id: str,
    reviewer_name: str = "Scrutiny Officer - AICTE Compliance Bureau",
    clarifications_note: str = ""
) -> Dict[str, Any]:
    """
    Generates a formal, evidence-linked Deficiency Notice derived directly from actual findings.
    Cryptographically hashed with verifiable QR report verification.
    """
    with get_db_context() as conn:
        cursor = conn.cursor()

        # Fetch Application
        cursor.execute("SELECT * FROM applications WHERE id = ?", (application_id,))
        app_row = cursor.fetchone()
        if not app_row:
            raise ValueError(f"Application '{application_id}' not found.")
        app = dict(app_row)

        # Fetch Findings
        cursor.execute("SELECT * FROM findings WHERE application_id = ?", (application_id,))
        f_rows = cursor.fetchall()
        findings = []
        for r in f_rows:
            f = dict(r)
            try:
                f["details"] = json.loads(f.get("details_json", "{}"))
            except Exception:
                f["details"] = {}
            findings.append(f)

    # Compile itemized deficiency items
    deficiency_items = []
    for f in findings:
        deficiency_items.append({
            "finding_id": f["id"],
            "type": f["type"],
            "severity": f["severity"],
            "claim_or_field": f.get("field_or_claim", "Regulatory Claim"),
            "extracted_value": f.get("extracted_value", "N/A"),
            "comparison_norm": f.get("comparison_value", "Statutory Threshold"),
            "evidence_document": f.get("source_document", "Checklist Document"),
            "page_reference": f.get("page_or_field", "Page 1"),
            "applied_rule": f.get("rule_id", "AICTE-RULE-DEMO"),
            "rule_description": f.get("rule_source", "Illustrative Configurable Demo Rule"),
            "deficiency_statement": f.get("reason", "Discrepancy detected against submitted evidence."),
            "action_required": f.get("recommended_next_step", "Submit certified clarification.")
        })

    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    notice_id = f"DEF-NOTICE-{app['reference'].replace('/', '-')}-{int(time.time() % 100000)}"

    # Compute tamper-evident notice digest
    notice_content = f"{notice_id}|{app['id']}|{app['reference']}|{timestamp}|{len(deficiency_items)}|{reviewer_name}"
    notice_hash = hashlib.sha256(notice_content.encode("utf-8")).hexdigest()

    qr_verification_url = f"/api/reports/verify/{notice_id}"

    clarifications = clarifications_note or (
        "1. Submit original notarized Governing Body resolution approving intake expansion.\n"
        "2. Provide biometric staff roster and Form 16 / bank disbursement proofs.\n"
        "3. Upload valid Municipal Fire Safety NOC renewed for the current academic session."
    )

    with get_db_context() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO deficiency_notices (
            id, application_id, campus_id, institution_name, reference, generated_date,
            findings_json, clarifications_requested, reviewer_name, notice_hash, qr_verification_url, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            notice_id,
            app["id"],
            "CAMPUS-VV-01",
            app["name"],
            app["reference"],
            DEMO_DATE,
            json.dumps(deficiency_items),
            clarifications,
            reviewer_name,
            notice_hash,
            qr_verification_url,
            "Issued for Response"
        ))
        conn.commit()

    return {
        "id": notice_id,
        "application_id": app["id"],
        "institution_name": app["name"],
        "reference": app["reference"],
        "category": app.get("category", "Technical Education"),
        "generated_date": DEMO_DATE,
        "disclaimer": "DEMO NOTICE — NOT AN OFFICIAL AICTE COMMUNICATION. Generated on synthetic test data for scrutiny workflow evaluation.",
        "findings_count": len(deficiency_items),
        "deficiency_items": deficiency_items,
        "clarifications_requested": clarifications,
        "reviewer_name": reviewer_name,
        "notice_hash": notice_hash,
        "qr_verification_url": qr_verification_url,
        "status": "Issued for Response"
    }

def get_deficiency_notice_by_id(notice_id: str) -> Optional[Dict[str, Any]]:
    with get_db_context() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM deficiency_notices WHERE id = ?", (notice_id,))
        row = cursor.fetchone()
        if not row:
            return None
        res = dict(row)
        try:
            res["deficiency_items"] = json.loads(res.get("findings_json", "[]"))
        except Exception:
            res["deficiency_items"] = []
        res["disclaimer"] = "DEMO NOTICE — NOT AN OFFICIAL AICTE COMMUNICATION. Generated on synthetic test data for scrutiny workflow evaluation."
        return res

def list_deficiency_notices() -> List[Dict[str, Any]]:
    with get_db_context() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, application_id, institution_name, reference, generated_date, reviewer_name, notice_hash, status FROM deficiency_notices ORDER BY id DESC")
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
