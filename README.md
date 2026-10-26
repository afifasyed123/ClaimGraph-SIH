# ClaimGraph·AICTE

> **AICTE Application Scrutiny, Document Authentication & Regulatory Compliance Intelligence Platform**  
> *SYNTHETIC DEMO DATA — NOT A REAL INSTITUTION. All verification is simulated. Demonstration rules are illustrative and based on the AICTE Approval Process Handbook (APH 2024–27).*

---

## 🏛️ Executive Summary

The annual statutory scrutiny of Extension of Approval (EoA) applications is a mission-critical, labor-intensive process for the All India Council for Technical Education (AICTE). Scrutiny officers repeatedly examine hundreds of pages of institutional submissions, regulatory affidavits, municipal fire safety NOCs, registered land title deeds, and faculty rosters. High-severity discrepancies—such as expired statutory clearances, approved seat quota contradictions, inflated faculty cadres, and duplicate binary document uploads—are frequently discovered late in the cycle and remain arduous to cross-correlate manually.

Furthermore, when multiple technical institutions (e.g. Engineering, Pharmacy, and Management) operate on a **shared integrated campus**, critical cross-institutional contradictions routinely escape single-application review—such as the same senior faculty member claimed full-time at multiple colleges, or the same central auditorium/block claimed 100% exclusively by multiple institutions.

**ClaimGraph·AICTE** establishes an evidence-linked compliance intelligence platform for government scrutiny officers. It combines deterministic single-application scrutiny with **campus-level cross-institution reconciliation**, a **working document upload and text/evidence extraction pipeline**, and formal **mathematical constraint solving**.

> **Important Regulatory Principle:**  
> ClaimGraph·AICTE does **not** autonomously approve or reject applications, nor does it compute arbitrary black-box fraud scores. It generates fully explainable, evidence-backed findings to empower authorized human scrutiny officers. In strict compliance with regulatory governance principles, **no autonomous approve or reject action exists anywhere in the platform**.

---

## 🌟 Core Innovations & Architecture

```
[ Institutional Claims ] ──► [ Supporting Evidence PDFs ] ──► [ YAML Rule Engine ] ──► [ Mathematical Prover ] ──► [ Explainable Finding ] ──► [ Reviewer Action ]
       │                                                                                      │
       ▼                                                                                      ▼
[ Multi-College Campus ] ──► [ Cross-Institution Claims ] ─────────────────────────────────► [ Unsat Core ] ──► [ Deficiency Notice & Audit Chain ]
```

### 1. Task-Oriented Scrutiny Register & Executive Portal
- **Executive Portal Entry**: Clear statutory orientation detailing the three core capabilities, with 1-click demo case shortcuts (Cases A, B, and C) and seamless role selection (Reviewer vs Senior Officer).
- **Task-Oriented Dashboard**: Replaces decorative charts with actionable queues: Registered Applications, Action-Required Cases, Shared Campus Alerts, and Pre-Generated Deficiency Notices.
- **Spacious Floating Queue Table**: Streamlined 5-column layout with live real-time search, category filters, and floating card rows that eliminate visual clutter.

### 2. Document Upload & Evidence Extraction Pipeline
- **Multi-File Upload & Drag-and-Drop**: Scrutiny officers can upload multiple PDF documents using an integrated file picker or drag-and-drop.
- **Client & Server Format Limits**: Enforces strictly PDF format and a 15 MB file size limit with clear error messages.
- **Genuine SHA-256 Byte Hashes**: Computes cryptographic SHA-256 digests from file bytes to detect exact duplicate documents across applications.
- **Text & Field Extraction**: Employs `pypdf` to extract text per page, locate target regulatory fields, and link snippets with page numbers directly to findings.
- **Document Management**: Attached evidence documents can be inspected, previewed, and removed with automated rule re-evaluation and audit trail logging.

### 3. Application Scrutiny Workspace with Consequential Confirmation
Organized into three predictable administrative sections:
1. **Application Checklist & Findings**: Clear status badges (*"Verified Compliant"*, *"Missing document"*, *"Information mismatch"*, *"Requires verification"*). Explains what was reported, what the verified proof shows, the applicable handbook rule, and why the discrepancy matters.
2. **Document Viewer & Evidence Packets**: PDF packets displaying cryptographic SHA-256 digests, page indicators, and a 1-click preview modal with text provenance.
3. **Reviewer Actions & Explicit Confirmation**: Authorized officers record regulatory decisions (*Request Evidence/Clarification*, *Refer for Physical Inspection*, *Record Reasoned Dismissal*, *Accept for Scrutiny*). An **Explicit Confirmation Modal** presents the decision summary and officer justification before permanently hashing the action into the ledger.

### 4. Cross-Institution Campus Reconciliation
Cross-analyzes claims across multiple institutions sharing an integrated campus parcel:
- **Campus → Institution → Facility → Area → Programme → Intake → Faculty → Evidence → Rule → Finding**
- Detects **Faculty Double-Counting**: Identifies individuals claimed as 100% full-time regular faculty across multiple institutions.
- Detects **Facility Over-Allocation**: Flags physical rooms/blocks claimed exclusively by multiple colleges exceeding total physical square footage (AICTE APH Annexure 3 Note i).
- Plain-language explanation with an optional expandable accordion for technical mathematical proofs.

### 5. Formal SMT Constraint Prover & Reconciliation Model
A mathematical constraint-solving layer using Python `z3-solver`:
- Formulates statutory constraints into SMT logic: mutual exclusivity of full-time appointments ($\sum \text{FTE} \le 1.0$), non-overlapping carpet areas ($\sum \text{Area} \le \text{Total}$), and Student-to-Faculty Ratios ($\text{Intake} \le \text{Faculty} \times \text{Norm}$).
- Returns mathematically proven verdicts: `SATISFIED` or `CONTRADICTION_DETECTED (UNSAT)`.
- Isolates minimal unsatisfiable cores to pinpoint the exact conflicting assertions.
- Calculates **statutory student intake capacity and headroom** given verified faculty cadres.

### 6. Change-Impact Simulator
Reviewers can test hypothetical parameter changes in a sandboxed memory state:
- **Campus Level**: Simulate allocating a shared professor exclusively to one institution, or re-partitioning a shared facility (e.g. 600m² / 600m²). Re-evaluates mathematical constraints and proves whether contradictions resolve.
- **Application Level**: Adjust proposed intake (e.g. 480 to 360) and re-evaluate dependent rules.
- **Before / After Diff**: Categorizes findings into **Newly Flagged**, **Resolved**, and **Unchanged**.
- **Safety Guarantee**: Sandbox executions do not mutate or overwrite stored database records.

### 7. Cryptographic Hash-Chained Audit Trail
- Each human reviewer action cryptographically links `prev_hash` to `current_hash` via SHA-256 block digests.
- Provides a one-click **"Verify Chain Integrity"** endpoint that traverses the chain from the genesis block and mathematically proves tamper evidence.

### 8. Deficiency Notice Generator & Authenticity Verification
- Generates formal, itemized Deficiency Notices directly from verified findings.
- Signs notices with cryptographic SHA-256 digests.
- Includes print-friendly styles (`@media print`) and verification endpoints (`/api/reports/verify/{id}`) for statutory authenticity checking.

---

## 📁 Synthetic Demonstration Applications (`synthetic_demo_applications/`)

All synthetic applications are generated using ReportLab based on the AICTE Approval Process Handbook (APH 2024–27):

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
│   ├── Faculty_Roster_Annexure_5.pdf           # 24 faculty for 300 intake (SFR 1:12.5)
│   ├── Fire_Safety_NOC_Requirement_6_47.pdf    # Valid through 2028
│   └── Land_Deed_and_Floor_Plan_Annexure_3.pdf # 2.5 acres, 3,200 sq.m verified
├── case_B_deficient/                           # Deficient case (3 PDFs, 3 findings)
│   ├── Application_Form_EoA_2026.pdf
│   ├── Faculty_Roster_Annexure_5.pdf           # 18 faculty vs 24 required (-6 shortfall)
│   └── Fire_Safety_NOC_Expired.pdf             # Expired March 2025 vs Oct 2026 scrutiny
├── case_C_conflicting/                         # Conflicting case (4 PDFs, 2 findings)
│   ├── Application_Form_EoA_2026.pdf           # Claims 480 intake
│   ├── Governing_Body_Resolution_360_Seats.pdf # Resolves only 360 intake maximum
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

## 📸 Presentation Assets & Storyboard (`presentation_assets/`)

Detailed guides for presentation screenshots and demonstration videos:
- [01_officer_dashboard_and_queue.md](file:///c:/Users/Mrunmayee%20Potdar/Desktop/ClaimGraph/ClaimGraph-SIH/presentation_assets/01_officer_dashboard_and_queue.md): Viewport setup, visual framing, and talking points for the task-oriented dashboard and scrutiny register.
- [02_evidence_conflict_investigation.md](file:///c:/Users/Mrunmayee%20Potdar/Desktop/ClaimGraph/ClaimGraph-SIH/presentation_assets/02_evidence_conflict_investigation.md): Setup and talking points for the multi-document discrepancy investigation screen (480 vs 360 seat discrepancy and binary duplicate file).
- [03_reviewer_decision_and_audit_trail.md](file:///c:/Users/Mrunmayee%20Potdar/Desktop/ClaimGraph/ClaimGraph-SIH/presentation_assets/03_reviewer_decision_and_audit_trail.md): Setup and talking points for the consequential confirmation modal and SHA-256 cryptographic audit chain.
- [DEMO_VIDEO_STORYBOARD.md](file:///c:/Users/Mrunmayee%20Potdar/Desktop/ClaimGraph/ClaimGraph-SIH/presentation_assets/DEMO_VIDEO_STORYBOARD.md): Complete 105-second, 6-scene demonstration video script with exact timings (0:00 to 1:45), on-screen actions, and voiceover narration.

---

## 🎨 Design System: Accessible Enterprise Claymorphism

Designed specifically for regulatory scrutiny officers:
- **Full-Width Responsive Canvas**: Expansive layout with max-width `1680px`, eliminating lateral empty gaps.
- **Floating Row Card Queue**: Configured with `border-collapse: separate` and `border-spacing: 0 0.75rem` so each application sits in its own elevated white card pill.
- **Tactile Clay Surfaces**: Warm light canvas (`#eaf0f8`), soft raised convex cards, and subtle inner edge lighting.
- **Statutory Accent Line**: Sleek top horizontal tricolor accent line on the sticky navbar anchoring regulatory authority.
- **Accessible Micro-Interactions**: Smooth card entrance animation, tactile hover elevation (`hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]`), and responsive button scaling.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Enterprise Claymorphism Design System.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, SQLite3, PyYAML, Pydantic v2.
- **Formal Verification**: Python Z3 SMT Theorem Prover (`z3-solver` v5.3+).
- **PDF Extraction & Generation**: PyPDF (text & page extraction), ReportLab 5.0 (synthetic PDF generator), SHA-256 cryptographic digests.
- **Automated Test Suite**: Pytest (23 automated unit & integration tests), FastAPI TestClient.

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

# Run full automated test suite (23 tests passing)
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

## 📋 REST API Endpoints

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/meta` | System metadata, framework details, and synthetic disclaimers |
| `GET` | `/api/cases` | List reproducible synthetic demo cases (`case_a`, `case_b`, `case_c`) |
| `GET` | `/api/sample-packs` | Retrieve demo document packs for 1-click test uploads |
| `GET` | `/api/applications/{id}` | Application details, checklist completeness, attached documents, and findings count |
| `POST` | `/api/applications/{id}/validate` | Execute deterministic rules engine across claims & evidence |
| `GET` | `/api/applications/{id}/findings` | Retrieve explainable findings for scrutiny review |
| `POST` | `/api/applications/{id}/upload-batch` | **Mandatory Upload**: Upload multiple PDFs (<15MB), compute SHA-256 hashes, extract per-page text, and auto-evaluate rules |
| `POST` | `/api/applications/create-and-upload` | Create new custom institution application and upload documents in one integrated flow |
| `DELETE` | `/api/documents/{doc_id}` | Remove attached document, clean extracted fields, record audit block, and re-evaluate rules |
| `GET` | `/api/documents/{doc_id}/preview` | Retrieve extracted text, pages, SHA-256 digest, and metadata for document inspector |
| `POST` | `/api/findings/{id}/actions` | Record reviewer action in hash-chained audit trail (Approve/Reject strictly blocked) |
| `GET` | `/api/campuses` | List integrated campuses and co-located colleges |
| `GET` | `/api/campuses/{id}/reconcile` | **Flagship**: Cross-institution reconciliation with Z3 SMT solver and legal partition model |
| `POST` | `/api/campuses/{id}/simulate` | Campus-level Change-Impact Simulator (reallocate faculty, re-partition facilities) |
| `POST` | `/api/applications/{id}/simulate` | Single-application parameter shift simulator (intake / faculty) |
| `GET` | `/api/inspection-priority` | Transparent multi-factor inspection ranking for campuses and colleges |
| `GET` | `/api/notices` | List generated and pre-seeded deficiency notices |
| `POST` | `/api/notices/generate` | Generate formal deficiency notice with SHA-256 digest |
| `GET` | `/api/notices/{id}` | Retrieve deficiency notice details for printable view |
| `GET` | `/api/audit/chain` | Retrieve cryptographically linked SHA-256 audit chain blocks |
| `POST` | `/api/audit/verify` | Verify cryptographic hash-chain integrity from genesis block |
| `GET` | `/api/reports/verify/{report_id}` | Public verification endpoint for QR code report lookup |
| `GET` | `/api/rules` | Configurable rule registry with provenance, version, and active toggle |
| `POST` | `/api/rules/{id}/toggle` | Toggle rule active status or modify threshold |
| `GET` | `/api/applications/{id}/verification` | Simulated external issuer verification panel (clearly marked simulated) |
| `GET` | `/api/stats/metrics` | Measured automated testing and verification metrics |
