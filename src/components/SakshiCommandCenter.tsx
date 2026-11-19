"use client";

import { useMemo, useState } from "react";
import { FileText, MapPin, ShieldCheck } from "lucide-react";
import { CommandHeader, type UserRole } from "./CommandHeader";
import { VoiceToDprTab } from "./VoiceToDprTab";
import { BottleneckRadarTab } from "./BottleneckRadarTab";
import { VisionAuditTab } from "./VisionAuditTab";
import { MorningBriefModal } from "./MorningBriefModal";
import { detectBottlenecks } from "@/lib/mplads/rules-engine";
import { DELHI_SEED_WORKS, INITIAL_BUDGET } from "@/lib/mplads/seed-data";
import type {
  ConstituencyBudget,
  DprDraft,
  UtilizationCertificate,
  WorkItem,
} from "@/lib/mplads/types";

type ActiveTab = "VOICE_DPR" | "RADAR" | "VISION_AUDIT";

const TODAY_ISO = "2026-11-20";

export function SakshiCommandCenter() {
  const [role, setRole] = useState<UserRole>("MP_OFFICE");
  const [activeTab, setActiveTab] = useState<ActiveTab>("VOICE_DPR");
  const [works, setWorks] = useState<WorkItem[]>(DELHI_SEED_WORKS);
  const [budget, setBudget] = useState<ConstituencyBudget>(INITIAL_BUDGET);
  const [briefOpen, setBriefOpen] = useState(false);

  const alerts = useMemo(() => detectBottlenecks(works, TODAY_ISO), [works]);

  const sanctionedTotalInr = useMemo(
    () =>
      works.reduce(
        (sum, w) => (w.sanctionedCostInr ? sum + w.sanctionedCostInr : sum),
        0
      ),
    [works]
  );

  const stalledTotalInr = useMemo(
    () => alerts.reduce((sum, a) => sum + a.stalledAmountInr, 0),
    [alerts]
  );

  const handleSubmitWork = (work: WorkItem, dpr: DprDraft) => {
    setWorks((prev) => [work, ...prev]);
    setBudget((prev) => ({
      ...prev,
      allocatedGeneralInr:
        dpr.category === "GENERAL"
          ? prev.allocatedGeneralInr + dpr.grandTotalInr
          : prev.allocatedGeneralInr,
      allocatedScInr:
        dpr.category === "SC"
          ? prev.allocatedScInr + dpr.grandTotalInr
          : prev.allocatedScInr,
      allocatedStInr:
        dpr.category === "ST"
          ? prev.allocatedStInr + dpr.grandTotalInr
          : prev.allocatedStInr,
    }));
  };

  const handleGrantDmSanction = (workId: string) => {
    setWorks((prev) =>
      prev.map((w) =>
        w.id === workId
          ? {
              ...w,
              stage: "DM_SANCTIONED",
              sanctionedCostInr: w.estimatedCostInr,
              sanctionedDateIso: TODAY_ISO,
              lastUpdatedIso: TODAY_ISO,
            }
          : w
      )
    );
  };

  const handleUcMinted = (workId: string, uc: UtilizationCertificate) => {
    setWorks((prev) =>
      prev.map((w) =>
        w.id === workId
          ? {
              ...w,
              stage: "UC_VERIFIED",
              sanctionedCostInr: w.sanctionedCostInr ?? w.estimatedCostInr,
              lastUpdatedIso: TODAY_ISO,
              ucHash: uc.sha256Hash,
            }
          : w
      )
    );
  };

  const tabs: Array<{ id: ActiveTab; label: string; icon: typeof FileText }> = [
    { id: "VOICE_DPR", label: "1. Voice-to-DPR Studio", icon: FileText },
    { id: "RADAR", label: "2. Bottleneck Radar & Twin", icon: MapPin },
    { id: "VISION_AUDIT", label: "3. Vision-AI Site Audit & UC", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen pb-14">
      <CommandHeader
        role={role}
        onRoleChange={setRole}
        budget={budget}
        sanctionedTotalInr={sanctionedTotalInr}
        stalledTotalInr={stalledTotalInr}
        stalledCount={alerts.length}
        onOpenBrief={() => setBriefOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav
          className="no-print mb-6 flex flex-wrap gap-2 border-b border-[var(--rule-hairline)] pb-4"
          aria-label="SakshiAI Command Center Tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "border-[var(--ink-primary)] bg-[var(--ink-primary)] text-white shadow-sm"
                    : "border-[var(--rule-hairline)] bg-white text-[var(--ink-muted)] hover:border-[var(--ink-primary)] hover:text-[var(--ink-primary)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {activeTab === "VOICE_DPR" && (
          <VoiceToDprTab budget={budget} onSubmitWork={handleSubmitWork} />
        )}
        {activeTab === "RADAR" && (
          <BottleneckRadarTab
            role={role}
            works={works}
            alerts={alerts}
            onGrantDmSanction={handleGrantDmSanction}
          />
        )}
        {activeTab === "VISION_AUDIT" && (
          <VisionAuditTab works={works} onUcMinted={handleUcMinted} />
        )}
      </main>

      <MorningBriefModal
        open={briefOpen}
        onClose={() => setBriefOpen(false)}
        budget={budget}
        works={works}
        alerts={alerts}
      />
    </div>
  );
}
