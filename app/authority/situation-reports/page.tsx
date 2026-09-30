"use client";

import { useState } from "react";
import { FileBarChart2, Wand2, Download, Loader2, ShieldAlert } from "lucide-react";
import { AuthorityShell } from "@/components/authority/sidebar";
import { Card, Button } from "@/components/common/primitives";
import { simulateSituationReport } from "@/lib/mock-ai";
import { useToast } from "@/components/common/toast";

type Report = Awaited<ReturnType<typeof simulateSituationReport>>;

export default function SituationReportsPage() {
  const [ward, setWard] = useState("Ward 12");
  const [range, setRange] = useState("Last 30 days");
  const [category, setCategory] = useState("All categories");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const toast = useToast();

  async function generate() {
    setLoading(true);
    setReport(null);
    await simulateSituationReport();
    setReport(await simulateSituationReport());
    setLoading(false);
    toast({ kind: "success", title: "Situation report generated", desc: "Draft ready for authority review and export." });
  }

  return (
    <AuthorityShell title="AI Situation Reports" subtitle="Generated strictly from submitted citizen evidence">
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        {/* Controls */}
        <Card className="h-fit p-6">
          <p className="flex items-center gap-2 font-bold text-navy-900"><Wand2 className="h-4.5 w-4.5 text-brand-600" /> Generate Situation Report</p>
          <p className="mt-1.5 text-sm text-slate-500">The AI drafts a structured briefing; an authority reviews and exports it.</p>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="sr-ward" className="text-sm font-bold text-navy-900">Ward</label>
              <select id="sr-ward" value={ward} onChange={(e) => setWard(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm">
                {["Ward 5", "Ward 8", "Ward 12", "Ward 17", "Ward 22", "Ward 26"].map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="sr-range" className="text-sm font-bold text-navy-900">Date range</label>
              <select id="sr-range" value={range} onChange={(e) => setRange(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm">
                {["Last 7 days", "Last 30 days", "Last 90 days", "Full pilot"].map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="sr-cat" className="text-sm font-bold text-navy-900">Category</label>
              <select id="sr-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm">
                {["All categories", "Waterlogging", "Street Lighting", "Accessibility", "Drainage"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Button onClick={generate} disabled={loading} className="w-full" size="lg">
              {loading ? <><Loader2 className="h-4.5 w-4.5 animate-spin" /> Analyzing evidence…</> : <><FileBarChart2 className="h-4.5 w-4.5" /> Generate Situation Report</>}
            </Button>
            <p className="rounded-xl bg-sky-50 px-3.5 py-2.5 text-xs leading-relaxed text-sky-900">
              <ShieldAlert className="mr-1 inline h-3.5 w-3.5" />
              No information appears here beyond mock citizen evidence available in the frontend dataset. A human authority reviews before any use.
            </p>
          </div>
        </Card>

        {/* Output */}
        <div>
          {!report && !loading && (
            <Card className="flex h-72 flex-col items-center justify-center border-dashed text-center">
              <FileBarChart2 className="h-8 w-8 text-slate-300" />
              <p className="mt-3 font-bold text-navy-900">No report generated yet</p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">Choose filters and press “Generate Situation Report” to draft an AI briefing.</p>
            </Card>
          )}
          {loading && (
            <Card className="flex h-72 flex-col items-center justify-center">
              <Loader2 className="h-9 w-9 animate-spin text-brand-600" />
              <p className="mt-4 font-bold text-navy-900">Reading cluster evidence…</p>
              <p className="mt-1 text-sm text-slate-500">Summarizing citizen reports for {ward}, {range.toLowerCase()}.</p>
            </Card>
          )}
          {report && !loading && (
            <Card className="p-7">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-600">AI-generated draft · {ward} · {range}</p>
                  <h2 className="mt-1 text-2xl font-extrabold text-navy-900">{report.title}</h2>
                  <p className="mt-1 text-xs text-slate-400">Generated 2026-09-30 · Draft for review</p>
                </div>
                <Button variant="secondary" onClick={() => window.print()}>
                  <Download className="h-4 w-4" /> Export PDF
                </Button>
              </div>

              <div className="mt-6 space-y-6">
                <section>
                  <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">Overview</h3>
                  <p className="mt-2 leading-relaxed text-slate-700">{report.overview}</p>
                </section>
                <section>
                  <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">Key issues</h3>
                  <ul className="mt-2 space-y-2">
                    {report.keyIssues.map((k) => (
                      <li key={k} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">{k}</li>
                    ))}
                  </ul>
                </section>
                <div className="grid gap-6 sm:grid-cols-2">
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">High priority areas</h3>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                      {report.highPriorityAreas.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-wide text-fuchsia-600">Underheard concerns</h3>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                      {report.underheardConcerns.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  </section>
                </div>
                <section>
                  <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">Evidence</h3>
                  <div className="mt-2 space-y-2">
                    {report.evidence.map((e) => (
                      <blockquote key={e} className="rounded-xl border-l-4 border-brand-300 bg-brand-50/50 px-4 py-2.5 text-sm italic text-slate-700">{e}</blockquote>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">Suggested follow-up</h3>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
                    {report.followUp.map((x) => <li key={x}>{x}</li>)}
                  </ol>
                </section>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AuthorityShell>
  );
}
