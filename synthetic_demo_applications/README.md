# Synthetic AICTE Demo Applications & Document Registry

> **MANDATORY STATUTORY NOTICE:**  
> **SYNTHETIC DEMO DOCUMENT — NOT AN OFFICIAL AICTE DOCUMENT**  
> All applicant institutions, faculty names, registration numbers, property survey numbers, and municipal certificates in this dataset are entirely fictional. No real applicant or institutional personal data has been used. Demonstration rules and evaluation metrics are configured solely for system verification, constraint-solving testing, and the ClaimGraph prototype demonstration.

---

## 📁 Directory Structure & Contents

```
synthetic_demo_applications/
├── README.md                      # Documentation, scenario guides, handbook citations
├── generate_documents.py          # Reproducible Python generator script
├── source_data/                   # Ground-truth structured JSON declarations
│   ├── case_a_consistent.json
│   ├── case_b_deficient.json
│   ├── case_c_conflicting.json
│   └── campus_vidya_vihar.json
├── manifests/                     # Manifests with SHA-256 digests & expected findings
│   ├── manifest_case_a.json
│   ├── manifest_case_b.json
│   ├── manifest_case_c.json
│   └── manifest_campus.json
├── case_A_consistent/             # Case A PDFs (100% compliant, 0 discrepancies)
│   ├── Application_Form_EoA_2026.pdf
│   ├── Faculty_Roster_Annexure_5.pdf
│   ├── Land_Deed_and_Floor_Plan_Annexure_3.pdf
│   └── Fire_Safety_NOC_Requirement_6_47.pdf
├── case_B_deficient/              # Case B PDFs (Faculty shortage, expired NOC, missing deed)
│   ├── Application_Form_EoA_2026.pdf
│   ├── Faculty_Roster_Annexure_5.pdf
│   └── Fire_Safety_NOC_Expired.pdf
├── case_C_conflicting/            # Case C PDFs (Intake mismatch & byte-identical duplicate file)
│   ├── Application_Form_EoA_2026.pdf
│   ├── Governing_Body_Resolution_360_Seats.pdf
│   ├── Fire_Safety_NOC.pdf
│   └── Land_Registration_Deed_Duplicate.pdf
└── campus_reconciliation/        # Vidya Vihar Campus multi-college overlap records
    ├── Chitkara_Engineering_Faculty_Sharma.pdf
    ├── Vidya_Pharmacy_Faculty_Sharma.pdf
    └── Building_Block_A_Partition_Dispute.pdf
```

---

## 🏛️ AICTE Handbook Citations & Statutory Scenarios

The synthetic documents are grounded in the **AICTE Approval Process Handbook (APH 2024-25 to 2026-27)**:

### 1. Case A — Consistent Baseline (Clean Approval)
- **Institution**: Apex Institute of Technology & Engineering (`INST-APEX-01`)
- **Application Reference**: `AICTE/2026/APEX-0192`
- **Applicable Norms**:
  - **Faculty Ratio (Annexure 5.2)**: 360 Approved Intake / 24 Regular Faculty = 15.0:1 (satisfies AICTE Under Graduate Engineering norm $\le 20:1$).
  - **Land & Space (Annexure 3.1 & 3.2)**: 2.50 contiguous acres; 3,200 sq.m instructional area (satisfies NBCC desirable $1.1 \text{ m}^2 / \text{student}$).
  - **Fire Safety (Chapter VI, Essential Requirement 6.47)**: Active Municipal Fire Certificate valid till 30-June-2027.
- **Expected Outcome**: Clean evaluation. **0 Findings.**

---

### 2. Case B — Deficient Scenario (Statutory Gaps & Shortages)
- **Institution**: Bharat College of Engineering & Technology (`INST-BHARAT-02`)
- **Application Reference**: `AICTE/2026/BHARAT-0481`
- **Seeded Gaps**:
  - **Faculty Shortage (Annexure 5.2)**: Proposes 480 intake with only 18 faculty ($\text{SFR} = 480 / 18 = 26.7:1$). AICTE norm requires minimum 24 teachers ($\text{Deficit} = 6$).
  - **Expired Fire Safety NOC (Requirement 6.47)**: Certificate expired on 31-December-2025 relative to the 15-March-2026 evaluation baseline date.
  - **Missing Land Deed (Annexure 3.1)**: Land Title Certificate omitted from uploaded packet.
- **Expected Outcome**: **3 High-Severity Findings** (`RULE-SFR-01`, `RULE-FIRE-NOC-01`, `RULE-LAND-CERT-01`).

---

### 3. Case C — Conflicting Scenario (Cross-Document Contradiction & Duplicates)
- **Institution**: Chitkara Institute of Technology (`INST-CHITKARA-03`)
- **Application Reference**: `AICTE/2026/CHITKARA-0819`
- **Seeded Contradictions**:
  - **Intake Contradiction (Chapter II & Annexure 2)**: Application Form claims 480 seats, but Governing Body Resolution explicitly sanctions only 360 seats.
  - **SHA-256 Byte Duplicate (Chapter VII, Clause 7.4)**: `Land_Registration_Deed_Duplicate.pdf` is an exact byte-for-byte duplicate of `Fire_Safety_NOC.pdf` (computed via genuine SHA-256 cryptographic hashing).
- **Expected Outcome**: **2 Findings** (`RULE-INTAKE-CONSISTENCY`, `RULE-DUPLICATE-FILE`).

---

### 4. Campus Reconciliation — Vidya Vihar Integrated Knowledge Campus
- **Campus Identifier**: `CAMPUS-VV-01` (Plot 14-B, Sector 62, Greater Noida, UP)
- **Hosted Institutions**:
  1. *Chitkara Institute of Technology* (Engineering, 360 Intake)
  2. *Vidya College of Pharmacy* (Pharmacy, 120 Intake)
  3. *Vidya Institute of Management* (Management, 180 Intake)
- **Applicable Handbook Rule**:
  - **Annexure 3 Note i (Shared Campus Facilities Mutual Exclusivity)**: Multi-institution integrated campuses cannot double-count faculty or share essential instructional classrooms/laboratories without registered partitions and separate entrances.
- **Seeded Contradictions**:
  1. **Faculty Double-Count**: Dr. Rajesh Sharma claimed 100% full-time regular by both Engineering and Pharmacy colleges.
  2. **Facility Over-Allocation**: Building Block A (1,800 sq.m) claimed exclusively by both Engineering and Management colleges.
- **Resolution**: Solved formally via Python `z3-solver` constraint engine into mutually exclusive allocations.

---

## 🔄 Regeneration Instructions

To regenerate all PDF documents, manifests, and source JSON files from scratch:

```bash
# Ensure reportlab is available
python -m pip install reportlab

# Execute reproducible generator
python synthetic_demo_applications/generate_documents.py
```
