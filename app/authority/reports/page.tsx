"use client";

import { useMemo, useState } from "react";
import { Search, Eye, ImageIcon } from "lucide-react";
import { AuthorityShell } from "@/components/authority/sidebar";
import { Card, EmptyState } from "@/components/common/primitives";
import { Drawer } from "@/components/common/overlays";
import { RAW_REPORTS } from "@/data/reports";
import { useDemoReports } from "@/lib/demo-store";
import { CATEGORY_META } from "@/data/reports";
import { formatDate } from "@/lib/utils";
import type { CitizenReport } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const demo = useDemoReports();
  const all = useMemo(() => [...demo, ...RAW_REPORTS], [demo]);
  const [q, setQ] = useState("");
  const [ward, setWard] = useState("");
  const [sel, setSel] = useState<CitizenReport | null>(null);

  const rows = all.filter((r) => {
    if (ward && r.ward !== Number(ward.replace("Ward ", ""))) return false;
    if (q.trim()) {
      const s = q.toLowerCase();
      return r.transcription.toLowerCase().includes(s) || r.id.toLowerCase().includes(s) || r.category.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <AuthorityShell title="Raw Reports" subtitle="Every individual citizen report before clustering">
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search text, ID, category…"
            aria-label="Search reports"
            className="h-10 w-72 rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <select value={ward} onChange={(e) => setWard(e.target.value)} aria-label="Filter ward" className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm">
          <option value="">All wards</option>
          {["Ward 5", "Ward 8", "Ward 12", "Ward 17", "Ward 22", "Ward 26"].map((w) => <option key={w}>{w}</option>)}
        </select>
        <span className="ml-auto text-sm text-slate-500">{rows.length} reports</span>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No matching reports" desc="Adjust the search or ward filter." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Report ID</th>
                  <th className="px-4 py-3">Citizen input</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Ward</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Cluster</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const isDemo = r.id.startsWith("VMB-2026-1") && Number(r.id.slice(-3)) > 500 || demo.some((d) => d.id === r.id);
                  return (
                    <tr key={r.id} className={cn("border-b border-slate-50 transition-colors hover:bg-slate-50/60", demo.some((d) => d.id === r.id) && "bg-green-50/40")}>
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-bold text-brand-700">{r.id}</td>
                      <td className="max-w-[280px] px-4 py-3.5">
                        <p className="truncate text-slate-700">“{r.transcription}”</p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{r.category}</td>
                      <td className="px-4 py-3.5 text-slate-600">{r.ward}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-bold", r.severity === "Critical" ? "border-red-200 bg-red-50 text-red-700" : r.severity === "High" ? "border-orange-200 bg-orange-50 text-orange-700" : "border-amber-200 bg-amber-50 text-amber-700")}>
                          {r.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{r.clusterId}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">{formatDate(r.createdAt)}</td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-slate-600">{r.status}</td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => setSel(r)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50" aria-label={`View report ${r.id}`}>
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel ? `Report ${sel.id}` : ""}>
        {sel && (
          <div className="space-y-5">
            <section>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Original Bangla input</p>
              <p className="mt-1.5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-800">“{sel.originalText}”</p>
            </section>
            <section>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">AI transcription</p>
              <p className="mt-1.5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-800">{sel.transcription}</p>
            </section>
            <section className="grid grid-cols-2 gap-3">
              {[
                ["AI classification", sel.category],
                ["Severity", sel.severity],
                ["Urgency", sel.urgency],
                ["Affected group", sel.affectedGroup],
                ["Location", `${sel.locationLabel}, Ward ${sel.ward}`],
                ["Cluster", sel.clusterId ?? "—"],
                ["Status", sel.status],
                ["Citizen", sel.anonymizedCitizen],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-100 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{k}</p>
                  <p className="mt-0.5 text-sm font-bold text-navy-900">{v}</p>
                </div>
              ))}
            </section>
            <section>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Attached photo (mock)</p>
              <div className="mt-1.5 flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                {sel.hasPhoto ? (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-1 text-xs text-slate-400">evidence_{sel.id.slice(-3)}.jpg · reviewed ✓</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No photo attached</p>
                )}
              </div>
            </section>
            <section>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Related reports in cluster</p>
              <p className="mt-1.5 text-sm text-slate-600">
                {RAW_REPORTS.filter((x) => x.clusterId === sel.clusterId && x.id !== sel.id).length} semantically similar reports share cluster {sel.clusterId}.
              </p>
            </section>
            <section>
              <div className="flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3">
                <p className="text-sm font-bold text-navy-900">Confidence score</p>
                <p className="text-lg font-black text-brand-700">{sel.confidence.category}% category · {sel.confidence.location}% location</p>
              </div>
            </section>
          </div>
        )}
      </Drawer>
    </AuthorityShell>
  );
}
