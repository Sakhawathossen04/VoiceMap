"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthorityShell } from "@/components/authority/sidebar";
import { Card, SeverityBadge, StatusBadge, UnderheardBadge } from "@/components/common/primitives";
import { Modal } from "@/components/common/overlays";
import { PriorityRadar } from "@/components/charts/priority-radar";
import { CLUSTERS } from "@/data/clusters";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function PriorityPage() {
  const [explain, setExplain] = useState<string | null>(null);
  const ranked = [...CLUSTERS].sort((a, b) => b.priorityScore - a.priorityScore);
  const explained = CLUSTERS.find((c) => c.id === explain);

  return (
    <AuthorityShell title="Priority Issues" subtitle="Equity-aware ranking — not complaint volume alone">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Rank</th>
                <th className="px-4 py-3">Issue</th>
                <th className="px-4 py-3">Ward</th>
                <th className="px-4 py-3 text-right">Reports</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Vulnerability</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((c, i) => (
                <tr key={c.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
                  <td className="px-5 py-4 text-lg font-black text-slate-200">#{i + 1}</td>
                  <td className="px-4 py-4">
                    <Link href={`/issues/${c.id}`} className="flex items-center gap-2 font-semibold text-navy-900 hover:text-brand-700">
                      {c.title} {c.underheard && <UnderheardBadge />}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-slate-600">Ward {c.ward}</td>
                  <td className="px-4 py-4 text-right font-bold tabular-nums">{formatNumber(c.reportCount)}</td>
                  <td className="px-4 py-4"><SeverityBadge severity={c.priorityScore >= 90 ? "Critical" : c.priorityScore >= 80 ? "High" : "Medium"} /></td>
                  <td className="px-4 py-4 tabular-nums text-slate-700">{c.priorityFactors.urgency}</td>
                  <td className="px-4 py-4 tabular-nums text-slate-700">{c.priorityFactors.vulnerability}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setExplain(c.id)}
                      className="group flex items-center gap-2"
                      title="Explain this priority score"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white" style={{ background: c.priorityScore >= 90 ? "#dc2626" : c.priorityScore >= 80 ? "#ea580c" : c.priorityScore >= 65 ? "#d97706" : "#0284c7" }}>
                        {c.priorityScore}
                      </span>
                      <span className="text-xs font-bold text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">Why?</span>
                    </button>
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!explained} onClose={() => setExplain(null)} title="Why is this issue prioritized?" wide>
        {explained && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-navy-900">{explained.title}</p>
                <p className="text-sm text-slate-500">Ward {explained.ward} · {formatNumber(explained.reportCount)} reports</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black tabular-nums text-navy-900">{explained.priorityScore}<span className="text-base text-slate-400">/100</span></p>
              </div>
            </div>
            <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_1.2fr]">
              <div className="h-64"><PriorityRadar factors={explained.priorityFactors} /></div>
              <div className="space-y-2.5">
                {(Object.entries(explained.priorityFactors) as [string, number][]).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold capitalize text-slate-600">{k.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="font-black tabular-nums text-navy-900">{v}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-5 rounded-xl bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-900">
              Priority is <strong>not</strong> based solely on complaint volume. Frequency contributes just 14% of the score — severity, urgency, vulnerability of affected groups, recurrence, and geographic impact carry the rest. This is how an issue with only {formatNumber(explained.reportCount)} reports can outrank issues with thousands.
            </p>
          </div>
        )}
      </Modal>
    </AuthorityShell>
  );
}
