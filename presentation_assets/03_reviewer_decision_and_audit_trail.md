# Screenshot 3 Guide — Reviewer Decision & Cryptographic Audit Trail

## Purpose
Demonstrates accountable government governance: consequential human reviewer control, explicit confirmation modals, and the resulting immutable cryptographic (SHA-256) audit trail.

## Target Route & Navigation Steps
1. Navigate to: `http://localhost:5173/`
2. Go to **"Application Scrutiny"** for Chitkara Institute (`APP-CASE-C`).
3. Scroll to **"Section 3: Reviewer Actions & Audit Trail"**.
4. Select **"💬 Request Evidence / Clarification"** (or **"🏢 Refer for Physical Inspection"**).
5. Enter a justification note: e.g., *"Clarification requested regarding discrepancy between 480 proposed intake and 360-seat ceiling in Governing Body Resolution."*
6. Click **"Review & Record Action"**.
7. The **"Confirm Regulatory Action"** modal opens with the complete decision summary, authorized officer credentials, and statutory disclaimer.
8. Click **"Confirm & Record in Audit Trail"**.
9. Navigate to **"Audit Chain"** tab (`http://localhost:5173/`) to inspect the newly sealed cryptographic block.

## Recommended Desktop Viewport & Screen Framing
- **Recommended Viewport**: 1920 × 1080 (or 1440 × 900 desktop standard)
- **Framing Composition**:
  - **View Option A (Confirmation Dialog)**:
    - Main card blurred softly in background.
    - Prominent white modal centered with title *"Confirm Regulatory Action — AICTE Statutory Review Protocol"*.
    - Visual breakdown of:
      - Action: `Additional evidence required`
      - Target Institution: `Chitkara Institute of Technology (AICTE/2026/ENGG-003)`
      - Authorized Reviewer: `Priya Sharma (Scrutiny Reviewer)`
      - Officer Note: `"Clarification requested regarding discrepancy between 480 proposed intake..."`
      - Statutory Notice: *"This consequential decision will be sealed with a SHA-256 hash into the immutable audit chain."*
      - Cancel and Confirm buttons.
  - **View Option B (Audit Chain Register)**:
    - Audit Trail screen showing sequential verified blocks:
      - Block #1: Genesis seed
      - Block #N: Document intake and hash verification
      - Block #N+1: Reviewer action with previous block hash, timestamp, actor ID, and valid chain status.
      - **"Verify Integrity"** button showing green badge: `Audit Chain Valid & Tamper-Free`.

## Presentation Talking Points for PPT Slide
- **Human-in-the-Loop Governance**: AI and rules engines assist in discovery, but consequential statutory decisions remain 100% under human reviewer authority.
- **Explicit Consequential Confirmation**: Prevents accidental actions and enforces administrative justification notes.
- **Cryptographic Immutability**: All decisions, document additions, and notice generations are chained using SHA-256 blocks, ensuring complete anti-tamper auditability.
