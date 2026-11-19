# SakshiAI

**Autonomous Public Works DPR, Sanction & Audit Agent for MPLADS / MLALADS**

Built for the **45th India International Trade Fair (IITF 2026) — Open Innovation Conference** at Bharat Mandapam, New Delhi (*Category 2: Political Tech & Grassroots Governance — Agentic AI*).

## The Problem

Under the [MPLAD Scheme](https://sansad.in/getFile/lsapps/loksabhaquestions/annex/188/AS44_hNPX9H.pdf?source=lsapps) (extended through FY 2026–31 at ₹5 crore/year per MP) and state MLALADS/municipal grants, thousands of crores in public works funding stall every year between recommendation, District Authority sanction, and final completion.

The bottleneck is administrative friction, not lack of funds:
- Manual Detailed Project Reports (DPRs) and fragmented State Schedule of Rates (SoR) checks
- Manual tracking of mandatory **15% SC** and **7.5% ST** earmarks
- Delayed District Magistrate / implementing-agency sanctions on **e-SAKSHI**
- Paper-heavy site inspections and Utilization Certificate (UC) generation

## What SakshiAI Does

Respecting constitutional separation of powers (*MP recommends; District Authority sanctions and executes*), SakshiAI orchestrates three autonomous agents:

1. **Voice-to-DPR Agent (`hi-IN` / Hinglish):** Converts MP/booth voice or WhatsApp requests into CPWD/State SoR-benchmarked DPR PDFs with automatic MPLADS eligibility and 15% SC / 7.5% ST earmark verification.
2. **Stalled-Fund Bottleneck Radar:** Tracks every recommended work from recommendation -> DM sanction -> work order -> completion, flagging overdue files and auto-drafting formal escalation reminders.
3. **Vision-AI Site Audit & Auto-UC Agent:** Inspects geo-tagged contractor photos for physical progress and anomalies, auto-generating audit-ready Utilization Certificates (UCs), permanent asset logs, and a daily 8 AM executive brief.

## Compliance & Ecosystem Fit

- **DPDP Act 2023:** Privacy-by-design data handling with zero citizen PII stored in public asset logs.
- **BHASHINI-Ready:** Modular speech-to-text layer designed for 22 Indian voice languages.
- **Complementary to e-SAKSHI & Hamara Neta:** Serves as the financial execution and audit layer downstream of citizen grievance intake.

## Roadmap

- [x] Core architecture & MPLADS FY 2026–31 ruleset
- [ ] Interactive 3-tab Web Command Center MVP
- [ ] Printable DPR PDF & Auto-UC generator
- [ ] 90-day District Pilot & e-SAKSHI API integration
