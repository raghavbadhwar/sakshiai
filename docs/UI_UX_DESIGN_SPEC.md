# SakshiAI — UI & UX Design Specification ("Sovereign Ledger")

## 1. Aesthetic Direction & Visual Identity

**Concept:** *Sovereign Ledger* — the quiet authority of an Indian Parliamentary Gazette & RBI ledger paired with Bloomberg-grade FinOps precision. Deliberately rejects generic dark-mode neon/purple AI dashboard clichés so SakshiAI looks immediately credible to an Hon'ble Minister of State, IAS District Magistrates, and institutional VCs on a bright Bharat Mandapam LED screen.

### Color System (CSS Custom Properties)
```css
:root {
  --canvas-khadi: #F7F4EE;       /* Warm archival stone background */
  --surface-paper: #FFFFFF;      /* Official DPR / UC stationery cards */
  --surface-tint: #EFEAE0;       /* Subtle ledger headers & inactive pills */
  --ink-primary: #111D35;        /* Deep Ashoka-indigo primary ink (>= 12:1 contrast) */
  --ink-muted: #525B6E;          /* Secondary metadata & labels */
  --rule-hairline: #DCD6C8;      /* Crisp 1px ledger dividers */
  --accent-saffron: #C85A17;     /* Burnt terracotta: stalled >45d SLA alerts & active mic */
  --accent-saffron-bg: #FDF1E8;  /* Soft alert wash */
  --accent-jade: #0F6E4A;        /* Verified UC, eligible asset, SC/ST compliant */
  --accent-jade-bg: #E7F5EE;     /* Soft verified wash */
  --accent-crimson: #B42318;     /* Prohibited work / geofence & duplicate fraud block */
  --accent-crimson-bg: #FDECEB;  /* Soft rejection wash */
}
```

### Typography Hierarchy
- **Display & Official Headings:** `Newsreader` (serif) — used for constituency name, DPR/UC document titles, and headline ₹ crore figures.
- **UI & Body Copy:** `Plus Jakarta Sans` — crisp geometric readability from 30+ feet on conference projectors (minimum `14px` body).
- **Financial Tables, SoR Codes & Hashes:** `JetBrains Mono` with `font-variant-numeric: tabular-nums` so every rupee column and 64-char SHA-256 UC hash aligns cleanly.

---

## 2. Global Chrome & Constitutional UX

1. **Top Sovereign Header Bar:**
   - **Left:** SakshiAI geometric seal + *West Delhi Parliamentary Constituency · FY 2026–27*.
   - **Center (Signature Differentiator):** **Constitutional Role Switcher** (`MP Office: Recommend` vs. `District Authority: Sanction & Audit`). Toggling roles visibly enables/disables DM sanction controls, demonstrating *Bhim Singh v. Union of India* compliance live on stage.
   - **Right:** `8:00 AM Brief` trigger (opens 60-sec Hindi/English executive audio modal) + `Stage-Safe / Live AI` status indicator.

2. **Persistent KPI & Statutory Earmark Ribbon (4-Column Hairline Grid):**
   - **Annual Entitlement:** ₹5.00 Cr (FY 2026–27)
   - **Sanctioned & Active:** ₹X.XX Cr (% utilization)
   - **Stalled Beyond SLA (>45d):** ₹X.XX Cr (highlighted in burnt terracotta)
   - **Statutory Earmarks:** Dual inline progress bars for **15% SC (₹75L)** and **7.5% ST (₹37.5L)** showing exact rupee compliance or shortfall.

---

## 3. Three-Tab Command Center Layout

### Tab 1: Voice-to-DPR Studio (40% Left Intake / 60% Right Official DPR Sheet)
- **Left Panel (Intake & Rules):**
  - Tactile **Hold/Click to Speak (Hindi / Hinglish)** mic button with subtle concentric ring animation.
  - **3 One-Click Stage Presets** (zero typing risk on stage):
    1. *Eligible SC Work:* "Najafgarh Ward 14 mein 400m drainage repair aur 25 solar street lights chahiye"
    2. *Earmark / General Check:* "Dwarka Sector 12 mein 1,200 sq.m paver lane aur 3 RO water ATM"
    3. *Prohibited Work Trap:* "MP office renovation aur commercial complex shops banwani hai" *(triggers instant crimson rejection stamp!)*
  - Ward dropdown + Beneficiary Category pills (`SC`, `ST`, `GENERAL`).
- **Right Panel (Official DPR Stationery):**
  - Elevated white paper sheet styled like a real Government of India DPR with subtle top double-rule border.
  - Status stamp (`ELIGIBLE — READY FOR DM SANCTION` in jade, or `PROHIBITED / EARMARK BLOCKED` in crimson).
  - Itemized **CPWD/Delhi SoR Table** (`Code`, `Description`, `Qty`, `Unit Rate`, `Total ₹`) + `2% Contingency` + **Grand Total**.
  - Primary actions: **`Submit Recommendation to DM Pipeline`** + **`Print Official DPR PDF`** (`@media print` strips all app chrome).

### Tab 2: Stalled-Fund Bottleneck Radar + 3D Constituency Twin (55% Left 3D Map / 45% Right SLA Queue)
- **Left Panel (3D South-West Delhi Constituency Digital Twin):**
  - Clean architectural clay/paper Three.js orthographic map of West/South-West Delhi wards (Najafgarh, Dwarka, Uttam Nagar, Matiala, Kakrola).
  - Vertical 3D pin towers scaled by work value and color-coded (`Amber` = Recommended, `Terracotta/Crimson` = Overdue >45d SLA, `Jade` = Verified UC).
  - Smooth hover tooltip + click-to-select syncs directly with the right-hand SLA queue.
- **Right Panel (SLA Bottleneck Queue & HITL Actions):**
  - Agency filter chips (`All`, `MCD`, `PWD Delhi`, `Delhi Jal Board`, `DSIIDC`).
  - Cards sorted by `daysPending` descending with exact SLA breach badge (`80d pending · SLA 45d`).
  - **Role-Aware CTA:**
    - In **MP Office** mode: **`Draft Official Escalation Nudge`** (reveals copyable WhatsApp/e-SAKSHI reminder).
    - In **DM Office** mode: **`Grant Administrative Sanction`** (HITL approval button that updates the work status & turns the 3D pin live!).

### Tab 3: Vision-AI Site Audit & Auto-UC Ledger (50% Left Forensics / 50% Right Official UC)
- **Left Panel (Field Photo Forensics):**
  - Drag-and-drop real image uploader + **2 One-Click Stage Scenarios**:
    1. *Valid Completion (Uttam Nagar Solar Lights):* 14m GPS offset, unique hash, C2PA verified, 96% VLM progress -> **PASS**.
    2. *Fraud / Spoofed Photo (Najafgarh Drain):* 1,840m GPS breach + recycled contractor image hash -> **BLOCKED**.
  - 2×2 Forensic Verification Grid (`GPS Geofence <=200m`, `Duplicate Hash Check`, `C2PA Provenance`, `Vision-AI Completion %`).
- **Right Panel (Tamper-Evident Auto-UC Certificate):**
  - On **PASS**: Displays official **MoSPI e-SAKSHI Utilization Certificate** with `UC Number`, certified ₹ amount, `Previous Hash`, live **64-char SHA-256 Hash**, and **`Print Official UC PDF`**.
  - On **FAIL**: Displays bold crimson **Tranche Release Blocked — Audit Hold Notice** listing every failed forensic check.

---

## 4. Motion, Stage Resilience & Print Rules

- **Restrained Motion:** Single staggered entrance on initial load (`120ms` cascade), crisp `150ms` tab transitions, subtle pulse only on active mic or critical SLA badge.
- **Zero-Failure Demo Mode:** Every tab works 100% deterministically offline if conference Wi-Fi drops, while upgrading seamlessly when `GEMINI_API_KEY` is configured.
- **Official Print Stationery (`@media print`):** Hides header, tabs, and buttons; formats DPR and UC sheets cleanly for A4 PDF export.
