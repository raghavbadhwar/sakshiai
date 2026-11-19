"use client";

import { Landmark, ShieldCheck, Volume2, AlertTriangle } from "lucide-react";
import { CONSTITUENCY_META } from "@/lib/mplads/seed-data";
import { formatInrCrores, formatInrLakhs } from "@/lib/mplads/format";
import type { ConstituencyBudget } from "@/lib/mplads/types";

export type UserRole = "MP_OFFICE" | "DM_AUTHORITY";

interface CommandHeaderProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  budget: ConstituencyBudget;
  sanctionedTotalInr: number;
  stalledTotalInr: number;
  stalledCount: number;
  onOpenBrief: () => void;
}

export function CommandHeader({
  role,
  onRoleChange,
  budget,
  sanctionedTotalInr,
  stalledTotalInr,
  stalledCount,
  onOpenBrief,
}: CommandHeaderProps) {
  const scTarget = Math.round(budget.annualEntitlementInr * 0.15);
  const stTarget = Math.round(budget.annualEntitlementInr * 0.075);
  const scPct = Math.min(100, Math.round((budget.allocatedScInr / scTarget) * 100));
  const stPct = Math.min(100, Math.round((budget.allocatedStInr / stTarget) * 100));
  const scShortfall = Math.max(0, scTarget - budget.allocatedScInr);

  return (
    <header className="no-print border-b border-[var(--rule-hairline)] bg-[var(--surface-paper)]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--ink-primary)] bg-[var(--ink-primary)] text-[var(--canvas-khadi)] shadow-sm">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-2xl font-semibold tracking-tight text-[var(--ink-primary)]">
                  SakshiAI
                </h1>
                <span className="rounded-full border border-[var(--accent-jade)]/30 bg-[var(--accent-jade-bg)] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[var(--accent-jade)]">
                  e-SAKSHI FinOps · DPDP 2023
                </span>
              </div>
              <p className="text-xs font-medium text-[var(--ink-muted)]">
                {CONSTITUENCY_META.name} · {CONSTITUENCY_META.financialYear} ·{" "}
                {CONSTITUENCY_META.nodalDistrict}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex rounded-xl border border-[var(--rule-hairline)] bg-[var(--surface-tint)] p-1"
              role="group"
              aria-label="Constitutional Role Switcher"
            >
              <button
                type="button"
                onClick={() => onRoleChange("MP_OFFICE")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  role === "MP_OFFICE"
                    ? "bg-[var(--ink-primary)] text-white shadow-sm"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                }`}
              >
                MP Office (Recommend)
              </button>
              <button
                type="button"
                onClick={() => onRoleChange("DM_AUTHORITY")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  role === "DM_AUTHORITY"
                    ? "bg-[var(--accent-jade)] text-white shadow-sm"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                }`}
              >
                DM Authority (Sanction & Audit)
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenBrief}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent-saffron)]/40 bg-[var(--accent-saffron-bg)] px-3.5 py-2 text-xs font-semibold text-[var(--accent-saffron)] transition-colors hover:bg-[#fae4d3]"
            >
              <Volume2 className="h-4 w-4" />
              8:00 AM Brief
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[var(--rule-hairline)] pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)]/70 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              Annual Entitlement
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-[var(--ink-primary)]">
              {formatInrCrores(budget.annualEntitlementInr)}
            </p>
            <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
              MPLADS FY 2026–31 Non-Lapsable
            </p>
          </div>

          <div className="rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)]/70 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              DM Sanctioned & Active
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-[var(--ink-primary)]">
              {formatInrLakhs(sanctionedTotalInr)}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--accent-jade)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Bhim Singh Separation Enforced
            </p>
          </div>

          <div className="rounded-xl border border-[var(--accent-saffron)]/35 bg-[var(--accent-saffron-bg)]/60 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-saffron)]">
              Stalled Beyond SLA (&gt;45d)
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-[var(--accent-saffron)]">
              {formatInrLakhs(stalledTotalInr)}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-[var(--accent-saffron)]">
              <AlertTriangle className="h-3.5 w-3.5" />
              {stalledCount} files awaiting action
            </p>
          </div>

          <div className="rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)]/70 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                Statutory Earmarks
              </p>
              <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                15% SC · 7.5% ST
              </span>
            </div>
            <div className="mt-2 space-y-2">
              <div>
                <div className="flex justify-between font-mono text-[11px] tabular-nums">
                  <span>SC ({scPct}%)</span>
                  <span className={scShortfall > 0 ? "text-[var(--accent-saffron)] font-semibold" : "text-[var(--accent-jade)]"}>
                    {scShortfall > 0 ? `Shortfall ${formatInrLakhs(scShortfall)}` : "Compliant"}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--rule-hairline)]">
                  <div
                    className={`h-full rounded-full transition-all ${
                      scShortfall > 0 ? "bg-[var(--accent-saffron)]" : "bg-[var(--accent-jade)]"
                    }`}
                    style={{ width: `${scPct}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-mono text-[11px] tabular-nums">
                  <span>ST ({stPct}%)</span>
                  <span className="text-[var(--accent-jade)]">Compliant</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--rule-hairline)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-jade)] transition-all"
                    style={{ width: `${stPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
