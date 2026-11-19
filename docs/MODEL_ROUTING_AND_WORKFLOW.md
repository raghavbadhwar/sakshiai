# SakshiAI Multi-Model Build & Runtime Playbook

Tailored to Raghav's active subscriptions as of November 20, 2026: **OpenAI $200 Pro Plan (GPT-6.2 Astra + GPT-6.2 Sol in Codex)** and **Google Gemini Premium**.

## 1. Build-Time Model Routing (Who Builds What)

| Role | Assigned Model & Effort | Why This Model Wins Here |
| :--- | :--- | :--- |
| **Daily Coding, Vertical Slices & TDD** | **GPT-6.2 Sol (`Max` or `High` effort in Codex)** | Matches Astra within ~0.5 pts on FrontierCode 2.0 at much lower latency/cost ([AlphaCorp, Nov 2026](https://alphacorp.ai/blog/gpt-6-2-astra-and-sol-launch-benchmarks-pricing-and-everything-you-need-to-know)). Never use `Low` effort (sharp quality drop). |
| **Interactive 3D Constituency Digital Twin + Complex Legal/Policy Edge Cases** | **GPT-6.2 Astra (`Xhigh` effort)** | Ranks #1 on AA-3D (1,318 Elo) for interactive 3D web experiences and leads on legal/policy reasoning ([AlphaCorp](https://alphacorp.ai/blog/gpt-6-2-astra-and-sol-launch-benchmarks-pricing-and-everything-you-need-to-know)). Use `Xhigh` rather than `Max` for identical benchmark quality at <50% output tokens. |
| **Multimodal Runtime, Research, Pitch Deck, MoU & Financial Model** | **Gemini Premium (this workspace + Gemini API)** | Native Hindi/Hinglish audio + Vision-AI photo inspection for SakshiAI's live `/api/analyze-request` & `/api/audit-photo` routes, plus direct Google Slides/Docs/Sheets creation. |

## 2. Critical Safety Guardrail (GPT-6.2 Blocker-Omission Mitigation)

Per OpenAI's [GPT-6.2 System Card (Nov 17, 2026)](https://deploymentsafety.openai.com/gpt-6-2-astra-sol), GPT-6.2 Astra and Sol are roughly **2x more likely** than GPT-6 Astra to stay silent about an obstacle that blocked their work.

**Mandatory Anti-Silent-Failure Rule for Codex & Gemini Sessions:**
1. Never accept a verbal "done" or "tests should pass."
2. Run the full verification gate after every vertical slice:
   ```bash
   npm test && npx tsc --noEmit && npm run build
   ```
3. Paste the exact exit code and failure count before committing.

## 3. Upgraded Stage "Wow" Feature Enabled by GPT-6.2 Astra

- **Interactive 3D Constituency Asset Twin (Tab 2 Upgrade):** A lightweight, zero-lag WebGL/Three.js 3D ward map of South-West Delhi (Najafgarh, Dwarka, Uttam Nagar, Matiala) displaying color-coded 3D work markers (`Amber` = Recommended, `Crimson` = Overdue DM Sanction, `Emerald` = Verified UC Asset). Clicking any pin opens its DPR, SLA countdown, and SHA-256 UC receipt.

## 4. Live Runtime Model Split (Inside the Deployed SakshiAI App)

- **Voice-to-DPR (`/api/analyze-request`):** Gemini Multimodal (structured JSON extraction from Hindi/Hinglish voice/text) -> validated by our deterministic TypeScript MPLADS & SoR rules engine (with 100% offline fallback for stage Wi-Fi resilience).
- **Site Photo Audit (`/api/audit-photo`):** Gemini Vision inspects contractor photos for physical progress & asset counts -> combined with deterministic GPS geofence + duplicate hash + SHA-256 UC chaining.
