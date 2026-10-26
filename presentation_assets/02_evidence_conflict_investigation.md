# Screenshot 2 Guide — Evidence-Backed Conflict Investigation Screen

## Purpose
Demonstrates the core technical innovation: connecting reported application claims directly to mathematical rule checks, exact multi-document contradictions, and extracted PDF evidence previews.

## Target Route & Navigation Steps
1. Navigate to: `http://localhost:5173/`
2. Click **"Application Scrutiny"** in the top navigation bar (or click **"Case C"** from the login screen or dashboard).
3. Ensure **"Chitkara Institute (Intake Discrepancy & Campus Sharing)"** is the active institution.
4. Click on **Discrepancy #1** (Sanctioned Intake Discrepancy: 480 vs 360).
5. Click the **"Inspect Evidence"** button to open the PDF preview modal with highlighted text.

## Recommended Desktop Viewport & Screen Framing
- **Recommended Viewport**: 1920 × 1080 (or 1440 × 900 desktop standard)
- **Framing Composition**:
  - **Header**: Chitkara Institute of Technology (`AICTE/2026/ENGG-003`), flagged with badge `2 Issues Requiring Scrutiny`.
  - **Section 1: Application Checklist & Scrutiny Findings**:
    - Snapshot: Proposed Intake: 480 Students · Declared Faculty: 18 Teachers · Land Area: 2.5 Acres · Built-up: 3,200 sq.m.
    - Discrepancy Card #1 (Selected with active blue claymorphic border):
      - Badge: `🔴 Information mismatch`
      - Headline: *"Sanctioned Intake Discrepancy: Application claims 480 seats, but Affiliation Resolution specifies 360 seats maximum."*
      - Comparison Box:
        - What was claimed: `480 Students`
        - Statutory norm / verified proof: `360 Seats (Governing Body Resolution)`
      - Regulatory Impact: *"Institutional sanctions cannot exceed the governing body statutory ceiling."*
      - Evidence Link: `📄 Evidence: Chitkara_Resolution_360.pdf (Page 1)`
    - Discrepancy Card #2:
      - Badge: `🔴 Information mismatch`
      - Headline: *"Duplicate Document Binary File Detected: Exact SHA-256 match with another submitted file."*
  - **Section 2: Document Viewer & Evidence Packets**:
    - Attached PDF cards showing filename, verified badge, and cryptographic SHA-256 hash.

## Presentation Talking Points for PPT Slide
- **Multi-Document Verification**: Unlike simple form validators, ClaimGraph extracts and cross-checks claims against physical evidence across distinct PDF documents.
- **Explainable Discrepancy Reasoning**: Tells the officer *what* was reported, *what* contradicted it, *which* handbook clause applies, and *why* it matters.
- **Evidence Traceability**: Every finding has a 1-click link to the exact source PDF document and page reference.
