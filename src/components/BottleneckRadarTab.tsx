"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { ConstituencyTwinMap } from "./ConstituencyTwinMap";
import { formatInrLakhs } from "@/lib/mplads/format";
import type { UserRole } from "./CommandHeader";
import type {
  BottleneckAlert,
  ImplementingAgency,
  WorkItem,
} from "@/lib/mplads/types";

interface BottleneckRadarTabProps {
  role: UserRole;
  works: WorkItem[];
  alerts: BottleneckAlert[];
  onGrantDmSanction: (workId: string) => void;
}

const AGENCIES: Array<"ALL" | ImplementingAgency> = [
  "ALL",
  "MCD",
  "PWD Delhi",
  "Delhi Jal Board",
  "DSIIDC",
];

export function BottleneckRadarTab({
  role,
  works,
  alerts,
  onGrantDmSanction,
}: BottleneckRadarTabProps) {
  const [agencyFilter, setAgencyFilter] = useState<"ALL" | ImplementingAgency>("ALL");
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(
    alerts[0]?.workId ?? works[0]?.id ?? null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const alertMap = new Map(alerts.map((a) => [a.workId, a]));

  const filteredWorks = works
    .filter((w) => agencyFilter === "ALL" || w.implementingAgency === agencyFilter)
    .sort((a, b) => {
      const daysA = alertMap.get(a.id)?.daysPending ?? -1;
      const daysB = alertMap.get(b.id)?.daysPending ?? -1;
      return daysB - daysA;
    });

  const handleCopyEscalation = (workId: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(workId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <ConstituencyTwinMap
          works={filteredWorks}
          alerts={alerts}
          selectedWorkId={selectedWorkId}
          onSelectWork={setSelectedWorkId}
        />
      </div>

      <section className="ledger-card animate-ledger-in rounded-2xl p-5 lg:col-span-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-saffron)]">
              Agent 2 · Sanction &amp; SLA Chaser
            </p>
            <h3 className="font-serif text-xl font-semibold text-[var(--ink-primary)]">
              Constituency Works Pipeline
            </h3>
          </div>
          <span className="rounded-full bg-[var(--surface-tint)] px-2.5 py-1 font-mono text-[11px] font-semibold text-[var(--ink-primary)]">
            {filteredWorks.length} Works
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {AGENCIES.map((ag) => (
            <button
              key={ag}
              type="button"
              onClick={() => setAgencyFilter(ag)}
              className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors ${
                agencyFilter === ag
                  ? "border-[var(--ink-primary)] bg-[var(--ink-primary)] text-white"
                  : "border-[var(--rule-hairline)] bg-white text-[var(--ink-muted)] hover:border-[var(--ink-primary)]"
              }`}
            >
              {ag}
            </button>
          ))}
        </div>

        <div className="mt-4 max-h-[440px] space-y-3 overflow-y-auto pr-1">
          {filteredWorks.map((work) => {
            const alert = alertMap.get(work.id);
            const isSelected = selectedWorkId === work.id;
            const canSanction =
              role === "DM_AUTHORITY" && work.stage === "RECOMMENDED";

            return (
              <article
                key={work.id}
                onClick={() => setSelectedWorkId(work.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-[var(--ink-primary)] bg-[var(--canvas-khadi)] shadow-sm"
                    : "border-[var(--rule-hairline)] bg-white hover:border-[var(--ink-muted)]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--ink-muted)]">
                      <span>{work.id}</span>
                      <span>·</span>
                      <span>{work.implementingAgency}</span>
                      <span>·</span>
                      <span className="font-semibold text-[var(--ink-primary)]">
                        {work.category}
                      </span>
                    </div>
                    <h4 className="mt-1 text-sm font-semibold text-[var(--ink-primary)]">
                      {work.title}
                    </h4>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-[var(--ink-primary)]">
                    {formatInrLakhs(work.estimatedCostInr)}
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                  {work.stage === "UC_VERIFIED" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-jade-bg)] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--accent-jade)]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      UC Verified
                    </span>
                  ) : alert ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-saffron-bg)] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--accent-saffron)]">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {alert.daysPending}d pending (SLA {alert.slaThresholdDays}d)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-tint)] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[var(--ink-muted)]">
                      <Clock className="h-3.5 w-3.5" />
                      {work.stage.replace(/_/g, " ")}
                    </span>
                  )}

                  {canSanction ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGrantDmSanction(work.id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-jade)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Grant DM Sanction
                    </button>
                  ) : alert ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyEscalation(work.id, alert.escalationDraft);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent-saffron)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--accent-saffron)] hover:bg-[var(--accent-saffron-bg)]"
                    >
                      {copiedId === work.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied Escalation
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Escalation Nudge
                        </>
                      )}
                    </button>
                  ) : null}
                </div>

                {isSelected && alert && (
                  <div className="mt-3 rounded-lg border border-[var(--accent-saffron)]/30 bg-[var(--accent-saffron-bg)]/70 p-2.5 font-mono text-[11px] leading-relaxed text-[var(--ink-primary)]">
                    {alert.escalationDraft}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
