"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { Card, SeverityBadge, StatusBadge, UnderheardBadge, PriorityMeter, EmptyState, Chip } from "@/components/common/primitives";
import { MiniTrend } from "@/components/charts/charts";
import { CLUSTERS } from "@/data/clusters";
import { CATEGORY_META } from "@/data/reports";
import { CATEGORIES, WARD_LIST } from "@/data/lookups";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/icon";
import { useDemoReports } from "@/lib/demo-store";

const TABS = ["All", "High Priority", "Underheard", "In Progress", "Resolved"] as const;

export default function IssuesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [ward, setWard] = useState<string>("");
  const demoReports = useDemoReports();

  const issues = useMemo(() => {
    let list = [...CLUSTERS];
    if (tab === "High Priority") list = list.filter((c) => c.priorityScore >= 84);
    if (tab === "Underheard") list = list.filter((c) => c.underheard);
    if (tab === "In Progress") list = list.filter((c) => c.status === "In Progress" || c.status === "Planned");
    if (tab === "Resolved") list = list.filter((c) => c.status === "Resolved");
    if (cat) list = list.filter((c) => c.category === cat);
    if (ward) list = list.filter((c) => c.ward === Number(ward.replace("Ward ", "")));
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(s) || c.locationLabel.toLowerCase().includes(s) || c.category.toLowerCase().includes(s));
    }
    return list.sort((a, b) => b.priorityScore - a.priorityScore);
  }, [tab, q, cat, ward]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-900">Issues Directory</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Every row is a community-level issue — grouped from many individual citizen reports by semantic and spatial clustering.
        </p>

        {/* Tabs */}
        <div className="mt-7 flex flex-wrap items-center gap-2" role="tablist">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                tab === t ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
              )}
            >
              {t}
              {t === "Underheard" && <span className="ml-1.5 rounded-full bg-fuchsia-100 px-1.5 text-xs font-bold text-fuchsia-700">{CLUSTERS.filter((c) => c.underheard).length}</span>}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search issues…"
              aria-label="Search issues"
              className="h-10 w-64 rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category" className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none">
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={ward} onChange={(e) => setWard(e.target.value)} aria-label="Filter by ward" className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none">
            <option value="">All wards</option>
            {WARD_LIST.map((w) => <option key={w}>{w}</option>)}
          </select>
          <span className="ml-auto text-sm text-slate-500">{issues.length} issues</span>
        </div>

        {/* Cards grid */}
        {issues.length === 0 ? (
          <div className="mt-10">
            <EmptyState icon={<SlidersHorizontal className="h-6 w-6 text-slate-400" />} title="No issues match your filters" desc="Try clearing the search or choosing a different tab." />
          </div>
        ) : (
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {issues.map((c) => {
              const meta = CATEGORY_META[c.category];
              return (
                <Link key={c.id} href={`/issues/${c.id}`}>
                  <Card hover className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border", meta.border, meta.bg)}>
                        <Icon name={meta.icon} className={cn("h-5.5 w-5.5", meta.text)} />
                      </span>
                      <MiniTrend pct={c.trendPct} />
                    </div>
                    <h2 className="mt-3 font-bold leading-snug text-navy-900">{c.title}</h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Ward {c.ward} · {c.locationLabel}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <SeverityBadge severity={c.severityMix.High + c.severityMix.Critical > c.severityMix.Medium ? "High" : "Medium"} />
                      <StatusBadge status={c.status} />
                      {c.underheard && <UnderheardBadge />}
                    </div>
                    <div className="mt-4 flex-1" />
                    <div className="flex items-end justify-between gap-3">
                      <div className="w-32">
                        <PriorityMeter score={c.priorityScore} size="sm" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600">
                        {formatNumber(c.reportCount)} <span className="font-normal text-slate-400">reports</span>
                      </p>
                    </div>
                    <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">Last update {new Date(c.lastReported).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {demoReports.length > 0 && (
          <p className="mt-6 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
            🎉 Your demo session includes {demoReports.length} newly submitted report{demoReports.length > 1 ? "s" : ""} — view them in the{" "}
            <Link href="/authority" className="font-bold underline">authority dashboard</Link>.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
