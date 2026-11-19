import { createHash } from "node:crypto";
import type {
  AuditReport,
  GeoPoint,
  SiteSubmission,
  UtilizationCertificate,
  WorkItem,
} from "./types";

const MAX_GEOFENCE_METERS = 200;
const MIN_COMPLETION_PCT_FOR_UC = 85;

export function haversineDistanceMeters(a: GeoPoint, b: GeoPoint): number {
  const earthRadiusMeters = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return Math.round(2 * earthRadiusMeters * Math.asin(Math.sqrt(h)));
}

export function verifySiteSubmission(
  submission: SiteSubmission,
  existingImageHashes: string[]
): AuditReport {
  const distanceMeters = haversineDistanceMeters(
    submission.sanctionedLocation,
    submission.photoLocation
  );
  const withinGeofence = distanceMeters <= MAX_GEOFENCE_METERS;
  const duplicatePhotoDetected = existingImageHashes.includes(
    submission.imageHash
  );

  const flags: string[] = [];

  if (!withinGeofence) {
    flags.push(
      `GPS Geofence Breach: Photo captured ${distanceMeters}m from sanctioned site (limit: ${MAX_GEOFENCE_METERS}m).`
    );
  }

  if (duplicatePhotoDetected) {
    flags.push(
      "Duplicate Photo Fraud Alert: Image hash matches a previously submitted contractor record."
    );
  }

  if (!submission.c2paVerified) {
    flags.push(
      "Missing C2PA Content Credentials: Camera provenance signature not verified (requires physical JE sign-off)."
    );
  }

  if (submission.vlmDetectedCompletionPct < MIN_COMPLETION_PCT_FOR_UC) {
    flags.push(
      `Incomplete Physical Progress: Vision AI detected ${submission.vlmDetectedCompletionPct}% completion (minimum ${MIN_COMPLETION_PCT_FOR_UC}% required for final UC).`
    );
  }

  return {
    workId: submission.workId,
    passed: flags.length === 0,
    distanceMeters,
    withinGeofence,
    duplicatePhotoDetected,
    c2paVerified: submission.c2paVerified,
    completionPct: submission.vlmDetectedCompletionPct,
    flags,
  };
}

export function mintUtilizationCertificate(
  work: WorkItem,
  audit: AuditReport,
  previousHash: string,
  issuedAtIso = new Date().toISOString()
): UtilizationCertificate {
  if (!audit.passed) {
    throw new Error(
      `Cannot mint Utilization Certificate for failed audit on ${work.id}: ${audit.flags.join(" ")}`
    );
  }

  const certifiedAmountInr = work.sanctionedCostInr ?? work.estimatedCostInr;
  const ucNumber = `UC-MOSPI-${work.id}-${issuedAtIso.slice(0, 10).replace(/-/g, "")}`;

  const canonicalPayload = JSON.stringify({
    ucNumber,
    workId: work.id,
    ward: work.ward,
    implementingAgency: work.implementingAgency,
    certifiedAmountInr,
    completionPct: audit.completionPct,
    distanceMeters: audit.distanceMeters,
    issuedAtIso,
    previousHash,
  });

  const sha256Hash = createHash("sha256")
    .update(canonicalPayload)
    .digest("hex");

  return {
    ucNumber,
    workId: work.id,
    workTitle: work.title,
    ward: work.ward,
    implementingAgency: work.implementingAgency,
    certifiedAmountInr,
    issuedAtIso,
    previousHash,
    sha256Hash,
  };
}
