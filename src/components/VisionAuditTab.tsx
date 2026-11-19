"use client";

import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  ShieldAlert,
  Printer,
  Lock,
  Upload,
} from "lucide-react";
import { formatInrExact } from "@/lib/mplads/format";
import type {
  AuditReport,
  UtilizationCertificate,
  WorkItem,
} from "@/lib/mplads/types";

interface VisionAuditTabProps {
  works: WorkItem[];
  onUcMinted: (workId: string, uc: UtilizationCertificate) => void;
}

interface AuditResponse {
  auditReport: AuditReport;
  utilizationCertificate: UtilizationCertificate | null;
}

export function VisionAuditTab({ works, onUcMinted }: VisionAuditTabProps) {
  const auditableWorks = works.filter((w) => w.stage !== "UC_VERIFIED");
  const [selectedWorkId, setSelectedWorkId] = useState(
    auditableWorks[0]?.id ?? works[0]?.id ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedWork =
    works.find((w) => w.id === selectedWorkId) ?? works[0];

  const latestUcHash =
    works.find((w) => w.ucHash)?.ucHash ??
    "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

  const runAudit = async (scenario: "VALID" | "FRAUD" | "UPLOAD") => {
    if (!selectedWork) return;
    setLoading(true);
    setError(null);

    const payload =
      scenario === "FRAUD"
        ? {
            work: selectedWork,
            photoLocation: {
              lat: selectedWork.siteLocation.lat + 0.014,
              lng: selectedWork.siteLocation.lng + 0.011,
            },
            imageHash: "img_hash_recycled_contractor_999",
            c2paVerified: false,
            vlmDetectedCompletionPct: 52,
            vlmDetectedAssets: ["Unverified partial earthwork"],
            previousHash: latestUcHash,
          }
        : {
            work: selectedWork,
            photoLocation: {
              lat: selectedWork.siteLocation.lat + 0.0001,
              lng: selectedWork.siteLocation.lng + 0.0001,
            },
            imageHash: `img_hash_live_${selectedWork.id}_${Date.now()}`,
            c2paVerified: true,
            vlmDetectedCompletionPct: 96,
            vlmDetectedAssets: [
              "Installed physical asset verified",
              "GPS + C2PA hardware signature intact",
            ],
            previousHash: latestUcHash,
          };

    try {
      const res = await fetch("/api/audit-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Audit API returned an error");
      }
      const data = (await res.json()) as AuditResponse;
      setResult(data);
      if (data.utilizationCertificate) {
        onUcMinted(selectedWork.id, data.utilizationCertificate);
      }
    } catch {
      setError("Could not reach audit endpoint. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left 50% — Field Photo Forensics */}
      <section className="no-print ledger-card animate-ledger-in rounded-2xl p-6 lg:col-span-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-saffron)]">
          Agent 3 · Anti-Fraud Site Vision-AI
        </p>
        <h2 className="mt-1 font-serif text-xl font-semibold text-[var(--ink-primary)]">
          Geo-Tagged Inspection &amp; C2PA Forensics
        </h2>

        <div className="mt-4">
          <label
            htmlFor="audit-work-select"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]"
          >
            Select Sanctioned / Active Work
          </label>
          <select
            id="audit-work-select"
            value={selectedWorkId}
            onChange={(e) => {
              setSelectedWorkId(e.target.value);
              setResult(null);
            }}
            className="mt-1.5 w-full rounded-xl border border-[var(--rule-hairline)] bg-white px-3 py-2.5 text-sm text-[var(--ink-primary)]"
          >
            {works.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id} — {w.title} ({w.stage.replace(/_/g, " ")})
              </option>
            ))}
          </select>
        </div>

        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--rule-hairline)] bg-[var(--canvas-khadi)]/60 p-6 text-center transition-colors hover:border-[var(--ink-primary)]">
          <Upload className="h-6 w-6 text-[var(--ink-muted)]" />
          <span className="mt-2 text-xs font-semibold text-[var(--ink-primary)]">
            {uploadedFileName
              ? `Loaded field photo: ${uploadedFileName}`
              : "Drop contractor site photo (JPEG/PNG) to verify"}
          </span>
          <span className="mt-1 font-mono text-[11px] text-[var(--ink-muted)]">
            Runs GPS Geofence (&le;200m) · pHash Duplicate Check · C2PA · VLM Progress
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setUploadedFileName(file.name);
                runAudit("UPLOAD");
              }
            }}
          />
        </label>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => runAudit("VALID")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-jade)] px-4 py-3 text-xs font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
          >
            <Camera className="h-4 w-4" />
            Demo: Valid Site Photo (Pass)
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => runAudit("FRAUD")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-crimson)] px-4 py-3 text-xs font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
          >
            <ShieldAlert className="h-4 w-4" />
            Demo: Spoofed / Recycled Photo
          </button>
        </div>

        {error && (
          <p className="mt-3 text-xs font-semibold text-[var(--accent-crimson)]">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--rule-hairline)] pt-4">
            <div className="rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)]/70 p-3">
              <p className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">
                GPS Geofence (&le;200m)
              </p>
              <p
                className={`mt-1 font-mono text-sm font-semibold ${
                  result.auditReport.withinGeofence
                    ? "text-[var(--accent-jade)]"
                    : "text-[var(--accent-crimson)]"
                }`}
              >
                {result.auditReport.distanceMeters}m{" "}
                {result.auditReport.withinGeofence ? "PASS" : "BREACH"}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)]/70 p-3">
              <p className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">
                Duplicate Photo Check
              </p>
              <p
                className={`mt-1 font-mono text-sm font-semibold ${
                  result.auditReport.duplicatePhotoDetected
                    ? "text-[var(--accent-crimson)]"
                    : "text-[var(--accent-jade)]"
                }`}
              >
                {result.auditReport.duplicatePhotoDetected ? "RECYCLED FRAUD" : "UNIQUE"}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)]/70 p-3">
              <p className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">
                C2PA Credentials
              </p>
              <p
                className={`mt-1 font-mono text-sm font-semibold ${
                  result.auditReport.c2paVerified
                    ? "text-[var(--accent-jade)]"
                    : "text-[var(--accent-crimson)]"
                }`}
              >
                {result.auditReport.c2paVerified ? "VERIFIED" : "MISSING"}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)]/70 p-3">
              <p className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">
                Vision-AI Completion
              </p>
              <p
                className={`mt-1 font-mono text-sm font-semibold ${
                  result.auditReport.completionPct >= 85
                    ? "text-[var(--accent-jade)]"
                    : "text-[var(--accent-crimson)]"
                }`}
              >
                {result.auditReport.completionPct}%
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Right 50% — Official SHA-256 Utilization Certificate or Fraud Hold */}
      <section className="official-sheet print-only-sheet animate-ledger-in rounded-2xl p-6 lg:col-span-6">
        {!result ? (
          <div className="flex h-full min-h-[340px] flex-col items-center justify-center text-center">
            <Lock className="h-8 w-8 text-[var(--ink-muted)]" />
            <h3 className="mt-3 font-serif text-xl font-semibold text-[var(--ink-primary)]">
              Tamper-Evident Utilization Certificate Ledger
            </h3>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--ink-muted)]">
              Run a valid site photo or spoofed photo check on the left to watch SakshiAI either mint a SHA-256 hash-chained MoSPI Utilization Certificate or freeze tranche release.
            </p>
          </div>
        ) : result.utilizationCertificate ? (
          <div>
            <div className="flex items-start justify-between gap-2 border-b border-[var(--rule-hairline)] pb-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent-jade)]">
                  Verified Utilization Certificate (Form GFR-12C / e-SAKSHI)
                </p>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-[var(--ink-primary)]">
                  {result.utilizationCertificate.ucNumber}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-xl border border-[var(--accent-jade)]/40 bg-[var(--accent-jade-bg)] px-3 py-1.5 font-mono text-xs font-semibold text-[var(--accent-jade)]">
                <CheckCircle2 className="h-4 w-4" />
                AUDIT PASSED
              </span>
            </div>

            <dl className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-[var(--rule-hairline)] pb-2">
                <dt className="text-[var(--ink-muted)]">Work &amp; Ward</dt>
                <dd className="text-right font-semibold text-[var(--ink-primary)]">
                  {result.utilizationCertificate.workTitle}
                </dd>
              </div>
              <div className="flex justify-between border-b border-[var(--rule-hairline)] pb-2">
                <dt className="text-[var(--ink-muted)]">Implementing Agency</dt>
                <dd className="font-mono font-semibold text-[var(--ink-primary)]">
                  {result.utilizationCertificate.implementingAgency}
                </dd>
              </div>
              <div className="flex justify-between border-b border-[var(--rule-hairline)] pb-2">
                <dt className="text-[var(--ink-muted)]">Certified Tranche Amount</dt>
                <dd className="font-mono text-sm font-semibold tabular-nums text-[var(--accent-jade)]">
                  {formatInrExact(result.utilizationCertificate.certifiedAmountInr)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 rounded-xl border border-[var(--rule-hairline)] bg-[var(--canvas-khadi)] p-3.5 font-mono text-[11px]">
              <p className="font-semibold text-[var(--ink-muted)]">
                SHA-256 Cryptographic Ledger Hash:
              </p>
              <p className="mt-1 break-all text-[var(--ink-primary)]">
                {result.utilizationCertificate.sha256Hash}
              </p>
              <p className="mt-2 font-semibold text-[var(--ink-muted)]">
                Chained Previous UC Hash:
              </p>
              <p className="mt-0.5 break-all text-[var(--ink-muted)]">
                {result.utilizationCertificate.previousHash}
              </p>
            </div>

            <div className="no-print mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--ink-primary)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--ink-primary)] hover:bg-[var(--surface-tint)]"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Official UC PDF
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between gap-2 border-b border-[var(--accent-crimson)]/30 pb-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent-crimson)]">
                  Tranche Release Frozen · CAG Audit Alert
                </p>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-[var(--accent-crimson)]">
                  Utilization Certificate Blocked
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-xl border border-[var(--accent-crimson)]/40 bg-[var(--accent-crimson-bg)] px-3 py-1.5 font-mono text-xs font-semibold text-[var(--accent-crimson)]">
                <ShieldAlert className="h-4 w-4" />
                HOLD NOTICE
              </span>
            </div>

            <ul className="mt-4 space-y-2.5 text-xs text-[var(--accent-crimson)]">
              {result.auditReport.flags.map((flag) => (
                <li
                  key={flag}
                  className="rounded-xl border border-[var(--accent-crimson)]/30 bg-[var(--accent-crimson-bg)] p-3 font-medium"
                >
                  {flag}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[var(--ink-muted)]">
              Escalation logged for District Planning Officer &amp; Joint Inspection Committee per MPLADS FY 2026–31 mandatory inspection guidelines.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
