# ClaimGraph-AICTE — 2 to 3 Minute Winning Demo Video Storyboard

## Executive Overview
- **Optimal Target Duration**: 2 Minutes 45 Seconds (165 seconds)
- **Target Audience**: Statutory Evaluators, Regulatory Authorities, and Hackathon Evaluation Jury
- **Tone**: Authoritative, technically rigorous, evidence-grounded, government-officer perspective
- **Core Theme**: Transforming labor-intensive manual document scrutiny into an explainable, mathematically verified, and cryptographically auditable workflow.

---

## Complete Scene-by-Scene Storyboard & Narration Script

```
[0:00 - 0:25] ──► Scene 1: The Regulatory Problem Hook & Portal Entry (25s)
[0:25 - 0:50] ──► Scene 2: Task-Oriented Scrutiny Queue & Application Selection (25s)
[0:50 - 1:20] ──► Scene 3: Multi-Document Discrepancy & Extracted Evidence Proof (30s)
[1:20 - 1:55] ──► Scene 4: Flagship: Cross-Institution Campus Reconciliation & SMT Solver (35s)
[1:55 - 2:15] ──► Scene 5: Accountable Human Governance & Consequential Confirmation (20s)
[2:15 - 2:38] ──► Scene 6: Cryptographic SHA-256 Audit Chain & Deficiency Notices (23s)
[2:38 - 2:48] ──► Scene 7: Impactful Regulatory Closing (10s)
```

---

### Scene 1: The Regulatory Problem Hook & Portal Entry (0:00 – 0:25, 25 sec)
- **Visual**:
  - Opens on the clean, official **ClaimGraph-AICTE** portal entry screen (`http://localhost:5173/`).
  - Screen displays the national emblem accent, AICTE statutory subtitle, and three core capabilities:
    1. *Evidence-Backed Document Scrutiny*
    2. *Cross-Institution Claim Reconciliation*
    3. *Auditable Human Review*
  - Cursor hovers over the 1-click demo case shortcuts (`Case A: Compliant`, `Case B: Missing NOC`, `Case C: Discrepancy & Campus Sharing`).
  - Officer selects the **Reviewer** profile and clicks **"Open Review Dashboard"**.
- **Spoken Narration (Voiceover)**:
  > *"Every year, over ten thousand technical institutions submit Extension of Approval applications to the AICTE. Scrutiny officers must manually verify hundreds of thousands of pages of PDF resolutions, land title deeds, municipal fire safety NOCs, and faculty registers. Human fatigue inevitably leads to missed oversights. Worse yet, single-application scrutiny is completely blind to cross-institution fraud—such as colleges sharing the same campus double-counting faculty or double-pledging physical facilities. This is ClaimGraph-AICTE: a statutory compliance intelligence platform delivering evidence-backed document scrutiny, campus-level reconciliation, and cryptographic auditability."*

---

### Scene 2: Task-Oriented Scrutiny Queue (0:25 – 0:50, 25 sec)
- **Visual**:
  - Smooth transition to the **Institutional Scrutiny Dashboard**.
  - Highlights the top four real-time metric cards:
    - `Registered Applications: 5`
    - `Action Required: 2` (highlighted in red)
    - `Shared Campus Alerts: 2` (highlighted in purple)
    - `Deficiency Notices: 2` (highlighted in amber)
  - Focuses on the **Institutional Scrutiny Queue** floating table:
    - Types *"Chitkara"* into the real-time search bar to show instant filtering.
    - Clears search and shows filter pills: `All (5)`, `Requires Action (2)`, `Verified Compliant (1)`, `Shared Campus`.
    - Points out **Case A** (*Apex Institute* — 🟢 Verified Compliant, SFR 1:12.5 met).
    - Points out **Case B** (*Bharat College* — 🟡 Deficiency Detected, expired Fire NOC).
    - Clicks **"Open Workspace"** on **Case C: Chitkara Institute of Technology** (`AICTE/2026/ENGG-003`), flagged with `🔴 Discrepancy Detected`.
- **Spoken Narration (Voiceover)**:
  > *"Instead of decorative dashboards, officers are greeted by a task-oriented regulatory queue. Our database pre-loads real evaluation scenarios: Apex Institute, which is fully compliant; Bharat College, with an expired Fire NOC; and Chitkara Institute, with multiple severe discrepancies. Let's enter the Scrutiny Workspace for Chitkara Institute to inspect how ClaimGraph verifies reported claims against physical evidence."*

---

### Scene 3: Multi-Document Discrepancy & Extracted Evidence (0:50 – 1:20, 30 sec)
- **Visual**:
  - The Scrutiny Workspace loads with its three structured sections:
    1. *Application Checklist & Findings*
    2. *Document Viewer & Evidence Packets*
    3. *Reviewer Actions & Audit Trail*
  - Zooms into **Discrepancy #1**:
    - Title: *"Sanctioned Intake Discrepancy: Application claims 480 seats, but Affiliation Resolution specifies 360 seats maximum."*
    - Fact comparison box: Claimed `480 Students` vs. Approved Ceiling `360 Seats`.
    - Handbook Norm citation: `APH Clause 6.47`.
    - Regulatory rationale: Why it matters for statutory student ceilings.
  - Officer clicks **"Inspect Evidence: Chitkara_Resolution_360.pdf"**.
  - Document Viewer modal opens, rendering the actual extracted PDF resolution text, highlighting the exact approved 360-seat clause on Page 1.
  - Closes modal and highlights **Discrepancy #2**:
    - Title: *"Duplicate Document Binary File Detected: Exact SHA-256 match with another submitted file."*
    - Demonstrates genuine byte-level hash deduplication.
- **Spoken Narration (Voiceover)**:
  > *"Section One displays our automated findings. Chitkara Institute reported a proposed intake of 480 students. But our extraction engine cross-examined their submitted Governing Body Affiliation Resolution and detected that the authorized statutory ceiling is strictly 360 seats. Clicking 'Inspect Evidence' opens the authenticated PDF viewer, showing the exact page and clause extracted. Furthermore, ClaimGraph computes SHA-256 byte hashes across all submitted files, instantly catching that the applicant uploaded an identical duplicate binary file disguised as a land deed."*

---

### Scene 4: Flagship Innovation: Cross-Institution Campus Reconciliation (1:20 – 1:55, 35 sec)
- **Visual**:
  - Officer clicks **"Campus"** in the top navigation bar.
  - The **Vidya Vihar Integrated Knowledge Campus** workspace loads:
    - Displays geographic parcel: 14.5 Acres, 12,500 sq.m built-up area.
    - Shows the 3 hosted institutions: Chitkara Institute (Engineering), Vidya College of Pharmacy, and Vidya Institute of Management.
  - Zooms into the two flagged cross-institution contradictions:
    - **Conflict #1**: *Faculty Double-Counting* — Dr. R. K. Sharma claimed simultaneously as full-time regular faculty by both Engineering and Pharmacy.
    - **Conflict #2**: *Physical Space Over-Allocation* — Central Block A (1,200 sq.m certified) claimed for 2,400 sq.m total across Engineering and Management.
  - Officer clicks **"Run Capacity Reconciliation"**:
    - The constraint solver calculates an optimal, non-overlapping partition:
      - Dr. Sharma allocated 100% exclusively to Engineering; Pharmacy advised to recruit independent faculty.
      - Central Block A partitioned 600m² / 600m² between computing labs and seminar halls.
    - Displays the **Statutory Student Intake Capacity & Headroom Table** derived mathematically from faculty numbers.
  - Toggles the optional **Technical Verification Details** accordion, showcasing First-Order SMT logic formulation (`SUM(assigned_inst) <= 1`).
- **Spoken Narration (Voiceover)**:
  > *"Now for our flagship technical breakthrough: Cross-Institution Campus Reconciliation. In India, multiple colleges often operate on contiguous parcels under a common trust. Here on Vidya Vihar Campus, single-form scrutiny would miss that Professor R. K. Sharma is pledged as full-time faculty on two separate rosters, and an auditorium is claimed twice, creating a 1,200 square meter physical deficit. By clicking 'Run Capacity Reconciliation', ClaimGraph executes a formal Python Z3 SMT constraint solver. It mathematically proves the contradiction, isolates the minimal unsatisfiable core, and computes a legally compliant spatial partition and maximum intake capacity headroom table."*

---

### Scene 5: Accountable Human Governance & Consequential Confirmation (1:55 – 2:15, 20 sec)
- **Visual**:
  - Officer navigates back to **Scrutiny Workspace** for Chitkara Institute.
  - Scrolls to **Section 3: Reviewer Actions & Audit Trail**.
  - Selects action: **"💬 Request Evidence / Clarification"** (`Additional evidence required`).
  - Types administrative note:
    *"Clarification required: Provide updated governing resolution approving 480 intake or reduce proposed seats to 360 as per APH norms."*
  - Clicks **"Review & Record Action"**.
  - The **"Confirm Regulatory Action"** modal appears:
    - Highlights action, target institution, officer credentials (`Priya Sharma, Scrutiny Reviewer`), and justification note.
    - Displays statutory notice: *"This consequential decision will be sealed with a SHA-256 hash into the immutable audit chain."*
  - Officer clicks **"Confirm & Record in Audit Trail"**.
  - A green banner confirms: *"Decision logged successfully! Cryptographic Audit Block #4"*.
- **Spoken Narration (Voiceover)**:
  > *"Crucially, ClaimGraph adheres to strict regulatory governance: AI never autonomously approves or rejects an institution. Consequential statutory actions remain strictly in authorized human hands. When the officer requests clarification and enters their rationale, an explicit confirmation dialog ensures no accidental actions occur before cryptographically hashing the decision into the permanent record."*

---

### Scene 6: Cryptographic Audit Chain & Deficiency Notices (2:15 – 2:38, 23 sec)
- **Visual**:
  - Officer clicks **"Audit Chain"** in the top navigation:
    - Displays sequentially chained blocks with block index, actor, action, timestamp, and SHA-256 hashes (`prev_hash` -> `hash`).
    - Clicks **"Verify Audit Chain Integrity"** button; banner flashes green: *"Audit Chain Valid & Tamper-Free from Genesis Block"*.
  - Officer clicks **"Notices"** tab:
    - Opens the pre-seeded formal **Deficiency Notice** for Chitkara Institute.
    - Shows official header, reference number, itemized statutory deficiencies, reviewer notes, and public QR code authenticity verification endpoint (`/api/reports/verify/{id}`).
- **Spoken Narration (Voiceover)**:
  > *"Accountability is guaranteed through an append-only, SHA-256 cryptographic audit chain. A single click mathematically validates that no past records or reviewer decisions have been altered. Furthermore, formal Deficiency Notices are itemized directly from verified findings, complete with cryptographic digests and public QR verification endpoints for statutory transparency."*

---

### Scene 7: Impactful Regulatory Closing (2:38 – 2:48, 10 sec)
- **Visual**:
  - Camera pans back to the executive dashboard, showing the live compliance engine pulsing indicator.
  - Title card appears with key pillars:
    - *Evidence Traceability* · *Cross-Campus Reconciliation* · *Formal Mathematical Proofs* · *Cryptographic Auditability*
- **Spoken Narration (Voiceover)**:
  > *"ClaimGraph-AICTE transforms institutional scrutiny from an error-prone manual ordeal into an explainable, mathematically verified, and cryptographically auditable standard for technical education across India. Thank you."*

---

## 🏆 SIH Winning Evaluation Matrix Alignment
| Evaluation Criteria | How ClaimGraph-AICTE Proves It in This Demo |
| :--- | :--- |
| **Innovation & Uniqueness** | First platform to execute cross-institution SMT constraint solving for multi-college campuses sharing land and faculty. |
| **Technical Depth & Feasibility** | Real Python Z3 solver, genuine SHA-256 byte hashing, live `pypdf` extraction, and 23 automated tests (100% passing). |
| **Regulatory Trust & Ethics** | Zero black-box AI scores; no autonomous approval/rejection; explicit human reviewer confirmation dialogs. |
| **End-to-End Polish** | Accessible Enterprise Claymorphism design system, responsive floating queue table, and print-ready deficiency notices. |
