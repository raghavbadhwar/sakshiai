# SakshiAI MVP Implementation Plan

> **For agentic workers:** Build slice-by-slice following `incremental-implementation`, `test-driven-development`, `frontend-design`, `vercel-react-best-practices`, and `verification-before-completion`.

**Goal:** Build a live, stage-proof 3-tab SakshiAI web command center (Voice-to-DPR Agent, Stalled-Fund Bottleneck Radar, Vision-AI Site Audit & Auto-UC + Daily 8 AM Executive Brief) with realistic Delhi constituency data, deterministic MPLADS FY 2026-31 compliance math, and zero-failure offline fallback.

**Architecture:** Next.js 15 (App Router, TypeScript, Tailwind CSS) single-repo web app separating pure, unit-tested domain engines (`src/lib/mplads/`) from UI components (`src/components/`) and optional Gemini API route handlers (`src/app/api/`). All rupee calculations, SC/ST earmark checks, SLA breach detection, and SHA-256 UC hashes execute deterministically in TypeScript so LLMs only parse unstructured voice/image inputs into validated Zod schemas.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS, Vitest (unit tests), Zod (schema validation), Web Speech API (`hi-IN`), Gemini API (with deterministic fallback), browser print-to-PDF stylesheets for DPR & UC certificates.

**Spec:** `docs/PRODUCT_VISION_AND_ARCHITECTURE.md`

## Global Constraints

- Constitutional separation of powers: UI and data model strictly separate **MP Recommendation** from **District Authority (DM) Sanction & Execution**.
- Zero LLM arithmetic: All SoR line-item totals, contingency fees, and 15% SC / 7.5% ST earmark balances are computed by unit-tested deterministic functions.
- Stage-proof offline resilience: App must work 100% smoothly without internet or API keys via realistic pre-calibrated fallbacks, while upgrading automatically when `GEMINI_API_KEY` is present.
- Distinctive civic-editorial visual identity: Warm parchment/stone canvas, deep navy/ink authority typography, saffron/terracotta accents for alerts, forest emerald for verified UCs (no generic dark-mode neon or purple gradients).
- Verification gate: Every slice must pass `npm test`, `npx tsc --noEmit`, and `npm run build` before commit.

## Review Focus (Top 5 Failure Modes Pinned to Tasks)

1. **SC/ST Earmark Under-Allocation Violation:** Recommending a General-category work when remaining annual ₹5 Cr balance would make 15% SC (₹75L) or 7.5% ST (₹37.5L) unachievable -> **Pinned to Task 1 (`mplads-rules.test.ts`)**.
2. **Prohibited Work Slip-Through:** Requesting an ineligible item (e.g., commercial complex, office renovation, recurring salary) -> **Pinned to Task 1 (`mplads-rules.test.ts`)**.
3. **Silent Venue Wi-Fi / API Failure on Stage:** Gemini API timeout or missing key during live Bharat Mandapam demo -> **Pinned to Task 2 & Task 4 (automatic deterministic fallback with clear mode indicator)**.
4. **Recycled or Out-of-Geofence Contractor Photo:** Contractor uploads a photo taken >200m from sanctioned site or reuses an already-submitted image hash -> **Pinned to Task 4 (`audit-engine.test.ts`)**.
5. **Broken Print Layout for DPR / UC PDFs:** Official documents clipping tables or showing app nav bars when exported -> **Pinned to Task 2 & Task 4 (`@media print` clean official stationery layout)**.

---

## File Structure

- `package.json`, `tsconfig.json`, `vitest.config.ts`, `next.config.ts` — App & test configuration
- `src/lib/mplads/types.ts` — Core TypeScript interfaces (`WorkItem`, `DprDraft`, `EarmarkStatus`, `AuditReport`, `UtilizationCertificate`)
- `src/lib/mplads/sor-catalog.ts` — Realistic Delhi/CPWD Schedule of Rates (SoR) reference items & MPLADS prohibited-works ruleset
- `src/lib/mplads/rules-engine.ts` — Pure deterministic eligibility, 15% SC / 7.5% ST earmark math, SoR costing, and SLA bottleneck calculator
- `src/lib/mplads/audit-engine.ts` — Geofence Haversine distance check, duplicate hash detection, and SHA-256 tamper-evident UC ledger generator
- `src/lib/mplads/seed-data.ts` — Realistic West/South-West Delhi constituency dataset (Najafgarh, Dwarka, Uttam Nagar, Matiala wards) mirroring real ₹16.39 Cr stalled-fund dynamics
- `src/lib/mplads/__tests__/rules-engine.test.ts` — Unit tests for eligibility, earmarks, SoR math, and SLA alerts
- `src/lib/mplads/__tests__/audit-engine.test.ts` — Unit tests for geofence checks, duplicate photo rejection, and SHA-256 UC chaining
- `src/components/CommandHeader.tsx` — Executive KPI strip, role switcher (MP Office vs. DM Office), and Daily 8 AM Brief modal
- `src/components/VoiceToDprTab.tsx` — Live Hindi/Hinglish voice/text intake, rule-check badges, SoR table, and printable DPR PDF view
- `src/components/BottleneckRadarTab.tsx` — Lifecycle pipeline board, stalled-fund filter, and 1-click official escalation drafter
- `src/components/VisionAuditTab.tsx` — Geo-photo upload + sample site inspector, anomaly flags, C2PA/hash verification, and printable Auto-UC certificate
- `src/app/api/analyze-request/route.ts` — Optional Gemini API endpoint for free-text/voice DPR parsing (graceful fallback if no key)
- `src/app/api/audit-photo/route.ts` — Optional Gemini Vision endpoint for site photo progress estimation (graceful fallback if no key)
- `src/app/page.tsx` & `src/app/layout.tsx` — Main 3-tab SakshiAI Command Center

---

## Vertical Slices

### Task 1: Project Scaffold + Deterministic MPLADS Rules & Audit Engines (TDD)

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `next.config.ts`, `src/lib/mplads/types.ts`, `src/lib/mplads/sor-catalog.ts`, `src/lib/mplads/rules-engine.ts`, `src/lib/mplads/audit-engine.ts`, `src/lib/mplads/seed-data.ts`
- Test: `src/lib/mplads/__tests__/rules-engine.test.ts`, `src/lib/mplads/__tests__/audit-engine.test.ts`

**Interfaces:**
- Produces:
  - `evaluateEligibility(input: string, category: BeneficiaryCategory, budgetStatus: ConstituencyBudget): EligibilityResult`
  - `generateDeterministicDpr(input: string, ward: string, category: BeneficiaryCategory): DprDraft`
  - `detectBottlenecks(works: WorkItem[], todayIso: string): BottleneckAlert[]`
  - `verifySiteSubmission(sub: SiteSubmission, existingHashes: string[]): AuditReport`
  - `mintUtilizationCertificate(work: WorkItem, audit: AuditReport, previousHash: string): UtilizationCertificate`

- [ ] **Step 1:** Initialize Next.js 15 + TypeScript + Tailwind CSS + Vitest + Zod inside `/Volumes/RAGHAV2/Projects/sakshiai`.
- [ ] **Step 2:** Write failing unit tests in `rules-engine.test.ts` covering: prohibited works rejection, 15% SC / 7.5% ST earmark breach warning, SoR line-item sum + 2% contingency math, and >45-day DM sanction SLA flagging.
- [ ] **Step 3:** Run `npm test` and confirm RED failure.
- [ ] **Step 4:** Write failing unit tests in `audit-engine.test.ts` covering: >200m GPS geofence failure, duplicate image hash rejection, and deterministic SHA-256 UC hash chaining.
- [ ] **Step 5:** Implement `types.ts`, `sor-catalog.ts`, `rules-engine.ts`, `audit-engine.ts`, and `seed-data.ts`.
- [ ] **Step 6:** Run `npm test` and `npx tsc --noEmit`; verify GREEN (0 failures, 0 TS errors).
- [ ] **Step 7:** Commit: `feat: add deterministic MPLADS rules engine, audit engine, and Delhi seed data`.

### Task 2: Civic-Editorial Shell + Tab 1 (Live Voice-to-DPR Agent + Printable PDF)

**Files:**
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/components/CommandHeader.tsx`, `src/components/VoiceToDprTab.tsx`, `src/app/api/analyze-request/route.ts`

**Interfaces:**
- Consumes: `generateDeterministicDpr`, `evaluateEligibility`, `DELHI_SEED_WORKS`
- Produces: Live Hindi/Hinglish voice/preset intake -> structured DPR preview -> `Add to Constituency Pipeline` callback & clean `@media print` official DPR sheet.

- [ ] **Step 1:** Build distinctive civic-editorial design system in `globals.css` and `layout.tsx` (custom display + crisp body typography, warm stone canvas, deep navy ink, emerald/saffron status tokens, print stylesheet).
- [ ] **Step 2:** Build `CommandHeader.tsx` with live ₹5.00 Cr entitlement vs. sanctioned vs. completed KPIs, SC/ST earmark progress bars, and MP/DM role toggle.
- [ ] **Step 3:** Build `VoiceToDprTab.tsx` with Web Speech API (`hi-IN`), 3 one-click realistic Hinglish voice presets (including 1 prohibited work to demo guardrails live!), real-time rule-check badges, SoR cost table, and `Export Official DPR PDF` button.
- [ ] **Step 4:** Wire `/api/analyze-request` with optional Gemini call + automatic deterministic fallback.
- [ ] **Step 5:** Run `npm test && npx tsc --noEmit && npm run build` and verify exit 0.
- [ ] **Step 6:** Commit: `feat: build SakshiAI command shell and live Voice-to-DPR tab`.

### Task 3: Tab 2 (Stalled-Fund Bottleneck Radar & One-Click Escalation Drafter)

**Files:**
- Create: `src/components/BottleneckRadarTab.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `WorkItem[]`, `detectBottlenecks`
- Produces: Interactive lifecycle filter, overdue implementing-agency cards, DM Sanction approval action (HITL gate), and 1-click official escalation memo / WhatsApp reminder generator.

- [ ] **Step 1:** Build `BottleneckRadarTab.tsx` with stage funnel metrics (Recommended -> DM Sanctioned -> In Progress -> UC Verified), overdue SLA sorting, and implementing-agency filter (PWD, MCD, DJB, DSIIDC).
- [ ] **Step 2:** Add constitutional HITL button: in DM role, allow 1-click "Grant Administrative Sanction" with timestamped audit log; in MP role, allow 1-click "Draft Official Escalation Nudge" (copyable for WhatsApp/e-SAKSHI).
- [ ] **Step 3:** Run `npm test && npx tsc --noEmit && npm run build` and verify exit 0.
- [ ] **Step 4:** Commit: `feat: add Stalled-Fund Bottleneck Radar and HITL sanction workflow`.

### Task 4: Tab 3 (Vision-AI Site Audit, Anti-Spoofing & Auto-UC Ledger) + Daily 8 AM Brief

**Files:**
- Create: `src/components/VisionAuditTab.tsx`, `src/components/MorningBriefModal.tsx`, `src/app/api/audit-photo/route.ts`
- Modify: `src/app/page.tsx`, `src/components/CommandHeader.tsx`

**Interfaces:**
- Consumes: `verifySiteSubmission`, `mintUtilizationCertificate`
- Produces: Real photo upload + 2 realistic demo scenarios (Valid Solar Streetlight Completion vs. Spoofed/Out-of-Geofence Contractor Photo), SHA-256 hash-chained UC certificate (printable PDF), and 60-second Hindi/English Daily 8 AM Brief with Web Speech TTS playback.

- [ ] **Step 1:** Build `VisionAuditTab.tsx` with drag-and-drop real photo upload + instant demo scenarios showing both a **PASS (Auto-UC Minted)** and **FLAGGED (Geofence/Recycled Photo Fraud Blocked)**.
- [ ] **Step 2:** Wire `/api/audit-photo` with optional Gemini Vision analysis + deterministic fallback.
- [ ] **Step 3:** Build `MorningBriefModal.tsx` generating a live 60-second executive brief from current constituency state with browser Hindi/English audio readout.
- [ ] **Step 4:** Run `npm test && npx tsc --noEmit && npm run build` and verify exit 0.
- [ ] **Step 5:** Commit: `feat: add Vision-AI Site Audit, Auto-UC ledger, and Daily 8 AM Brief`.

### Task 5: End-to-End Stage Polish & Local Smoke Verification

**Files:**
- Modify: `README.md` (add live run instructions & architecture summary)

- [ ] **Step 1:** Start dev server locally, verify all 3 tabs, voice presets, DPR PDF print preview, fraud detection flag, and zero console errors.
- [ ] **Step 2:** Update `README.md` with setup, test, and stage demo instructions.
- [ ] **Step 3:** Run full verification gate (`npm test && npx tsc --noEmit && npm run build`) and commit final polish.
