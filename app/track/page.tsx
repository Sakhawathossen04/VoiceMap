"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, PackageSearch, CheckCircle2, Loader2 } from "lucide-react";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { Card, EmptyState, Chip } from "@/components/common/primitives";
import { RAW_REPORTS } from "@/data/reports";
import { CLUSTERS } from "@/data/clusters";
import { useDemoReports } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

const STAGES = [
  "Submitted",
  "AI Reviewed",
  "Clustered",
  "Authority Notified",
  "Action In Progress",
  "Resolution Pending",
];

function TrackInner() {
  const params = useSearchParams();
  const demoReports = useDemoReports();
  const [input, setInput] = useState(params.get("id") ?? "");
  const [searched, setSearched] = useState<string | null>(params.get("id"));
  const [pulse, setPulse] = useState(false);

  const report = useMemo(
    () => [...demoReports, ...RAW_REPORTS].find((r) => r.id.toLowerCase() === (searched ?? "").trim().toLowerCase()),
    [searched, demoReports]
  );

  useEffect(() => {
    if (searched) setPulse(true);
    const t = setTimeout(() => setPulse(false), 900);
    return () => clearTimeout(t);
  }, [searched]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-900">Track Report</h1>
        <p className="mt-2 text-slate-600">Enter your Report ID to see where it is in the pipeline. Try <button onClick={() => { setInput("VMB-2026-10482"); setSearched("VMB-2026-10482"); }} className="font-bold text-brand-700 underline">VMB-2026-10482</button> from the demo dataset.</p>

        <form
          className="mt-7 flex gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(input);
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. VMB-2026-10482"
              aria-label="Report ID"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 font-mono text-sm uppercase focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <button type="submit" className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 font-bold text-white hover:bg-brand-700">
            {pulse ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <PackageSearch className="h-4.5 w-4.5" />}
            Track
          </button>
        </form>

        {searched && !report && (
          <div className="mt-8">
            <EmptyState
              icon={<PackageSearch className="h-6 w-6 text-slate-400" />}
              title="No report found with that ID"
              desc={`“${searched}” doesn't match a report in the pilot dataset. Reports you submit in this session appear here instantly.`}
            />
          </div>
        )}

        {report && (
          <div className={cn("mt-8 transition-opacity", pulse && "opacity-70")}>
            <Card className="p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-bold text-brand-700">{report.id}</p>
                  <p className="mt-2 max-w-lg text-lg font-semibold leading-snug text-navy-900">“{report.transcription}”</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Chip>{report.category}</Chip>
                    <Chip>Severity: {report.severity}</Chip>
                    <Chip>Ward {report.ward}</Chip>
                  </div>
                </div>
              </div>

              {/* status timeline */}
              <div className="mt-8">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Status timeline</p>
                <ol className="mt-4 grid gap-3 sm:grid-cols-3">
                  {STAGES.map((s, i) => {
                    const reportStage = STAGES.indexOf(report.status === "Submitted" ? "Submitted" : report.status);
                    const done = i <= Math.max(reportStage, report.status === "Clustered" ? 2 : reportStage);
                    return (
                      <li
                        key={s}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-semibold",
                          done ? "border-green-200 bg-green-50 text-green-800" : "border-slate-200 bg-white text-slate-400"
                        )}
                      >
                        <span className={cn("flex h-5.5 w-5.5 items-center justify-center rounded-full text-[10px]", done ? "bg-green-600 text-white" : "bg-slate-200 text-slate-500")}>
                          {done ? "✓" : i + 1}
                        </span>
                        {s}
                      </li>
                    );
                    })}
                </ol>
              </div>

              {/* cluster membership */}
              {report.clusterId && (
                <div className="mt-7 rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Belongs to issue cluster</p>
                  {(() => {
                    const cl = CLUSTERS.find((c) => c.id === report.clusterId);
                    return cl ? (
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-navy-900">{cl.title}</p>
                          <p className="text-sm text-slate-600">Ward {cl.ward} · {cl.reportCount} reports · priority {cl.priorityScore}/100</p>
                        </div>
                        <a href={`/issues/${cl.id}`} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700">View Issue</a>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-600">{report.clusterId}</p>
                    );
                  })()}
                </div>
              )}
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-400">Loading…</div>}>
      <TrackInner />
    </Suspense>
  );
}
