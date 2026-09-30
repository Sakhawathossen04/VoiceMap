"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { AuthorityShell } from "@/components/authority/sidebar";
import { Card, Button, Chip } from "@/components/common/primitives";
import { useToast } from "@/components/common/toast";
import { clearDemoReports } from "@/lib/demo-store";

export default function AuthoritySettingsPage() {
  const [wardScope, setWardScope] = useState(["5", "8", "12", "17", "22", "26", "31"]);
  const toast = useToast();

  function toggleWard(w: string) {
    setWardScope((prev) => (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]));
  }

  return (
    <AuthorityShell title="Settings" subtitle="Console preferences (frontend-only in this prototype)">
      <div className="grid max-w-4xl gap-6">
        <Card className="p-6">
          <p className="flex items-center gap-2 font-bold text-navy-900"><SettingsIcon className="h-4.5 w-4.5 text-brand-600" /> Pilot scope</p>
          <p className="mt-1 text-sm text-slate-500">Wards visible in this console session.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["5", "8", "12", "17", "22", "26", "31"].map((w) => (
              <button
                key={w}
                onClick={() => toggleWard(w)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-bold ${wardScope.includes(w) ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600"}`}
                aria-pressed={wardScope.includes(w)}
              >
                Ward {w}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-bold text-navy-900">Priority engine weights</p>
          <p className="mt-1 text-sm text-slate-500">Simulated sliders — real weights live in backend scoring configuration.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["Frequency", 14], ["Severity", 26], ["Urgency", 18],
              ["Vulnerability", 20], ["Recurrence", 12], ["Geographic impact", 10],
            ].map(([label, val]) => (
              <div key={label as string}>
                <div className="flex justify-between text-sm font-semibold text-slate-600">
                  <span>{label}</span><span className="tabular-nums">{val}%</span>
                </div>
                <input type="range" min={0} max={40} defaultValue={val as number} className="mt-1 w-full accent-brand-600" aria-label={`${label} weight`} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-bold text-navy-900">Demo session</p>
          <p className="mt-1 text-sm text-slate-500">Reports you submitted during this demo are stored in this browser only.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                clearDemoReports();
                toast({ kind: "info", title: "Demo reports cleared", desc: "The dashboard returns to the baseline pilot dataset." });
                setTimeout(() => window.location.reload(), 800);
              }}
            >
              Clear my demo reports
            </Button>
            <Button onClick={() => toast({ kind: "success", title: "Settings saved (simulated)", desc: "In production these persist per authority account." })}>
              <Save className="h-4 w-4" /> Save settings
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip>Frontend-only storage</Chip>
            <Chip>localStorage</Chip>
          </div>
        </Card>
      </div>
    </AuthorityShell>
  );
}
