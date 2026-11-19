import { NextResponse } from "next/server";
import { z } from "zod";
import {
  mintUtilizationCertificate,
  verifySiteSubmission,
} from "@/lib/mplads/audit-engine";
import { KNOWN_SUBMITTED_PHOTO_HASHES } from "@/lib/mplads/seed-data";
import type { WorkItem } from "@/lib/mplads/types";

const AuditRequestSchema = z.object({
  work: z.object({
    id: z.string(),
    title: z.string(),
    ward: z.string(),
    category: z.enum(["GENERAL", "SC", "ST"]),
    implementingAgency: z.enum(["PWD Delhi", "MCD", "Delhi Jal Board", "DSIIDC"]),
    stage: z.enum([
      "RECOMMENDED",
      "DM_SANCTIONED",
      "WORK_ORDER_ISSUED",
      "IN_PROGRESS",
      "UC_VERIFIED",
    ]),
    estimatedCostInr: z.number(),
    sanctionedCostInr: z.number().nullable(),
    recommendedDateIso: z.string(),
    sanctionedDateIso: z.string().nullable(),
    lastUpdatedIso: z.string(),
    siteLocation: z.object({ lat: z.number(), lng: z.number() }),
    ucHash: z.string().nullable(),
  }),
  photoLocation: z.object({ lat: z.number(), lng: z.number() }),
  imageHash: z.string().min(4),
  c2paVerified: z.boolean(),
  vlmDetectedCompletionPct: z.number().min(0).max(100),
  vlmDetectedAssets: z.array(z.string()),
  previousHash: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = AuditRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid audit submission payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { work, photoLocation, imageHash, c2paVerified, vlmDetectedCompletionPct, vlmDetectedAssets, previousHash } =
      parsed.data;

    const auditReport = verifySiteSubmission(
      {
        workId: work.id,
        sanctionedLocation: work.siteLocation,
        photoLocation,
        imageHash,
        c2paVerified,
        vlmDetectedCompletionPct,
        vlmDetectedAssets,
        capturedAtIso: new Date().toISOString(),
      },
      KNOWN_SUBMITTED_PHOTO_HASHES
    );

    const utilizationCertificate = auditReport.passed
      ? mintUtilizationCertificate(work as WorkItem, auditReport, previousHash)
      : null;

    return NextResponse.json({
      auditReport,
      utilizationCertificate,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to run site audit verification" },
      { status: 500 }
    );
  }
}
