"use client";

import { useState } from "react";
import { CheckCircle2, Camera, Loader2 } from "lucide-react";
import { AuthorityShell } from "@/components/authority/sidebar";
import { Card, Button, StatusBadge, PriorityMeter } from "@/components/common/primitives";
import { Modal } from "@/components/common/overlays";
import { CLUSTERS } from "@/data/clusters";
import { VERIFICATION_TOTALS } from "@/data/analytics";
import { useToast } from "@/components/common/toast";
import { cn } from "@/lib/utils";
import type { IssueCluster } from "@/lib/types";

const ACTIONS = ["Investigating", "Planned", "In Progress", "Resolved"] as const;

export default function ResolutionPage() {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(CLUSTERS.map((c) => [c.id, c.status]))
  );
  const [resolveTarget, setResolveTarget] = useState<IssueCluster | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  function setStatus(id: string, s: string) {
    if (s === "Resolved") {
      setResolveTarget(CLUSTERS.find((c) => c.id === id)!);
      return;
    }
    setStatuses((prev) => ({ ...prev, [id]: s }));
    toast({ kind: "info", title: `Status updated to “${s}”`, desc: "Citizens tracking related reports see this change immediately." });
  }

  async function confirmResolve() {
    if (!resolveTarget) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setStatuses((prev) => ({ ...prev, [resolveTarget.id]: "Resolved" }));
    setSaving(false);
    toast({
      kind: "success",
      title: "Issue marked resolved",
      desc: "Citizen verification requests have been sent to reporters in this cluster.",
    });
    setResolveTarget(null);
    setNote("");
  }

  const active = CLUSTERS.filter((c) => statuses[c.id] !== "Resolved");
  const resolved = CLUSTERS.filter((c) => statuses[c.id] === "Resolved");

  return (
    <AuthorityShell title="Resolution Management" subtitle="Update issue status; close the loop with citizen verification">
      {/* Verification summary */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-navy-900">Citizen Verification</h2>
            <p className="mt-1 text-sm text-slate-500">Post-resolution feedback across all resolved clusters.</p>
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="text-3xl font-black text-green-600">{VERIFICATION_TOTALS.solved}%</p><p className="text-xs font-semibold text-slate-500">Solved</p></div>
            <div><p className="text-3xl font-black text-amber-500">{VERIFICATION_TOTALS.partial}%</p><p className="text-xs font-semibold text-slate-500">Partially</p></div>
            <div><p className="text-3xl font-black text-red-500">{VERIFICATION_TOTALS.notSolved}%</p><p className="text-xs font-semibold text-slate-500">Not solved</p></div>
          </div>
        </div>
        <div className="mt-4 flex h-3.5 overflow-hidden rounded-full">
          <div className="bg-green-500" style={{ width: `${VERIFICATION_TOTALS.solved}%` }} />
          <div className="bg-amber-400" style={{ width: `${VERIFICATION_TOTALS.partial}%` }} />
          <div className="bg-red-400" style={{ width: `${VERIFICATION_TOTALS.notSolved}%` }} />
        </div>
      </Card>

      {/* Active issues */}
      <h3 className="mt-8 text-sm font-black uppercase tracking-wide text-slate-500">Active issues — update status</h3>
      <div className="mt-3 grid gap-4 xl:grid-cols-2">
        {active.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-navy-900">{c.title}</p>
                <p className="text-sm text-slate-500">Ward {c.ward} · {c.reportCount} reports</p>
              </div>
              <StatusBadge status={statuses[c.id]} />
            </div>
            <div className="mt-3 max-w-[220px]"><PriorityMeter score={c.priorityScore} size="sm" /></div>
            <div className="mt-4 flex flex-wrap gap-2">
              {ACTIONS.map((a) => (
                <button
                  key={a}
                  onClick={() => setStatus(c.id, a)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors",
                    statuses[c.id] === a
                      ? a === "Resolved" ? "border-green-600 bg-green-600 text-white" : "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                  )}
                >
                  Mark as {a}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <>
          <h3 className="mt-8 text-sm font-black uppercase tracking-wide text-slate-500">Resolved — awaiting/collecting citizen verification</h3>
          <div className="mt-3 grid gap-4 xl:grid-cols-2">
            {resolved.map((c) => (
              <Card key={c.id} className="border-green-200 bg-green-50/40 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-navy-900">{c.title}</p>
                    <p className="text-sm text-slate-500">Ward {c.ward} · {c.reportCount} reports</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                  </span>
                </div>
                {c.verification && (
                  <p className="mt-3 text-sm text-slate-600">
                    Citizen verification: <strong>{c.verification.solved}% solved</strong> · {c.verification.partial}% partial · {c.verification.notSolved}% not solved
                  </p>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Resolve dialog */}
      <Modal open={!!resolveTarget} onClose={() => setResolveTarget(null)} title="Mark issue as resolved">
        {resolveTarget && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              <strong className="text-navy-900">{resolveTarget.title}</strong> — Ward {resolveTarget.ward}, {resolveTarget.reportCount} reports.
            </p>
            <div>
              <label htmlFor="res-note" className="text-sm font-bold text-navy-900">Resolution note</label>
              <textarea
                id="res-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Work completed, e.g. “Desilted 240m of drain; replaced 2 manhole covers.”"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="res-date" className="text-sm font-bold text-navy-900">Completion date</label>
              <input id="res-date" type="date" defaultValue="2026-09-30" className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900">Proof photo</p>
              <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 hover:border-brand-400">
                <input type="file" accept="image/*" className="sr-only" />
                <Camera className="h-4.5 w-4.5" /> Upload proof photo (mock)
              </label>
            </div>
            <Button onClick={confirmResolve} disabled={saving} className="w-full" size="lg">
              {saving ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <CheckCircle2 className="h-4.5 w-4.5" />}
              {saving ? "Updating…" : "Mark Resolved"}
            </Button>
          </div>
        )}
      </Modal>
    </AuthorityShell>
  );
}
