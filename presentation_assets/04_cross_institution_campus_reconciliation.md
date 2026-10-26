# Screenshot 4 Guide — Cross-Institution Campus Reconciliation & SMT Solver
**Demo Video Reference**: Scene 4 `[1:20 – 1:55]` (35 seconds)

---

## Purpose
Demonstrates ClaimGraph's flagship technical breakthrough: cross-institution claim reconciliation across colleges sharing a common campus parcel. Proves that ClaimGraph detects cross-form double-pledging of physical facilities and faculty that single-application scrutiny is completely blind to, using a formal Python Z3 SMT constraint solver.

---

## Route & Navigation Steps
1. Navigate to: `http://localhost:5173/`
2. Click the **"Campus"** tab in the top navigation bar.
3. The **Vidya Vihar Integrated Knowledge Campus** workspace opens automatically.
4. Observe the campus overview card and the two flagged cross-institution contradictions.
5. Click the primary button: **"Run Capacity Reconciliation"**.
6. The Z3 SMT constraint solver executes, rendering the legally compliant spatial partition and maximum intake capacity headroom table.
7. Click the **"Technical Verification Details (Formal Logic & SMT Formulation)"** accordion to view the mathematical constraint formulation.

---

## Recommended Desktop Viewport & Framing
- **Viewport**: 1920 × 1080 (or 1440 × 900 desktop standard)
- **Framing Composition**:
  - **Campus Header Card**:
    - Title: *Vidya Vihar Integrated Knowledge Campus (Campus ID: CMP-2026-0881)*
    - Parcel Specs: `14.5 Total Land Acres` · `12,500 sq.m Built-Up Area` · `Managed by Vidya Educational Trust`
    - Hosted Institutions (3 institutions sharing campus):
      1. Chitkara Institute of Technology (Engineering)
      2. Vidya College of Pharmacy (Pharmacy)
      3. Vidya Institute of Management (Management)
  - **Cross-Institution Contradictions Section**:
    - **Conflict Card 1 (Faculty Double-Counting)**:
      - Title: `🔴 Faculty Double-Counting Detected`
      - Details: Dr. R. K. Sharma claimed simultaneously as full-time regular faculty by Chitkara Engineering (`100%`) and Vidya Pharmacy (`100%`).
      - Regulatory Impact: Violates APH 2024-27 Clause 7.12 (faculty exclusivity norm).
    - **Conflict Card 2 (Physical Space Over-Allocation)**:
      - Title: `🔴 Physical Space Over-Allocation`
      - Details: Central Block A (certified capacity: `1,200 sq.m`) claimed for `1,200 sq.m` by Engineering AND `1,200 sq.m` by Management (Total claimed: `2,400 sq.m`).
      - Regulatory Deficit: `1,200 sq.m physical deficit`.
  - **Reconciliation Engine Output (After clicking "Run Capacity Reconciliation")**:
    - Solver Status Badge: `🟢 SMT Constraint Satisfied — Minimal Non-Overlapping Partition Computed`
    - **Optimal Allocation Table**:
      - Dr. R. K. Sharma: Allocated 100% exclusively to Engineering; Pharmacy flagged to recruit replacement.
      - Central Block A: 600 sq.m allocated to Engineering labs; 600 sq.m allocated to Management seminar halls.
    - **Statutory Student Intake Capacity & Headroom Table**:
      - Chitkara Engineering: Faculty-supported intake: `360 Seats` | Headroom: `0 Seats` (At maximum legal ceiling).
      - Vidya Pharmacy: Faculty-supported intake: `60 Seats` | Headroom: `-40 Seats` (Requires +2 faculty before intake expansion).
      - Vidya Management: Faculty-supported intake: `120 Seats` | Headroom: `+30 Seats`.
  - **Formal Logic Accordion (Expanded)**:
    - Displays first-order logic constraints:
      `∀ f ∈ Faculty: ∑ (inst ∈ Institutions) Assigned(f, inst) ≤ 1`
      `∀ r ∈ Rooms: ∑ (inst ∈ Institutions) AllocatedArea(r, inst) ≤ CertifiedArea(r)`

---

## High-Impact Presentation Talking Points
- **Single-Application Scrutiny is Blind**: In traditional regulatory reviews, an officer examining an Engineering application has no visibility into what the adjacent Pharmacy college submitted. ClaimGraph unifies institutional claims under a shared parcel graph.
- **Formal Verification vs Heuristic Guesswork**: ClaimGraph does not use vague LLM summaries for physical compliance. It translates AICTE handbook clauses into formal first-order logic constraints and solves them via the Microsoft Z3 SMT Theorem Prover.
- **Intake Headroom Calculation**: Directly computes maximum statutory student intake backed by physical space and verified faculty numbers, giving regulators mathematically defensible numbers.
