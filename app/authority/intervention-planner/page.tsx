"use client";

import { useState } from "react";
import { Wrench, Loader2, Banknote, ShieldAlert, CheckCircle2, MapPin } from "lucide-react";
import { AuthorityShell } from "@/components/authority/sidebar";
import { Card, Button } from "@/components/common/primitives";
import { INTERVENTION_OPTIONS } from "@/data/interventions";
import { formatBDT, cn } from "@/lib/utils";

export default function InterventionPlannerPage() {
  const [budget, setBudget] = useState("1000000");
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  async function analyze() {
    setAnalyzing(true);
    setDone(false);
    await new Promise((r) => setTimeout(r, 2200));
    setAnalyzing(false);
    setDone(true);
  }

  return (
    <AuthorityShell title="Intervention Planner" subtitle="“What should we fix first?” — decision support, not decisions">
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card className="h-fit p-6">
          <p className="flex items-center gap-2 font-bold text-navy-900"><Wrench className="h-4.5 w-4.5 text-brand-600" /> Plan an intervention</p>
          <p className="mt-1.5 text-sm text-slate-500">Enter available budget. VoiceMap BD matches priority clusters to candidate interventions.</p>
          <div className="mt-5">
            <label htmlFor="budget" className="text-sm font-bold text-navy-900">Available budget (৳)</label>
            <div className="relative mt-1.5">
              <Banknote className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
              <input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-11 pr-4 text-sm tabular-nums"
              />
            </div>
            <div className="mt-2 flex gap-2">
              {["500000", "1000000", "2000000"].map((b) => (
                <button key={b} onClick={() => setBudget(b)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 hover:border-brand-300">
                  ৳{Number(b).toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={analyze} disabled={analyzing} size="lg" className="mt-5 w-full">
            {analyzing ? <><Loader2 className="h-4.5 w-4.5 animate-spin" /> Analyzing options…</> : "Analyze Options"}
          </Button>
          <p className="mt-4 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900">
            <ShieldAlert className="mr-1 inline h-3.5 w-3.5" />
            <strong>Prototype decision-support output.</strong> Final public decisions require engineering, financial, and administrative assessment. AI does not allocate funds.
          </p>
        </Card>

        <div className="space-y-5">
          {!done && !analyzing && (
            <Card className="flex h-72 flex-col items-center justify-center border-dashed text-center">
              <Wrench className="h-8 w-8 text-slate-300" />
              <p className="mt-3 font-bold text-navy-900">No analysis yet</p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">Enter a budget and run the analysis to compare candidate interventions against priority clusters.</p>
            </Card>
          )}
          {analyzing && (
            <Card className="flex h-72 flex-col items-center justify-center">
              <Loader2 className="h-9 w-9 animate-spin text-brand-600" />
              <p className="mt-4 font-bold text-navy-900">Matching interventions to priority clusters…</p>
              <p className="mt-1 text-sm text-slate-500">Budget ৳{Number(budget || 0).toLocaleString("en-IN")} · 12 clusters · 7 wards</p>
            </Card>
          )}
          {done && !analyzing && INTERVENTION_OPTIONS.map((o) => {
            const affordable = o.costBDT <= Number(budget || 0);
            return (
              <Card key={o.id} className={cn("p-6", affordable ? "border-green-200" : "border-amber-200")}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-lg font-black text-white">{o.id}</span>
                    <div>
                      <h2 className="text-lg font-extrabold text-navy-900">{o.title}</h2>
                      <p className="text-sm text-slate-500">{o.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Estimated cost</p>
                    <p className="text-xl font-black tabular-nums text-navy-900">{formatBDT(o.costBDT)}</p>
                    {affordable ? (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-green-700"><CheckCircle2 className="h-3.5 w-3.5" /> within budget</p>
                    ) : (
                      <p className="mt-0.5 text-xs font-bold text-amber-700">exceeds budget</p>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  {[
                    { icon: MapPin, label: "Locations", value: String(o.locations) },
                    { icon: Wrench, label: "Est. impact", value: o.impact },
                    { icon: Banknote, label: "People affected", value: o.peopleAffected },
                    { icon: CheckCircle2, label: "Coverage", value: o.priorityCoverage },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-xl bg-slate-50 p-3.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400"><Icon className="h-3.5 w-3.5" /> {label}</p>
                      <p className="mt-1 text-sm font-bold text-navy-900">{value}</p>
                    </div>
                  ))}
                </div>

                {o.underheardSupport && (
                  <p className="mt-4 rounded-xl bg-fuchsia-50 px-4 py-2.5 text-sm font-semibold text-fuchsia-800">
                    Underheard communities supported: Yes — includes wheelchair accessibility and elderly crossing clusters.
                  </p>
                )}

                <p className="mt-4 text-xs text-slate-400">
                  Covers clusters: {o.clustersCovered.join(", ")} · Estimates are simulated for demonstration.
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </AuthorityShell>
  );
}
