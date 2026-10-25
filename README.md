# ClaimGraph-AICTE

> **SIH 2026, Problem Statement 5 (PS5): AI-Powered Application & Document Validation for AICTE**  
> *SYNTHETIC DEMO DATA. NOT A REAL INSTITUTION. All verification is simulated. Demonstration rules are not official AICTE requirements.*

---

## 🏛️ Executive Summary

The annual AICTE scrutiny of Extension of Approval (EoA) applications is a high-stakes, labor-intensive process. Scrutiny officers repeatedly cross-examine thousands of pages of institutional records, regulatory affidavits, municipal safety NOCs, land ownership deeds, and faculty rosters. Critical discrepancies—such as expired approvals, mismatched quotas, inflated faculty numbers, and duplicate document uploads—are frequently uncovered late in the cycle and remain hard to trace.

**ClaimGraph-AICTE** is an evidence-linked validation platform. It establishes a deterministic traceability chain connecting every institutional claim to its supporting documentary evidence, the regulatory rule applied, the explainable finding, and the authorized reviewer action. 

> **Important Regulatory Principle:**  
> ClaimGraph-AICTE does **not** autonomously approve or reject applications, nor does it compute arbitrary opaque credit scores. It generates fully explainable findings to empower authorized human scrutiny officers. In strict compliance with regulatory non-goals (**FR-F4**), no autonomous approve or reject action exists anywhere in the product.

---

## 🌟 Core Differentiators

```
[ Institutional Claim ] ──► [ Supporting Evidence PDF ] ──► [ YAML Rule Engine ] ──► [ Explainable Finding ] ──► [ Reviewer Action ]
```

### 1. Evidence Reconciliation Graph
An end-to-end deterministic knowledge graph that links:
- **Application Claim**: e.g., Proposed Intake: 480 seats.
- **Evidence Source**: Governing Council Resolution PDF, Page 1, Table 1.
- **Rule Applied**: `RULE-INTAKE-EVIDENCE-CROSSCHECK` (Demonstration Rule).
- **Explainable Finding**: Claimed proposed intake (480) conflicts with sanctioned quota (360) stated in official minutes.
- **Reviewer Action**: Recorded in an append-only audit trail with mandatory administrative reasoning.

### 2. Change-Impact Simulator (Signature Feature)
Allows reviewers to test hypothetical parameter changes in a sandboxed environment (e.g., simulating proposed intake shift from 360 to 480).
- Re-runs **only** the rules dependent on the mutated field (intake ratio, instructional carpet area).
- Generates an immediate Before/After comparison: **Newly Flagged**, **Resolved**, and **Unchanged** findings.
- **Safety Guarantee (FR-G6)**: Sandbox executions do not mutate or overwrite the stored institutional record.
- Label: *"Simulation of a proposed change. Not an AICTE decision."*

---

## 🎨 Design System: Bento Grid + Swiss Design + Glassmorphism

Built specifically for high-density regulatory review:
- **Swiss Design Hierarchy**: Clean sans-serif typography (`Plus Jakarta Sans`, `Space Grotesk`, `JetBrains Mono`), high-contrast numeric data tables, and structured geometric alignment.
- **Bento Grid Architecture**: Modular, asymmetric cards that prioritize institutional claims, compliance checklists, visual knowledge graphs, and audit timelines without clutter.
- **Subtle Glassmorphism**: Frosted glass surfaces (`backdrop-filter: blur(16px)`), luminous 1px borders, and refined status pills.
- **Persistent Synthetic Banner**: Complies with PRD requirements across every screen and PDF export.

---

## 🧪 Three Reproducible Synthetic Cases

The repository includes pre-generated synthetic datasets and downloadable text-based PDFs for three reproducible cases:

| Case | Institutional Profile | Configuration & Seeded Faults | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **Case A: Consistent** | *Apex Institute of Technology & Engineering* | All expected documents present; values match evidence and history (Intake 360, Faculty 24, Ratio 1:15). | **0 Seeded Discrepancies** on configured checks |
| **Case B: Incomplete** | *Blue Valley College of Engineering & Research* | One document omitted (Land & Building Certificate); one required field blank (Faculty Count); one expired document (Municipal Fire NOC expired 2025-12-15 against cutoff 2026-10-01). | **3 Seeded Findings**: 1 missing document, 1 incomplete field, 1 expired document |
| **Case C: Inconsistent** | *Crestview Technical University & Academy* | Application claims 480 intake but Resolution PDF states 360 (field mismatch); historical ratio deficit (480 intake with 20 faculty = 1:24 vs norm 1:15); identical PDF binary uploaded twice under distinct categories (SHA-256 duplicate collision). | **3 Seeded Findings**: Field conflict, ratio inconsistency, duplicate document indicator |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS Design System (Bento Grid, Glassmorphism).
- **Backend**: Python 3.10+, FastAPI, Uvicorn, SQLite3, PyYAML, Pydantic v2.
- **PDF Extraction & Integrity**: PyPDF (text & page extraction), ReportLab (synthetic PDF generator), SHA-256 hashing.
- **Test Suite**: Pytest, FastAPI TestClient.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ (Tested up to Python 3.14)
- Node.js v18+ & npm

### 1. Clone & Setup Workspace
```bash
git clone https://github.com/<your-username>/claimgraph-aicte.git
cd claimgraph-aicte
```

### 2. Backend Setup
```bash
# Create and activate Python virtual environment
python -m venv venv
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Seed synthetic cases and generate demonstration PDFs
python -m backend.app.seed_data

# Run automated test suite
pytest backend/tests -v

# Start FastAPI server (Runs on port 8000)
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server (Runs on port 5173 with proxy to backend)
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 📋 REST API Endpoints

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/meta` | System metadata, demo date, and synthetic disclaimers |
| `GET` | `/api/cases` | List the three reproducible synthetic demo cases |
| `POST` | `/api/applications` | Create application or fast-load demo cases (`case_a`, `case_b`, `case_c`) |
| `GET` | `/api/applications/{id}` | Application details, checklist status, and findings summary |
| `POST` | `/api/applications/{id}/documents` | Upload new PDF documents with text & hash extraction |
| `POST` | `/api/applications/{id}/validate` | Execute rules engine deterministically across claims & evidence |
| `GET` | `/api/applications/{id}/findings` | Retrieve explainable findings for scrutiny review |
| `GET` | `/api/findings/{id}` | Detailed finding with side-by-side values & evidence reference |
| `GET` | `/api/documents/{id}/preview` | Document preview stream, extracted metadata, and text per page |
| `POST` | `/api/findings/{id}/actions` | Record reviewer action in audit trail (Approve/Reject strictly blocked) |
| `GET` | `/api/applications/{id}/audit` | Immutable audit trail timeline |
| `POST` | `/api/applications/{id}/simulate` | Run Change-Impact Simulator on proposed parameter shifts |
| `GET` | `/api/applications/{id}/verification` | Verification panel data with Mock Issuer Adapter |
| `GET` | `/api/stats/metrics` | Measured automated testing and verification metrics |

---

## ⏱️ 60-to-90 Second Live Demo Script (SIH Presentation)

1. **00:00 - 00:15 | The Hook & Compliance Principle**:
   - *"Respected Jury, AICTE scrutiny faces manual verification bottlenecks across thousands of pages. Here is ClaimGraph-AICTE. Notice the top banner: this prototype uses synthetic data and never autonomously approves or rejects anything; it provides explainability for authorized human officers."*
2. **00:15 - 00:35 | Evidence Reconciliation Graph**:
   - *"Look at Case C. We observe an institution claiming 480 intake. Our deterministic engine maps the exact chain: Claim ➔ Resolution PDF Page 1 ➔ Rule Check ➔ Conflict Detected. The resolution PDF only sanctioned 360 seats! Additionally, our SHA-256 integrity check detected the identical PDF binary uploaded for both land and faculty."*
3. **00:35 - 00:60 | Signature Feature — Change-Impact Simulator**:
   - *"What happens if the institution amends its intake request? Instead of re-running the entire manual scrutiny, our reviewer launches the Change-Impact Simulator. We change 480 to 360. In milliseconds, only dependent rules re-evaluate. The intake deficit resolves in green! All without mutating stored database records."*
4. **00:60 - 00:85 | Human-in-the-Loop Audit Trail**:
   - *"The scrutiny officer opens the finding, enters an administrative note, and selects 'Additional evidence required'. This is immutably logged in the Audit Trail with actor, timestamp, and justification."*
5. **00:85 - 00:90 | Case A Validation**:
   - *"Switching to Case A shows full compliance: 0 discrepancies found across all configured rules."*

---

## 📊 Implemented vs. Simulated vs. Future Scope

| Feature / Capability | Prototype Status | Production AICTE Roadmap |
| :--- | :--- | :--- |
| **PDF Text & Field Extraction** | ✅ **Implemented** (PyPDF per-page extraction) | Multi-lingual OCR + LayoutLM v3 for complex scanned tables |
| **Deterministic Rules Engine** | ✅ **Implemented** (External YAML/JSON rules) | Dynamic AICTE Approval Process Handbook (APH) rule compiler |
| **Change-Impact Simulator** | ✅ **Implemented** (Delta graph re-evaluation) | Multi-variable optimization solver (Intake vs Faculty vs Infrastructure) |
| **Reviewer Audit Trail** | ✅ **Implemented** (SQLite append-only ledger) | Cryptographic blockhash anchoring on Government Cloud |
| **Third-Party Registry Adapter** | ⚠️ **Simulated** (Mock adapter with realistic states) | Direct production API integration with DigiLocker, NAD, & State Land Portals |
| **QR & Digital Signature Checks** | ⚠️ **Simulated Indicators** | PKI X.509 certificate validation & DSC hardware token support |

---

## 📑 6-Slide Pitch Deck Outline

- **Slide 1: Title & Vision**: *ClaimGraph-AICTE: Evidence-Linked Validation & Change-Impact Simulation for AICTE EoA Scrutiny.*
- **Slide 2: The Regulatory Challenge**: *Why manual cross-checking fails: document fatigue, late discovery of discrepancies, zero traceability.*
- **Slide 3: Core Innovation #1 — The Evidence Graph**: *Connecting Claim ➔ Document ➔ Rule ➔ Explainable Finding ➔ Human Action.*
- **Slide 4: Core Innovation #2 — Change-Impact Simulator**: *What-if analysis without database mutation; instant delta feedback on parameter amendments.*
- **Slide 5: Architecture & Metrics**: *FastAPI + React + SQLite; 100% seeded discrepancy detection rate, sub-15ms validation latency.*
- **Slide 6: Compliance & Future Roadmap**: *Safe AI governance: human oversight, no autonomous approval, DigiLocker & APH rule compilation roadmap.*

---

## 🔒 Ethics, Security & Limitations

1. **Synthetic Data Only**: All institutional names, application numbers, personnel rosters, and addresses are completely fictional.
2. **Indicators vs. Proof**: Hashes, metadata, and duplicate flags are presented as investigative indicators, never as proof of fraud.
3. **Safe Fallbacks**: Under Mock Issuer Adapter specifications, a missing external response is never treated as evidence of fraud.
4. **Final Authority**: Final regulatory decisions remain strictly with authorized AICTE officials.

---

## 👥 SIH 2026 Team: ClaimGraph AICTE
- *Built with Swiss design precision and Bento grid architecture for the Smart India Hackathon 2026.*
