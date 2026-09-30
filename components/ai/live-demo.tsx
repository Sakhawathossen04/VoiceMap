"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Play, RotateCcw, Send, MapPin, Users, Layers, Target } from "lucide-react";
import { Card } from "@/components/common/primitives";
import { AIPipelineLoader, Waveform } from "./pipeline-loader";
import { PIPELINE_STAGES, sleep, type AIAnalysis } from "@/lib/mock-ai";
import { useToast } from "@/components/common/toast";
import { addDemoReport, nextReportId } from "@/lib/demo-store";
import type { CitizenReport } from "@/lib/types";

const DEMO_TEXT = "আমাদের স্কুলের সামনে বৃষ্টি হলে হাঁটু পর্যন্ত পানি জমে যায়। বাচ্চাদের স্কুলে যেতে সমস্যা হয়।";

export function LiveDemo() {
  const [phase, setPhase] = useState<"idle" | "listening" | "processing" | "result" | "submitted">("idle");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<AIAnalysis | null>(null);

  const toast = useToast();

  async function run() {
    setPhase("listening");
    await sleep(1800);
    setPhase("processing");
    for (let i = 0; i <= PIPELINE_STAGES.length - 1; i++) {
      setStage(i);
      await sleep(850);
    }
    const analysis = await import("@/lib/mock-ai").then((m) =>
      m.simulateIssueAnalysis(DEMO_TEXT)
    );
    setResult(analysis);
    setPhase("result");
  }

  function reset() {
    setPhase("idle");
    setStage(0);
    setResult(null);
  }

  function submit() {
    if (!result) return;
    const report: CitizenReport = {
      id: nextReportId(),
      createdAt: new Date().toISOString(),
      inputMode: "voice",
      originalText: result.transcription,
      transcription: result.transcription,
      category: result.category,
      severity: result.severity,
      urgency: result.urgency,
      affectedGroup: result.affectedGroup,
      entities: result.entities,
      ward: result.ward,
      locationLabel: result.locationLabel,
      lat: 22.3603,
      lng: 91.8220,
      clusterId: result.clusterId,
      status: "Clustered",
      confidence: { category: result.confidence.category, location: result.confidence.location },
      hasPhoto: false,
      anonymizedCitizen: "Citizen #1088",
    };
    addDemoReport(report);
    setPhase("submitted");
    toast({
      kind: "success",
      title: `Report ${report.id} submitted`,
      desc: "It now appears in the authority dashboard's recent reports.",
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Left: voice simulation */}
      <Card className="flex flex-col p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Citizen speaks (Bangla)</p>
        <p className="mt-3 text-xl font-bold leading-relaxed text-navy-900">
          “{DEMO_TEXT}”
        </p>

        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/50 p-6">
          <div className="flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={run}
              disabled={phase === "listening" || phase === "processing"}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-white shadow-lift transition-colors hover:bg-brand-700 disabled:opacity-70"
              aria-label="Simulate voice report"
            >
              {phase === "idle" || phase === "submitted" ? (
                <Play className="h-8 w-8" />
              ) : phase === "listening" ? (
                <Mic className="h-8 w-8" />
              ) : (
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
            </motion.button>
            <p className="mt-3 text-sm font-semibold text-brand-800">
              {phase === "idle" && "Simulate Voice Report"}
              {phase === "listening" && "Listening…"}
              {phase === "processing" && "AI pipeline running…"}
              {phase === "result" && "Analysis complete"}
              {phase === "submitted" && "Report submitted ✓"}
            </p>
            <Waveform active={phase === "listening"} className="mt-2" />
          </div>
        </div>

        <div className="mt-6 space-y-2 text-sm text-slate-600">
          <p className="flex items-center gap-2"><Mic className="h-4 w-4 text-brand-600" /> Simulated Bangla speech-to-text (Whisper-class ASR in production)</p>
          <p className="flex items-center gap-2"><Layers className="h-4 w-4 text-brand-600" /> Clustering runs against the pilot dataset</p>
          <p className="flex items-center gap-2"><Target className="h-4 w-4 text-brand-600" /> Priority computed by the equity-aware engine</p>
        </div>
      </Card>

      {/* Right: pipeline + result */}
      <Card className="p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">AI pipeline</p>
        <div className="mt-4">
          {phase === "idle" || phase === "listening" ? (
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center">
              <div>
                <p className="font-semibold text-navy-900">Press “Simulate Voice Report”</p>
                <p className="mt-1 text-sm text-slate-500">Watch the report travel the full AI pipeline.</p>
              </div>
            </div>
          ) : (
            <AIPipelineLoader stages={PIPELINE_STAGES} current={phase === "result" || phase === "submitted" ? PIPELINE_STAGES.length : stage} />
          )}
        </div>

        <AnimatePresence>
          {result && (phase === "result" || phase === "submitted") && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-brand-200 bg-gradient-to-b from-brand-50/70 to-white p-5"
            >
              <p className="text-sm font-bold text-navy-900">AI Analysis</p>
              <p className="mt-2 rounded-xl bg-white px-3.5 py-2.5 text-sm italic text-slate-700 shadow-card">“{result.transcription}”</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {[
                  ["Category", result.category],
                  ["Severity", result.severity],
                  ["Urgency", result.urgency],
                  ["Affected Entity", result.affectedGroup],
                  ["Location", `Ward ${result.ward}, Chattogram`],
                  ["Similar Reports", String(result.similarReports)],
                  ["Cluster", result.clusterTitle],
                  ["Priority Score", `${result.priorityScore}/100`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{k}</dt>
                    <dd className="font-bold text-navy-900">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                <span className="rounded-full bg-white px-2.5 py-1 shadow-card">Category confidence {result.confidence.category}%</span>
                <span className="rounded-full bg-white px-2.5 py-1 shadow-card">Location confidence {result.confidence.location}%</span>
                <span className="rounded-full bg-white px-2.5 py-1 shadow-card">Cluster match {result.confidence.clusterMatch}%</span>
              </div>

              {phase === "result" ? (
                <div className="mt-5 flex gap-2.5">
                  <button onClick={submit} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
                    <Send className="h-4 w-4" /> Submit Report
                  </button>
                  <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-navy-800 hover:bg-slate-50">
                    <RotateCcw className="h-4 w-4" /> Replay
                  </button>
                </div>
              ) : (
                <p className="mt-5 rounded-xl bg-green-50 px-3.5 py-2.5 text-sm font-semibold text-green-800">
                  ✓ Submitted — open the <a href="/authority" className="underline">authority dashboard</a> or <a href={`/track?id=${nextReportId()}`} className="underline">track this report</a>.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
