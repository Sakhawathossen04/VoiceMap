"use client";

import Link from "next/link";
import { FileText, Flame, CheckCircle2, Ear, Inbox } from "lucide-react";
import { AuthorityShell } from "@/components/authority/sidebar";
import { StatCard, Card, SeverityBadge, UnderheardBadge, PrototypeNote } from "@/components/common/primitives";
import { ReportsAreaChart, CategoryBarChart, PriorityDistChart, MiniTrend } from "@/components/charts/charts";
import ChattogramMap from "@/components/maps/chattogram-map";
import { PILOT_STATS, MONTHLY_TREND, CATEGORY_TOTALS, PRIORITY_DISTRIBUTION, WEEKLY_TREND } from "@/data/analytics";
import { CLUSTERS } from "@/data/clusters";
import { useDemoReports } from "@/lib/demo-store";
import { formatNumber } from "@/lib/utils";
import { Icon } from "@/components/common/icon";
import { CATEGORY_META } from "@/data/reports";
import { cn } from "@/lib/utils";

export default function AuthorityOverview() {
  const demoReports = useDemoReports();
  const top = [...CLUSTERS].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 6);

  return (
    <AuthorityShell title="Chattogram Civic Intelligence Dashboard" subtitle="Current pilot area · VoiceMap Chattogram">
      <div className="mb-6"><PrototypeNote /></div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <StatCard label="Total Reports" value={formatNumber(PILOT_STATS.totalReports)} icon={<Inbox className="h-5 w-5" />} />
        <StatCard label="Active Issues" value={formatNumber(PILOT_STATS.activeIssues)} tone="amber" icon={<FileText className="h-5 w-5" />} />
        <StatCard label="High Priority" value={formatNumber(PILOT_STATS.highPriorityIssues)} tone="red" icon={<Flame className="h-5 w-5" />} />
        <StatCard label="Resolved" value={formatNumber(PILOT_STATS.resolvedReports)} tone="green" icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Underheard Issues" value={PILOT_STATS.underheardIssues} tone="violet" icon={<Ear className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Priority table */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <p className="font-bold text-navy-900">Today's Priority Issues</p>
            <Link href="/authority/priority" className="text-sm font-bold text-brand-700 hover:underline">View ranking →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Issue</th>
                  <th className="px-4 py-3">Ward</th>
                  <th className="px-4 py-3 text-right">Reports</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Level</th>
                </tr>
              </thead>
              <tbody>
                {top.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
                    <td className="px-5 py-3.5">
                      <Link href={`/issues/${c.id}`} className="flex items-center gap-3 font-semibold text-navy-900 hover:text-brand-700">
                        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", CATEGORY_META[c.category].border, CATEGORY_META[c.category].bg)}>
                          <Icon name={CATEGORY_META[c.category].icon} className={cn("h-4 w-4", CATEGORY_META[c.category].text)} />
                        </span>
                        {c.title}
                        {c.underheard && <UnderheardBadge />}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">Ward {c.ward}</td>
                    <td className="px-4 py-3.5 text-right font-bold tabular-nums text-navy-900">{formatNumber(c.reportCount)}</td>
                    <td className="px-4 py-3.5 font-black tabular-nums text-navy-900">{c.priorityScore}</td>
                    <td className="px-4 py-3.5">
                      <SeverityBadge severity={c.priorityScore >= 90 ? "Critical" : c.priorityScore >= 80 ? "High" : "Medium"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Weekly trend */}
        <Card className="p-5">
          <p className="font-bold text-navy-900">Weekly report trend</p>
          <div className="mt-3 h-64"><ReportsAreaChart data={MONTHLY_TREND.map((m) => ({ ...m, resolved: m.resolved }))} /></div>
          <p className="mt-2 text-xs text-slate-400">Reports vs resolved, last 7 months.</p>
        </Card>
      </div>

      {/* Map + charts row */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="font-bold text-navy-900">Live issue map</p>
            <Link href="/authority/map" className="text-sm font-bold text-brand-700 hover:underline">Open expanded map →</Link>
          </div>
          <div className="mt-3"><ChattogramMap compact /></div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="font-bold text-navy-900">Issues by category</p>
            <div className="mt-3 h-56"><CategoryBarChart data={CATEGORY_TOTALS} /></div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="font-bold text-navy-900">Priority distribution</p>
            <div className="mt-3 h-56"><PriorityDistChart data={PRIORITY_DISTRIBUTION} /></div>
          </div>
        </div>
      </div>

      {/* Recent reports incl. demo submissions */}
      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <p className="font-bold text-navy-900">Recent citizen reports</p>
          <Link href="/authority/reports" className="text-sm font-bold text-brand-700 hover:underline">All reports →</Link>
        </div>
        <ul className="divide-y divide-slate-50">
          {demoReports.slice(0, 3).map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 bg-green-50/50 px-5 py-3.5 text-sm">
              <span className="rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-black text-white">NEW</span>
              <span className="font-mono text-xs font-bold text-brand-700">{r.id}</span>
              <span className="min-w-0 flex-1 truncate text-slate-700">“{r.transcription}”</span>
              <span className="text-xs text-slate-500">{r.category} · Ward {r.ward}</span>
            </li>
          ))}
          {CLUSTERS.slice(0, 4).map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 text-sm">
              <span className="font-mono text-xs font-bold text-slate-400">{c.id}</span>
              <span className="min-w-0 flex-1 truncate text-slate-700">“{c.citizenQuotes[0]}”</span>
              <span className="text-xs text-slate-500">{c.category} · Ward {c.ward} · {c.reportCount} reports</span>
              <MiniTrend pct={c.trendPct} />
            </li>
          ))}
        </ul>
      </Card>
    </AuthorityShell>
  );
}
