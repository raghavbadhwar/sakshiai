"use client";

import { useMemo, useState } from "react";
import {
  Mic,
  MicOff,
  Printer,
  CheckCircle2,
  XCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { generateDeterministicDpr } from "@/lib/mplads/rules-engine";
import { formatInrExact, formatInrLakhs } from "@/lib/mplads/format";
import type {
  BeneficiaryCategory,
  ConstituencyBudget,
  DprDraft,
  WorkItem,
} from "@/lib/mplads/types";

interface VoiceToDprTabProps {
  budget: ConstituencyBudget;
  onSubmitWork: (work: WorkItem, dpr: DprDraft) => void;
}

const WARDS = [
  { label: "Najafgarh (Ward 14)", lat: 28.6092, lng: 76.9798 },
  { label: "Dwarka (Ward 121)", lat: 28.5921, lng: 77.046 },
  { label: "Uttam Nagar (Ward 114)", lat: 28.6219, lng: 77.059 },
  { label: "Matiala (Ward 125)", lat: 28.6041, lng: 77.0324 },
  { label: "Kakrola (Ward 123)", lat: 28.6108, lng: 77.0221 },
];

const STAGE_PRESETS: Array<{
  label: string;
  tag: string;
  transcript: string;
  ward: string;
  category: BeneficiaryCategory;
}> = [
  {
    label: "Eligible SC Drainage + Solar Lights",
    tag: "Recommended Demo",
    transcript:
      "Najafgarh Ward 14 mein 400m drainage repair aur 25 solar street lights lagwani hain",
    ward: "Najafgarh (Ward 14)",
    category: "SC",
  },
  {
    label: "Dwarka Paver Lane + RO Water ATM",
    tag: "General Category",
    transcript:
      "Dwarka Sector 12 mein 1200 sq.m paver lane aur 3 RO drinking water ATM chahiye",
    ward: "Dwarka (Ward 121)",
    category: "GENERAL",
  },
  {
    label: "Prohibited MP Office Renovation Trap",
    tag: "Guardrail Test",
    transcript:
      "Najafgarh mein MP office renovation aur commercial complex shops banwani hai",
    ward: "Najafgarh (Ward 14)",
    category: "GENERAL",
  },
];

export function VoiceToDprTab({ budget, onSubmitWork }: VoiceToDprTabProps) {
  const [transcript, setTranscript] = useState(STAGE_PRESETS[0].transcript);
  const [ward, setWard] = useState(STAGE_PRESETS[0].ward);
  const [category, setCategory] = useState<BeneficiaryCategory>("SC");
  const [listening, setListening] = useState(false);
  const [voiceNoteStatus, setVoiceNoteStatus] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const dpr = useMemo(
    () =>
      generateDeterministicDpr(
        transcript.trim() || STAGE_PRESETS[0].transcript,
        ward,
        category,
        budget,
        "2026-11-20T09:00:00Z"
      ),
    [transcript, ward, category, budget]
  );

  interface BrowserSpeechRecognition {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start: () => void;
  }

  const handleVoiceCapture = () => {
    if (typeof window === "undefined") return;
    const win = window as unknown as {
      SpeechRecognition?: new () => BrowserSpeechRecognition;
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
    };
    const SpeechRecognitionCtor =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setVoiceNoteStatus(
        "Browser voice API unavailable here — type directly or use a 1-click Hinglish preset below."
      );
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    setVoiceNoteStatus("Listening in Hindi / Hinglish (hi-IN)...");

    recognition.onresult = (event) => {
      const spoken = event.results[0]?.[0]?.transcript;
      if (spoken) {
        setTranscript(spoken);
        setVoiceNoteStatus(`Captured voice note: "${spoken}"`);
      }
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      setVoiceNoteStatus(
        "Mic permission or venue noise interrupted capture — use a preset or edit text directly."
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const handleSubmitToPipeline = () => {
    if (!dpr.eligibility.eligible) return;
    const wardCoord = WARDS.find((w) => w.label === ward) ?? WARDS[0];
    const newWork: WorkItem = {
      id: `WK-2026-${Math.floor(200 + Math.random() * 700)}`,
      title: dpr.title,
      ward: dpr.ward,
      category: dpr.category,
      implementingAgency: dpr.implementingAgency,
      stage: "RECOMMENDED",
      estimatedCostInr: dpr.grandTotalInr,
      sanctionedCostInr: null,
      recommendedDateIso: "2026-11-20",
      sanctionedDateIso: null,
      lastUpdatedIso: "2026-11-20",
      siteLocation: { lat: wardCoord.lat, lng: wardCoord.lng },
      ucHash: null,
    };
    onSubmitWork(newWork, dpr);
    setSubmittedId(newWork.id);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left 40% — Voice Intake & Constitutional Guardrails */}
      <section className="no-print ledger-card animate-ledger-in rounded-2xl p-6 lg:col-span-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-saffron)]">
              Agent 1 · Voice-to-DPR Engine
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-[var(--ink-primary)]">
              Constituency Work Intake
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-tint)] px-2.5 py-1 font-mono text-[11px] text-[var(--ink-muted)]">
            <Sparkles className="h-3 w-3 text-[var(--accent-saffron)]" />
            Zero LLM Math
          </span>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleVoiceCapture}
            className={`flex w-full items-center justify-center gap-2.5 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all ${
              listening
                ? "border-[var(--accent-saffron)] bg-[var(--accent-saffron)] text-white shadow-md"
                : "border-[var(--ink-primary)] bg-[var(--ink-primary)] text-white hover:opacity-95"
            }`}
          >
            {listening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
            {listening ? "Listening (Hindi / Hinglish)..." : "Speak Request (Hindi / Hinglish)"}
          </button>
          {voiceNoteStatus && (
            <p className="mt-2 font-mono text-xs text-[var(--ink-muted)]">
              {voiceNoteStatus}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="dpr-transcript"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]"
          >
            WhatsApp / Voice Transcript
          </label>
          <textarea
            id="dpr-transcript"
            rows={3}
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              setSubmittedId(null);
            }}
            className="mt-1.5 w-full rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)]/60 p-3 text-sm text-[var(--ink-primary)] focus:border-[var(--ink-primary)] focus:outline-none"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ward-select"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]"
            >
              Target Ward
            </label>
            <select
              id="ward-select"
              value={ward}
              onChange={(e) => {
                setWard(e.target.value);
                setSubmittedId(null);
              }}
              className="mt-1.5 w-full rounded-xl border border-[var(--rule-hairline)] bg-white px-3 py-2 text-sm text-[var(--ink-primary)] focus:border-[var(--ink-primary)] focus:outline-none"
            >
              {WARDS.map((w) => (
                <option key={w.label} value={w.label}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              Beneficiary Earmark
            </span>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {(["SC", "ST", "GENERAL"] as BeneficiaryCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setSubmittedId(null);
                  }}
                  className={`rounded-lg border py-2 font-mono text-xs font-semibold transition-colors ${
                    category === cat
                      ? "border-[var(--ink-primary)] bg-[var(--ink-primary)] text-white"
                      : "border-[var(--rule-hairline)] bg-white text-[var(--ink-muted)] hover:border-[var(--ink-primary)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-[var(--rule-hairline)] pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
            One-Click Stage Demo Presets
          </p>
          <div className="mt-2 space-y-2">
            {STAGE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setTranscript(preset.transcript);
                  setWard(preset.ward);
                  setCategory(preset.category);
                  setSubmittedId(null);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)]/70 px-3.5 py-2.5 text-left transition-colors hover:border-[var(--ink-primary)] hover:bg-white"
              >
                <span className="text-xs font-semibold text-[var(--ink-primary)]">
                  {preset.label}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                    preset.tag === "Guardrail Test"
                      ? "bg-[var(--accent-crimson-bg)] text-[var(--accent-crimson)]"
                      : "bg-[var(--surface-tint)] text-[var(--ink-muted)]"
                  }`}
                >
                  {preset.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Right 60% — Official Printable DPR Stationery */}
      <section className="official-sheet print-only-sheet animate-ledger-in rounded-2xl p-6 lg:col-span-7">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--rule-hairline)] pb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--ink-muted)]">
              Draft Detailed Project Report (MPLADS FY 2026–31) · {dpr.dprId}
            </p>
            <h3 className="mt-1 font-serif text-2xl font-semibold text-[var(--ink-primary)]">
              {dpr.title}
            </h3>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Implementing Agency: <strong className="text-[var(--ink-primary)]">{dpr.implementingAgency}</strong> · Category:{" "}
              <strong className="font-mono text-[var(--ink-primary)]">{dpr.category}</strong>
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs font-semibold ${
              dpr.eligibility.eligible
                ? "border-[var(--accent-jade)]/40 bg-[var(--accent-jade-bg)] text-[var(--accent-jade)]"
                : "border-[var(--accent-crimson)]/40 bg-[var(--accent-crimson-bg)] text-[var(--accent-crimson)]"
            }`}
          >
            {dpr.eligibility.eligible ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {dpr.eligibility.eligible ? "ELIGIBLE FOR DM SANCTION" : "BLOCKED BY GUARDRAIL"}
          </div>
        </div>

        <div
          className={`mt-4 rounded-xl border p-3.5 text-xs leading-relaxed ${
            dpr.eligibility.eligible
              ? "border-[var(--accent-jade)]/30 bg-[var(--accent-jade-bg)]/60 text-[var(--ink-primary)]"
              : "border-[var(--accent-crimson)]/40 bg-[var(--accent-crimson-bg)] text-[var(--accent-crimson)]"
          }`}
        >
          <p className="font-semibold">{dpr.eligibility.reason}</p>
          <p className="mt-1 opacity-85">{dpr.eligibility.earmarkCheck.message}</p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--ink-primary)]/20 font-mono text-[11px] uppercase text-[var(--ink-muted)]">
                <th className="py-2 pr-3">CPWD SoR</th>
                <th className="py-2 pr-3">Item Description</th>
                <th className="py-2 pr-3 text-right">Qty</th>
                <th className="py-2 pr-3 text-right">Rate (₹)</th>
                <th className="py-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rule-hairline)]">
              {dpr.lineItems.map((item) => (
                <tr key={item.code}>
                  <td className="py-3 pr-3 font-mono font-medium text-[var(--ink-primary)]">
                    {item.code}
                  </td>
                  <td className="py-3 pr-3 text-[var(--ink-primary)]">
                    {item.description}
                  </td>
                  <td className="py-3 pr-3 text-right font-mono tabular-nums">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3 pr-3 text-right font-mono tabular-nums">
                    {formatInrExact(item.unitRateInr)}
                  </td>
                  <td className="py-3 text-right font-mono font-semibold tabular-nums">
                    {formatInrExact(item.totalInr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 ml-auto max-w-xs space-y-1.5 border-t border-[var(--rule-hairline)] pt-3 font-mono text-xs tabular-nums">
          <div className="flex justify-between text-[var(--ink-muted)]">
            <span>Schedule of Rates Subtotal</span>
            <span>{formatInrExact(dpr.subtotalInr)}</span>
          </div>
          <div className="flex justify-between text-[var(--ink-muted)]">
            <span>Statutory Contingency (2%)</span>
            <span>{formatInrExact(dpr.contingencyInr)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--ink-primary)]/20 pt-2 text-sm font-semibold text-[var(--ink-primary)]">
            <span>Estimated Grand Total</span>
            <span>
              {formatInrExact(dpr.grandTotalInr)} ({formatInrLakhs(dpr.grandTotalInr)})
            </span>
          </div>
        </div>

        <div className="no-print mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule-hairline)] pt-4">
          <button
            type="button"
            disabled={!dpr.eligibility.eligible}
            onClick={handleSubmitToPipeline}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              dpr.eligibility.eligible
                ? "bg-[var(--accent-jade)] text-white hover:opacity-95"
                : "cursor-not-allowed bg-[var(--surface-tint)] text-[var(--ink-muted)]"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            {submittedId
              ? `Submitted (${submittedId}) — View in Tab 2`
              : "Submit Recommendation to DM Pipeline"}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--ink-primary)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--ink-primary)] transition-colors hover:bg-[var(--surface-tint)]"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Official DPR PDF
          </button>
        </div>
      </section>
    </div>
  );
}
