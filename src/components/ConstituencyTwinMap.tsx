"use client";

import { formatInrLakhs } from "@/lib/mplads/format";
import type { BottleneckAlert, WorkItem } from "@/lib/mplads/types";

interface ConstituencyTwinMapProps {
  works: WorkItem[];
  alerts: BottleneckAlert[];
  selectedWorkId: string | null;
  onSelectWork: (workId: string) => void;
}

const WARD_POSITIONS: Record<string, { x: number; y: number; short: string }> = {
  "Najafgarh (Ward 14)": { x: 145, y: 215, short: "Najafgarh" },
  "Kakrola (Ward 123)": { x: 265, y: 175, short: "Kakrola" },
  "Matiala (Ward 125)": { x: 350, y: 225, short: "Matiala" },
  "Dwarka (Ward 121)": { x: 430, y: 270, short: "Dwarka" },
  "Uttam Nagar (Ward 114)": { x: 455, y: 135, short: "Uttam Nagar" },
};

export function ConstituencyTwinMap({
  works,
  alerts,
  selectedWorkId,
  onSelectWork,
}: ConstituencyTwinMapProps) {
  const overdueSet = new Set(alerts.map((a) => a.workId));

  return (
    <div className="ledger-card relative overflow-hidden rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-saffron)]">
            Architectural 2.5D Digital Twin
          </p>
          <h3 className="font-serif text-xl font-semibold text-[var(--ink-primary)]">
            South-West Delhi Asset &amp; Bottleneck Map
          </h3>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c85a17]" />
            Stalled (&gt;45d)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#111d35]" />
            Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0f6e4a]" />
            UC Verified
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--rule-hairline)] bg-[#f3efe6] p-2">
        <svg
          viewBox="0 0 600 360"
          className="h-auto w-full"
          role="img"
          aria-label="Isometric South-West Delhi Constituency Works Map"
        >
          {/* Isometric Base Slab */}
          <polygon
            points="300,32 568,162 300,330 32,162"
            fill="#e9e2d3"
            stroke="#c5baa4"
            strokeWidth="1.5"
          />
          <polygon
            points="32,162 300,330 300,346 32,178"
            fill="#d8cebb"
            stroke="#c5baa4"
            strokeWidth="1"
          />
          <polygon
            points="568,162 300,330 300,346 568,178"
            fill="#ccc1ac"
            stroke="#c5baa4"
            strokeWidth="1"
          />

          {/* Subtle Ward Grid Lines */}
          <line x1="166" y1="97" x2="434" y2="246" stroke="#d5ccb8" strokeDasharray="4 4" />
          <line x1="434" y1="97" x2="166" y2="246" stroke="#d5ccb8" strokeDasharray="4 4" />
          <line x1="300" y1="32" x2="300" y2="330" stroke="#dfd7c6" strokeDasharray="3 5" />

          {/* Ward Labels */}
          {Object.entries(WARD_POSITIONS).map(([wardName, pos]) => (
            <g key={wardName}>
              <ellipse cx={pos.x} cy={pos.y} rx="28" ry="13" fill="#ded6c5" opacity="0.7" />
              <text
                x={pos.x}
                y={pos.y + 24}
                textAnchor="middle"
                className="fill-[#525b6e] font-mono text-[10px] font-semibold"
              >
                {pos.short}
              </text>
            </g>
          ))}

          {/* Interactive 3D-Style Rupee-Scaled Work Towers */}
          {works.map((work, idx) => {
            const base = WARD_POSITIONS[work.ward] ?? { x: 300, y: 185, short: work.ward };
            const offsetX = (idx % 3 - 1) * 14;
            const x = base.x + offsetX;
            const y = base.y;
            const towerHeight = Math.min(82, Math.max(26, Math.round((work.estimatedCostInr / 4_000_000) * 76)));
            const isOverdue = overdueSet.has(work.id);
            const isVerified = work.stage === "UC_VERIFIED";
            const isSelected = selectedWorkId === work.id;

            const fillColor = isVerified
              ? "#0f6e4a"
              : isOverdue
              ? "#c85a17"
              : "#111d35";

            return (
              <g
                key={work.id}
                onClick={() => onSelectWork(work.id)}
                className="cursor-pointer transition-opacity hover:opacity-90"
              >
                {isSelected && (
                  <ellipse
                    cx={x}
                    cy={y}
                    rx="18"
                    ry="9"
                    fill="none"
                    stroke={fillColor}
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                )}
                <rect
                  x={x - 9}
                  y={y - towerHeight}
                  width="18"
                  height={towerHeight}
                  rx="4"
                  fill={fillColor}
                  opacity={isSelected ? 1 : 0.88}
                />
                <circle
                  cx={x}
                  cy={y - towerHeight}
                  r={isSelected ? 6 : 4.5}
                  fill="#ffffff"
                  stroke={fillColor}
                  strokeWidth="2.5"
                />
                <text
                  x={x}
                  y={y - towerHeight - 10}
                  textAnchor="middle"
                  className="fill-[#111d35] font-mono text-[10px] font-semibold"
                >
                  {formatInrLakhs(work.estimatedCostInr)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2.5 text-xs text-[var(--ink-muted)]">
        Click any vertical asset tower to inspect its e-SAKSHI lifecycle status, SLA timer, and constitutional sanction controls.
      </p>
    </div>
  );
}
