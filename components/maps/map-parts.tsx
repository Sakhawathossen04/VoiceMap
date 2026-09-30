"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { CATEGORIES, WARD_LIST } from "@/data/lookups";
import type { IssueCluster } from "@/lib/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { SeverityBadge, StatusBadge, UnderheardBadge, PriorityMeter } from "@/components/common/primitives";
import { dominantSeverity } from "./chattogram-map";

export interface MapFilters {
  categories: string[];
  wards: number[];
  severities: string[];
  statuses: string[];
  underheardOnly: boolean;
}

export function FilterPanel({ filters, onChange }: { filters: MapFilters; onChange: (f: MapFilters) => void }) {
  const toggle = <T,>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="absolute left-4 top-36 z-10 w-[min(88vw,270px)] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-lift backdrop-blur">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-bold text-navy-900">Map filters</p>
        <p className="text-[11px] text-slate-500">Combine filters to explore hotspots</p>
      </div>
      <div className="max-h-[350px] space-y-4 overflow-y-auto px-4 py-4">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onChange({ ...filters, categories: toggle(filters.categories, cat) })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  filters.categories.includes(cat) ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                )}
                aria-pressed={filters.categories.includes(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Ward</p>
          <div className="flex flex-wrap gap-1.5">
            {WARD_LIST.map((w) => (
              <button
                key={w}
                onClick={() => onChange({ ...filters, wards: toggle(filters.wards, Number(w.replace("Ward ", ""))) })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  filters.wards.includes(Number(w.replace("Ward ", ""))) ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                )}
                aria-pressed={filters.wards.includes(Number(w.replace("Ward ", "")))}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Severity</p>
          <div className="flex flex-wrap gap-1.5">
            {["Critical", "High", "Medium"].map((s) => (
              <button
                key={s}
                onClick={() => onChange({ ...filters, severities: toggle(filters.severities, s) })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  filters.severities.includes(s) ? "border-orange-500 bg-orange-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-orange-300"
                )}
                aria-pressed={filters.severities.includes(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-3 py-2.5">
          <input
            type="checkbox"
            checked={filters.underheardOnly}
            onChange={(e) => onChange({ ...filters, underheardOnly: e.target.checked })}
            className="h-4 w-4 accent-fuchsia-600"
          />
          <span className="text-xs font-bold text-fuchsia-800">Underheard issues only</span>
        </label>
      </div>
    </div>
  );
}

export function IssueSidePanel({ cluster, onClose }: { cluster: IssueCluster; onClose: () => void }) {
  const c = cluster;
  const sev = dominantSeverity(c);
  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute right-4 top-4 z-20 flex max-h-[calc(100%-2rem)] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift"
      role="complementary"
      aria-label="Issue intelligence panel"
    >
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{c.category}</p>
          <h3 className="text-lg font-extrabold leading-snug text-navy-900">{c.title}</h3>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-navy-900" aria-label="Close issue panel">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-wrap gap-1.5">
          <SeverityBadge severity={sev} />
          <StatusBadge status={c.status} />
          {c.underheard && <UnderheardBadge />}
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Priority score</p>
          <div className="mt-1.5">
            <PriorityMeter score={c.priorityScore} showLabel />
          </div>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          {[
            ["Location", c.locationLabel + ", Ward " + c.ward],
            ["Reports", formatNumber(c.reportCount) + " citizen reports"],
            ["First reported", formatDate(c.firstReported)],
            ["Latest report", formatDate(c.lastReported)],
            ["Geographic radius", c.radiusM + " m"],
            ["Trend", (c.trendPct >= 0 ? "+" : "") + c.trendPct + "% (30 days)"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 border-b border-slate-50 pb-1.5">
              <dt className="shrink-0 text-slate-500">{k}</dt>
              <dd className="text-right font-semibold text-navy-900">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Severity distribution</p>
          <div className="mt-2 flex h-3 overflow-hidden rounded-full">
            {(["Critical", "High", "Medium", "Low"] as const).map((k) => (
              <div
                key={k}
                title={`${k}: ${c.severityMix[k]}`}
                style={{ width: `${(c.severityMix[k] / c.reportCount) * 100}%`, background: { Critical: "#dc2626", High: "#ea580c", Medium: "#d97706", Low: "#94a3b8" }[k] }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Affected groups</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {c.affectedGroups.map((g) => (
              <span key={g} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">{g}</span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Recent citizen reports</p>
          <div className="mt-2 space-y-2">
            {c.citizenQuotes.slice(0, 3).map((q, i) => (
              <blockquote key={i} className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700">
                “{q}”
              </blockquote>
            ))}
          </div>
        </div>

        <a
          href={`/issues/${c.id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
        >
          View Full Issue
        </a>
      </div>
    </motion.aside>
  );
}
