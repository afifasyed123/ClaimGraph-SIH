# ClaimGraph·AICTE

> **AICTE Application Validation, Document Authentication & Regulatory Scrutiny Intelligence Platform**  
> *SYNTHETIC DEMO DATA — NOT A REAL INSTITUTION. All verification is simulated. Demonstration rules are not official AICTE requirements.*

---

## 🏛️ Executive Summary

The annual AICTE scrutiny of Extension of Approval (EoA) applications is a high-stakes, labor-intensive process. Scrutiny officers repeatedly cross-examine thousands of pages of institutional records, regulatory affidavits, municipal safety NOCs, land ownership deeds, and faculty rosters. Critical discrepancies—such as expired approvals, mismatched quotas, inflated faculty numbers, and duplicate document uploads—are frequently uncovered late in the cycle and remain hard to trace.

Furthermore, when multiple colleges (e.g. Engineering, Pharmacy, and Management) operate on a **shared integrated campus**, critical cross-institutional contradictions frequently escape single-document inspection—such as the same senior faculty member claimed full-time at multiple colleges, or the same central auditorium/block claimed 100% exclusively by multiple institutions.

**ClaimGraph·AICTE** establishes an evidence-linked compliance intelligence platform. It combines deterministic single-application scrutiny with **campus-level cross-institution reconciliation**, a **working document upload and text/evidence extraction pipeline**, and formal **Python Z3 SMT constraint solving**.

> **Important Regulatory Principle:**  
> ClaimGraph·AICTE does **not** autonomously approve or reject applications, nor does it compute arbitrary opaque credit scores. It generates fully explainable findings to empower authorized human scrutiny officers. In strict compliance with regulatory non-goals, **no autonomous approve or reject action exists anywhere in the product**.

---

## 🌟 Core Innovations & Architecture

```
[ Institutional Claims ] ──► [ Supporting Evidence PDFs ] ──► [ YAML Rule Engine ] ──► [ Z3 SMT Solver ] ──► [ Explainable Finding ] ──► [ Reviewer Action ]
       │                                                                │
       ▼                                                                ▼
[ Multi-College Campus ] ──► [ Cross-Institution Claims ] ──────────► [ Unsat Core ] ──► [ Deficiency Notice & Audit Chain ]
```

### 1. Document Upload & Evidence Extraction Pipeline (Phase 4 Integration)
- **Multi-File Upload & Drag-and-Drop**: Scrutiny officers can upload multiple PDF documents using a file picker or intuitive drag-and-drop.
- **Client & Server Size/Format Limits**: Enforces strictly PDF format and a 15 MB file size limit with clear error messages.
- **Genuine SHA-256 Byte Hashes**: Calculates real cryptographic SHA-256 digests from file bytes to detect exact duplicate documents across cases and applications.
- **Text & Field Extraction**: Employs `pypdf` to extract text per page, locate target regulatory fields, and link snippets with page numbers directly to findings.
- **Document Management**: Attached evidence documents can be inspected, previewed, and removed with automated rule re-evaluation and audit trail logging.

### 2. Campus-Level Reconciliation Graph
Cross-analyzes claims across multiple institutions sharing an integrated campus:
- **Campus → Institution → Facility → Area → Programme → Intake → Faculty → Evidence → Rule → Finding**
- Detects **Faculty Double-Counting**: Identifies individuals claimed as 100% full-time regular faculty across multiple institutions.
- Detects **Facility Over-Allocation**: Flags physical rooms/blocks claimed exclusively by multiple colleges exceeding total physical square footage (AICTE APH Annexure 3 Note i).
- Visual **Relationship Graph**: Renders entity traceability from campus nodes down to conflicting rules and evidence.

### 3. Formal Python Z3 SMT Constraint Prover
A genuine mathematical constraint-solving layer using Python `z3-solver`:
- Formulates statutory constraints into SMT logic: mutual exclusivity of full-time appointments ($\sum \text{FTE} \le 1.0$), non-overlapping carpet areas ($\sum \text{Area} \le \text{Total}$), and Student-to-Faculty Ratios ($\text{Intake} \le \text{Faculty} \times \text{Norm}$).
- Returns mathematically proven verdicts: `SATISFIED` or `CONTRADICTION_DETECTED (UNSAT)`.
- Computes **minimal unsatisfiable cores** (unsat cores) to isolate the exact conflicting assertions.
- Calculates **maximum permitted intake headroom** given available faculty.

### 4. Change-Impact Simulator
Reviewers can test hypothetical parameter changes in a sandboxed memory state:
- **Campus Level**: Simulate allocating a shared professor exclusively to one institution, or re-partitioning a shared facility (e.g. 600m² / 600m²). Re-runs Z3 SMT solver and proves whether contradictions resolve.
- **Application Level**: Adjust proposed intake (e.g. 480 to 360) and re-evaluate dependent rules.
- **Before / After Diff**: Categorizes findings into **Newly Flagged**, **Resolved**, and **Unchanged**.
- **Safety Guarantee**: Sandbox executions do not mutate or overwrite stored database records.

### 5. Cryptographic Hash-Chained Audit Trail
- Each human reviewer action cryptographically links `prev_hash` to `current_hash` via SHA-256 block digests.
- Provides a one-click **"Verify Chain Integrity"** endpoint that traverses the chain from the genesis block and mathematically proves tamper evidence.

### 6. Deficiency Notice Generator & QR Verification
- Generates formal, itemized Deficiency Notices directly from verified findings.
- Signs notices with cryptographic SHA-256 digests.
- Includes print-friendly styles (`@media print`) and working QR code verification endpoints (`/api/reports/verify/{id}`) for public authenticity checking.

### 7. Transparent Inspection Prioritization
- Ranks campuses and applications using explainable additive weights: Cross-College Faculty Collision (+45), Facility Deficit (+35), High Severity Finding (+25), Missing Document (+20).
- Provides recommended inspection focus areas without calculating black-box fraud scores.

---

## 📁 Synthetic Demo Applications (`synthetic_demo_applications/`)

All synthetic applications are generated using ReportLab based on the AICTE Approval Process Handbook (APH 2024-25 to 2026-27):

```
synthetic_demo_applications/
├── README.md                                    # Scenario descriptions and handbook mapping
├── generate_documents.py                       # Reproducible PDF generator script
├── source_data/                                 # JSON source-of-truth records
│   ├── case_a_consistent.json
│   ├── case_b_deficient.json
│   ├── case_c_conflicting.json
│   └── campus_vidya_vihar.json
├── case_A_consistent/                          # Consistent case (4 PDFs, 0 findings)
│   ├── Application_Form_EoA_2026.pdf
│   ├── Faculty_Roster_Annexure_5.pdf
│   ├── Fire_Safety_NOC_Requirement_6_47.pdf
│   └── Land_Deed_and_Floor_Plan_Annexure_3.pdf
├── case_B_deficient/                           # Deficient case (3 PDFs, 3 findings)
│   ├── Application_Form_EoA_2026.pdf
│   ├── Faculty_Roster_Annexure_5.pdf           # 18 faculty vs 24 required
│   └── Fire_Safety_NOC_Expired.pdf             # Expired March 2025 vs Oct 2026 scrutiny
├── case_C_conflicting/                         # Conflicting case (4 PDFs, 2 findings)
│   ├── Application_Form_EoA_2026.pdf           # Claims 480 intake
│   ├── Governing_Body_Resolution_360_Seats.pdf # Resolves only 360 intake
│   ├── Fire_Safety_NOC.pdf
│   └── Land_Registration_Deed_Duplicate.pdf    # Exact SHA-256 byte duplicate of Fire NOC
├── campus_reconciliation/                      # Multi-college campus (3 PDFs)
│   ├── Apex_Engineering_Affiliation.pdf
│   ├── Apex_Pharmacy_Faculty_Declaration.pdf   # Double-counting Dr. R. K. Sharma
│   └── Central_Facility_Partition_Deed.pdf     # Double-claiming Central Block A
├── manifests/                                  # Machine-readable evaluation manifests
│   ├── manifest_case_a.json
│   ├── manifest_case_b.json
│   ├── manifest_case_c.json
│   └── manifest_campus.json
└── tests/                                      # Automated test suite
    └── test_synthetic_documents.py
```

---

## 🎨 Design System: Accessible Enterprise Claymorphism

Designed specifically for regulatory scrutiny officers:
- **Full-Width Canvas**: Clean, expansive layout with max-width `1680px` and `width: 100%`, eliminating lateral empty gaps.
- **Tactile Clay Surfaces**: Warm light canvas (`#f0f4f8`), soft raised convex cards, subtle inner highlights (`inset 1px 1px 2px rgba(255,255,255,0.9)`), and diffuse dual outer shadows (`6px 10px 20px rgba(15,23,42,0.07), -4px -4px 12px rgba(255,255,255,0.95)`).
- **Streamlined Navigation Bar**: Single-row horizontal navigation bar with no vertical wrapping and clean action icons.
- **Rich Dashboard First Impression**: Features a circular 94.2% scrutiny compliance gauge, continuous wave analytics chart (`Last 7 days ▲ +22.1%`), and direct upload action.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Enterprise Claymorphism Design System.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, SQLite3, PyYAML, Pydantic v2.
- **Formal Verification**: Python Z3 SMT Theorem Prover (`z3-solver` v5.3+).
- **PDF Extraction & Generation**: PyPDF (text & page extraction), ReportLab 5.0 (synthetic PDF generator), SHA-256 cryptographic digests.
- **Automated Test Suite**: Pytest (22 automated unit & integration tests), FastAPI TestClient.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 1. Setup Backend
```powershell
# Navigate to repository root
cd ClaimGraph-SIH

# Install dependencies
python -m pip install -r backend/requirements.txt z3-solver reportlab pypdf

# Seed synthetic test cases and database
python -m backend.app.seed_data

# Run full automated test suite (22 tests passing)
python -m pytest backend/tests synthetic_demo_applications/tests -v

# Start FastAPI server (Runs on port 8000)
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

### 2. Setup Frontend
```powershell
cd frontend

# Install dependencies
npm install

# Build production bundle to verify correctness
npx vite build

# Start Vite dev server (Runs on port 5173 with proxy to backend)
npm run dev -- --host 127.0.0.1
```

Open your browser at **`http://localhost:5173`**.

---

## 📋 Complete REST API Endpoints

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/meta` | System metadata, demo date, and synthetic disclaimers |
| `GET` | `/api/cases` | List reproducible synthetic demo cases (`case_a`, `case_b`, `case_c`) |
| `GET` | `/api/applications/{id}` | Application details, checklist completeness, attached documents, and findings count |
| `POST` | `/api/applications/{id}/validate` | Execute deterministic rules engine across claims & evidence |
| `GET` | `/api/applications/{id}/findings` | Retrieve explainable findings for scrutiny review |
| `POST` | `/api/applications/{id}/upload-batch` | **Mandatory Upload**: Upload multiple PDFs (<15MB), SHA-256 hash, per-page text extract, auto rule run |
| `POST` | `/api/applications/create-and-upload` | Create new custom institution application and upload documents in one integrated flow |
| `DELETE` | `/api/documents/{doc_id}` | Remove attached document, clean extracted fields, record audit block, re-evaluate rules |
| `GET` | `/api/documents/{doc_id}/preview` | Retrieve extracted text, pages, SHA-256, and metadata for document inspector |
| `POST` | `/api/findings/{id}/actions` | Record reviewer action in hash-chained audit trail (Approve/Reject strictly blocked) |
| `GET` | `/api/campuses` | List integrated campuses and affiliated colleges |
| `GET` | `/api/campuses/{id}/reconcile` | **Flagship**: Cross-institution reconciliation with Z3 SMT solver and relationship graph |
| `POST` | `/api/campuses/{id}/simulate` | Campus-level Change-Impact Simulator (reallocate faculty, re-partition facilities) |
| `POST` | `/api/applications/{id}/simulate` | Single-application parameter shift simulator (intake / faculty) |
| `GET` | `/api/inspection-priority` | Transparent multi-factor inspection ranking for campuses and colleges |
| `GET` | `/api/notices` | List generated deficiency notices |
| `POST` | `/api/notices/generate` | Generate formal deficiency notice with SHA-256 digest |
| `GET` | `/api/notices/{id}` | Retrieve deficiency notice details for printable view |
| `GET` | `/api/audit/chain` | Retrieve cryptographically linked SHA-256 audit chain blocks |
| `POST` | `/api/audit/verify` | Verify cryptographic hash-chain integrity from genesis block |
| `GET` | `/api/reports/verify/{report_id}` | Public verification endpoint for QR code report lookup |
| `GET` | `/api/rules` | Configurable rule registry with provenance, version, and active toggle |
| `POST` | `/api/rules/{id}/toggle` | Toggle rule active status or modify threshold |
| `GET` | `/api/applications/{id}/verification` | Simulated external issuer verification panel (clearly marked simulated) |
| `GET` | `/api/stats/metrics` | Measured automated testing and verification metrics |
