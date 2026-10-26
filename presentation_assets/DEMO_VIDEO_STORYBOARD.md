# ClaimGraph-AICTE — 90–120 Second Demo Video Storyboard

## Overview
- **Total Duration**: 105 seconds (1 minute 45 seconds)
- **Target Audience**: Statutory Evaluators, Regulatory Authorities & Technical Committees
- **Tone**: Authoritative, concise, evidence-grounded, government-officer perspective

---

## Detailed Scene Breakdown & Narration Script

### Scene 1: Portal Entry & Scrutiny Dashboard (0:00 – 0:18, 18 sec)
- **Visual**:
  - Starts on the ClaimGraph-AICTE portal entry page.
  - Quick glance at the three core capabilities: Evidence-Backed Document Scrutiny, Cross-Institution Claim Reconciliation, and Auditable Human Review.
  - Officer clicks **"Open Review Dashboard"** (or selects **"Reviewer"** profile).
  - Lands smoothly on the **Regulatory Application Scrutiny Dashboard**.
  - Cursor highlights the four task-oriented metric indicators: 5 Registered Applications, 2 Actions Required, 2 Shared Campus Alerts, and 2 Pre-Generated Deficiency Notices.
- **Spoken Narration (Voiceover)**:
  > *"Welcome to ClaimGraph-AICTE, a regulatory scrutiny portal engineered to assist government officers in verifying institutional compliance under the AICTE Approval Process Handbook. Instead of decorative dashboards, officers are presented with an actionable review queue backed by live document extraction and statutory rule verification."*

---

### Scene 2: Selecting an Application & Overview (0:18 – 0:33, 15 sec)
- **Visual**:
  - Officer views the Institutional Scrutiny Queue table.
  - Points out Case A (Apex Institute: 100% compliant baseline) and Case B (Bharat College: missing NOC and faculty shortfall).
  - Clicks **"Open Workspace"** on **Chitkara Institute of Technology** (`AICTE/2026/ENGG-003`), flagged with `🔴 Discrepancy Detected`.
  - The Scrutiny Workspace loads instantly with the three organized sections: Findings, Evidence Documents, and Reviewer Actions.
- **Spoken Narration (Voiceover)**:
  > *"In our live queue, we can immediately filter and identify institutions requiring regulatory attention. Let's open Chitkara Institute of Technology, where our automated compliance engine has identified multi-document discrepancies."*

---

### Scene 3: Inspecting a Real Finding & Evidentiary Proof (0:33 – 0:53, 20 sec)
- **Visual**:
  - Highlights **Discrepancy #1**: *"Sanctioned Intake Discrepancy"*.
  - Compares the Claimed Intake (`480 Students`) with the Governing Body Resolution ceiling (`360 Seats`).
  - Highlights the Handbook Norm citation (`APH Clause 6.47`).
  - Officer clicks **"Inspect Evidence: Chitkara_Resolution_360.pdf"**.
  - Modal pops up displaying the actual extracted PDF resolution text, showing where the 360-seat limit was extracted.
  - Officer closes the modal and briefly highlights Discrepancy #2 (Identical binary SHA-256 duplicate file detection).
- **Spoken Narration (Voiceover)**:
  > *"Section One displays the verified findings with complete provenance. The applicant claimed 480 seats, but cross-document extraction against their submitted Governing Body Resolution reveals an approved ceiling of only 360 seats. With a single click on 'Inspect Evidence', the officer can inspect the exact PDF document and authenticated text extract."*

---

### Scene 4: Cross-Institution Campus Reconciliation (0:53 – 1:15, 22 sec)
- **Visual**:
  - Officer clicks **"Campus Reconciliation"** in the top navigation bar.
  - Vidya Vihar Integrated Knowledge Campus loads, showing 3 co-located colleges (Chitkara Engineering, Vidya Pharmacy, and Vidya Management).
  - Displays **Conflict #1: Faculty Double-Counting** (Dr. R. K. Sharma claimed as full-time regular faculty by two separate institutions).
  - Displays **Conflict #2: Physical Space Over-Allocation** (Central Block A claimed for 2,400 sq.m against a certified 1,200 sq.m parcel).
  - Officer clicks **"Run Capacity Reconciliation"** — the model derives a legally compliant spatial partition and maximum intake capacity headroom table.
- **Spoken Narration (Voiceover)**:
  > *"When colleges share a single physical campus, ClaimGraph executes cross-institution reconciliation. Here on the Vidya Vihar campus, it flags that Professor Sharma has been double-pledged across both Engineering and Pharmacy rosters, and an auditorium has been double-allocated. The engine derives a legally partitioned allocation and maximum intake capacity headroom."*

---

### Scene 5: Reviewer Decision with Explicit Confirmation (1:15 – 1:33, 18 sec)
- **Visual**:
  - Officer returns to the Scrutiny Workspace for Chitkara Institute.
  - Scrolls to **Section 3: Reviewer Actions & Audit Trail**.
  - Selects action: **"💬 Request Evidence / Clarification"**.
  - Enters note: *"Clarification required: Provide updated Governing Body resolution sanctioning 480 seats, or adjust intake to 360."*
  - Clicks **"Review & Record Action"**.
  - The **"Confirm Regulatory Action"** modal appears, detailing the action, actor name, note, and cryptographic notice.
  - Officer clicks **"Confirm & Record in Audit Trail"**. Success banner pops up with audit block number.
- **Spoken Narration (Voiceover)**:
  > *"Consequential actions are never automated; they remain strictly in authorized human hands. The officer selects 'Request Evidence', enters their administrative rationale, and receives an explicit confirmation dialog before the decision is permanently recorded."*

---

### Scene 6: Cryptographic Audit Trail Verification (1:33 – 1:45, 12 sec)
- **Visual**:
  - Officer clicks **"Audit Chain"** in the navigation bar.
  - Shows the newly appended audit block containing the officer's action, timestamp, actor ID, and SHA-256 hash linked to the previous block.
  - Clicks **"Verify Audit Chain Integrity"** button; green banner confirms: *"Audit Chain Valid & Tamper-Free"*.
- **Spoken Narration (Voiceover)**:
  > *"Finally, every regulatory decision is sealed in an append-only, SHA-256 cryptographic audit chain. ClaimGraph empowers officers with explainable, trustworthy, and tamper-proof scrutiny for technical education across India."*

---

## Technical Demonstration Verification Checklist
| Step | Demonstrated Capability | Verification Status |
| :--- | :--- | :--- |
| 1 | Task-oriented dashboard with search and status filters | Verified in `OverviewScreen.jsx` |
| 2 | Consistent vs deficient vs conflicting application cases | Verified (Apex, Bharat, Chitkara) |
| 3 | Extracted evidence linking with 1-click PDF preview | Verified in `ScrutinyWorkspace.jsx` & `DocumentViewerModal.jsx` |
| 4 | Multi-institution campus conflict detection & reconciliation | Verified in `CampusReconciliationScreen.jsx` |
| 5 | Explicit confirmation modal before consequential reviewer action | Verified in `ScrutinyWorkspace.jsx` |
| 6 | Cryptographic SHA-256 immutable audit chain verification | Verified in `AuditVerificationScreen.jsx` & `audit_chain.py` |
| 7 | Full upload-to-validation pipeline with file hash deduplication | Verified in `UploadModal.jsx` & `test_upload_integration.py` |
