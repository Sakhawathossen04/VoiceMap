"use client";

import Link from "next/link";
import { Ear, AlertTriangle, Users } from "lucide-react";
import { AuthorityShell } from "@/components/authority/sidebar";
import { Card, UnderheardBadge, PriorityMeter, StatusBadge, Button } from "@/components/common/primitives";
import { CLUSTERS } from "@/data/clusters";
import { useDemoReports } from "@/lib/demo-store";
import { formatNumber } from "@/lib/utils";

export default function UnderheardPage() {
  const list = CLUSTERS.filter((c) => c.underheard);
  const demo = useDemoReports();

  return (
    <AuthorityShell title="Underheard Voices" subtitle="High-impact issues that could be overlooked by complaint volume alone">
      <div className="rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-lg font-extrabold text-fuchsia-800"><Ear className="h-5.5 w-5.5" /> Detection engine active</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              VoiceMap BD flags issues where report volume is low but severity, vulnerability, and impact are high — groups that report less (elderly, wheelchair users, night workers) are exactly the ones volume-based systems miss. {CLUSTERS.filter((c) => c.underheard).length} active underheard clusters in the pilot; 36 identified across the simulated dataset.
            </p>
          </div>
          <div className="rounded-2xl border border-fuchsia-200 bg-white px-6 py-4 text-center shadow-card">
            <p className="text-3xl font-black text-fuchsia-700">{formatNumber(36)}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Underheard detected</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {list.map((c) => (
          <Card key={c.id} className="border-fuchsia-200 p-6 ring-1 ring-fuchsia-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <UnderheardBadge size="lg" />
                <h2 className="mt-2.5 text-lg font-extrabold text-navy-900">{c.title}</h2>
                <p className="text-sm text-slate-500">Ward {c.ward} · {c.locationLabel}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 py-3">
                <p className="text-xl font-black tabular-nums text-navy-900">{c.reportCount}</p>
                <p className="text-[11px] font-semibold text-slate-500">reports</p>
              </div>
              <div className="rounded-xl bg-red-50 py-3">
                <p className="text-xl font-black tabular-nums text-red-600">{Math.round(((c.severityMix.High + c.severityMix.Critical) / c.reportCount) * 100)}%</p>
                <p className="text-[11px] font-semibold text-red-500">high severity</p>
              </div>
              <div className="rounded-xl bg-fuchsia-50 py-3">
                <p className="text-xl font-black tabular-nums text-fuchsia-700">{c.priorityScore}</p>
                <p className="text-[11px] font-semibold text-fuchsia-600">priority</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Affected group</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                <Users className="h-4 w-4 text-fuchsia-600" /> {c.affectedGroups.join(", ")}
              </p>
            </div>

            <div className="mt-4 rounded-xl bg-fuchsia-50/70 px-4 py-3">
              <p className="text-xs font-bold text-fuchsia-700">Why flagged</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{c.underheardReason}</p>
            </div>

            <div className="mt-4 max-w-xs">
              <PriorityMeter score={c.priorityScore} showLabel />
            </div>

            <div className="mt-5 flex gap-2.5">
              <Link href={`/issues/${c.id}`}>
                <Button size="sm">Open issue intelligence</Button>
              </Link>
              <Link href="/authority/resolution">
                <Button size="sm" variant="secondary">Manage resolution</Button>
              </Link>
            </div>
          </Card>
        ))}

        <Card className="flex flex-col items-center justify-center border-dashed p-10 text-center">
          <AlertTriangle className="h-7 w-7 text-slate-300" />
          <p className="mt-3 font-bold text-navy-900">More cases surface as reports arrive</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            The engine continuously re-scores clusters. {demo.length > 0 ? "Your session's new reports are being re-evaluated now." : "Submit citizen reports from the demo to see the pipeline in motion."}
          </p>
        </Card>
      </div>
    </AuthorityShell>
  );
}
