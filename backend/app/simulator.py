import json
from typing import Dict, Any, List
from .config import SIMULATOR_DISCLAIMER
from .rules_engine import load_rules, evaluate_rules
from .database import get_db_context

def run_change_impact_simulation(
    app_id: str,
    changed_field: str,
    new_value: Any
) -> Dict[str, Any]:
    """
    Change-Impact Simulator:
    1. Loads current application state and current findings without modifying database.
    2. Identifies rules dependent on changed_field.
    3. Re-runs only those dependent rules with new_value.
    4. Computes diff: newly_flagged, resolved, unchanged.
    5. Explains rationale for each shift.
    """
    with get_db_context() as conn:
        cursor = conn.cursor()

        # Fetch current application
        cursor.execute("SELECT * FROM applications WHERE id = ?", (app_id,))
        app_row = cursor.fetchone()
        if not app_row:
            raise ValueError(f"Application {app_id} not found")
        app_dict = dict(app_row)

        # Fetch documents
        cursor.execute("SELECT * FROM documents WHERE application_id = ?", (app_id,))
        doc_rows = cursor.fetchall()
        documents = [dict(r) for r in doc_rows]

        # Fetch extracted fields
        extracted_fields = {}
        for d in documents:
            cursor.execute("SELECT * FROM extracted_fields WHERE document_id = ?", (d["id"],))
            ef_rows = cursor.fetchall()
            extracted_fields[d["id"]] = {r["field"]: {"value": r["value"], "page": r["page"]} for r in ef_rows}

        # Fetch historical records
        cursor.execute("SELECT * FROM historical_records WHERE institution_id = ?", (app_dict["institution_id"],))
        hist_rows = cursor.fetchall()
        historical_records = [dict(r) for r in hist_rows]

    # Find dependent rules
    all_rules = load_rules()
    dependent_rule_ids = [
        r["id"] for r in all_rules if changed_field in r.get("inputs", [])
    ]

    # Evaluate before state on dependent rules
    before_findings = evaluate_rules(
        app_dict, documents, extracted_fields, historical_records, rule_filter=dependent_rule_ids
    )

    # Clone app_dict with hypothetical changed value
    simulated_app = dict(app_dict)
    try:
        # Cast numerical fields
        if changed_field in ["proposed_intake", "faculty_count"]:
            simulated_app[changed_field] = int(new_value)
        elif changed_field in ["carpet_area_sqm"]:
            simulated_app[changed_field] = float(new_value)
        else:
            simulated_app[changed_field] = new_value
    except Exception:
        simulated_app[changed_field] = new_value

    # Evaluate after state on dependent rules
    after_findings = evaluate_rules(
        simulated_app, documents, extracted_fields, historical_records, rule_filter=dependent_rule_ids
    )

    before_ids = {f["id"]: f for f in before_findings}
    after_ids = {f["id"]: f for f in after_findings}

    newly_flagged = [f for fid, f in after_ids.items() if fid not in before_ids]
    resolved = [f for fid, f in before_ids.items() if fid not in after_ids]
    unchanged = [f for fid, f in after_ids.items() if fid in before_ids]

    old_val = app_dict.get(changed_field)
    
    # Generate human-readable explanation
    field_label = changed_field.replace("_", " ").title()
    explanation_parts = [
        f"Simulated modifying '{field_label}' from {old_val} to {new_value}."
    ]
    if newly_flagged:
        explanation_parts.append(
            f"Resulted in {len(newly_flagged)} newly flagged discrepancy(s): {', '.join([f['field_or_claim'] for f in newly_flagged])}."
        )
    if resolved:
        explanation_parts.append(
            f"Successfully resolved {len(resolved)} previous finding(s): {', '.join([f['field_or_claim'] for f in resolved])}."
        )
    if not newly_flagged and not resolved:
        explanation_parts.append("No change in finding state across dependent regulatory rules.")

    result = {
        "changed_field": changed_field,
        "old_value": old_val,
        "new_value": new_value,
        "dependent_rules_evaluated": dependent_rule_ids,
        "before_count": len(before_findings),
        "after_count": len(after_findings),
        "newly_flagged": newly_flagged,
        "resolved": resolved,
        "unchanged": unchanged,
        "summary_explanation": " ".join(explanation_parts),
        "disclaimer": SIMULATOR_DISCLAIMER
    }

    # Record simulation in DB for history without modifying stored application (FR-G6)
    with get_db_context() as conn:
        cursor = conn.cursor()
        sim_id = f"SIM-{app_id}-{changed_field}-{str(new_value)}"
        cursor.execute("""
        INSERT OR REPLACE INTO simulations (id, application_id, changed_field, old_value, new_value, result_json)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            sim_id,
            app_id,
            changed_field,
            str(old_val),
            str(new_value),
            json.dumps(result)
        ))
        conn.commit()

    return result
