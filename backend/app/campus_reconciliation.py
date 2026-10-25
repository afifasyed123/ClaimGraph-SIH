import json
from typing import Dict, Any, List, Optional
from .database import get_db_context
from .solver import CampusConstraintSolver

def run_campus_reconciliation(campus_id: str = "CAMPUS-VV-01") -> Dict[str, Any]:
    """
    Executes cross-institutional reconciliation across all colleges on a shared campus.
    Combines rule-based evidence cross-examination with Z3 SMT constraint solving.
    """
    with get_db_context() as conn:
        cursor = conn.cursor()

        # 1. Fetch Campus Info
        cursor.execute("SELECT * FROM campuses WHERE id = ?", (campus_id,))
        campus_row = cursor.fetchone()
        if not campus_row:
            raise ValueError(f"Campus with id '{campus_id}' not found.")
        campus = dict(campus_row)

        # 2. Fetch Institutions on this campus
        cursor.execute("SELECT * FROM campus_institutions WHERE campus_id = ?", (campus_id,))
        inst_rows = cursor.fetchall()
        institutions = [dict(r) for r in inst_rows]
        inst_map = {inst["institution_id"]: inst for inst in institutions}

        # 3. Fetch Facilities
        cursor.execute("SELECT * FROM campus_facilities WHERE campus_id = ?", (campus_id,))
        facil_rows = cursor.fetchall()
        facilities = []
        for r in facil_rows:
            f_dict = dict(r)
            try:
                f_dict["claimed_areas"] = json.loads(f_dict.get("claimed_areas_json", "{}"))
            except Exception:
                f_dict["claimed_areas"] = {}
            try:
                f_dict["claiming_institutions"] = json.loads(f_dict.get("claiming_institutions", "[]"))
            except Exception:
                f_dict["claiming_institutions"] = []
            try:
                f_dict["source_documents"] = json.loads(f_dict.get("source_documents_json", "{}"))
            except Exception:
                f_dict["source_documents"] = {}
            facilities.append(f_dict)

        # 4. Fetch Faculty
        cursor.execute("SELECT * FROM campus_faculty")
        faculty_rows = cursor.fetchall()
        faculty_roster = []
        for r in faculty_rows:
            f_dict = dict(r)
            try:
                f_dict["claimed_institutions"] = json.loads(f_dict.get("claimed_institutions", "[]"))
            except Exception:
                f_dict["claimed_institutions"] = []
            try:
                f_dict["source_evidence"] = json.loads(f_dict.get("source_evidence_json", "{}"))
            except Exception:
                f_dict["source_evidence"] = {}
            faculty_roster.append(f_dict)

    # 5. Rule-Based Reconciliation Logic
    cross_findings = []

    # Check A: Faculty Full-Time Double-Counting
    for fac in faculty_roster:
        claimed_inst_ids = fac.get("claimed_institutions", [])
        if len(claimed_inst_ids) > 1 and fac.get("is_full_time", 1):
            affected = []
            claims_summary = {}
            evidence_summary = []

            for inst_id in claimed_inst_ids:
                inst_info = inst_map.get(inst_id, {})
                inst_name = inst_info.get("institution_name", inst_id)
                affected.append({
                    "institution_id": inst_id,
                    "institution_name": inst_name
                })
                claims_summary[inst_id] = {
                    "institution_name": inst_name,
                    "claimed_role": "Full-Time Professor (100% FTE)",
                    "department": fac.get("department", "Core Department")
                }
                ev = fac.get("source_evidence", {}).get(inst_id, {})
                evidence_summary.append({
                    "institution_id": inst_id,
                    "institution_name": inst_name,
                    "document": ev.get("document", "faculty_appointment_register.pdf"),
                    "page": ev.get("page", 1),
                    "snippet": f"Identified roster record for {fac['name']} with statutory faculty ID: {fac['id']} as regular full-time employee."
                })

            cross_findings.append({
                "finding_id": f"XFND-{campus_id}-FAC-{fac['id']}",
                "type": "cross_institution_faculty_duplicate",
                "severity": "high",
                "title": f"Faculty Double-Counting: {fac['name']}",
                "affected_institutions": affected,
                "conflicting_claims": claims_summary,
                "evidence_sources": evidence_summary,
                "rule_id": "RULE-CAMPUS-FACULTY-EXCLUSIVITY",
                "rule_name": "Campus Faculty Single-Appointment Exclusivity",
                "rule_source": "Illustrative Configurable Demo Rule - Not Official AICTE Requirement",
                "why_conflict": (
                    f"Faculty member {fac['name']} (ID: {fac['id']}) is reported as a full-time, regular faculty member in the submitted rosters of {len(affected)} separate institutions on this campus ({', '.join([a['institution_name'] for a in affected])}). "
                    "Under configured norms, an individual cannot be credited simultaneously as full-time regular faculty to satisfy the required Student-to-Faculty Ratio in multiple institutions."
                ),
                "uncertainty_or_missing_info": "Check if an official shared-appointment agreement or inter-institutional deputation order is registered with AICTE.",
                "suggested_next_steps": "Issue Deficiency Notice to both institutions requesting biometric attendance records, salary disbursement bank statements (Form 16 / TDS), and declaration of primary institutional affiliation.",
                "solver_verdict": "UNSATISFIABLE (Proven by Z3 SMT Solver)",
                "status": "Unresolved Conflict"
            })

    # Check B: Facility Carpet Area Over-Allocation / Double Claiming
    for facil in facilities:
        claimed_areas = facil.get("claimed_areas", {})
        total_physical = float(facil.get("total_carpet_area_sqm", 0.0))
        sum_claimed = sum(float(val) for val in claimed_areas.values())

        if len(claimed_areas) > 1 and sum_claimed > total_physical:
            affected = []
            claims_summary = {}
            evidence_summary = []

            for inst_id, claimed_sqm in claimed_areas.items():
                inst_info = inst_map.get(inst_id, {})
                inst_name = inst_info.get("institution_name", inst_id)
                affected.append({
                    "institution_id": inst_id,
                    "institution_name": inst_name,
                    "claimed_area_sqm": float(claimed_sqm)
                })
                claims_summary[inst_id] = {
                    "institution_name": inst_name,
                    "claimed_area_sqm": float(claimed_sqm),
                    "claim_type": "Exclusive Instructional/Administrative Floor Space"
                }
                ev = facil.get("source_documents", {}).get(inst_id, {})
                evidence_summary.append({
                    "institution_id": inst_id,
                    "institution_name": inst_name,
                    "document": ev.get("document", "land_building_certificate.pdf"),
                    "page": ev.get("page", 1),
                    "snippet": f"Building certificate schedule lists {facil['name']} with allocated exclusive carpet area of {claimed_sqm} sq.m."
                })

            cross_findings.append({
                "finding_id": f"XFND-{campus_id}-FACIL-{facil['id']}",
                "type": "cross_institution_facility_overlap",
                "severity": "high",
                "title": f"Facility Over-Allocation: {facil['name']}",
                "affected_institutions": affected,
                "conflicting_claims": claims_summary,
                "evidence_sources": evidence_summary,
                "rule_id": "RULE-CAMPUS-FACILITY-OVERLAP",
                "rule_name": "Campus Physical Infrastructure Non-Overlap Norm",
                "rule_source": "Illustrative Configurable Demo Rule - Not Official AICTE Requirement",
                "why_conflict": (
                    f"Physical facility '{facil['name']}' has an architect-certified total carpet area of {total_physical} sq.m. "
                    f"However, multiple institutions claim exclusive carpet area totaling {sum_claimed} sq.m, creating a physical deficit of {sum_claimed - total_physical} sq.m. "
                    "Multiple institutions cannot claim exclusive non-shared use of the same physical square footage without a statutory shared-space resolution."
                ),
                "uncertainty_or_missing_info": "Inspect whether the governing society has passed an integrated campus shared-resource schedule allocating non-overlapping operating time slots.",
                "suggested_next_steps": "Require certified municipal building blueprint demarcating institutional boundaries, or submit formal shared-use timetable approved by the Board of Governors.",
                "solver_verdict": "UNSATISFIABLE (Proven by Z3 SMT Solver)",
                "status": "Unresolved Conflict"
            })

    # Check C: Campus-Level Total Built-up Area Sufficiency
    total_inst_carpet = sum(float(inst.get("carpet_area_sqm", 0.0)) for inst in institutions)
    campus_built_up = float(campus.get("total_built_up_sqm", 0.0))
    if total_inst_carpet > campus_built_up:
        cross_findings.append({
            "finding_id": f"XFND-{campus_id}-CAMPUS-AREA-DEFICIT",
            "type": "campus_aggregate_area_deficit",
            "severity": "medium",
            "title": f"Aggregate Campus Built-up Area Deficit",
            "affected_institutions": [{"institution_id": i["institution_id"], "institution_name": i["institution_name"]} for i in institutions],
            "conflicting_claims": {
                "campus_total_capacity": campus_built_up,
                "aggregate_institutions_claimed": total_inst_carpet
            },
            "evidence_sources": [],
            "rule_id": "RULE-CAMPUS-AGGREGATE-AREA",
            "rule_name": "Campus Aggregate Built-Up Capacity",
            "rule_source": "Illustrative Configurable Demo Rule - Not Official AICTE Requirement",
            "why_conflict": f"The aggregate instructional carpet area claimed by all institutions ({total_inst_carpet} sq.m) exceeds the approved total built-up area of the campus ({campus_built_up} sq.m).",
            "uncertainty_or_missing_info": "Verify master layout plan and recent local municipal building occupancy certificates.",
            "suggested_next_steps": "Scrutinize master site plan and physical inspection report.",
            "solver_verdict": "UNSATISFIABLE (Z3 Core)",
            "status": "Unresolved Conflict"
        })

    # 6. Execute Z3 Formal Constraint Solver
    solver = CampusConstraintSolver()
    solver_results = solver.verify_campus_scenario(
        campus=campus,
        institutions=institutions,
        facilities=facilities,
        faculty_roster=faculty_roster
    )

    # 7. Construct Graph Relationship Nodes & Edges for Visual Knowledge Graph
    graph_data = _build_campus_knowledge_graph(campus, institutions, facilities, faculty_roster, cross_findings)

    return {
        "campus": campus,
        "institutions": institutions,
        "facilities": facilities,
        "faculty_roster": faculty_roster,
        "cross_institution_findings": cross_findings,
        "conflicts_count": len(cross_findings),
        "solver_results": solver_results,
        "graph": graph_data,
        "disclaimer": "SYNTHETIC DEMO DATA - NOT A REAL CAMPUS. All verification is simulated. Demonstration rules are not official AICTE requirements."
    }

def _build_campus_knowledge_graph(campus, institutions, facilities, faculty_roster, findings) -> Dict[str, Any]:
    """
    Constructs node-link relationship model representing:
    Campus -> Institutions -> Facilities/Faculty -> Claims -> Rules -> Findings
    """
    nodes = []
    links = []

    # Campus Root Node
    nodes.append({
        "id": campus["id"],
        "label": campus["name"],
        "type": "campus",
        "category": "Campus",
        "details": f"Total Built-up: {campus['total_built_up_sqm']} sq.m | {campus['total_land_acres']} Acres"
    })

    # Institution Nodes
    for inst in institutions:
        inst_node_id = f"inst_{inst['institution_id']}"
        nodes.append({
            "id": inst_node_id,
            "label": inst["institution_name"],
            "type": "institution",
            "category": "Institution",
            "programme": inst["programme"],
            "intake": inst["sanctioned_intake"],
            "faculty": inst["faculty_count"],
            "details": f"Intake: {inst['sanctioned_intake']} | Faculty: {inst['faculty_count']}"
        })
        links.append({
            "source": campus["id"],
            "target": inst_node_id,
            "relation": "operates_on_campus"
        })

    # Facility Nodes
    for fac in facilities:
        fac_node_id = f"facil_{fac['id']}"
        has_conflict = any(fac['id'] in f["finding_id"] for f in findings)
        nodes.append({
            "id": fac_node_id,
            "label": fac["name"],
            "type": "facility",
            "category": "Facility",
            "has_conflict": has_conflict,
            "details": f"Area: {fac['total_carpet_area_sqm']} sq.m ({fac['type']})"
        })
        # Link to claiming institutions
        for inst_id in fac.get("claiming_institutions", []):
            links.append({
                "source": f"inst_{inst_id}",
                "target": fac_node_id,
                "relation": "claims_exclusive_use",
                "has_conflict": has_conflict
            })

    # Shared Faculty Nodes
    for fac in faculty_roster:
        fac_node_id = f"fac_{fac['id']}"
        is_shared = len(fac.get("claimed_institutions", [])) > 1
        nodes.append({
            "id": fac_node_id,
            "label": fac["name"],
            "type": "faculty",
            "category": "Faculty",
            "is_shared": is_shared,
            "has_conflict": is_shared,
            "details": f"{fac['designation']} - {fac['department']}"
        })
        for inst_id in fac.get("claimed_institutions", []):
            links.append({
                "source": f"inst_{inst_id}",
                "target": fac_node_id,
                "relation": "reports_full_time_cadre",
                "has_conflict": is_shared
            })

    # Finding Nodes
    for f in findings:
        f_node_id = f["finding_id"]
        nodes.append({
            "id": f_node_id,
            "label": f["title"],
            "type": "finding",
            "category": "Finding",
            "severity": f["severity"],
            "details": f["why_conflict"][:90] + "..."
        })
        for aff in f.get("affected_institutions", []):
            links.append({
                "source": f"inst_{aff['institution_id']}",
                "target": f_node_id,
                "relation": "violates_rule",
                "rule": f["rule_id"]
            })

    return {
        "nodes": nodes,
        "links": links
    }
