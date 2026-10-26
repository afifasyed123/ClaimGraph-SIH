import hashlib
import json
import os
import shutil
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

from .config import SYNTHETIC_DATA_DIR, DEMO_DATE, SYNTHETIC_BANNER
from .database import get_db_context, init_db
from .rules_engine import evaluate_rules
from .notices import generate_deficiency_notice

def generate_pdf(filepath: Path, title: str, fields: dict, institution: str, ref: str):
    filepath.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(filepath), pagesize=letter)
    width, height = letter

    # Draw Synthetic Warning Banner
    c.setFillColor(colors.HexColor("#FFF1F2"))
    c.rect(0, height - 45, width, 45, fill=True, stroke=False)
    c.setFillColor(colors.HexColor("#BE123C"))
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(width / 2, height - 20, "SYNTHETIC DEMO DATA. NOT A REAL INSTITUTION.")
    c.setFont("Helvetica", 7)
    c.drawCentredString(width / 2, height - 32, "All verification is simulated. Demonstration rules are not official AICTE requirements.")

    # Header
    c.setFillColor(colors.HexColor("#0F172A"))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 80, title)
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.HexColor("#475569"))
    c.drawString(50, height - 100, f"Institution: {institution}")
    c.drawString(50, height - 116, f"Application Reference: {ref}")
    c.drawString(50, height - 132, f"Synthetic Demo Date: {DEMO_DATE}")

    # Separator
    c.setStrokeColor(colors.HexColor("#E2E8F0"))
    c.setLineWidth(1)
    c.line(50, height - 145, width - 50, height - 145)

    # Document Fields & Content
    y = height - 175
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(colors.HexColor("#1E293B"))
    c.drawString(50, y, "Official Regulatory Record Details:")
    y -= 25

    c.setFont("Helvetica", 10)
    for key, val in fields.items():
        label = key.replace("_", " ").title()
        c.setFillColor(colors.HexColor("#334155"))
        c.setFont("Helvetica-Bold", 9)
        c.drawString(60, y, f"{label}:")
        c.setFont("Helvetica", 9)
        c.setFillColor(colors.HexColor("#0F172A"))
        c.drawString(220, y, str(val))
        y -= 20

    # Decorative synthetic seal stamp
    y -= 30
    c.setStrokeColor(colors.HexColor("#94A3B8"))
    c.setLineWidth(0.8)
    c.rect(60, y - 50, 220, 45, fill=False)
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(colors.HexColor("#64748B"))
    c.drawString(70, y - 20, "AICTE COMPLIANCE AUDIT CELL (SIMULATED)")
    c.setFont("Helvetica", 7)
    c.drawString(70, y - 35, f"Authenticated Digest Verification ID: #{ref[-8:]}")

    # Footer banner
    c.setFont("Helvetica-Oblique", 7)
    c.setFillColor(colors.HexColor("#94A3B8"))
    c.drawCentredString(width / 2, 25, "Page 1 of 1 — Generated for AICTE Scrutiny Demonstration — Synthetic Case")

    c.save()

def calculate_sha256(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def seed_demo_data():
    init_db()

    # Define cases
    cases = {
        "case_a": {
            "id": "APP-CASE-A",
            "institution_id": "INST-APEX-01",
            "name": "Apex Institute of Technology & Engineering",
            "reference": "AICTE/2026/APEX-0192",
            "type": "Extension of Approval (EoA)",
            "category": "Engineering & Technology",
            "proposed_intake": 360,
            "faculty_count": 24,
            "carpet_area_sqm": 3200.0,
            "status": "Ready for Scrutiny",
            "history": [
                {"field": "sanctioned_intake", "value": "360", "as_of": "2024-25"},
                {"field": "approved_faculty", "value": "24", "as_of": "2024-25"},
                {"field": "compliance_status", "value": "Compliant", "as_of": "2024-25"}
            ],
            "docs": [
                {
                    "doc_type": "aicte_affiliation_resolution",
                    "filename": "aicte_affiliation_resolution_apex.pdf",
                    "title": "AICTE Governing Resolution of Affiliation",
                    "fields": {
                        "institution_name": "Apex Institute of Technology & Engineering",
                        "application_reference": "AICTE/2026/APEX-0192",
                        "programme": "Undergraduate B.Tech Engineering",
                        "proposed_intake": 360,
                        "document_date": "2026-04-12",
                        "validity_date": "2027-04-30"
                    }
                },
                {
                    "doc_type": "land_building_certificate",
                    "filename": "land_building_certificate_apex.pdf",
                    "title": "Land & Instructional Building Certificate",
                    "fields": {
                        "institution_name": "Apex Institute of Technology & Engineering",
                        "application_reference": "AICTE/2026/APEX-0192",
                        "land_area_acres": "5.2 Acres",
                        "carpet_area_sqm": 3200.0,
                        "document_date": "2026-03-10",
                        "validity_date": "2028-03-31"
                    }
                },
                {
                    "doc_type": "fire_safety_noc",
                    "filename": "fire_safety_noc_apex.pdf",
                    "title": "Municipal Fire & Life Safety NOC",
                    "fields": {
                        "institution_name": "Apex Institute of Technology & Engineering",
                        "application_reference": "AICTE/2026/APEX-0192",
                        "document_date": "2026-05-15",
                        "validity_date": "2027-05-14"  # Valid! After demo cutoff 2026-10-01
                    }
                },
                {
                    "doc_type": "faculty_appointment_register",
                    "filename": "faculty_register_apex.pdf",
                    "title": "Certified Faculty Cadre & Appointment Register",
                    "fields": {
                        "institution_name": "Apex Institute of Technology & Engineering",
                        "application_reference": "AICTE/2026/APEX-0192",
                        "faculty_count": 24,
                        "cadre_ratio": "1:2:6 Cadre Met",
                        "document_date": "2026-06-01",
                        "validity_date": "2027-06-30"
                    }
                }
            ]
        },
        "case_b": {
            "id": "APP-CASE-B",
            "institution_id": "INST-BHARAT-02",
            "name": "Bharat College of Engineering & Technology",
            "reference": "AICTE/2026/BHARAT-0481",
            "type": "Extension of Approval (EoA)",
            "category": "Engineering & Technology",
            "proposed_intake": 300,
            "faculty_count": None,  # Incomplete: required field blank
            "carpet_area_sqm": 2500.0,
            "status": "Incomplete Submissions",
            "history": [
                {"field": "sanctioned_intake", "value": "300", "as_of": "2024-25"},
                {"field": "approved_faculty", "value": "20", "as_of": "2024-25"}
            ],
            "docs": [
                {
                    "doc_type": "aicte_affiliation_resolution",
                    "filename": "aicte_affiliation_resolution_bharat.pdf",
                    "title": "AICTE Governing Resolution of Affiliation",
                    "fields": {
                        "institution_name": "Bharat College of Engineering & Technology",
                        "application_reference": "AICTE/2026/BHARAT-0481",
                        "programme": "Undergraduate B.Tech Engineering",
                        "proposed_intake": 300,
                        "document_date": "2026-02-14",
                        "validity_date": "2027-02-28"
                    }
                },
                {
                    "doc_type": "fire_safety_noc",
                    "filename": "fire_safety_noc_bharat_expired.pdf",
                    "title": "Municipal Fire & Life Safety NOC",
                    "fields": {
                        "institution_name": "Bharat College of Engineering & Technology",
                        "application_reference": "AICTE/2026/BHARAT-0481",
                        "document_date": "2024-11-10",
                        "validity_date": "2025-12-15"  # Expired against demo date 2026-10-01!
                    }
                },
                {
                    "doc_type": "faculty_appointment_register",
                    "filename": "faculty_register_bharat.pdf",
                    "title": "Certified Faculty Cadre & Appointment Register",
                    "fields": {
                        "institution_name": "Bharat College of Engineering & Technology",
                        "application_reference": "AICTE/2026/BHARAT-0481",
                        "faculty_count": 20,
                        "document_date": "2026-05-10",
                        "validity_date": "2027-05-10"
                    }
                }
                # NOTE: land_building_certificate is missing!
            ]
        },
        "case_c": {
            "id": "APP-CASE-C",
            "institution_id": "INST-CHITKARA-03",
            "name": "Chitkara Institute of Technology",
            "reference": "AICTE/2026/CHITKARA-0819",
            "type": "Extension of Approval (EoA)",
            "category": "Engineering & Technology",
            "proposed_intake": 480,  # Conflicts with resolution document (states 360) and historical faculty
            "faculty_count": 20,
            "carpet_area_sqm": 2400.0,
            "status": "Discrepancies Flagged",
            "history": [
                {"field": "sanctioned_intake", "value": "300", "as_of": "2024-25"},
                {"field": "approved_faculty", "value": "18", "as_of": "2024-25"}
            ],
            "docs": [
                {
                    "doc_type": "aicte_affiliation_resolution",
                    "filename": "aicte_affiliation_resolution_chitkara.pdf",
                    "title": "AICTE Governing Resolution of Affiliation",
                    "fields": {
                        "institution_name": "Chitkara Institute of Technology",
                        "application_reference": "AICTE/2026/CHITKARA-0819",
                        "programme": "Undergraduate B.Tech Engineering",
                        "proposed_intake": 360,  # Field mismatch: document says 360, application says 480!
                        "document_date": "2026-03-22",
                        "validity_date": "2027-03-31"
                    }
                },
                {
                    "doc_type": "land_building_certificate",
                    "filename": "land_building_certificate_chitkara.pdf",
                    "title": "Land & Instructional Building Certificate",
                    "fields": {
                        "institution_name": "Chitkara Institute of Technology",
                        "application_reference": "AICTE/2026/CHITKARA-0819",
                        "carpet_area_sqm": 2400.0,
                        "document_date": "2026-04-05",
                        "validity_date": "2028-04-05"
                    }
                },
                {
                    "doc_type": "faculty_appointment_register",
                    "filename": "faculty_register_chitkara_duplicate.pdf",
                    "title": "Land & Instructional Building Certificate",  # Deliberately copies land doc content -> duplicate SHA-256
                    "fields": {
                        "institution_name": "Chitkara Institute of Technology",
                        "application_reference": "AICTE/2026/CHITKARA-0819",
                        "carpet_area_sqm": 2400.0,
                        "document_date": "2026-04-05",
                        "validity_date": "2028-04-05"
                    },
                    "copy_from": "land_building_certificate"
                },
                {
                    "doc_type": "fire_safety_noc",
                    "filename": "fire_safety_noc_chitkara.pdf",
                    "title": "Municipal Fire & Life Safety NOC",
                    "fields": {
                        "institution_name": "Chitkara Institute of Technology",
                        "application_reference": "AICTE/2026/CHITKARA-0819",
                        "document_date": "2026-05-18",
                        "validity_date": "2027-05-17"
                    }
                }
            ]
        }
    }

    with get_db_context() as conn:
        cursor = conn.cursor()

        # Clean existing test data
        cursor.execute("DELETE FROM applications")
        cursor.execute("DELETE FROM documents")
        cursor.execute("DELETE FROM extracted_fields")
        cursor.execute("DELETE FROM historical_records")
        cursor.execute("DELETE FROM findings")
        cursor.execute("DELETE FROM reviewer_actions")
        cursor.execute("DELETE FROM simulations")

        for key, cdata in cases.items():
            # Insert application
            cursor.execute("""
            INSERT INTO applications (id, institution_id, name, reference, type, category, proposed_intake, faculty_count, carpet_area_sqm, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                cdata["id"],
                cdata["institution_id"],
                cdata["name"],
                cdata["reference"],
                cdata["type"],
                cdata["category"],
                cdata["proposed_intake"],
                cdata["faculty_count"],
                cdata["carpet_area_sqm"],
                cdata["status"]
            ))

            # Insert historical records
            for h in cdata["history"]:
                cursor.execute("""
                INSERT INTO historical_records (id, institution_id, field, value, as_of)
                VALUES (?, ?, ?, ?, ?)
                """, (
                    f"HIST-{cdata['id']}-{h['field']}",
                    cdata["institution_id"],
                    h["field"],
                    str(h["value"]),
                    h["as_of"]
                ))

            # Generate PDFs and register documents
            case_dir = SYNTHETIC_DATA_DIR / key
            case_dir.mkdir(parents=True, exist_ok=True)

            created_files = {}

            for doc in cdata["docs"]:
                pdf_path = case_dir / doc["filename"]

                if doc.get("copy_from") and doc["copy_from"] in created_files:
                    # Duplicate identical binary file to test SHA-256 duplicate collision detection
                    shutil.copyfile(created_files[doc["copy_from"]], pdf_path)
                else:
                    generate_pdf(pdf_path, doc["title"], doc["fields"], cdata["name"], cdata["reference"])

                created_files[doc["doc_type"]] = pdf_path
                file_hash = calculate_sha256(pdf_path)

                doc_id = f"DOC-{cdata['id']}-{doc['doc_type']}"
                cursor.execute("""
                INSERT INTO documents (id, application_id, doc_type, filename, sha256, file_path, processing_status)
                VALUES (?, ?, ?, ?, ?, ?, 'processed')
                """, (
                    doc_id,
                    cdata["id"],
                    doc["doc_type"],
                    doc["filename"],
                    file_hash,
                    str(pdf_path)
                ))

                # Insert extracted fields
                for f_name, f_val in doc["fields"].items():
                    cursor.execute("""
                    INSERT INTO extracted_fields (id, document_id, field, value, page, extraction_status)
                    VALUES (?, ?, ?, ?, 1, 'success')
                    """, (
                        f"EXT-{doc_id}-{f_name}",
                        doc_id,
                        f_name,
                        str(f_val),
                    ))

        # --- SEED TULA INTEGRATED CAMPUS SCENARIO ---
        # 1. Campus VV-01
        campus_id = "CAMPUS-VV-01"
        cursor.execute("DELETE FROM campuses")
        cursor.execute("DELETE FROM campus_institutions")
        cursor.execute("DELETE FROM campus_facilities")
        cursor.execute("DELETE FROM campus_faculty")
        cursor.execute("DELETE FROM audit_chain")
        cursor.execute("DELETE FROM deficiency_notices")

        cursor.execute("""
        INSERT INTO campuses (id, name, location, total_land_acres, total_built_up_sqm)
        VALUES (?, ?, ?, ?, ?)
        """, (
            campus_id,
            "Vidya Vihar Integrated Knowledge Campus",
            "Plot 14-B, Sector 62, Institutional Area, Greater Noida, UP - 201309",
            14.5,
            12500.0
        ))

        # 2. Campus Institutions (Engineering, Pharmacy, Management)
        campus_insts = [
            {
                "id": "CINST-01",
                "campus_id": campus_id,
                "institution_id": "INST-APEX-01",
                "application_id": "APP-CASE-A",
                "institution_name": "Apex Institute of Technology & Engineering",
                "programme": "Engineering & Technology",
                "sanctioned_intake": 360,
                "faculty_count": 24,
                "carpet_area_sqm": 3200.0
            },
            {
                "id": "CINST-02",
                "campus_id": campus_id,
                "institution_id": "INST-PHARM-01",
                "application_id": "APP-CAMPUS-PHARM",
                "institution_name": "Apex College of Pharmacy & Research",
                "programme": "Pharmacy",
                "sanctioned_intake": 100,
                "faculty_count": 10,
                "carpet_area_sqm": 2100.0
            },
            {
                "id": "CINST-03",
                "campus_id": campus_id,
                "institution_id": "INST-MGMT-01",
                "application_id": "APP-CAMPUS-MGMT",
                "institution_name": "Apex Global Institute of Management",
                "programme": "Management",
                "sanctioned_intake": 120,
                "faculty_count": 8,
                "carpet_area_sqm": 1800.0
            }
        ]

        for ci in campus_insts:
            cursor.execute("""
            INSERT INTO campus_institutions (id, campus_id, institution_id, application_id, institution_name, programme, sanctioned_intake, faculty_count, carpet_area_sqm)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                ci["id"], ci["campus_id"], ci["institution_id"], ci["application_id"],
                ci["institution_name"], ci["programme"], ci["sanctioned_intake"],
                ci["faculty_count"], ci["carpet_area_sqm"]
            ))

        # Add Pharmacy and Management to applications table for direct scrutiny
        pharm_app = {
            "id": "APP-CAMPUS-PHARM",
            "institution_id": "INST-PHARM-01",
            "name": "Apex College of Pharmacy & Research",
            "reference": "AICTE/2026/PHARM-0512",
            "type": "Extension of Approval (EoA)",
            "category": "Pharmacy",
            "proposed_intake": 100,
            "faculty_count": 10,
            "carpet_area_sqm": 2100.0,
            "status": "Ready for Scrutiny"
        }
        mgmt_app = {
            "id": "APP-CAMPUS-MGMT",
            "institution_id": "INST-MGMT-01",
            "name": "Apex Global Institute of Management",
            "reference": "AICTE/2026/MGMT-0388",
            "type": "Extension of Approval (EoA)",
            "category": "Management",
            "proposed_intake": 120,
            "faculty_count": 8,
            "carpet_area_sqm": 1800.0,
            "status": "Ready for Scrutiny"
        }

        for extra_app in [pharm_app, mgmt_app]:
            cursor.execute("""
            INSERT OR REPLACE INTO applications (id, institution_id, name, reference, type, category, proposed_intake, faculty_count, carpet_area_sqm, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                extra_app["id"], extra_app["institution_id"], extra_app["name"], extra_app["reference"],
                extra_app["type"], extra_app["category"], extra_app["proposed_intake"],
                extra_app["faculty_count"], extra_app["carpet_area_sqm"], extra_app["status"]
            ))

            # Generate basic affiliation and faculty PDFs for them
            extra_dir = SYNTHETIC_DATA_DIR / extra_app["id"].lower().replace("-", "_")
            extra_dir.mkdir(parents=True, exist_ok=True)
            
            aff_path = extra_dir / f"aicte_affiliation_{extra_app['id'].lower()}.pdf"
            generate_pdf(aff_path, f"AICTE Affiliation Resolution — {extra_app['category']}", {
                "institution_name": extra_app["name"],
                "application_reference": extra_app["reference"],
                "programme": extra_app["category"],
                "proposed_intake": extra_app["proposed_intake"],
                "document_date": "2026-05-10",
                "validity_date": "2027-05-31"
            }, extra_app["name"], extra_app["reference"])
            
            aff_hash = calculate_sha256(aff_path)
            cursor.execute("""
            INSERT INTO documents (id, application_id, doc_type, filename, sha256, file_path, processing_status)
            VALUES (?, ?, 'aicte_affiliation_resolution', ?, ?, ?, 'processed')
            """, (f"DOC-{extra_app['id']}-AFF", extra_app["id"], aff_path.name, aff_hash, str(aff_path)))

            cursor.execute("""
            INSERT INTO extracted_fields (id, document_id, field, value, page, extraction_status)
            VALUES (?, ?, 'proposed_intake', ?, 1, 'success')
            """, (f"EXT-{extra_app['id']}-INTAKE", f"DOC-{extra_app['id']}-AFF", str(extra_app["proposed_intake"])))

        # 3. Campus Facilities (Including Seeded Overlap Contradiction)
        facilities_seed = [
            {
                "id": "FACIL-AUD-01",
                "campus_id": campus_id,
                "name": "Central Block A (Auditorium & Computing Center)",
                "type": "Instructional & Auditorium Block",
                "total_carpet_area_sqm": 1200.0,
                "is_sharable": 1,
                "claiming_institutions": json.dumps(["INST-APEX-01", "INST-MGMT-01"]),
                "claimed_areas_json": json.dumps({
                    "INST-APEX-01": 1200.0,
                    "INST-MGMT-01": 1200.0
                }),
                "source_documents_json": json.dumps({
                    "INST-APEX-01": {"document": "land_building_certificate_apex.pdf", "page": 1},
                    "INST-MGMT-01": {"document": "land_building_certificate_mgmt.pdf", "page": 1}
                })
            },
            {
                "id": "FACIL-LIB-01",
                "campus_id": campus_id,
                "name": "Central Knowledge & Digital Library",
                "type": "Central Knowledge Resource",
                "total_carpet_area_sqm": 1800.0,
                "is_sharable": 1,
                "claiming_institutions": json.dumps(["INST-APEX-01", "INST-PHARM-01", "INST-MGMT-01"]),
                "claimed_areas_json": json.dumps({
                    "INST-APEX-01": 1000.0,
                    "INST-PHARM-01": 500.0,
                    "INST-MGMT-01": 300.0
                }),
                "source_documents_json": json.dumps({
                    "INST-APEX-01": {"document": "land_building_certificate_apex.pdf", "page": 1},
                    "INST-PHARM-01": {"document": "land_building_certificate_pharm.pdf", "page": 1},
                    "INST-MGMT-01": {"document": "land_building_certificate_mgmt.pdf", "page": 1}
                })
            },
            {
                "id": "FACIL-ROBO-01",
                "campus_id": campus_id,
                "name": "Advanced Robotics & AI Incubation Hub",
                "type": "Specialized Engineering Workshop",
                "total_carpet_area_sqm": 800.0,
                "is_sharable": 0,
                "claiming_institutions": json.dumps(["INST-APEX-01"]),
                "claimed_areas_json": json.dumps({
                    "INST-APEX-01": 800.0
                }),
                "source_documents_json": json.dumps({
                    "INST-APEX-01": {"document": "land_building_certificate_apex.pdf", "page": 1}
                })
            }
        ]

        for f in facilities_seed:
            cursor.execute("""
            INSERT INTO campus_facilities (id, campus_id, name, type, total_carpet_area_sqm, is_sharable, claiming_institutions, claimed_areas_json, source_documents_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                f["id"], f["campus_id"], f["name"], f["type"], f["total_carpet_area_sqm"],
                f["is_sharable"], f["claiming_institutions"], f["claimed_areas_json"],
                f["source_documents_json"]
            ))

        # 4. Campus Faculty Roster (Including Seeded Double-Counting Contradiction)
        faculty_seed = [
            {
                "id": "FAC-PROF-007",
                "name": "Dr. R. K. Sharma (Privacy ID: #007)",
                "department": "Computer Science / Bio-Informatics",
                "designation": "Senior Professor & Department Head",
                "claimed_institutions": json.dumps(["INST-APEX-01", "INST-PHARM-01"]),
                "is_full_time": 1,
                "source_evidence_json": json.dumps({
                    "INST-APEX-01": {"document": "faculty_register_apex.pdf", "page": 1},
                    "INST-PHARM-01": {"document": "faculty_register_pharm.pdf", "page": 1}
                })
            },
            {
                "id": "FAC-PHARM-011",
                "name": "Dr. Ananya Sen (Privacy ID: #011)",
                "department": "Pharmacology & Pharmaceutical Chemistry",
                "designation": "Associate Professor",
                "claimed_institutions": json.dumps(["INST-PHARM-01"]),
                "is_full_time": 1,
                "source_evidence_json": json.dumps({
                    "INST-PHARM-01": {"document": "faculty_register_pharm.pdf", "page": 1}
                })
            },
            {
                "id": "FAC-MGMT-005",
                "name": "Dr. Priya Nair (Privacy ID: #005)",
                "department": "Business Analytics & Quantitative Strategy",
                "designation": "Professor & Dean",
                "claimed_institutions": json.dumps(["INST-MGMT-01"]),
                "is_full_time": 1,
                "source_evidence_json": json.dumps({
                    "INST-MGMT-01": {"document": "faculty_register_mgmt.pdf", "page": 1}
                })
            },
            {
                "id": "FAC-ENG-023",
                "name": "Prof. Vikram Patel (Privacy ID: #023)",
                "department": "Mechanical & Industrial Automation",
                "designation": "Assistant Professor",
                "claimed_institutions": json.dumps(["INST-APEX-01"]),
                "is_full_time": 1,
                "source_evidence_json": json.dumps({
                    "INST-APEX-01": {"document": "faculty_register_apex.pdf", "page": 1}
                })
            }
        ]

        for fac in faculty_seed:
            cursor.execute("""
            INSERT INTO campus_faculty (id, name, department, designation, claimed_institutions, is_full_time, source_evidence_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                fac["id"], fac["name"], fac["department"], fac["designation"],
                fac["claimed_institutions"], fac["is_full_time"], fac["source_evidence_json"]
            ))

        # 5. Initialize Cryptographic Audit Chain with Genesis Block
        import time
        from .audit_chain import compute_record_hash, GENESIS_PREV_HASH
        
        genesis_ts = "2026-10-25T08:00:00Z"
        genesis_id = "AUD-GENESIS-001"
        genesis_hash = compute_record_hash(
            prev_hash=GENESIS_PREV_HASH,
            record_id=genesis_id,
            timestamp=genesis_ts,
            actor="System Setup / Compliance Ingestion Engine",
            role="System Administrator",
            action="GENESIS_SYSTEM_INITIALIZATION",
            target_id="CLAIMGRAPH-CAMPUS-INTEGRATION",
            reason="Initialized immutable audit trail and baseline regulatory state.",
            payload_json="{}"
        )
        cursor.execute("""
        INSERT INTO audit_chain (id, prev_hash, current_hash, timestamp, actor, role, action, target_id, reason, payload_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            genesis_id, GENESIS_PREV_HASH, genesis_hash, genesis_ts,
            "System Setup / Compliance Ingestion Engine", "System Administrator",
            "GENESIS_SYSTEM_INITIALIZATION", "CLAIMGRAPH-CAMPUS-INTEGRATION",
            "Initialized immutable audit trail and baseline regulatory state.", "{}"
        ))

        # Add second sample block for pre-loaded Case C validation
        block2_ts = "2026-10-25T08:05:00Z"
        block2_id = "AUD-SCRUTINY-002"
        block2_hash = compute_record_hash(
            prev_hash=genesis_hash,
            record_id=block2_id,
            timestamp=block2_ts,
            actor="Dr. Arvind Deshmukh (Scrutiny Committee Chair)",
            role="Senior Officer",
            action="Referred for further verification or inspection",
            target_id="FND-APP-CASE-C-RULE-INTAKE-EVIDENCE-CROSSCHECK-MISMATCH-proposed_intake",
            reason="Sanctioned intake in Council Resolution is 360, but application claims 480. High discrepancy requires physical inspection.",
            payload_json=json.dumps({"application_id": "APP-CASE-C", "claimed_intake": 480, "resolution_intake": 360})
        )
        cursor.execute("""
        INSERT INTO audit_chain (id, prev_hash, current_hash, timestamp, actor, role, action, target_id, reason, payload_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            block2_id, genesis_hash, block2_hash, block2_ts,
            "Dr. Arvind Deshmukh (Scrutiny Committee Chair)", "Senior Officer",
            "Referred for further verification or inspection",
            "FND-APP-CASE-C-RULE-INTAKE-EVIDENCE-CROSSCHECK-MISMATCH-proposed_intake",
            "Sanctioned intake in Council Resolution is 360, but application claims 480. High discrepancy requires physical inspection.",
            json.dumps({"application_id": "APP-CASE-C", "claimed_intake": 480, "resolution_intake": 360})
        ))

        conn.commit()

        # Pre-evaluate rules and pre-seed findings for synthetic test applications
        for app_id in ["APP-CASE-A", "APP-CASE-B", "APP-CASE-C"]:
            cursor.execute("SELECT * FROM applications WHERE id = ?", (app_id,))
            app_row = cursor.fetchone()
            if not app_row:
                continue
            app_dict = dict(app_row)
            cursor.execute("SELECT * FROM documents WHERE application_id = ?", (app_id,))
            docs = [dict(r) for r in cursor.fetchall()]
            ext_fields = {}
            for d in docs:
                cursor.execute("SELECT * FROM extracted_fields WHERE document_id = ?", (d["id"],))
                ef_rows = cursor.fetchall()
                ext_fields[d["id"]] = {r["field"]: {"value": r["value"], "page": r["page"]} for r in ef_rows}
            cursor.execute("SELECT * FROM historical_records WHERE institution_id = ?", (app_dict["institution_id"],))
            hist_records = [dict(r) for r in cursor.fetchall()]

            cursor.execute("DELETE FROM findings WHERE application_id = ?", (app_id,))
            fnds = evaluate_rules(app_dict, docs, ext_fields, hist_records)
            for f in fnds:
                cursor.execute("""
                INSERT INTO findings (
                    id, application_id, rule_id, type, severity, status, field_or_claim,
                    extracted_value, comparison_value, source_document, page_or_field,
                    reason, verification_status, recommended_next_step, rule_source, details_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    f["id"], app_id, f["rule_id"], f["type"], f["severity"], f["status"],
                    f["field_or_claim"], f["extracted_value"], f["comparison_value"],
                    f["source_document"], f["page_or_field"], f["reason"],
                    f["verification_status"], f["recommended_next_step"], f["rule_source"],
                    json.dumps(f.get("details_json", {}))
                ))
        conn.commit()

        # Seed realistic deficiency notices for Case B and Case C
        try:
            generate_deficiency_notice(
                application_id="APP-CASE-B",
                reviewer_name="Dr. Arvind Deshmukh (Scrutiny Committee Chair)",
                clarifications_note=(
                    "1. Upload valid Municipal Fire & Life Safety NOC renewed for 2026-27 (submitted NOC expired on 2025-03-31).\n"
                    "2. Submit certified Faculty Cadre Register and Form 16 salary disbursement statements."
                )
            )
            generate_deficiency_notice(
                application_id="APP-CASE-C",
                reviewer_name="Priya Sharma (Scrutiny Officer)",
                clarifications_note=(
                    "1. Reconcile proposed intake discrepancy (claims 480 intake; Governing Body Resolution confirms only 360 intake).\n"
                    "2. Provide valid registered Land & Building Deed (uploaded PDF is an exact byte duplicate of Fire NOC)."
                )
            )
        except Exception as e:
            print("Notice seed warning:", e)

if __name__ == "__main__":
    seed_demo_data()
    print("Synthetic demo data & PDFs successfully seeded!")


