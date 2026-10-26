# Screenshot 1 Guide — Officer Dashboard & Scrutiny Queue
**Demo Video Reference**: Scene 2 `[0:25 – 0:50]` (25 seconds)

---

## Purpose
Demonstrates the primary task-oriented workspace used by AICTE scrutiny officers. Eliminates vanity charts in favor of an actionable, filterable regulatory queue showing pre-loaded evaluation cases (Apex, Bharat, Chitkara, Vidya Vihar campus institutions).

---

## Route & Navigation Steps
1. Navigate to: `http://localhost:5173/`
2. At the portal entry screen, select **"Reviewer"** role and click **"Open Review Dashboard"** (or use the one-click shortcut **"Case C: Discrepancy & Campus Sharing"**).
3. The **Institutional Scrutiny Dashboard** loads.

---

## Recommended Desktop Viewport & Framing
- **Viewport**: 1920 × 1080 (or 1440 × 900 desktop standard)
- **Framing Composition**:
  - **Top Navigation Bar**:
    - Ministry Navy `#0F172A` theme with Indian saffron `#FF9933` top accent line.
    - AICTE institutional brand & live status: **"Compliance Engine · Active"** pulsing dot.
    - Compact tab pills: `Dashboard`, `Scrutiny`, `Campus`, `Simulator`, `Notices`, `Audit Chain`.
    - Officer identity: `Priya Sharma · Scrutiny Reviewer`.
  - **Top Metric Cards** (4 task-oriented stat tiles):
    - **Registered Applications**: `5`
    - **Action Required**: `2` (highlighted in soft red: Chitkara 480 vs 360, Bharat expired NOC)
    - **Shared Campus Alerts**: `2` (highlighted in soft purple: Vidya Vihar campus)
    - **Deficiency Notices**: `2` (highlighted in soft amber: pre-seeded formal notices)
  - **Institutional Scrutiny Queue** (Floating card table):
    - Filter pills: `All (5)`, `Requires Action (2)`, `Verified Compliant (1)`, `Shared Campus`.
    - Search input field: active query for instant live client-side filtering.
    - 5-Column Streamlined Table Structure:
      1. **Application ID & Type**: `AICTE/2026/ENGG-003` · `Extension of Approval (EoA)`
      2. **Institution Details**: `Chitkara Institute of Technology` · `Engineering & Technology (UG/PG)` · `Punjab`
      3. **Scrutiny Status**: `🔴 Discrepancy Detected`
      4. **Flags & Alerts**: `Intake Mismatch (480 vs 360)` · `Shared Campus Alert`
      5. **Actions**: High-contrast blue button **"Open Workspace"**

---

## High-Impact Presentation Talking Points
- **Task-Oriented vs Decorative**: Designed strictly for regulatory productivity; officers immediately see which institutions require statutory action without digging through menus.
- **Pre-Loaded Ground-Truth Evaluation Scenarios**: Showcases three authentic regulatory profiles:
  - **Case A (Apex Institute)**: 🟢 100% Verified Compliant (SFR 1:12.5 verified, zero deficiencies).
  - **Case B (Bharat College)**: 🟡 Missing Mandatory Document (expired Fire Safety NOC).
  - **Case C (Chitkara Institute)**: 🔴 Multi-Document Intake Contradiction & Cross-Campus Contradiction.
- **Zero-Hallucination Architecture**: All numbers, statuses, and counts are computed live from the SQLite backend database, backed by the AICTE Approval Process Handbook (APH) rules engine.
