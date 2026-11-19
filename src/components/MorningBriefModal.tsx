"use client";

import { useState } from "react";
import { Play, Square, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatInrLakhs } from "@/lib/mplads/format";
import type { BottleneckAlert, ConstituencyBudget, WorkItem } from "@/lib/mplads/types";

interface MorningBriefModalProps {
  open: boolean;
  onClose: () => void;
  budget: ConstituencyBudget;
  works: WorkItem[];
  alerts: BottleneckAlert[];
}

export function MorningBriefModal({
  open,
  onClose,
  budget,
  works,
  alerts,
}: MorningBriefModalProps) {
  const [speaking, setSpeaking] = useState(false);

  if (!open) return null;

  const verifiedCount = works.filter((w) => w.stage === "UC_VERIFIED").length;
  const scTarget = Math.round(budget.annualEntitlementInr * 0.15);
  const scShortfall = Math.max(0, scTarget - budget.allocatedScInr);
  const topAlert = alerts[0];

  const briefText = `Namaskar. SakshiAI 8 AM Constituency Brief for West Delhi, FY 2026-27. You have ${works.length} tracked MPLADS works, with ${verifiedCount} verified Utilization Certificates on ledger. ${alerts.length} files are currently stalled beyond SLA. Top priority: ${
    topAlert
      ? `${topAlert.title} in ${topAlert.ward}, pending ${topAlert.daysPending} days with ${topAlert.implementingAgency}.`
      : "No overdue bottlenecks today."
  } ${
    scShortfall > 0
      ? `Statutory alert: Prioritize ${formatInrLakhs(scShortfall)} in SC-category community assets to satisfy the mandatory 15 percent earmark.`
      : "Mandatory 15 percent SC and 7.5 percent ST earmarks are fully compliant."
  }`;

  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(briefText);
    utterance.lang = "en-IN";
    utterance.rate = 1.0;
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-[#111d35]/50 p-4 backdrop-blur-xs">
      <div className="ledger-card animate-ledger-in w-full max-w-xl rounded-2xl p-6">
        <div className="flex items-start justify-between border-b border-[var(--rule-hairline)] pb-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-saffron)]">
              Daily 8:00 AM Executive Brief · WhatsApp & Audio
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-[var(--ink-primary)]">
              West Delhi Morning Pulse
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
              }
              setSpeaking(false);
              onClose();
            }}
            className="rounded-lg p-1.5 text-[var(--ink-muted)] hover:bg-[var(--surface-tint)]"
            aria-label="Close morning brief"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--ink-primary)]">
          <div className="rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)] p-4">
            {briefText}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--accent-saffron)]/30 bg-[var(--accent-saffron-bg)] p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-saffron)]">
                <AlertTriangle className="h-4 w-4" />
                Overdue Files
              </div>
              <p className="mt-1 font-mono text-lg font-semibold text-[var(--ink-primary)]">
                {alerts.length} works
              </p>
            </div>
            <div className="rounded-xl border border-[var(--accent-jade)]/30 bg-[var(--accent-jade-bg)] p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-jade)]">
                <CheckCircle2 className="h-4 w-4" />
                Verified UC Assets
              </div>
              <p className="mt-1 font-mono text-lg font-semibold text-[var(--ink-primary)]">
                {verifiedCount} assets
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[var(--rule-hairline)] pt-4">
          <button
            type="button"
            onClick={handleToggleSpeech}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--ink-primary)] px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            {speaking ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {speaking ? "Stop Audio Brief" : "Play 60s Audio Brief"}
          </button>
          <span className="font-mono text-[11px] text-[var(--ink-muted)]">
            BHASHINI 22-Language Ready
          </span>
        </div>
      </div>
    </div>
  );
}
