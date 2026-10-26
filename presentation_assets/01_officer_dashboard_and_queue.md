# Screenshot 1 Guide — Officer Dashboard and Application Scrutiny Queue

## Purpose
Demonstrates the entry point and task-oriented scrutiny register used by government scrutiny officers to manage, filter, and track technical institution applications for Extension of Approval (EoA).

## Target Route & Navigation Steps
1. Navigate to: `http://localhost:5173/`
2. If at login screen, select **"Reviewer"** role and click **"Open Review Dashboard"** (or click **"Case C: Discrepancy & Campus Sharing"**).
3. The **Institutional Compliance & Scrutiny Dashboard** displays.

## Recommended Desktop Viewport & Screen Framing
- **Recommended Viewport**: 1920 × 1080 (or 1440 × 900 desktop standard)
- **Framing Composition**:
  - Top: Official sticky navigation bar with saffron tricolor accent line, Ministry Navy brand, and live **"Compliance Engine · Active"** pulsing dot.
  - Middle: Four task-oriented metrics:
    - **Registered Applications**: 5
    - **Action Required**: 2 (Chitkara Institute 480 vs 360 mismatch, Bharat College expired NOC)
    - **Shared Campus Alerts**: 2 (Vidya Vihar campus physical facility & faculty sharing)
    - **Deficiency Notices**: 2 pre-seeded formal statutory notices
  - Lower Middle: Live **Institutional Scrutiny Queue** data table:
    - Search bar with filter pills: `All (5)`, `Requires Action (2)`, `Verified Compliant (1)`, `Shared Campus`.
    - Rows displaying:
      - `AICTE/2026/ENGG-001` · **Apex Institute of Technology** · 🟢 Verified Compliant (SFR 1:12.5 met)
      - `AICTE/2026/ENGG-002` · **Bharat College of Engineering** · 🟡 Deficiency Detected (Expired Fire NOC)
      - `AICTE/2026/ENGG-003` · **Chitkara Institute of Technology** · 🔴 Discrepancy Detected (480 claimed vs 360 resolution)
      - `AICTE/2026/PHARM-001` · **Vidya College of Pharmacy** · 🟣 Campus Sharing Alert
      - `AICTE/2026/MGMT-001` · **Vidya Institute of Management** · 🟣 Campus Sharing Alert
  - Action button: Highlight the blue **"Open Workspace"** button on Chitkara Institute.

## Presentation Talking Points for PPT Slide
- **Task-Oriented vs Chart-Oriented**: Focuses strictly on actionable regulatory queues rather than vanity charts.
- **Explainable Discrepancy Badging**: Instantly distinguishes verified compliance, missing documentation, and multi-document contradictions.
- **Zero Hallucination Guarantee**: All table counts and statistics are pulled directly from the underlying SQLite compliance database and verified handbook rules.
