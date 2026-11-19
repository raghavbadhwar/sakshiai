import { describe, expect, it } from "vitest";
import {
  haversineDistanceMeters,
  mintUtilizationCertificate,
  verifySiteSubmission,
} from "../audit-engine";
import type { SiteSubmission, WorkItem } from "../types";

const SAMPLE_WORK: WorkItem = {
  id: "WK-204",
  title: "25 LED Solar Street Lights — Uttam Nagar",
  ward: "Uttam Nagar (Ward 114)",
  category: "SC",
  implementingAgency: "PWD Delhi",
  stage: "IN_PROGRESS",
  estimatedCostInr: 1_125_000,
  sanctionedCostInr: 1_125_000,
  recommendedDateIso: "2026-08-10",
  sanctionedDateIso: "2026-09-02",
  lastUpdatedIso: "2026-11-10",
  siteLocation: { lat: 28.6219, lng: 77.059 },
  ucHash: null,
};

describe("verifySiteSubmission", () => {
  it("fails audit when contractor photo is captured outside the 200m GPS geofence", () => {
    const submission: SiteSubmission = {
      workId: "WK-204",
      sanctionedLocation: { lat: 28.6219, lng: 77.059 },
      photoLocation: { lat: 28.635, lng: 77.07 }, // ~1.8 km away
      imageHash: "img_hash_far_001",
      c2paVerified: true,
      vlmDetectedCompletionPct: 95,
      vlmDetectedAssets: ["25 solar street light poles"],
      capturedAtIso: "2026-11-19T10:30:00Z",
    };

    const report = verifySiteSubmission(submission, []);

    expect(report.passed).toBe(false);
    expect(report.withinGeofence).toBe(false);
    expect(report.distanceMeters).toBeGreaterThan(200);
    expect(report.flags.some((f) => f.toLowerCase().includes("geofence"))).toBe(
      true
    );
  });

  it("blocks recycled/duplicate contractor photos already used on another work", () => {
    const submission: SiteSubmission = {
      workId: "WK-204",
      sanctionedLocation: { lat: 28.6219, lng: 77.059 },
      photoLocation: { lat: 28.622, lng: 77.0591 }, // ~15m away
      imageHash: "img_hash_recycled_999",
      c2paVerified: true,
      vlmDetectedCompletionPct: 100,
      vlmDetectedAssets: ["25 solar street light poles"],
      capturedAtIso: "2026-11-19T10:30:00Z",
    };

    const report = verifySiteSubmission(submission, ["img_hash_recycled_999"]);

    expect(report.passed).toBe(false);
    expect(report.duplicatePhotoDetected).toBe(true);
    expect(report.flags.some((f) => f.toLowerCase().includes("duplicate"))).toBe(
      true
    );
  });

  it("passes valid in-geofence, unique, high-completion submissions", () => {
    const submission: SiteSubmission = {
      workId: "WK-204",
      sanctionedLocation: { lat: 28.6219, lng: 77.059 },
      photoLocation: { lat: 28.6221, lng: 77.0592 },
      imageHash: "img_hash_unique_777",
      c2paVerified: true,
      vlmDetectedCompletionPct: 96,
      vlmDetectedAssets: ["25 LED solar poles", "foundation plinths"],
      capturedAtIso: "2026-11-19T10:30:00Z",
    };

    const report = verifySiteSubmission(submission, ["img_hash_other_111"]);

    expect(haversineDistanceMeters(submission.sanctionedLocation, submission.photoLocation)).toBeLessThan(200);
    expect(report.passed).toBe(true);
    expect(report.flags).toHaveLength(0);
  });
});

describe("mintUtilizationCertificate", () => {
  it("produces a deterministic 64-char SHA-256 hash chained to the previous UC hash", () => {
    const report = verifySiteSubmission(
      {
        workId: "WK-204",
        sanctionedLocation: SAMPLE_WORK.siteLocation,
        photoLocation: { lat: 28.622, lng: 77.0591 },
        imageHash: "img_hash_valid_002",
        c2paVerified: true,
        vlmDetectedCompletionPct: 98,
        vlmDetectedAssets: ["25 solar poles"],
        capturedAtIso: "2026-11-19T10:30:00Z",
      },
      []
    );

    const uc1 = mintUtilizationCertificate(
      SAMPLE_WORK,
      report,
      "GENESIS_HASH_0000",
      "2026-11-20T01:00:00Z"
    );
    const uc2 = mintUtilizationCertificate(
      SAMPLE_WORK,
      report,
      "GENESIS_HASH_0000",
      "2026-11-20T01:00:00Z"
    );

    expect(uc1.sha256Hash).toMatch(/^[a-f0-9]{64}$/);
    expect(uc1.sha256Hash).toBe(uc2.sha256Hash);
    expect(uc1.previousHash).toBe("GENESIS_HASH_0000");
    expect(uc1.certifiedAmountInr).toBe(1_125_000);
  });

  it("throws when attempting to mint a UC for a failed audit", () => {
    const failedReport = verifySiteSubmission(
      {
        workId: "WK-204",
        sanctionedLocation: SAMPLE_WORK.siteLocation,
        photoLocation: { lat: 28.7, lng: 77.2 },
        imageHash: "img_hash_bad",
        c2paVerified: false,
        vlmDetectedCompletionPct: 40,
        vlmDetectedAssets: [],
        capturedAtIso: "2026-11-19T10:30:00Z",
      },
      []
    );

    expect(() =>
      mintUtilizationCertificate(
        SAMPLE_WORK,
        failedReport,
        "GENESIS_HASH_0000",
        "2026-11-20T01:00:00Z"
      )
    ).toThrow(/failed audit/i);
  });
});
