import yaml
from pathlib import Path
from typing import Dict, Any, List
from .config import RULES_FILE, DEMO_DATE

def load_rules() -> List[Dict[str, Any]]:
    if not RULES_FILE.exists():
        return []
    with open(RULES_FILE, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
        return data.get("rules", [])

def evaluate_rules(
    application: Dict[str, Any],
    documents: List[Dict[str, Any]],
    extracted_fields: Dict[str, Dict[str, Any]],
    historical_records: List[Dict[str, Any]],
    rule_filter: List[str] = None
) -> List[Dict[str, Any]]:
    """
    Evaluates rules deterministically.
    If rule_filter is provided (e.g. for simulator), only rules in rule_filter are evaluated.
    """
    all_rules = load_rules()
    findings = []
    app_id = application.get("id", "APP-UNKNOWN")

    # Normalize application fields for aliases
    norm_app = dict(application)
    norm_app["institution_name"] = application.get("institution_name") or application.get("name")
    norm_app["application_reference"] = application.get("application_reference") or application.get("reference")
    norm_app["programme"] = application.get("programme") or application.get("type") or application.get("category")

    # Map documents by doc_type and sha256
    docs_by_type = {d["doc_type"]: d for d in documents}
    hashes = {}
    for d in documents:
        h = d.get("sha256")
        if h:
            hashes.setdefault(h, []).append(d)

    # Historical mapping
    history_map = {h["field"]: h["value"] for h in historical_records}

    for rule in all_rules:
        rule_id = rule["id"]
        
        # If filter is applied, skip rules not matching
        if rule_filter is not None and rule_id not in rule_filter:
            continue

        rule_source = rule.get("source", "Demonstration Rule - Illustrative Only")

        # 1. Mandatory Checklist Check
        if rule_id == "RULE-DOC-CHECKLIST":
            required_types = rule.get("config", {}).get("required_doc_types", [])
            for r_type in required_types:
                if r_type not in docs_by_type:
                    label = r_type.replace("_", " ").title()
                    findings.append({
                        "id": f"FND-{app_id}-{rule_id}-MISSING-{r_type}",
                        "application_id": app_id,
                        "rule_id": rule_id,
                        "type": "missing_document",
                        "severity": rule["severity"],
                        "status": "Open",
                        "field_or_claim": f"Checklist: {label}",
                        "extracted_value": "Missing / Not Uploaded",
                        "comparison_value": "Mandatory Requirement",
                        "source_document": f"{r_type}.pdf",
                        "page_or_field": "Application Checklist",
                        "reason": f"Mandatory compliance document '{label}' was omitted from the submission package.",
                        "verification_status": "Missing",
                        "recommended_next_step": "Notify applicant to upload required statutory certificate.",
                        "rule_source": rule_source,
                        "details_json": {"doc_type": r_type}
                    })

        # 2. Mandatory Field Completeness Check
        elif rule_id == "RULE-REQUIRED-FIELDS":
            for field in rule.get("inputs", []):
                val = norm_app.get(field)
                if val is None or str(val).strip() == "" or str(val).lower() == "none":
                    label = field.replace("_", " ").title()
                    findings.append({
                        "id": f"FND-{app_id}-{rule_id}-BLANK-{field}",
                        "application_id": app_id,
                        "rule_id": rule_id,
                        "type": "missing_field",
                        "severity": rule["severity"],
                        "status": "Open",
                        "field_or_claim": f"Application Field: {label}",
                        "extracted_value": "Blank / Null",
                        "comparison_value": "Required Field",
                        "source_document": "Institutional Application Form",
                        "page_or_field": f"Field: {field}",
                        "reason": f"Required institutional data field '{label}' was left blank in the submission.",
                        "verification_status": "Missing",
                        "recommended_next_step": f"Prompt applicant to submit valid numerical value for {label}.",
                        "rule_source": rule_source,
                        "details_json": {"field": field}
                    })

        # 3. Document Expiry Check
        elif rule_id == "RULE-DOC-EXPIRY":
            cutoff = rule.get("config", {}).get("demo_cutoff_date", DEMO_DATE)
            for d in documents:
                doc_ext = extracted_fields.get(d["id"], {})
                v_date = doc_ext.get("validity_date", {}).get("value")
                if v_date and v_date < cutoff:
                    label = d["doc_type"].replace("_", " ").title()
                    findings.append({
                        "id": f"FND-{app_id}-{rule_id}-EXP-{d['doc_type']}",
                        "application_id": app_id,
                        "rule_id": rule_id,
                        "type": "expired_document",
                        "severity": rule["severity"],
                        "status": "Open",
                        "field_or_claim": f"Validity: {label}",
                        "extracted_value": f"Expired on {v_date}",
                        "comparison_value": f"Must be valid on {cutoff}",
                        "source_document": d["filename"],
                        "page_or_field": f"Page {doc_ext.get('validity_date', {}).get('page', 1)}",
                        "reason": f"Statutory certificate expired on {v_date}, prior to evaluation cutoff date {cutoff}.",
                        "verification_status": "Expired",
                        "recommended_next_step": "Require renewal endorsement or latest valid NOC from issuing authority.",
                        "rule_source": rule_source,
                        "details_json": {"doc_id": d["id"], "validity_date": v_date, "cutoff": cutoff}
                    })

        # 4. Field Crosscheck between Application Claim & PDF Evidence
        elif rule_id == "RULE-INTAKE-EVIDENCE-CROSSCHECK":
            app_intake = norm_app.get("proposed_intake")
            res_doc = docs_by_type.get("aicte_affiliation_resolution")
            if res_doc and app_intake is not None:
                doc_ext = extracted_fields.get(res_doc["id"], {})
                doc_intake_raw = doc_ext.get("proposed_intake", {}).get("value")
                if doc_intake_raw:
                    try:
                        doc_intake = int(doc_intake_raw)
                        if app_intake != doc_intake:
                            findings.append({
                                "id": f"FND-{app_id}-{rule_id}-MISMATCH-INTAKE",
                                "application_id": app_id,
                                "rule_id": rule_id,
                                "type": "field_mismatch",
                                "severity": rule["severity"],
                                "status": "Open",
                                "field_or_claim": "Proposed Intake Crosscheck",
                                "extracted_value": f"{app_intake} students (Application Claim)",
                                "comparison_value": f"{doc_intake} students (Resolution Document)",
                                "source_document": res_doc["filename"],
                                "page_or_field": f"Page {doc_ext.get('proposed_intake', {}).get('page', 1)}, Table 1",
                                "reason": f"Claimed proposed intake ({app_intake}) conflicts with sanctioned intake ({doc_intake}) stated in the governing resolution.",
                                "verification_status": "Inconsistent",
                                "recommended_next_step": "Verify formal governing body approval minutes for proposed intake expansion.",
                                "rule_source": rule_source,
                                "details_json": {"claimed": app_intake, "documented": doc_intake}
                            })
                    except ValueError:
                        pass

        # 5. Historical Consistency & Student-Faculty Ratio
        elif rule_id in ["RULE-HISTORY-INTAKE-FACULTY", "RULE-STUDENT-FACULTY-RATIO"]:
            intake = norm_app.get("proposed_intake")
            faculty = norm_app.get("faculty_count")
            
            if intake and faculty:
                try:
                    intake_num = int(intake)
                    faculty_num = int(faculty)
                    ratio = intake_num / faculty_num if faculty_num > 0 else 999.0
                    
                    if ratio > 15.0:
                        min_faculty = (intake_num + 14) // 15
                        findings.append({
                            "id": f"FND-{app_id}-{rule_id}-RATIO",
                            "application_id": app_id,
                            "rule_id": rule_id,
                            "type": "history_mismatch" if rule_id == "RULE-HISTORY-INTAKE-FACULTY" else "infra_gap",
                            "severity": "high",
                            "status": "Open",
                            "field_or_claim": "Student-to-Faculty Ratio",
                            "extracted_value": f"1:{ratio:.1f} ({faculty_num} faculty for {intake_num} intake)",
                            "comparison_value": f"1:15 Statutory Ratio (Requires {min_faculty} faculty)",
                            "source_document": docs_by_type.get("faculty_appointment_register", {}).get("filename", "Faculty Cadre List"),
                            "page_or_field": "Faculty Roster Summary",
                            "reason": f"Proposed intake ({intake_num}) with {faculty_num} appointed faculty results in a 1:{ratio:.1f} ratio, violating statutory norm (minimum 1:15).",
                            "verification_status": "Inconsistent",
                            "recommended_next_step": f"Refer for academic cadre scrutiny. Institution must appoint at least {min_faculty - faculty_num} additional qualified faculty.",
                            "rule_source": rule_source,
                            "details_json": {"ratio": ratio, "faculty": faculty_num, "intake": intake_num, "needed": min_faculty}
                        })
                except Exception:
                    pass

        # 6. File Integrity / Duplicate Hash Detection
        elif rule_id == "RULE-FILE-INTEGRITY-DUPLICATE":
            for h, doc_list in hashes.items():
                if len(doc_list) > 1:
                    types = ", ".join([d["doc_type"].replace("_", " ").title() for d in doc_list])
                    filenames = ", ".join([d["filename"] for d in doc_list])
                    findings.append({
                        "id": f"FND-{app_id}-{rule_id}-DUP-{h[:8]}",
                        "application_id": app_id,
                        "rule_id": rule_id,
                        "type": "duplicate_file",
                        "severity": rule["severity"],
                        "status": "Open",
                        "field_or_claim": "Document SHA-256 Fingerprint",
                        "extracted_value": f"SHA-256: {h[:16]}...",
                        "comparison_value": "Unique evidentiary files required",
                        "source_document": filenames,
                        "page_or_field": "File Checksum Layer",
                        "reason": f"Identical file binary uploaded under multiple distinct document types ({types}).",
                        "verification_status": "Duplicate indicator",
                        "recommended_next_step": "Applicant must upload unique, authentic records for each required compliance category.",
                        "rule_source": rule_source,
                        "details_json": {"hash": h, "colliding_types": [d["doc_type"] for d in doc_list]}
                    })

        # 7. Infrastructure Carpet Area Norm
        elif rule_id == "RULE-INFRASTRUCTURE-CARPET-AREA":
            intake = norm_app.get("proposed_intake")
            carpet = norm_app.get("carpet_area_sqm")
            if intake and carpet:
                try:
                    req_carpet = float(intake) * 1.5
                    if float(carpet) < req_carpet:
                        findings.append({
                            "id": f"FND-{app_id}-{rule_id}-AREA",
                            "application_id": app_id,
                            "rule_id": rule_id,
                            "type": "infra_gap",
                            "severity": rule["severity"],
                            "status": "Open",
                            "field_or_claim": "Instructional Carpet Area Norm",
                            "extracted_value": f"{carpet} sq.m provided",
                            "comparison_value": f"{req_carpet:.1f} sq.m minimum (1.5 sq.m / intake)",
                            "source_document": docs_by_type.get("land_building_certificate", {}).get("filename", "Land/Building Plan"),
                            "page_or_field": "Architect Area Schedule",
                            "reason": f"Instructional carpet area ({carpet} sq.m) is below standard norm of {req_carpet:.1f} sq.m for intake {intake}.",
                            "verification_status": "Inconsistent",
                            "recommended_next_step": "Refer for physical inspection or request building expansion plan.",
                            "rule_source": rule_source,
                            "details_json": {"provided": carpet, "required": req_carpet}
                        })
                except Exception:
                    pass

    return findings
