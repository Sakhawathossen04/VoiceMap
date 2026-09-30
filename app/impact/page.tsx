import type { Metadata } from "next";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { Card, SectionHeading, PrototypeNote } from "@/components/common/primitives";
import { ReportsAreaChart, CategoryBarChart, PriorityDistChart, ResolutionLineChart, CHART_COLORS } from "@/components/charts/charts";
import { WardCompare } from "@/components/charts/ward-compare";
import {
  PILOT_STATS, CATEGORY_TOTALS, MONTHLY_TREND, PRIORITY_DISTRIBUTION,
  RESOLUTION_BY_MONTH, WARD_COMPARISON, VERIFICATION_TOTALS, UNDERHEARD_TREND,
} from "@/data/analytics";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Impact — VoiceMap BD" };

export default function ImpactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="Impact"
          title="VoiceMap Chattogram — pilot at a glance"
          desc="What a deployed VoiceMap BD pilot would measure: participation, identification, resolution, and accountability."
        />
        <div className="mt-5 max-w-2xl">
          <PrototypeNote />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-6">
          {[
            { label: "Citizen Reports", value: formatNumber(PILOT_STATS.totalReports) },
            { label: "Active Issues", value: formatNumber(PILOT_STATS.activeIssues) },
            { label: "Resolved Reports", value: formatNumber(PILOT_STATS.resolvedReports) },
            { label: "High Priority Issues", value: formatNumber(PILOT_STATS.highPriorityIssues) },
            { label: "Underheard Issues", value: PILOT_STATS.underheardIssues },
            { label: "Wards Monitored", value: PILOT_STATS.wardsMonitored },
          ].map((s) => (
            <Card key={s.label} hover className="p-5">
              <p className="text-2xl font-black tabular-nums text-navy-900 xl:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{s.label}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="font-bold text-navy-900">Monthly reporting trend</p>
            <div className="mt-3 h-72"><ReportsAreaChart data={MONTHLY_TREND} /></div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="font-bold text-navy-900">Issues by category</p>
            <div className="mt-3 h-72">
              <CategoryBarChart
                data={CATEGORY_TOTALS.map((c) => ({ category: c.category, count: c.count }))}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="font-bold text-navy-900">Priority distribution</p>
            <div className="mt-3 h-72"><PriorityDistChart data={PRIORITY_DISTRIBUTION} /></div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="font-bold text-navy-900">Resolution rate</p>
            <div className="mt-3 h-72"><ResolutionLineChart data={RESOLUTION_BY_MONTH} /></div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
            <p className="font-bold text-navy-900">Ward comparison — reports, resolved, underheard detected</p>
            <div className="mt-3 h-72"><WardCompare data={WARD_COMPARISON} /></div>
          </div>
        </div>

        {/* Verification + underheard mini cards */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <p className="font-bold text-navy-900">Citizen verification outcomes</p>
            <p className="mt-1 text-sm text-slate-500">Post-resolution feedback from reporting citizens.</p>
            <div className="mt-5 flex h-4 overflow-hidden rounded-full">
              <div style={{ width: `${VERIFICATION_TOTALS.solved}%` }} className="bg-green-500" title="Solved" />
              <div style={{ width: `${VERIFICATION_TOTALS.partial}%` }} className="bg-amber-400" title="Partially solved" />
              <div style={{ width: `${VERIFICATION_TOTALS.notSolved}%` }} className="bg-red-400" title="Not solved" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                ["Solved", `${VERIFICATION_TOTALS.solved}%`, "text-green-700"],
                ["Partially", `${VERIFICATION_TOTALS.partial}%`, "text-amber-700"],
                ["Not solved", `${VERIFICATION_TOTALS.notSolved}%`, "text-red-600"],
              ].map(([label, v, color]) => (
                <div key={label} className="rounded-xl bg-slate-50 py-3">
                  <p className={`text-2xl font-black ${color}`}>{v}</p>
                  <p className="text-xs font-medium text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <p className="font-bold text-navy-900">Underheard issues trend</p>
            <p className="mt-1 text-sm text-slate-500">Low-volume, high-impact issues detected per month.</p>
            <div className="mt-5 flex items-end gap-2.5">
              {UNDERHEARD_TREND.map((m, i) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-xs font-bold text-fuchsia-700">{m.detected}</span>
                  <div
                    className="w-full rounded-t-lg bg-fuchsia-400/80"
                    style={{ height: `${m.detected * 10}px` }}
                  />
                  <span className="text-[10px] font-semibold text-slate-400">{m.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
