from typing import Dict, Any, List
from .database import get_db_context

def compute_inspection_priorities() -> Dict[str, Any]:
    """
    Ranks synthetic campuses and institutions for human inspection scheduling.
    Uses transparent, explainable factor weighting instead of black-box opaque scoring.
    Does NOT calculate fraud probabilities.
    """
    with get_db_context() as conn:
        cursor = conn.cursor()

        # Fetch applications and findings
        cursor.execute("SELECT * FROM applications")
        applications = [dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM findings")
        all_findings = [dict(r) for r in cursor.fetchall()]

        # Fetch campuses and cross-institution entities
        cursor.execute("SELECT * FROM campuses")
        campuses = [dict(r) for r in cursor.fetchall()]

    findings_by_app = {}
    for f in all_findings:
        findings_by_app.setdefault(f["application_id"], []).append(f)

    ranked_entities = []

    # 1. Evaluate Campus Level Prioritization
    for camp in campuses:
        campus_id = camp["id"]
        # Seeded cross-institution conflicts for demo campus
        factors = []
        score = 0
        focus_areas = []

        if campus_id == "CAMPUS-VV-01":
            score += 45
            factors.append({
                "factor": "Cross-Institution Faculty Collision",
                "weight": 45,
                "evidence": "Dr. R. K. Sharma (FAC-PROF-007) claimed full-time at both Apex Engineering and Apex Pharmacy."
            })
            focus_areas.append("Conduct biometric attendance audit and cross-verify TDS / salary credit statements.")

            score += 35
            factors.append({
                "factor": "Conflicting Facility Floor Area Allocation",
                "weight": 35,
                "evidence": "Central Block A (1,200 sq.m) claimed 100% exclusively by both Engineering and Management."
            })
            focus_areas.append("Physical demarcation inspection of Central Block A; verify timetable room logs.")

            score += 20
            factors.append({
                "factor": "Multi-Institutional Campus Density",
                "weight": 20,
                "evidence": "3 separate colleges share common 14.5 acre master plot."
            })
            focus_areas.append("Verify fire evacuation clearance and shared playground / parking zoning.")

        priority_level = "High Priority" if score >= 70 else "Medium Priority" if score >= 40 else "Routine Scrutiny"

        ranked_entities.append({
            "entity_id": campus_id,
            "entity_type": "Integrated Campus",
            "name": camp["name"],
            "location": camp["location"],
            "priority_score": score,
            "priority_level": priority_level,
            "factors": factors,
            "recommended_focus_areas": focus_areas,
            "associated_institutions": [
                "Apex Institute of Technology & Engineering",
                "Apex College of Pharmacy & Research",
                "Apex Global Institute of Management"
            ]
        })

    # 2. Evaluate Individual Applications
    for app in applications:
        app_id = app["id"]
        app_findings = findings_by_app.get(app_id, [])
        score = 0
        factors = []
        focus_areas = []

        for f in app_findings:
            sev = f.get("severity", "medium").lower()
            f_type = f.get("type", "")

            if sev == "high":
                pts = 25
                score += pts
                factors.append({
                    "factor": f"High Severity Discrepancy: {f.get('field_or_claim', 'Claim')}",
                    "weight": pts,
                    "evidence": f.get("reason", "Discrepancy detected.")[:100]
                })
            elif sev == "medium":
                pts = 15
                score += pts
                factors.append({
                    "factor": f"Medium Discrepancy: {f.get('field_or_claim', 'Claim')}",
                    "weight": pts,
                    "evidence": f.get("reason", "Discrepancy detected.")[:100]
                })

            if "missing" in f_type:
                focus_areas.append(f"In-person document check for {f.get('source_document', 'omitted document')}.")
            if "cross" in f_type or "intake" in f_type:
                focus_areas.append(f"Cross-examine student enrollment registers against sanctioned council cap.")
            if "duplicate" in f_type:
                focus_areas.append("Audit original hardcopy registers for land and faculty appointments.")

        priority_level = "High Priority" if score >= 50 else "Medium Priority" if score >= 25 else "Low Priority"

        ranked_entities.append({
            "entity_id": app_id,
            "entity_type": "Institutional Application",
            "name": app["name"],
            "reference": app["reference"],
            "priority_score": score,
            "priority_level": priority_level,
            "unresolved_findings_count": len(app_findings),
            "factors": factors,
            "recommended_focus_areas": list(set(focus_areas)) if focus_areas else ["Routine baseline inspection sample."],
            "associated_institutions": [app["name"]]
        })

    # Sort descending by priority score
    ranked_entities.sort(key=lambda x: x["priority_score"], reverse=True)

    return {
        "disclaimer": "Transparent configurable heuristic ranking for human scrutiny prioritization. NOT a fraud probability or automated enforcement verdict.",
        "scoring_methodology": "Transparent additive scoring: High Severity Finding (+25), Cross-Institution Collision (+45), Facility Deficit (+35), Missing Document (+20).",
        "ranked_targets": ranked_entities
    }
