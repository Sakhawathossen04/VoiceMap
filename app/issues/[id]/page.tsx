"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Quote } from "lucide-react";
import { Navbar } from "@/components/common/navbar";
import FeedbackVerification from "@/components/common/feedback-verification";
import { useDemoReports } from "@/lib/demo-store";
import { Footer } from "@/components/common/footer";
import { Card, SeverityBadge, StatusBadge, UnderheardBadge, PriorityMeter, PrototypeNote } from "@/components/common/primitives";
import { CategoryBarChart, SeverityPie, MiniTrend } from "@/components/charts/charts";
import { IssueTimeline } from "@/components/common/issue-timeline";
import { CLUSTERS } from "@/data/clusters";
import { RAW_REPORTS } from "@/data/reports";
import { CATEGORY_META } from "@/data/reports";
import { formatNumber } from "@/lib/utils";
import { EmptyState } from "@/components/common/primitives";

export default function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const cluster = CLUSTERS.find((c) => c.id.toLowerCase() === id.toLowerCase());
  const demoReports = useDemoReports();

  if (!cluster) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <EmptyState title="Issue not found" desc={`No issue cluster matches “${id}”.`} action={<Link href="/issues" className="font-bold text-brand-700 underline">Back to Issues</Link>} />
        </main>
        <Footer />
      </div>
    );
  }

  const c = cluster;
  const meta = CATEGORY_META[c.category];
  const related = RAW_REPORTS.filter((r) => r.clusterId === c.id);
  const relatedDemo = demoReports.filter((r) => r.clusterId === c.id);
  const trendData = [
    { month: "Apr", count: Math.round(c.reportCount * 0.08) },
    { month: "May", count: Math.round(c.reportCount * 0.11) },
    { month: "Jun", count: Math.round(c.reportCount * 0.16) },
    { month: "Jul", count: Math.round(c.reportCount * 0.22) },
    { month: "Aug", count: Math.round(c.reportCount * 0.23) },
    { month: "Sep", count: Math.round(c.reportCount * 0.2) },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Link href="/issues" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-700">
          <ArrowLeft className="h-4 w-4" /> All issues
        </Link>

        {/* Header */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-500 shadow-card">{c.id}</span>
              {c.underheard && <UnderheardBadge />}
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900">{c.title}</h1>
            <p className="mt-1.5 text-slate-600">
              {meta && <span className="font-semibold text-slate-700">{c.category}</span>} · Ward {c.ward} · {c.locationLabel}
            </p>
          </div>
          <Card className="min-w-[260px] p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Priority score</p>
            <div className="mt-2"><PriorityMeter score={c.priorityScore} size="lg" showLabel /></div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <SeverityBadge severity={c.severityMix.Critical / c.reportCount >= 0.35 ? "Critical" : "High"} />
              <StatusBadge status={c.status} />
            </div>
          </Card>
        </div>

        {/* Key stats */}
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Reports", value: formatNumber(c.reportCount) },
            { label: "Affected groups", value: c.affectedGroups.length },
            { label: "First reported", value: new Date(c.firstReported).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) },
            { label: "Trend (30d)", value: (c.trendPct >= 0 ? "+" : "") + c.trendPct + "%" },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-navy-900">{s.value}</p>
            </Card>
          ))}
        </div>

        {c.underheard && c.underheardReason && (
          <div className="mt-6 rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-5">
            <p className="font-bold text-fuchsia-800">Underheard Issue Detected</p>
            <p className="mt-1 text-sm text-fuchsia-900/90">{c.underheardReason}</p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {/* Overview */}
            <Card className="p-6">
              <h2 className="font-bold text-navy-900">Overview — AI-generated summary</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{c.summary}</p>
              <p className="mt-3 text-xs text-slate-400">AI summaries rely only on submitted citizen evidence. Authorities review before action.</p>
            </Card>

            {/* Trend + severity */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <p className="font-bold text-navy-900">Report trend</p>
                <div className="mt-3 h-52"><CategoryBarChart data={trendData} dataKey="count" nameKey="month" /></div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <p className="font-bold text-navy-900">Severity breakdown</p>
                <div className="mt-3 h-52">
                  <SeverityPie
                    data={(["Critical", "High", "Medium", "Low"] as const).map((k) => ({ name: k, value: c.severityMix[k] }))}
                  />
                </div>
              </div>
            </div>

            {/* Citizen evidence */}
            <Card className="p-6">
              <h2 className="font-bold text-navy-900">Citizen evidence</h2>
              <p className="mt-1 text-sm text-slate-500">Anonymized samples from the cluster. Original Bangla preserved.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {c.citizenQuotes.map((q, i) => (
                  <figure key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <Quote className="h-4 w-4 text-brand-400" />
                    <blockquote className="mt-1.5 text-sm leading-relaxed text-slate-700">“{q}”</blockquote>
                  </figure>
                ))}
              </div>
            </Card>

            {/* Similar reports */}
            <Card className="p-6">
              <h2 className="font-bold text-navy-900">Similar reports in this cluster</h2>
              <div className="mt-3 space-y-2.5">
                {related.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3">
                    <div>
                      <p className="text-sm text-slate-700">{r.transcription}</p>
                      <p className="mt-1 text-xs text-slate-400">{r.id} · {r.status} · {r.anonymizedCitizen}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{r.severity}</span>
                  </div>
                ))}
                {relatedDemo.map((r) => (
                  <div key={r.id} className="flex items-start justify-between gap-4 rounded-xl border border-green-200 bg-green-50/60 px-4 py-3">
                    <div>
                      <p className="text-sm text-slate-700">{r.transcription}</p>
                      <p className="mt-1 text-xs text-green-700">{r.id} · Your session · just now</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-green-700">NEW</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="font-bold text-navy-900">Affected groups</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.affectedGroups.map((g) => (
                  <span key={g} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                    <Users className="h-3.5 w-3.5 text-brand-600" /> {g}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-bold text-navy-900">Issue timeline</h2>
              <div className="mt-4">
                <IssueTimeline items={c.timeline} />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-bold text-navy-900">Geographic impact</h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                <div className="bg-gradient-to-b from-sky-50 to-white p-6 text-center">
                  <p className="text-4xl font-black tabular-nums text-navy-900">{c.radiusM} m</p>
                  <p className="text-sm text-slate-500">cluster radius · Ward {c.ward}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-card">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> hotspot intensity: {c.reportCount > 500 ? "very high" : c.reportCount > 100 ? "high" : "moderate"}
                  </div>
                </div>
              </div>
              <Link href="/map" className="mt-3 block text-center text-sm font-bold text-brand-700 hover:underline">Open in Community Map →</Link>
            </Card>

            <Card className="border-green-200 bg-green-50/40 p-6">
              <h2 className="font-bold text-navy-900">Was this problem actually solved?</h2>
              <p className="mt-1 text-sm text-slate-600">Citizen verification keeps authorities accountable after resolution.</p>
              <VerificationCard clusterId={c.id} />
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function VerificationCard({ clusterId }: { clusterId: string }) {
  return <div className="mt-4"><FeedbackVerification clusterId={clusterId} /></div>;
}