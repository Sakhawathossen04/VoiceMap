"use client";

import { AuthorityShell } from "@/components/authority/sidebar";
import ChattogramMap from "@/components/maps/chattogram-map";
import { Card } from "@/components/common/primitives";

export default function AuthorityMapPage() {
  return (
    <AuthorityShell title="Live Map" subtitle="Ward, category, priority, severity, status and underheard filters">
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card className="p-4">
          <ChattogramMap />
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <p className="font-bold text-navy-900">How to read this map</p>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li>• Marker size reflects report volume in the cluster</li>
              <li>• Pulsing rings flag critical severity</li>
              <li>• Greyed markers are filtered out — click any visible pin for the intelligence panel</li>
              <li>• Green markers are resolved clusters (verification example)</li>
            </ul>
          </Card>
          <Card className="p-5">
            <p className="font-bold text-navy-900">Geographic insight</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Ward 12 and Ward 17 account for the highest clustered report density in the pilot. Waterlogging clusters correlate with drainage complaints in adjacent Ward 8 — suggesting a shared storm-water root cause worth joint field assessment.
            </p>
          </Card>
        </div>
      </div>
    </AuthorityShell>
  );
}
