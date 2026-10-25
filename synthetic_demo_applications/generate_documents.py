import os
import json
import hashlib
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

ROOT_DIR = Path(__file__).resolve().parent
SOURCE_DATA_DIR = ROOT_DIR / "source_data"
MANIFESTS_DIR = ROOT_DIR / "manifests"
CASE_A_DIR = ROOT_DIR / "case_A_consistent"
CASE_B_DIR = ROOT_DIR / "case_B_deficient"
CASE_C_DIR = ROOT_DIR / "case_C_conflicting"
CAMPUS_DIR = ROOT_DIR / "campus_reconciliation"

DEMO_EVALUATION_DATE = "2026-03-15"
WATERMARK_TEXT = "SYNTHETIC DEMO DOCUMENT — NOT AN OFFICIAL AICTE DOCUMENT"

def draw_header_and_watermark(c: canvas.Canvas, width: float, height: float, title: str, subtitle: str, ref: str):
    # Top Watermark Warning Bar (Prominent and clear)
    c.setFillColor(colors.HexColor("#FEF2F2"))
    c.rect(0, height - 38, width, 38, fill=True, stroke=False)
    c.setFillColor(colors.HexColor("#DC2626"))
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(width / 2, height - 18, WATERMARK_TEXT)
    c.setFont("Helvetica", 7)
    c.drawCentredString(width / 2, height - 29, "Simulated data generated solely for system verification & prototype demonstration.")

    # Header Box
    c.setFillColor(colors.HexColor("#1E3A8A"))
    c.setFont("Helvetica-Bold", 14)
    c.drawString(45, height - 68, title)
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.HexColor("#475569"))
    c.drawString(45, height - 84, subtitle)
    c.drawString(45, height - 98, f"Document Reference: {ref}  |  Evaluation Baseline Date: {DEMO_EVALUATION_DATE}")

    # Separator Line
    c.setStrokeColor(colors.HexColor("#CBD5E1"))
    c.setLineWidth(1)
    c.line(45, height - 108, width - 45, height - 108)

def draw_field_table(c: canvas.Canvas, width: float, y_start: float, fields: dict):
    y = y_start
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor("#0F172A"))
    c.drawString(45, y, "Extractable Institutional & Regulatory Parameters:")
    y -= 18

    # Table background
    box_height = len(fields) * 22 + 10
    c.setFillColor(colors.HexColor("#F8FAFC"))
    c.rect(45, y - box_height + 15, width - 90, box_height, fill=True, stroke=True)
    c.setStrokeColor(colors.HexColor("#E2E8F0"))

    for label, val in fields.items():
        c.setFillColor(colors.HexColor("#334155"))
        c.setFont("Helvetica-Bold", 8.5)
        c.drawString(55, y, f"{label}:")
        c.setFillColor(colors.HexColor("#0F172A"))
        c.setFont("Helvetica", 8.5)
        c.drawString(240, y, str(val))
        y -= 22

    return y - 15

def draw_footer_and_hash(c: canvas.Canvas, width: float, doc_id: str, aicte_clause: str):
    y = 65
    c.setStrokeColor(colors.HexColor("#E2E8F0"))
    c.setLineWidth(0.8)
    c.line(45, y, width - 45, y)

    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(colors.HexColor("#475569"))
    c.drawString(45, y - 14, f"Applicable AICTE Handbook Reference: {aicte_clause}")
    c.setFont("Helvetica", 7)
    c.setFillColor(colors.HexColor("#64748B"))
    c.drawString(45, y - 26, f"Fictional Entity Identifier: {doc_id}  |  No personal applicant data used.")
    c.drawRightString(width - 45, y - 26, "Page 1 of 1  |  Self-Generated Synthetic Dataset")

def create_pdf(filepath: Path, title: str, subtitle: str, fields: dict, doc_id: str, aicte_clause: str, notes: list = None):
    filepath.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(filepath), pagesize=letter)
    width, height = letter

    draw_header_and_watermark(c, width, height, title, subtitle, doc_id)
    y_after_table = draw_field_table(c, width, height - 135, fields)

    # Informative notes / narrative
    if notes:
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(colors.HexColor("#1E293B"))
        c.drawString(45, y_after_table - 5, "Statutory Declaration & Verification Context:")
        y_text = y_after_table - 22
        c.setFont("Helvetica", 8)
        c.setFillColor(colors.HexColor("#475569"))
        for line in notes:
            c.drawString(55, y_text, f"• {line}")
            y_text -= 15

    draw_footer_and_hash(c, width, doc_id, aicte_clause)
    c.save()

def calculate_file_hash(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def build_all_scenarios():
    print("Generating Synthetic AICTE Demo Datasets informed by Approval Process Handbook 2024-2027...")
    SOURCE_DATA_DIR.mkdir(parents=True, exist_ok=True)
    MANIFESTS_DIR.mkdir(parents=True, exist_ok=True)

    # =========================================================================
    # CASE A: CONSISTENT (Clean baseline, 100% agreement, 0 findings)
    # =========================================================================
    case_a_data = {
        "institution_id": "INST-APEX-01",
        "institution_name": "Apex Institute of Technology & Engineering",
        "application_reference": "AICTE/2026/APEX-0192",
        "programme": "Engineering and Technology",
        "proposed_intake": 360,
        "faculty_count": 24,
        "carpet_area_sqm": 3200.0,
        "land_acres": 2.5,
        "fire_noc_valid_till": "2027-06-30",
        "aicte_clauses": {
            "sfr": "AICTE APH 2024-27 Annexure 5.2 (UG Degree Engineering SFR 1:20)",
            "land": "AICTE APH 2024-27 Annexure 3.1 (Urban/Metro Land & FSI Norms)",
            "space": "AICTE APH 2024-27 Annexure 3.2 (1.1 sq.m instructional area per student)"
        }
    }
    with open(SOURCE_DATA_DIR / "case_a_consistent.json", "w") as f:
        json.dump(case_a_data, f, indent=2)

    # 1. Application Summary Form
    create_pdf(
        CASE_A_DIR / "Application_Form_EoA_2026.pdf",
        title="AICTE Extension of Approval (EoA) Application Form",
        subtitle="Institution: Apex Institute of Technology & Engineering",
        fields={
            "Institution": case_a_data["institution_name"],
            "Application Reference": case_a_data["application_reference"],
            "Programme": case_a_data["programme"],
            "Proposed Intake": case_a_data["proposed_intake"],
            "Faculty Count": case_a_data["faculty_count"],
            "Carpet Area Sqm": case_a_data["carpet_area_sqm"],
            "Document Date": "2026-01-15",
            "Validity Date": "2027-06-30"
        },
        doc_id="DOC-APEX-APP-01",
        aicte_clause="Chapter II, Clause 2.1 (Grant of EoA)",
        notes=[
            "Application submitted for Extension of Approval for Academic Session 2026-27.",
            "All claimed parameters comply with AICTE Approval Process Handbook (APH 2024-27)."
        ]
    )

    # 2. Faculty Cadre Declaration
    create_pdf(
        CASE_A_DIR / "Faculty_Roster_Annexure_5.pdf",
        title="Faculty Cadre Roster & Qualification Declaration",
        subtitle="Institution: Apex Institute of Technology & Engineering",
        fields={
            "Institution": case_a_data["institution_name"],
            "Application Reference": case_a_data["application_reference"],
            "Programme": case_a_data["programme"],
            "Faculty Count": 24,
            "Proposed Intake": 360,
            "Document Date": "2026-01-10",
            "Validity Date": "2026-12-31"
        },
        doc_id="DOC-APEX-FAC-01",
        aicte_clause="Annexure 5.2 (Norms for Faculty Cadre Ratio 1:2:6 & SFR 1:20)",
        notes=[
            "24 full-time regular faculty appointed (2 Professors, 5 Associate Professors, 17 Assistant Professors).",
            "Calculated Student-to-Faculty Ratio (SFR) = 360 / 24 = 15.0:1 (satisfies ≤ 20:1 norm)."
        ]
    )

    # 3. Land & Infrastructure Deed
    create_pdf(
        CASE_A_DIR / "Land_Deed_and_Floor_Plan_Annexure_3.pdf",
        title="Registered Land Title Deed & Building Carpet Area Certificate",
        subtitle="Institution: Apex Institute of Technology & Engineering",
        fields={
            "Institution": case_a_data["institution_name"],
            "Application Reference": case_a_data["application_reference"],
            "Carpet Area Sqm": 3200.0,
            "Document Date": "2025-11-20",
            "Validity Date": "2035-11-20"
        },
        doc_id="DOC-APEX-LAND-01",
        aicte_clause="Annexure 3.1 & 3.2 (Land & Built-up Area Norms)",
        notes=[
            "Campus land area: 2.50 contiguous acres with unencumbered freehold ownership.",
            "Total instructional carpet area: 3,200 sq.m (exceeds NBCC desirable 1.1 sq.m/student)."
        ]
    )

    # 4. Municipal Fire Safety NOC
    create_pdf(
        CASE_A_DIR / "Fire_Safety_NOC_Requirement_6_47.pdf",
        title="Competent Authority Fire & Life Safety Certificate",
        subtitle="Institution: Apex Institute of Technology & Engineering",
        fields={
            "Institution": case_a_data["institution_name"],
            "Application Reference": case_a_data["application_reference"],
            "Document Date": "2025-07-01",
            "Validity Date": "2027-06-30"
        },
        doc_id="DOC-APEX-FIRE-01",
        aicte_clause="Chapter VI, Essential Requirement 6.47 & NBC 2016",
        notes=[
            "Inspected and certified by Chief Fire Officer, Municipal Corporation.",
            "Valid till 30-June-2027 (Active and unexpired on evaluation baseline date)."
        ]
    )

    # =========================================================================
    # CASE B: DEFICIENT (Faculty shortage, expired fire NOC, missing deed)
    # =========================================================================
    case_b_data = {
        "institution_id": "INST-BHARAT-02",
        "institution_name": "Bharat College of Engineering & Technology",
        "application_reference": "AICTE/2026/BHARAT-0481",
        "programme": "Engineering and Technology",
        "proposed_intake": 480,
        "faculty_count": 18,
        "carpet_area_sqm": 2800.0,
        "land_acres": 1.5,
        "fire_noc_valid_till": "2025-12-31",
        "aicte_clauses": {
            "sfr": "AICTE APH 2024-27 Annexure 5.2 (UG SFR 1:20 requires >= 24 faculty for 480 intake)",
            "safety": "AICTE APH 2024-27 Clause 6.47 (Active Fire Safety Certificate mandatory)"
        }
    }
    with open(SOURCE_DATA_DIR / "case_b_deficient.json", "w") as f:
        json.dump(case_b_data, f, indent=2)

    # 1. Application Form (Over-claiming intake of 480 with only 18 faculty)
    create_pdf(
        CASE_B_DIR / "Application_Form_EoA_2026.pdf",
        title="AICTE Extension of Approval (EoA) Application Form",
        subtitle="Institution: Bharat College of Engineering & Technology",
        fields={
            "Institution": case_b_data["institution_name"],
            "Application Reference": case_b_data["application_reference"],
            "Programme": case_b_data["programme"],
            "Proposed Intake": case_b_data["proposed_intake"],
            "Faculty Count": case_b_data["faculty_count"],
            "Carpet Area Sqm": case_b_data["carpet_area_sqm"],
            "Document Date": "2026-01-20",
            "Validity Date": "2027-06-30"
        },
        doc_id="DOC-BHARAT-APP-01",
        aicte_clause="Chapter II, Clause 2.1",
        notes=[
            "Institution proposes an expansion of student intake to 480 seats.",
            "Self-reported faculty roster numbers 18 teachers."
        ]
    )

    # 2. Faculty Roster showing only 18 teachers (Deficit of 6)
    create_pdf(
        CASE_B_DIR / "Faculty_Roster_Annexure_5.pdf",
        title="Faculty Cadre Roster & Qualification Declaration",
        subtitle="Institution: Bharat College of Engineering & Technology",
        fields={
            "Institution": case_b_data["institution_name"],
            "Application Reference": case_b_data["application_reference"],
            "Programme": case_b_data["programme"],
            "Faculty Count": 18,
            "Proposed Intake": 480,
            "Document Date": "2026-01-18",
            "Validity Date": "2026-12-31"
        },
        doc_id="DOC-BHARAT-FAC-01",
        aicte_clause="Annexure 5.2 (UG Degree SFR 1:20)",
        notes=[
            "Total regular faculty available: 18 (SFR 480 / 18 = 26.7:1).",
            "Deficiency: AICTE norm requires 24 faculty members for 480 intake. Deficit of 6 faculty."
        ]
    )

    # 3. Expired Fire Safety Certificate (Expired 2025-12-31)
    create_pdf(
        CASE_B_DIR / "Fire_Safety_NOC_Expired.pdf",
        title="Competent Authority Fire & Life Safety Certificate (EXPIRED)",
        subtitle="Institution: Bharat College of Engineering & Technology",
        fields={
            "Institution": case_b_data["institution_name"],
            "Application Reference": case_b_data["application_reference"],
            "Document Date": "2024-01-01",
            "Validity Date": "2025-12-31"
        },
        doc_id="DOC-BHARAT-FIRE-01",
        aicte_clause="Chapter VI, Essential Requirement 6.47",
        notes=[
            "Statutory notice: Certificate expired on 31-December-2025.",
            "Evaluation baseline date is 15-March-2026. Clearance is past validity date."
        ]
    )
    # Note: Land Registration Certificate is intentionally omitted to test MISSING_DOCUMENT detection.

    # =========================================================================
    # CASE C: CONFLICTING (Intake mismatch & SHA-256 duplicate file)
    # =========================================================================
    case_c_data = {
        "institution_id": "INST-CHITKARA-03",
        "institution_name": "Chitkara Institute of Technology",
        "application_reference": "AICTE/2026/CHITKARA-0819",
        "programme": "Engineering and Technology",
        "application_intake": 480,
        "resolution_intake": 360,
        "faculty_count": 22,
        "carpet_area_sqm": 2900.0,
        "aicte_clauses": {
            "intake_consistency": "AICTE APH 2024-27 Chapter II (Application intake must match Governing Body resolution)",
            "duplicate": "AICTE APH 2024-27 Chapter VII Clause 7.4 (Duplicate/Tampered documentation check)"
        }
    }
    with open(SOURCE_DATA_DIR / "case_c_conflicting.json", "w") as f:
        json.dump(case_c_data, f, indent=2)

    # 1. Application Form claiming 480 seats
    create_pdf(
        CASE_C_DIR / "Application_Form_EoA_2026.pdf",
        title="AICTE Extension of Approval (EoA) Application Form",
        subtitle="Institution: Chitkara Institute of Technology",
        fields={
            "Institution": case_c_data["institution_name"],
            "Application Reference": case_c_data["application_reference"],
            "Programme": case_c_data["programme"],
            "Proposed Intake": 480,
            "Faculty Count": 22,
            "Carpet Area Sqm": 2900.0,
            "Document Date": "2026-01-25",
            "Validity Date": "2027-06-30"
        },
        doc_id="DOC-CHITKARA-APP-01",
        aicte_clause="Chapter II, Clause 2.1",
        notes=[
            "Application claims 480 approved student seats for academic year 2026-27."
        ]
    )

    # 2. Governing Body Resolution stating only 360 seats approved (CONTRADICTION)
    create_pdf(
        CASE_C_DIR / "Governing_Body_Resolution_360_Seats.pdf",
        title="Board of Governors Statutory Sanction Resolution",
        subtitle="Institution: Chitkara Institute of Technology",
        fields={
            "Institution": case_c_data["institution_name"],
            "Application Reference": case_c_data["application_reference"],
            "Programme": case_c_data["programme"],
            "Proposed Intake": 360,
            "Faculty Count": 22,
            "Document Date": "2025-12-10",
            "Validity Date": "2027-06-30"
        },
        doc_id="DOC-CHITKARA-RES-01",
        aicte_clause="Chapter II & Annexure 2 (Governing Body Sanction)",
        notes=[
            "Resolution No. BOG/2025/12 explicitly approves a maximum student intake of 360 seats.",
            "Direct contradiction with self-reported portal claim of 480 seats."
        ]
    )

    # 3. Uploaded Fire NOC
    fire_noc_path = CASE_C_DIR / "Fire_Safety_NOC.pdf"
    create_pdf(
        fire_noc_path,
        title="Competent Authority Fire & Life Safety Certificate",
        subtitle="Institution: Chitkara Institute of Technology",
        fields={
            "Institution": case_c_data["institution_name"],
            "Application Reference": case_c_data["application_reference"],
            "Document Date": "2025-06-01",
            "Validity Date": "2027-06-30"
        },
        doc_id="DOC-CHITKARA-FIRE-01",
        aicte_clause="Chapter VI, Essential Requirement 6.47",
        notes=[
            "Valid Fire Safety Clearance from Local Fire Department."
        ]
    )

    # 4. Duplicate upload of Fire NOC under Land Certificate filename (Testing byte-identical SHA-256 detection)
    duplicate_noc_path = CASE_C_DIR / "Land_Registration_Deed_Duplicate.pdf"
    with open(fire_noc_path, "rb") as src, open(duplicate_noc_path, "wb") as dst:
        dst.write(src.read())

    # =========================================================================
    # CAMPUS RECONCILIATION: Vidya Vihar Knowledge Campus
    # =========================================================================
    campus_data = {
        "campus_id": "CAMPUS-VV-01",
        "campus_name": "Vidya Vihar Integrated Knowledge Campus",
        "location": "Plot 14-B, Sector 62, Greater Noida, UP - 201309",
        "total_land_acres": 14.5,
        "total_built_up_sqm": 12500.0,
        "institutions": [
            {
                "id": "INST-CHITKARA-03",
                "name": "Chitkara Institute of Technology",
                "programme": "Engineering and Technology",
                "claims": {
                    "shared_faculty": "Dr. Rajesh Sharma (Professor, Computer Science)",
                    "exclusive_building": "Building Block A (1,800 sq.m)"
                }
            },
            {
                "id": "INST-VIDYA-PHARM",
                "name": "Vidya College of Pharmacy",
                "programme": "Pharmacy",
                "claims": {
                    "shared_faculty": "Dr. Rajesh Sharma (Professor, Biostatistics)",
                    "exclusive_building": "Building Block B (1,500 sq.m)"
                }
            },
            {
                "id": "INST-VIDYA-MGMT",
                "name": "Vidya Institute of Management",
                "programme": "Management",
                "claims": {
                    "shared_faculty": "None",
                    "exclusive_building": "Building Block A (1,800 sq.m)"
                }
            }
        ],
        "aicte_rule": "AICTE APH 2024-27 Annexure 3 Note i: Shared campus institutions cannot double-claim faculty or essential instructional classrooms without legal partition."
    }
    with open(SOURCE_DATA_DIR / "campus_vidya_vihar.json", "w") as f:
        json.dump(campus_data, f, indent=2)

    # Supporting documents for Vidya Vihar Campus
    create_pdf(
        CAMPUS_DIR / "Chitkara_Engineering_Faculty_Sharma.pdf",
        title="Faculty Appointment Letter & Undertaking",
        subtitle="Institution: Chitkara Institute of Technology (Engineering)",
        fields={
            "Institution": "Chitkara Institute of Technology",
            "Faculty Name": "Dr. Rajesh Sharma",
            "Designation": "Professor & Head of Department",
            "Employment Type": "100% Full-Time Regular",
            "Document Date": "2024-07-01",
            "Validity Date": "2027-06-30"
        },
        doc_id="DOC-VV-CHITKARA-SHARMA",
        aicte_clause="Annexure 5.2 (Faculty Regular Appointment)",
        notes=[
            "Appointed as 100% full-time regular Professor in Department of Computer Science & Engineering.",
            "Requires exclusive dedication of 40 working hours per week."
        ]
    )

    create_pdf(
        CAMPUS_DIR / "Vidya_Pharmacy_Faculty_Sharma.pdf",
        title="Faculty Appointment Letter & Undertaking",
        subtitle="Institution: Vidya College of Pharmacy",
        fields={
            "Institution": "Vidya College of Pharmacy",
            "Faculty Name": "Dr. Rajesh Sharma",
            "Designation": "Professor of Pharmaceutical Statistics",
            "Employment Type": "100% Full-Time Regular",
            "Document Date": "2024-08-15",
            "Validity Date": "2027-06-30"
        },
        doc_id="DOC-VV-PHARM-SHARMA",
        aicte_clause="Annexure 5.2 (Cross-Institution Appointment Check)",
        notes=[
            "Appointed as 100% full-time regular Professor in Vidya College of Pharmacy.",
            "Conflict: A single faculty member cannot hold two simultaneous full-time regular posts."
        ]
    )

    create_pdf(
        CAMPUS_DIR / "Building_Block_A_Partition_Dispute.pdf",
        title="Campus Infrastructure & Facility Allocation Deed",
        subtitle="Campus: Vidya Vihar Integrated Knowledge Campus",
        fields={
            "Campus": "Vidya Vihar Integrated Knowledge Campus",
            "Facility Block": "Building Block A",
            "Carpet Area Sqm": 1800.0,
            "Claimant 1": "Chitkara Institute of Technology (Engineering Labs)",
            "Claimant 2": "Vidya Institute of Management (Classrooms)",
            "Document Date": "2025-05-10",
            "Validity Date": "2030-05-10"
        },
        doc_id="DOC-VV-BLOCK-A-ALLOCATION",
        aicte_clause="Annexure 3 Note i (Shared Campus Facilities Mutual Exclusivity)",
        notes=[
            "Building Block A (1,800 sq.m) is claimed exclusively by both Engineering and Management colleges.",
            "Requires physical or legal demarcation as mandated by AICTE Handbook Annexure 3."
        ]
    )

    # =========================================================================
    # GENERATE MANIFESTS WITH EXPECTED FINDINGS & SHA-256 DIGESTS
    # =========================================================================
    for name, directory, case_dict, expected in [
        ("case_a", CASE_A_DIR, case_a_data, []),
        ("case_b", CASE_B_DIR, case_b_data, [
            {
                "rule_id": "RULE-SFR-01",
                "severity": "HIGH",
                "summary": "Faculty Count Deficit for Proposed Intake",
                "details": "Proposed intake of 480 requires minimum 24 faculty (SFR 1:20). Only 18 faculty available. Deficit of 6.",
                "clause": "AICTE APH 2024-27 Annexure 5.2"
            },
            {
                "rule_id": "RULE-FIRE-NOC-01",
                "severity": "HIGH",
                "summary": "Expired Fire & Life Safety Certificate",
                "details": "Fire Safety Certificate expired on 2025-12-31 relative to 2026-03-15 evaluation baseline date.",
                "clause": "AICTE APH 2024-27 Chapter VI Requirement 6.47"
            },
            {
                "rule_id": "RULE-LAND-CERT-01",
                "severity": "HIGH",
                "summary": "Mandatory Land Ownership Deed Missing",
                "details": "Land Title Deed / Ownership Certificate was not submitted with application.",
                "clause": "AICTE APH 2024-27 Annexure 3.1"
            }
        ]),
        ("case_c", CASE_C_DIR, case_c_data, [
            {
                "rule_id": "RULE-INTAKE-CONSISTENCY",
                "severity": "HIGH",
                "summary": "Application Intake Exceeds Sanctioned Resolution",
                "details": "Application Form claims 480 seats, but Governing Body Resolution explicitly approved 360 seats.",
                "clause": "AICTE APH 2024-27 Chapter II"
            },
            {
                "rule_id": "RULE-DUPLICATE-FILE",
                "severity": "MEDIUM",
                "summary": "Duplicate Document File Upload Detected",
                "details": "Land_Registration_Deed_Duplicate.pdf is byte-identical (SHA-256 match) to Fire_Safety_NOC.pdf.",
                "clause": "AICTE APH 2024-27 Chapter VII Clause 7.4"
            }
        ])
    ]:
        docs_meta = []
        for pdf in sorted(directory.glob("*.pdf")):
            docs_meta.append({
                "filename": pdf.name,
                "filesize_bytes": pdf.stat().st_size,
                "sha256": calculate_file_hash(pdf),
                "path": str(pdf.relative_to(ROOT_DIR))
            })

        manifest = {
            "scenario": name,
            "generated_at": DEMO_EVALUATION_DATE,
            "handbook_edition": "AICTE Approval Process Handbook (APH 2024-25 to 2026-27)",
            "watermark": WATERMARK_TEXT,
            "institution": case_dict.get("institution_name"),
            "documents": docs_meta,
            "expected_findings": expected
        }
        with open(MANIFESTS_DIR / f"manifest_{name}.json", "w") as f:
            json.dump(manifest, f, indent=2)

    # Campus Manifest
    campus_docs = []
    for pdf in sorted(CAMPUS_DIR.glob("*.pdf")):
        campus_docs.append({
            "filename": pdf.name,
            "filesize_bytes": pdf.stat().st_size,
            "sha256": calculate_file_hash(pdf),
            "path": str(pdf.relative_to(ROOT_DIR))
        })

    campus_manifest = {
        "scenario": "campus_reconciliation",
        "campus_id": "CAMPUS-VV-01",
        "campus_name": "Vidya Vihar Integrated Knowledge Campus",
        "handbook_edition": "AICTE Approval Process Handbook (APH 2024-25 to 2026-27)",
        "documents": campus_docs,
        "expected_conflicts": [
            {
                "type": "FACULTY_DOUBLE_COUNT",
                "person": "Dr. Rajesh Sharma",
                "conflict": "Claimed 100% full-time regular by Chitkara Engineering AND Vidya Pharmacy",
                "clause": "AICTE APH 2024-27 Annexure 5.2"
            },
            {
                "type": "FACILITY_OVER_ALLOCATION",
                "facility": "Building Block A (1,800 sq.m)",
                "conflict": "Claimed exclusively by Chitkara Engineering AND Vidya Management without registered partition",
                "clause": "AICTE APH 2024-27 Annexure 3 Note i"
            }
        ]
    }
    with open(MANIFESTS_DIR / "manifest_campus.json", "w") as f:
        json.dump(campus_manifest, f, indent=2)

    print("All synthetic demo applications, handbook PDFs, source JSONs, and manifests generated successfully!")

if __name__ == "__main__":
    build_all_scenarios()
