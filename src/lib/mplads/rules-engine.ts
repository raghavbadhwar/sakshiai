import { DELHI_CPWD_SOR_CATALOG, PROHIBITED_WORK_PATTERNS } from "./sor-catalog";
import type {
  BeneficiaryCategory,
  BottleneckAlert,
  ConstituencyBudget,
  DprDraft,
  EarmarkCheck,
  EligibilityResult,
  ImplementingAgency,
  SorLineItem,
  WorkItem,
} from "./types";

const SC_EARMARK_RATE = 0.15;
const ST_EARMARK_RATE = 0.075;
const CONTINGENCY_RATE = 0.02;
const DM_SANCTION_SLA_DAYS = 45;
const EXECUTION_SLA_DAYS = 90;

export function computeEarmarkCheck(
  category: BeneficiaryCategory,
  proposedAmountInr: number,
  budget: ConstituencyBudget
): EarmarkCheck {
  const scTargetInr = Math.round(budget.annualEntitlementInr * SC_EARMARK_RATE);
  const stTargetInr = Math.round(budget.annualEntitlementInr * ST_EARMARK_RATE);

  const scShortfallInr = Math.max(0, scTargetInr - budget.allocatedScInr);
  const stShortfallInr = Math.max(0, stTargetInr - budget.allocatedStInr);
  const requiredProtectedReserveInr = scShortfallInr + stShortfallInr;

  const totalAllocatedInr =
    budget.allocatedGeneralInr + budget.allocatedScInr + budget.allocatedStInr;
  const remainingAfterProposalInr =
    budget.annualEntitlementInr - totalAllocatedInr - proposedAmountInr;

  const blocksGeneralRecommendation =
    category === "GENERAL" &&
    remainingAfterProposalInr < requiredProtectedReserveInr;

  const message = blocksGeneralRecommendation
    ? `Blocked: Approving ₹${(proposedAmountInr / 100_000).toFixed(2)}L under General leaves ₹${(
        Math.max(0, remainingAfterProposalInr) / 100_000
      ).toFixed(2)}L, which is below the mandatory 15% SC + 7.5% ST reserve shortfall of ₹${(
        requiredProtectedReserveInr / 100_000
      ).toFixed(2)}L.`
    : `Compliant with MPLADS 15% SC (₹${(scTargetInr / 100_000).toFixed(
        1
      )}L) & 7.5% ST (₹${(stTargetInr / 100_000).toFixed(1)}L) statutory earmarks.`;

  return {
    scTargetInr,
    stTargetInr,
    scShortfallInr,
    stShortfallInr,
    blocksGeneralRecommendation,
    message,
  };
}

export function evaluateEligibility(
  transcript: string,
  category: BeneficiaryCategory,
  proposedAmountInr: number,
  budget: ConstituencyBudget
): EligibilityResult {
  const earmarkCheck = computeEarmarkCheck(category, proposedAmountInr, budget);

  for (const rule of PROHIBITED_WORK_PATTERNS) {
    if (rule.pattern.test(transcript)) {
      return {
        eligible: false,
        prohibitedMatch: rule.label,
        reason: `Rejected: Request matches prohibited MPLADS category (${rule.label}). Only durable public community assets are eligible.`,
        earmarkCheck,
      };
    }
  }

  if (earmarkCheck.blocksGeneralRecommendation) {
    return {
      eligible: false,
      prohibitedMatch: null,
      reason: earmarkCheck.message,
      earmarkCheck,
    };
  }

  return {
    eligible: true,
    prohibitedMatch: null,
    reason:
      "Eligible durable community asset under MPLADS FY 2026-31 Guidelines (subject to District Authority administrative sanction).",
    earmarkCheck,
  };
}

function extractQuantityNearKeyword(
  transcript: string,
  keywords: string[],
  fallback: number
): number {
  const lower = transcript.toLowerCase();
  for (const kw of keywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(\\d+(?:,\\d+)?)\\s*(?:m|meters?|nos?|units?|sq\\.?m)?\\s*(?:[a-z]+\\s+){0,2}${escaped}`, "i");
    const match = lower.match(regex);
    if (match && match[1]) {
      const parsed = Number.parseInt(match[1].replace(/,/g, ""), 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }
  return fallback;
}

export function generateDeterministicDpr(
  transcript: string,
  ward: string,
  category: BeneficiaryCategory,
  budget: ConstituencyBudget,
  generatedAtIso = new Date().toISOString()
): DprDraft {
  const lower = transcript.toLowerCase();
  const matchedEntries = DELHI_CPWD_SOR_CATALOG.filter((entry) =>
    entry.keywords.some((kw) => lower.includes(kw))
  );

  const selectedEntries =
    matchedEntries.length > 0 ? matchedEntries : [DELHI_CPWD_SOR_CATALOG[0]];

  const lineItems: SorLineItem[] = selectedEntries.map((entry) => {
    const quantity = extractQuantityNearKeyword(
      transcript,
      entry.keywords,
      entry.defaultQuantity
    );
    return {
      code: entry.code,
      description: entry.description,
      unit: entry.unit,
      quantity,
      unitRateInr: entry.unitRateInr,
      totalInr: quantity * entry.unitRateInr,
    };
  });

  const subtotalInr = lineItems.reduce((sum, item) => sum + item.totalInr, 0);
  const contingencyInr = Math.round(subtotalInr * CONTINGENCY_RATE);
  const grandTotalInr = subtotalInr + contingencyInr;

  const eligibility = evaluateEligibility(
    transcript,
    category,
    grandTotalInr,
    budget
  );

  const primaryAgency: ImplementingAgency = selectedEntries[0].defaultAgency;
  const titleSummary = selectedEntries
    .map((e) => e.keywords[0].replace(/^\w/, (c) => c.toUpperCase()))
    .join(" & ");

  const dprId = `DPR-DL-${generatedAtIso.slice(0, 10).replace(/-/g, "")}-${Math.abs(
    transcript.length * 31 + ward.length * 17
  )
    .toString()
    .slice(0, 4)
    .padStart(4, "0")}`;

  return {
    dprId,
    title: `${titleSummary} Infrastructure Upgrade — ${ward}`,
    ward,
    category,
    implementingAgency: primaryAgency,
    sourceTranscript: transcript,
    lineItems,
    subtotalInr,
    contingencyInr,
    grandTotalInr,
    eligibility,
    generatedAtIso,
  };
}

function diffDays(fromIso: string, toIso: string): number {
  const msPerDay = 86_400_000;
  const start = Date.parse(fromIso);
  const end = Date.parse(toIso);
  return Math.max(0, Math.floor((end - start) / msPerDay));
}

export function detectBottlenecks(
  works: WorkItem[],
  todayIso: string
): BottleneckAlert[] {
  const alerts: BottleneckAlert[] = [];

  for (const work of works) {
    if (work.stage === "UC_VERIFIED") {
      continue;
    }

    const isSanctionStage = work.stage === "RECOMMENDED";
    const referenceDate = isSanctionStage
      ? work.recommendedDateIso
      : work.sanctionedDateIso ?? work.lastUpdatedIso;
    const slaThresholdDays = isSanctionStage
      ? DM_SANCTION_SLA_DAYS
      : EXECUTION_SLA_DAYS;
    const daysPending = diffDays(referenceDate, todayIso);

    if (daysPending <= slaThresholdDays) {
      continue;
    }

    const severity =
      daysPending > slaThresholdDays + 20 ? "CRITICAL" : "WARNING";
    const stalledAmountInr = work.sanctionedCostInr ?? work.estimatedCostInr;
    const amountLakhs = (stalledAmountInr / 100_000).toFixed(2);

    const escalationDraft = isSanctionStage
      ? `Urgent e-SAKSHI Follow-Up [${work.id}]: "${work.title}" (${work.ward}, est. ₹${amountLakhs}L) has awaited District Authority administrative sanction for ${daysPending} days (SLA: ${slaThresholdDays} days). Requesting District Planning Officer review and sanction update for ${work.implementingAgency}.`
      : `Execution SLA Escalation [${work.id}]: "${work.title}" (${work.ward}, sanctioned ₹${amountLakhs}L) assigned to ${work.implementingAgency} has been pending for ${daysPending} days (SLA: ${slaThresholdDays} days). Requesting geo-tagged site inspection upload and Utilization Certificate schedule.`;

    alerts.push({
      workId: work.id,
      title: work.title,
      ward: work.ward,
      implementingAgency: work.implementingAgency,
      stage: work.stage,
      daysPending,
      slaThresholdDays,
      severity,
      stalledAmountInr,
      escalationDraft,
    });
  }

  return alerts.sort((a, b) => b.daysPending - a.daysPending);
}
