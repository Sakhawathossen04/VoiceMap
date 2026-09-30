"use client";

import { AuthorityShell } from "@/components/authority/sidebar";
import { Card, StatCard, PrototypeNote } from "@/components/common/primitives";
import {
  ReportsAreaChart, CategoryBarChart, PriorityDistChart, ResolutionLineChart, MiniTrend,
} from "@/components/charts/charts";
import { WardCompare } from "@/components/charts/ward-compare";
import {
  PILOT_STATS, CATEGORY_TOTALS, MONTHLY_TREND, PRIORITY_DISTRIBUTION,
  RESOLUTION_BY_MONTH, WARD_COMPARISON, UNDERHEARD_TREND, AVG_RESOLUTION_DAYS, VERIFICATION_TOTALS,
} from "@/data/analytics";
import { formatNumber } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <AuthorityShell title="Analytics" subtitle="Pilot-wide trends — prototype demonstration data">
      <PrototypeNote />

      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Avg resolution time" value={`${AVG_RESOLUTION_DAYS.overall} days`} sub="all severities" />
        <StatCard label="Critical avg" value={`${AVG_RESOLUTION_DAYS.critical} days`} sub="severity: critical" tone="red" />
        <StatCard label="Verification rate" value={`${VERIFICATION_TOTALS.solved}%`} sub="citizens confirm solved" tone="green" />
        <StatCard label="Underheard detected" value={PILOT_STATS.underheardIssues} sub="pilot cumulative" tone="violet" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="font-bold text-navy-900">Reports over time</p>
          <div className="mt-3 h-64"><ReportsAreaChart data={MONTHLY_TREND} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="font-bold text-navy-900">Issues by category</p>
          <div className="mt-3 h-64"><CategoryBarChart data={CATEGORY_TOTALS} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="font-bold text-navy-900">Priority distribution</p>
          <div className="mt-3 h-64"><PriorityDistChart data={PRIORITY_DISTRIBUTION} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="font-bold text-navy-900">Resolution rate</p>
          <div className="mt-3 h-64"><ResolutionLineChart data={RESOLUTION_BY_MONTH} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
          <p className="font-bold text-navy-900">Ward comparison</p>
          <div className="mt-3 h-64"><WardCompare data={WARD_COMPARISON} /></div>
        </div>
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="font-bold text-navy-900">Underheard issue detection trend</p>
            <MiniTrend pct={38} />
          </div>
          <div className="mt-4 flex items-end gap-3">
            {UNDERHEARD_TREND.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs font-bold text-fuchsia-700">{m.detected}</span>
                <div className="w-full rounded-t-lg bg-fuchsia-400/80" style={{ height: `${m.detected * 11}px` }} />
                <span className="text-[10px] font-semibold text-slate-400">{m.month}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Average resolution time by severity: Critical <strong>{AVG_RESOLUTION_DAYS.critical}d</strong> · High <strong>{AVG_RESOLUTION_DAYS.high}d</strong> · Medium <strong>{AVG_RESOLUTION_DAYS.medium}d</strong> · Low <strong>{AVG_RESOLUTION_DAYS.low}d</strong>
          </p>
        </Card>
      </div>
    </AuthorityShell>
  );
}
