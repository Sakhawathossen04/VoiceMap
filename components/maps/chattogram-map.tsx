"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WARDS } from "@/data/wards";
import { CLUSTERS } from "@/data/clusters";
import type { IssueCluster } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { IssueSidePanel, type MapFilters, FilterPanel } from "./map-parts";

export const EMPTY_FILTERS: MapFilters = {
  categories: [], wards: [], severities: [], statuses: [], underheardOnly: false,
};

const SEV_COLOR: Record<string, string> = {
  Critical: "#dc2626",
  High: "#ea580c",
  Medium: "#d97706",
  Low: "#16a34a",
};

export function latLngToXY(lat: number, lng: number): [number, number] {
  const x = 40 + ((lng - 91.808) / (91.849 - 91.808)) * 920;
  const y = 730 - ((lat - 22.323) / (22.389 - 22.323)) * 660;
  return [Math.max(30, Math.min(970, x)), Math.max(24, Math.min(756, y))];
}

export function dominantSeverity(c: IssueCluster): "Critical" | "High" | "Medium" | "Low" {
  if (c.status === "Resolved") return "Low";
  if (c.severityMix.Critical / c.reportCount >= 0.35) return "Critical";
  if (c.severityMix.High + c.severityMix.Critical > c.severityMix.Medium) return "High";
  return "Medium";
}

function ClusterPin({
  c, selected, dimmed, onSelect,
}: { c: IssueCluster; selected: boolean; dimmed: boolean; onSelect: () => void }) {
  const [x, y] = latLngToXY(c.lat, c.lng);
  const sev = dominantSeverity(c);
  const color = SEV_COLOR[sev];
  const critical = sev === "Critical";
  const r = 8 + Math.min(10, Math.log2(c.reportCount + 1) * 1.35);
  return (
    <g
      transform={`translate(${x} ${y})`}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
      tabIndex={dimmed ? -1 : 0}
      role="button"
      aria-label={`${c.title}, ${c.reportCount} reports`}
      className="cursor-pointer focus:outline-none"
    >
      {critical && !dimmed && (
        <motion.circle
          r={r + 5}
          fill="none"
          stroke={color}
          strokeWidth={2}
          animate={{ r: [r + 2, r + 14], opacity: [0.65, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <circle r={r + 8} fill="transparent" />
      <circle
        r={r}
        fill={color}
        fillOpacity={dimmed ? 0.1 : 0.92}
        stroke="white"
        strokeWidth={2.5}
        className={cn("transition-all", dimmed && "pointer-events-none")}
      />
      {!dimmed && (
        <text y={r + 14} textAnchor="middle" className="fill-slate-700 text-[10px] font-bold select-none" style={{ pointerEvents: "none" }}>
          {formatNumber(c.reportCount)}
        </text>
      )}
      {selected && !dimmed && <circle r={r + 5} fill="none" stroke="#1d60d8" strokeWidth={3} />}
    </g>
  );
}

export default function ChattogramMap({
  filters: controlledFilters,
  onSelectCluster,
  compact = false,
}: {
  filters?: Partial<MapFilters>;
  onSelectCluster?: (c: IssueCluster) => void;
  compact?: boolean;
}) {
  const [internalFilters, setInternalFilters] = useState<MapFilters>({ ...EMPTY_FILTERS });
  const filters = { ...internalFilters, ...controlledFilters };
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(!compact);

  const visible = useMemo(
    () =>
      CLUSTERS.filter((c) => {
        if (filters.categories.length && !filters.categories.includes(c.category)) return false;
        if (filters.wards.length && !filters.wards.includes(c.ward)) return false;
        if (filters.severities.length && !filters.severities.includes(dominantSeverity(c))) return false;
        if (filters.statuses.length && !filters.statuses.includes(c.status)) return false;
        if (filters.underheardOnly && !c.underheard) return false;
        return true;
      }),
    [filters]
  );

  const visibleIds = new Set(visible.map((c) => c.id));
  const selected = CLUSTERS.find((c) => c.id === selectedId) ?? null;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50 to-white shadow-card", compact ? "h-[420px]" : "h-[560px] lg:h-[640px]")}>
      <svg viewBox="0 0 1000 780" className="h-full w-full" role="img" aria-label="Interactive map of VoiceMap BD pilot issue clusters in Chattogram">
        <defs>
          <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M 46 0 L 0 0 0 46" fill="none" stroke="#dbe7f3" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1000" height="780" fill="url(#grid)" />
        <path d="M0,352 C240,338 540,376 1000,356" fill="none" stroke="#bfe3f7" strokeWidth="16" opacity="0.75" />
        <path d="M0,352 C240,338 540,376 1000,356" fill="none" stroke="#7cc7ef" strokeWidth="3" opacity="0.7" />
        <text x="60" y="332" className="fill-sky-600/80 text-[11px] font-semibold italic">Karnaphuli River (schematic)</text>

        {WARDS.map((w) => (
          <g key={w.id}>
            <path d={w.path} fill="#f0f7ff" stroke="#9db8d9" strokeWidth={1.6} strokeDasharray="0">
              <title>{w.name}</title>
            </path>
            <text x={w.centroid[0]} y={w.centroid[1] - 26} textAnchor="middle" className="fill-slate-400 text-[11px] font-bold uppercase tracking-widest select-none" style={{ pointerEvents: "none" }}>
              WARD {w.id}
            </text>
          </g>
        ))}

        {visible.map((c) => {
          const [x, y] = latLngToXY(c.lat, c.lng);
          return (
            <circle key={c.id + "-halo"} cx={x} cy={y} r={c.radiusM / 4.2} fill={SEV_COLOR[dominantSeverity(c)]} fillOpacity={0.06} className="pointer-events-none" />
          );
        })}

        {CLUSTERS.map((c) => (
          <ClusterPin
            key={c.id}
            c={c}
            selected={c.id === selectedId}
            dimmed={!visibleIds.has(c.id)}
            onSelect={() => {
              setSelectedId(c.id);
              onSelectCluster?.(c);
            }}
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
        <div className="pointer-events-auto rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2.5 shadow-card backdrop-blur">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Severity</p>
          <div className="mt-1.5 flex flex-col gap-1">
            {[["Critical", "#dc2626"], ["High", "#ea580c"], ["Medium", "#d97706"], ["Resolved", "#16a34a"]].map(([label, color]) => (
              <span key={label} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>
        {!compact && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="pointer-events-auto self-start rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2 text-xs font-bold text-navy-800 shadow-card backdrop-blur hover:bg-slate-50"
            aria-expanded={showFilters}
          >
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
        )}
      </div>

      {showFilters && !compact && (
        <FilterPanel filters={filters} onChange={setInternalFilters} />
      )}

      <div className="absolute bottom-4 left-4 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2 shadow-card backdrop-blur">
        <p className="text-xs font-semibold text-navy-900">
          {visible.length} of {CLUSTERS.length} issue clusters visible
        </p>
        <p className="text-[11px] text-slate-500">Chattogram pilot · schematic ward map</p>
      </div>

      {selected && <IssueSidePanel cluster={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
