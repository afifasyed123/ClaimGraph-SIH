# Screenshot 2 Guide — Evidence-Backed Conflict Investigation
**Demo Video Reference**: Scene 3 `[0:50 – 1:20]` (30 seconds)

---

## Purpose
Demonstrates the multi-document contradiction discovery and evidence verification workflow. Proves that ClaimGraph does not rely on self-reported applicant forms; it cross-examines claimed numbers against raw physical evidence inside uploaded PDF documents.

---

## Route & Navigation Steps
1. Navigate to: `http://localhost:5173/`
2. Click **"Scrutiny"** in the top navigation bar (or click **"Open Workspace"** on Chitkara Institute from the dashboard).
3. Ensure **"Chitkara Institute of Technology (AICTE/2026/ENGG-003)"** is active.
4. Locate **Discrepancy #1** (Sanctioned Intake Discrepancy: 480 vs 360).
5. Click **"Inspect Evidence: Chitkara_Resolution_360.pdf"** to open the interactive PDF Document Viewer modal.

---

## Recommended Desktop Viewport & Framing
- **Viewport**: 1920 × 1080 (or 1440 × 900 desktop standard)
- **Framing Composition**:
  - **Header Banner**: Chitkara Institute of Technology · Status badge: `2 Issues Requiring Scrutiny` · Institution Type: `Private Self-Financing`.
  - **Section 1: Application Checklist & Findings**:
    - **Snapshot Bar**: Proposed Intake: `480 Students` · Declared Faculty: `18 Teachers` · Land Area: `2.5 Acres` · Built-Up: `3,200 sq.m.`
    - **Discrepancy Card #1** (Highlighted with active claymorphic border):
      - Severity Badge: `🔴 Information Mismatch`
      - Headline: *"Sanctioned Intake Discrepancy: Application claims 480 seats, but Affiliation Resolution specifies 360 seats maximum."*
      - Comparative Fact Box:
        - Self-Reported Claim: `480 Students`
        - Statutory / Extracted Proof: `360 Seats (Governing Body Resolution)`
      - Regulatory Impact: *"Institutional sanctions cannot exceed the governing body statutory ceiling under APH Clause 6.47."*
      - Action: Button **"Inspect Evidence: Chitkara_Resolution_360.pdf (Page 1)"**
    - **Discrepancy Card #2**:
      - Severity Badge: `🔴 Duplicate File Match`
      - Headline: *"Duplicate Document Binary File Detected: Exact SHA-256 match with another submitted file."*
      - Evidence: Byte-level SHA-256 collision caught between land deed and resolution.
  - **Document Viewer Modal (When opened)**:
    - Side-by-side modal displaying extracted text from `Chitkara_Resolution_360.pdf`.
    - Clause highlighted in bold amber: *"Resolved: The maximum sanctioned intake for academic year 2026-27 shall remain capped at 360 undergraduate seats."*

---

## High-Impact Presentation Talking Points
- **Cross-Document Cross-Examination**: Unlike standard form validators that check only single-field formats, ClaimGraph cross-checks applicant claims against legal evidentiary resolutions.
- **Explainable Discrepancy Cards**: Eliminates black-box AI scores. Every finding gives the officer:
  1. Exactly *what* was claimed.
  2. Exactly *what* was extracted from physical proof.
  3. The specific *AICTE Handbook Clause*.
  4. The concrete *regulatory impact* on institutional approval.
- **Genuine SHA-256 Byte Hash Deduplication**: Catches sophisticated evasion tactics where an applicant submits identical PDF binaries under different filenames to bypass checklist requirements.
