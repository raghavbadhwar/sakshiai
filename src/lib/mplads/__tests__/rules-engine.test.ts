import { describe, expect, it } from "vitest";
import {
  detectBottlenecks,
  evaluateEligibility,
  generateDeterministicDpr,
} from "../rules-engine";
import type { ConstituencyBudget, WorkItem } from "../types";

const BASE_BUDGET: ConstituencyBudget = {
  annualEntitlementInr: 50_000_000, // ₹5.00 Cr
  allocatedGeneralInr: 20_000_000, // ₹2.00 Cr
  allocatedScInr: 8_000_000, // ₹80L (meets 15% = ₹75L)
  allocatedStInr: 4_000_000, // ₹40L (meets 7.5% = ₹37.5L)
};

describe("evaluateEligibility", () => {
  it("rejects prohibited MPLADS works such as office renovation or commercial complex", () => {
    const result = evaluateEligibility(
      "Najafgarh mein MP office renovation aur commercial complex shops banwani hai",
      "GENERAL",
      5_000_000,
      BASE_BUDGET
    );

    expect(result.eligible).toBe(false);
    expect(result.prohibitedMatch).not.toBeNull();
    expect(result.reason.toLowerCase()).toContain("prohibited");
  });

  it("blocks a General-category work when remaining balance would make 15% SC / 7.5% ST earmarks unachievable", () => {
    const tightBudget: ConstituencyBudget = {
      annualEntitlementInr: 50_000_000, // ₹5.00 Cr -> SC target ₹75L, ST target ₹37.5L (total ₹1.125 Cr)
      allocatedGeneralInr: 38_000_000, // ₹3.80 Cr spent on General -> ₹1.20 Cr left
      allocatedScInr: 0,
      allocatedStInr: 0,
    };

    // Trying to spend ₹20L more on General leaves only ₹1.00 Cr, which cannot cover ₹1.125 Cr SC+ST earmark!
    const result = evaluateEligibility(
      "Dwarka Sector 12 mein 20 solar street lights lagwani hain",
      "GENERAL",
      2_000_000,
      tightBudget
    );

    expect(result.eligible).toBe(false);
    expect(result.earmarkCheck.blocksGeneralRecommendation).toBe(true);
    expect(result.earmarkCheck.scTargetInr).toBe(7_500_000);
    expect(result.earmarkCheck.stTargetInr).toBe(3_750_000);
  });

  it("approves an eligible SC-category durable community asset even when General is blocked", () => {
    const tightBudget: ConstituencyBudget = {
      annualEntitlementInr: 50_000_000,
      allocatedGeneralInr: 38_750_000,
      allocatedScInr: 0,
      allocatedStInr: 0,
    };

    const result = evaluateEligibility(
      "Matiala SC basti mein 400m drainage line aur solar street lights",
      "SC",
      2_500_000,
      tightBudget
    );

    expect(result.eligible).toBe(true);
    expect(result.prohibitedMatch).toBeNull();
  });
});

describe("generateDeterministicDpr", () => {
  it("computes deterministic CPWD/Delhi SoR line items plus 2% contingency with zero floating-point drift", () => {
    const dpr = generateDeterministicDpr(
      "Najafgarh Ward 14 mein 400m drainage repair aur 25 solar street lights chahiye",
      "Najafgarh (Ward 14)",
      "SC",
      BASE_BUDGET
    );

    expect(dpr.eligibility.eligible).toBe(true);
    expect(dpr.lineItems.length).toBeGreaterThanOrEqual(2);

    const recomputedSubtotal = dpr.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitRateInr,
      0
    );
    expect(dpr.subtotalInr).toBe(recomputedSubtotal);
    expect(dpr.contingencyInr).toBe(Math.round(recomputedSubtotal * 0.02));
    expect(dpr.grandTotalInr).toBe(dpr.subtotalInr + dpr.contingencyInr);
  });
});

describe("detectBottlenecks", () => {
  it("flags recommended works stalled beyond 45-day DM administrative sanction SLA", () => {
    const works: WorkItem[] = [
      {
        id: "WK-101",
        title: "400m RCC Storm Drain — Najafgarh",
        ward: "Najafgarh (Ward 14)",
        category: "SC",
        implementingAgency: "MCD",
        stage: "RECOMMENDED",
        estimatedCostInr: 4_200_000,
        sanctionedCostInr: null,
        recommendedDateIso: "2026-09-01",
        sanctionedDateIso: null,
        lastUpdatedIso: "2026-09-01",
        siteLocation: { lat: 28.6092, lng: 76.9798 },
        ucHash: null,
      },
      {
        id: "WK-102",
        title: "Community Library Solar Roof — Dwarka",
        ward: "Dwarka (Ward 121)",
        category: "GENERAL",
        implementingAgency: "PWD Delhi",
        stage: "UC_VERIFIED",
        estimatedCostInr: 1_800_000,
        sanctionedCostInr: 1_800_000,
        recommendedDateIso: "2026-07-01",
        sanctionedDateIso: "2026-07-20",
        lastUpdatedIso: "2026-10-15",
        siteLocation: { lat: 28.5921, lng: 77.046 },
        ucHash: "abc123",
      },
    ];

    const alerts = detectBottlenecks(works, "2026-11-20");

    expect(alerts).toHaveLength(1);
    expect(alerts[0].workId).toBe("WK-101");
    expect(alerts[0].daysPending).toBe(80);
    expect(alerts[0].severity).toBe("CRITICAL");
    expect(alerts[0].escalationDraft).toContain("WK-101");
  });
});
