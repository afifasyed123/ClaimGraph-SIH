# Screenshot 3 Guide — Reviewer Decision & Cryptographic Audit Trail
**Demo Video Reference**: Scene 5 `[1:55 – 2:15]` (20 seconds) & Scene 6 `[2:15 – 2:38]` (23 seconds)

---

## Purpose
Demonstrates accountable government governance: consequential human reviewer control, explicit administrative confirmation dialogs, and the resulting immutable cryptographic (SHA-256) audit trail.

---

## Route & Navigation Steps
1. Navigate to: `http://localhost:5173/`
2. Go to **"Scrutiny"** tab for Chitkara Institute (`AICTE/2026/ENGG-003`).
3. Scroll to **"Section 3: Reviewer Actions & Audit Trail"**.
4. Select administrative action: **"💬 Request Evidence / Clarification"** (`Additional evidence required`).
5. Type reviewer note:
   `"Clarification required: Provide updated governing body resolution approving 480 intake or reduce proposed seats to 360 as per APH norms."`
6. Click **"Review & Record Action"**.
7. The **"Confirm Regulatory Action"** modal appears.
8. Click **"Confirm & Record in Audit Trail"**.
9. Navigate to the **"Audit Chain"** tab (`http://localhost:5173/`) to inspect the newly sealed block and click **"Verify Integrity"**.

---

## Recommended Desktop Viewport & Framing
- **Viewport**: 1920 × 1080 (or 1440 × 900 desktop standard)
- **Framing Composition**:
  - **Framing A: Consequential Confirmation Modal** (Scene 5):
    - Background gently blurred with claymorphic backdrop.
    - Prominent modal box titled: *"Confirm Regulatory Action — AICTE Statutory Review Protocol"*.
    - Officer identity: `Priya Sharma (Scrutiny Reviewer)`.
    - Institution target: `Chitkara Institute of Technology (AICTE/2026/ENGG-003)`.
    - Action type: `Additional evidence required`.
    - Reviewer rationale text box.
    - Statutory Warning Box: *"This consequential decision will be sealed with a SHA-256 hash into the immutable audit chain. Decisions cannot be deleted or overwritten."*
    - High-contrast buttons: `Cancel` and `Confirm & Record in Audit Trail`.
  - **Framing B: Cryptographic Audit Chain Register** (Scene 6):
    - Top Status Banner: `Audit Chain Valid & Tamper-Free from Genesis Block` (with green verified badge).
    - Chain integrity button: **"Verify Integrity"** (showing instantaneous mathematical verification).
    - Sequential Block Cards:
      - **Block #0 (Genesis)**: Root system initialization.
      - **Block #1**: Initial document intake hash sealing.
      - **Block #2**: Rule engine execution and discrepancy detection.
      - **Block #3**: Reviewer action sealed with `prev_hash`, `timestamp`, `actor: Priya Sharma`, and computed SHA-256 block hash.

---

## High-Impact Presentation Talking Points
- **Strict Human-in-the-Loop Governance**: AI never autonomously approves, rejects, or sanctions an educational institution. Consequential administrative decisions remain 100% under human reviewer control.
- **Accidental Click Prevention**: Mandatory confirmation modal enforces administrative justification notes before committing state changes.
- **SHA-256 Cryptographic Immutability**: Every action, note, and verification is sealed into an append-only hash chain. If any database record or past decision is tampered with, the mathematical hash link breaks immediately.
