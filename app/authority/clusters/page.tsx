"use client";

import Link from "next/link";
import { Layers3, ArrowRight, MapPin, TrendingUp } from "lucide-react";
import { AuthorityShell } from "@/components/authority/sidebar";
import { Card, PriorityMeter, StatusBadge, UnderheardBadge } from "@/components/common/primitives";
import { CLUSTERS } from "@/data/clusters";
import { CATEGORY_META } from "@/data/reports";
import { Icon } from "@/components/common/icon";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function ClustersPage() {
  return (
    <AuthorityShell title="Issue Clusters" subtitle="Automatically detected community issues — semantic + spatial grouping">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {CLUSTERS.map((c) => {
          const meta = CATEGORY_META[c.category];
          return (
            <Card key={c.id} hover className="flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl border", meta.border, meta.bg)}>
                  <Icon name={meta.icon} className={cn("h-5.5 w-5.5", meta.text)} />
                </span>
                {c.underheard && <UnderheardBadge />}
              </div>
              <h2 className="mt-3 font-extrabold leading-snug text-navy-900">{c.title}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5" /> Ward {c.ward} · {c.locationLabel}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-xl bg-slate-50 py-2.5">
                  <p className="text-lg font-black tabular-nums text-navy-900">{formatNumber(c.reportCount)}</p>
                  <p className="text-[10px] font-semibold text-slate-500">reports</p>
                </div>
                <div className="rounded-xl bg-slate-50 py-2.5">
                  <p className="text-lg font-black tabular-nums text-navy-900">{c.radiusM}m</p>
                  <p className="text-[10px] font-semibold text-slate-500">radius</p>
                </div>
                <div className="rounded-xl bg-slate-50 py-2.5">
                  <p className={cn("flex items-center justify-center gap-1 text-lg font-black tabular-nums", c.trendPct >= 0 ? "text-red-600" : "text-green-600")}>
                    {c.trendPct >= 0 ? "+" : ""}{c.trendPct}%
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500">trend</p>
                </div>
              </div>

              <div className="mt-4">
                <PriorityMeter score={c.priorityScore} showLabel />
              </div>

              <div className="mt-4 flex-1" />
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <StatusBadge status={c.status} />
                <Link href={`/issues/${c.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700">
                  Open Cluster <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </AuthorityShell>
  );
}
