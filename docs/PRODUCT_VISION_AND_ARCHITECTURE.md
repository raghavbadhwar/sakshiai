# SakshiAI — Full Product Vision, Frontier Research & Production Architecture

**Mission:** Unblock India's stalled public works funds (₹3,950+ Cr/yr MPLADS + ₹10,000+ Cr/yr MLALADS & municipal grants) by turning unstructured constituency requests into audit-proof Detailed Project Reports (DPRs), automated District sanction workflows, and fraud-resistant Utilization Certificates (UCs).

---

## 1. The Product Vision: Public Works FinOps for India

SakshiAI is a **two-sided Governance FinOps operating system** that strictly enforces the constitutional separation of powers upheld in *Bhim Singh v. Union of India (2010)* ([Anantam IAS](https://anantamias.com/mplads-mp-local-area-development-scheme/)):
- **Legislators (MP / MLA Offices)** *recommend* works, track booth/ward fund velocity, and receive an 8:00 AM daily Hindi/English executive brief.
- **District Authorities (DM / Collector / District Planning Officers)** *verify eligibility, issue administrative sanction, track implementing agencies (PWD/MCD), and release tranches* on **e-SAKSHI** ([Lok Sabha Annex](https://sansad.in/getFile/lsapps/loksabhaquestions/annex/188/AS44_hNPX9H.pdf?source=lsapps)).

### Core Modules
1. **Voice-to-DPR Engine (Intake & Costing):** Converts Hindi/Hinglish/regional WhatsApp voice notes into compliant DPR PDFs benchmarked against CPWD/State Schedule of Rates (SoR), with deterministic validation of MPLADS prohibited-works lists and mandatory **15% SC / 7.5% ST earmarks**.
2. **Stalled-Fund Bottleneck Radar (Execution & SLA):** Tracks every work across 5 lifecycle states (`Recommended` -> `DM Sanctioned` -> `Work Order` -> `In Progress` -> `UC & Asset Verified`), detects SLA breaches at implementing agencies, and drafts formal escalation notices.
3. **Anti-Fraud Site Vision-AI & Auto-UC Ledger (Audit):** Inspects geo-tagged contractor photos for physical progress, runs anti-spoofing provenance checks, generates tamper-evident SHA-256 hash-chained Utilization Certificates (UCs), and publishes a verifiable public Asset Register.
4. **Daily 8:00 AM Executive Brief:** Synthesizes fund utilization %, SC/ST earmark compliance, top 3 stalled files, and verified completed assets into a 60-second audio + visual brief.

---

## 2. Frontier Research & Technical Standards Behind SakshiAI

Every technical choice solves a real failure mode in Indian public administration:

| Failure Mode | Frontier Research / Standard | How SakshiAI Applies It |
| :--- | :--- | :--- |
| **LLM hallucinating MPLADS rules or SoR pricing** | [GraphRAG (Edge et al., Microsoft Research, arXiv:2404.16130)](https://arxiv.org/abs/2404.16130) & [Core-based Hierarchies for Efficient GraphRAG (arXiv:2603.05207)](https://arxiv.org/html/2603.05207v1) + Neuro-Symbolic Verification | Hierarchical knowledge graph over MPLADS FY 2026–31 guidelines & State SoR tables, paired with a **deterministic TypeScript/Python rule engine** for all arithmetic, SC/ST earmarks, and cost totals (LLMs never compute rupee totals). |
| **Noisy code-mixed Hindi / regional voice notes** | [IndicTrans2 (AI4Bharat, arXiv:2305.16307)](https://arxiv.org/abs/2305.16307), [IndicVoices (AI4Bharat & Sarvam AI, arXiv:2403.01926)](https://arxiv.org/html/2403.01926v1), & [Conversational IndicTrans2 (arXiv:2606.29024)](https://arxiv.org/html/2606.29024v1) | Sovereign 22-language Indic speech/translation adapter aligned with [BHASHINI](https://indiaai.gov.in/missions/national-mission-on-natural-language-translation-bhashini) for production; Web Speech API (`hi-IN`) + Gemini Multimodal for zero-latency stage MVP. |
| **Ghost assets, recycled & AI-generated contractor photos** | [C2PA Technical Specification v2.5](https://spec.c2pa.org/specifications/specifications/2.5/specs/C2PA_Specification.html) hardened per [C2PA Limitations Analysis (arXiv:2604.24890)](https://arxiv.org/html/2604.24890v1) | Never trusts C2PA alone: layers C2PA Content Credentials + EXIF/GPS geofence radius check + perceptual hashing (pHash duplicate photo detection across works) + VLM physical object counting + SHA-256 hash-chained UC ledger. |
| **Autonomous agent overstepping constitutional roles** | [Model Context Protocol (Anthropic Research)](https://www.anthropic.com/research/code-execution-with-mcp) & [LangGraph Stateful HITL Orchestration](https://www.freecodecamp.org/news/how-to-build-a-multi-agent-ai-system-with-langgraph-mcp-and-a2a-full-book/) | Stateful cyclic workflow with explicit Human-in-the-Loop (HITL) interrupt gates separating MP recommendation from DM sanction; MCP servers wrap `e-SAKSHI`, `CPWD-SoR`, and `Hamara Neta` cleanly without monolithic glue code. |

---

## 3. Dual-Horizon Tech Stack (Stage MVP vs. Production Scale)

| Layer | 4-Day Bharat Mandapam MVP (Solo-Buildable, Stage-Proof) | Production Pilot & National Scale (Post-MoU) |
| :--- | :--- | :--- |
| **Frontend & UI** | Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS (distinctive civic-editorial design, zero generic AI slop) | Same Next.js frontend + PWA offline-first field inspector app for Junior Engineers |
| **Agent Orchestration** | Structured TypeScript multi-agent state machine + deterministic MPLADS/SoR rule engine + Zod schemas | LangGraph stateful multi-agent server (Python/FastAPI) with persistent HITL checkpoints & MCP servers |
| **AI Models (Voice/Text/Vision)** | Gemini 2.5 Flash (multimodal vision + structured JSON DPR extraction) + Web Speech API (`hi-IN`) with deterministic offline fallback | BHASHINI ULCA + IndicVoices/IndicTrans2 + Gemini / sovereign IndiaAI-hosted VLMs |
| **Verification & Audit** | Client/server EXIF + GPS geofence validator + SHA-256 hash-chained UC receipt + printable DPR & UC PDFs | C2PA signing SDK + perceptual hash (pHash) cross-district duplicate detector + PostgreSQL + immutable WORM audit log |
| **Security & Compliance** | Zero-PII public asset schema, DPDP Act 2023 consent notices, role-separated views (MP vs. DM) | India-region hosting (NIC MeghRaj / Mumbai region), RBAC with Aadhaar eSign / DigiLocker for official UC sign-off |

---

## 4. Engineering Practices Enforced

- **Spec-First & Bite-Sized Plans:** Every subsystem has explicit interfaces, acceptance criteria, and edge-case tests before implementation.
- **TDD for Deterministic Engines:** 100% unit-test coverage on the MPLADS eligibility engine, 15% SC / 7.5% ST earmark math, SoR cost calculator, SLA bottleneck detector, and SHA-256 UC ledger.
- **Zero-Failure Stage Resilience:** Every live AI feature (Voice, DPR generation, Vision-AI photo audit) has an automatic, seamless fallback mode so Bharat Mandapam venue Wi-Fi drops can never break the live pitch.
- **Verification Before Completion:** Every vertical slice must pass `npm test`, `npx tsc --noEmit`, and `npm run build` before committing.
