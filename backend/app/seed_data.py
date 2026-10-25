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
    c.drawCentredString(width / 2, 25, "Page 1 of 1 — Generated for SIH 2026 PS5 Prototype Demonstration")

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
            "institution_id": "INST-BLUEVALLEY-02",
            "name": "Blue Valley College of Engineering & Research",
            "reference": "AICTE/2026/BVCOE-0481",
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
                    "filename": "aicte_affiliation_resolution_bvcoe.pdf",
                    "title": "AICTE Governing Resolution of Affiliation",
                    "fields": {
                        "institution_name": "Blue Valley College of Engineering & Research",
                        "application_reference": "AICTE/2026/BVCOE-0481",
                        "programme": "Undergraduate B.Tech Engineering",
                        "proposed_intake": 300,
                        "document_date": "2026-02-14",
                        "validity_date": "2027-02-28"
                    }
                },
                {
                    "doc_type": "fire_safety_noc",
                    "filename": "fire_safety_noc_bvcoe_expired.pdf",
                    "title": "Municipal Fire & Life Safety NOC",
                    "fields": {
                        "institution_name": "Blue Valley College of Engineering & Research",
                        "application_reference": "AICTE/2026/BVCOE-0481",
                        "document_date": "2024-11-10",
                        "validity_date": "2025-12-15"  # Expired against demo date 2026-10-01!
                    }
                },
                {
                    "doc_type": "faculty_appointment_register",
                    "filename": "faculty_register_bvcoe.pdf",
                    "title": "Certified Faculty Cadre & Appointment Register",
                    "fields": {
                        "institution_name": "Blue Valley College of Engineering & Research",
                        "application_reference": "AICTE/2026/BVCOE-0481",
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
            "institution_id": "INST-CRESTVIEW-03",
            "name": "Crestview Technical University & Academy",
            "reference": "AICTE/2026/CREST-0819",
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
                    "filename": "aicte_affiliation_resolution_crestview.pdf",
                    "title": "AICTE Governing Resolution of Affiliation",
                    "fields": {
                        "institution_name": "Crestview Technical University & Academy",
                        "application_reference": "AICTE/2026/CREST-0819",
                        "programme": "Undergraduate B.Tech Engineering",
                        "proposed_intake": 360,  # Field mismatch: document says 360, application says 480!
                        "document_date": "2026-03-22",
                        "validity_date": "2027-03-31"
                    }
                },
                {
                    "doc_type": "land_building_certificate",
                    "filename": "land_building_certificate_crestview.pdf",
                    "title": "Land & Instructional Building Certificate",
                    "fields": {
                        "institution_name": "Crestview Technical University & Academy",
                        "application_reference": "AICTE/2026/CREST-0819",
                        "carpet_area_sqm": 2400.0,
                        "document_date": "2026-04-05",
                        "validity_date": "2028-04-05"
                    }
                },
                {
                    "doc_type": "faculty_appointment_register",
                    "filename": "faculty_register_crestview_duplicate.pdf",
                    "title": "Land & Instructional Building Certificate",  # Deliberately copies land doc content -> duplicate SHA-256
                    "fields": {
                        "institution_name": "Crestview Technical University & Academy",
                        "application_reference": "AICTE/2026/CREST-0819",
                        "carpet_area_sqm": 2400.0,
                        "document_date": "2026-04-05",
                        "validity_date": "2028-04-05"
                    },
                    "copy_from": "land_building_certificate"
                },
                {
                    "doc_type": "fire_safety_noc",
                    "filename": "fire_safety_noc_crestview.pdf",
                    "title": "Municipal Fire & Life Safety NOC",
                    "fields": {
                        "institution_name": "Crestview Technical University & Academy",
                        "application_reference": "AICTE/2026/CREST-0819",
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

        conn.commit()

if __name__ == "__main__":
    seed_demo_data()
    print("Synthetic demo data & PDFs successfully seeded!")
