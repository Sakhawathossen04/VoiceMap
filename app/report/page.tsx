"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, Type, ImageIcon, MapPin, ChevronLeft, ChevronRight, Check, Send,
  Camera, ShieldCheck, LocateFixed, Phone, PartyPopper, Map as MapIcon,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { Card, Button, Chip, PriorityMeter } from "@/components/common/primitives";
import { AIPipelineLoader, Waveform } from "@/components/ai/pipeline-loader";
import { useToast } from "@/components/common/toast";
import { PIPELINE_STAGES, sleep, simulateIssueAnalysis, type AIAnalysis } from "@/lib/mock-ai";
import { addDemoReport, nextReportId } from "@/lib/demo-store";
import { LOCATION_AREAS } from "@/data/lookups";
import type { CitizenReport } from "@/lib/types";
import { cn } from "@/lib/utils";

type Mode = "voice" | "text" | "photo";
const STEPS = ["Mode", "Describe", "Evidence", "Location", "AI Analysis", "Review"];

const SAMPLE = "আমাদের স্কুলের সামনে বৃষ্টি হলে হাঁটু পর্যন্ত পানি জমে যায়। বাচ্চাদের স্কুলে যেতে সমস্যা হয়।";

export default function ReportWizard() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode>("voice");
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribed, setTranscribed] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [area, setArea] = useState(LOCATION_AREAS[0]);
  const [locMode, setLocMode] = useState<"current" | "manual">("current");
  const [analyzing, setAnalyzing] = useState(false);
  const [stage, setStage] = useState(0);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const toast = useToast();

  const canNext = useMemo(() => {
    if (step === 1) return text.trim().length > 4 || transcribed.length > 4;
    return true;
  }, [step, text, transcribed]);

  async function holdToSpeak() {
    if (recording) {
      setRecording(false);
      setTranscribed(SAMPLE);
      setText(SAMPLE);
      return;
    }
    setRecording(true);
    setTranscribed("");
    await sleep(2600);
    if (recording !== false) {
      setTranscribed(SAMPLE);
      setText(SAMPLE);
      setRecording(false);
    }
  }

  async function runAnalysis() {
    setStep(4);
    setAnalyzing(true);
    setStage(0);
    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      setStage(i);
      await sleep(700);
    }
    const a = await simulateIssueAnalysis(text || transcribed, { ward: area.ward, locationLabel: area.label });
    setAnalysis(a);
    setAnalyzing(false);
  }

  function submit() {
    if (!analysis) return;
    const id = nextReportId();
    const report: CitizenReport = {
      id,
      createdAt: new Date().toISOString(),
      inputMode: mode,
      originalText: text || transcribed,
      transcription: analysis.transcription,
      category: analysis.category,
      severity: analysis.severity,
      urgency: analysis.urgency,
      affectedGroup: analysis.affectedGroup,
      entities: analysis.entities,
      ward: analysis.ward,
      locationLabel: analysis.locationLabel,
      lat: area.lat + (Math.random() - 0.5) * 0.0015,
      lng: area.lng + (Math.random() - 0.5) * 0.0015,
      clusterId: analysis.clusterId,
      status: "Clustered",
      confidence: { category: analysis.confidence.category, location: analysis.confidence.location },
      hasPhoto: photos.length > 0,
      anonymizedCitizen: "Citizen #" + (1000 + Math.floor(Math.random() * 9000)),
    };
    addDemoReport(report);
    setReportId(id);
    setStep(6);
    toast({ kind: "success", title: `Report ${id} submitted`, desc: "Track it any time from the Track page." });
  }

  const input = text || transcribed;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-900">Report an Issue</h1>
        <p className="mt-2 text-slate-600">Speak, type, or snap a photo. AI handles the paperwork — you just describe the problem.</p>

        {/* Stepper */}
        <ol className="mt-8 flex items-center gap-1.5 overflow-x-auto pb-2" aria-label="Report progress">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  i < step ? "bg-green-600 text-white" : i === step ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-500"
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={cn("hidden text-xs font-semibold sm:block", i === step ? "text-navy-900" : "text-slate-500")}>{s}</span>
              {i < STEPS.length - 1 && <span className="mx-1 h-0.5 w-4 shrink-0 rounded bg-slate-200 sm:w-7" />}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} className="mt-8">
            {/* Step 0: mode */}
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-3">
                {([
                  { id: "voice", icon: Mic, title: "Voice", desc: "Speak in Bangla — the easiest way to report.", recommended: true },
                  { id: "text", icon: Type, title: "Text", desc: "Type your issue in Bangla or English." },
                  { id: "photo", icon: Camera, title: "Photo + Text", desc: "Attach a photo and add a short description." },
                ] as const).map(({ id, icon: Icon, title, desc, recommended }: { id: Mode; icon: typeof Mic; title: string; desc: string; recommended?: boolean }) => (
                  <button key={id} onClick={() => setMode(id)} className="text-left focus-visible:outline-none">
                    <Card
                      className={cn(
                        "relative h-full cursor-pointer p-6 transition-all",
                        mode === id ? "border-brand-500 ring-2 ring-brand-200" : "hover:shadow-lift"
                      )}
                    >
                      {recommended && (
                        <span className="absolute -top-2.5 left-5 rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Recommended
                        </span>
                      )}
                      <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl", mode === id ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700")}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <p className="mt-3.5 font-bold text-navy-900">{title}</p>
                      <p className="mt-1 text-sm text-slate-600">{desc}</p>
                    </Card>
                  </button>
                ))}
                <div className="sm:col-span-3">
                  <Button onClick={() => setStep(1)} size="lg" className="w-full sm:w-auto">Continue <ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}

            {/* Step 1: describe */}
            {step === 1 && (
              <Card className="p-7">
                {mode === "voice" && (
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-bold text-navy-900">আপনার এলাকার সমস্যাটি বলুন</p>
                    <p className="mt-1 text-sm text-slate-500">Tap the microphone, speak, then tap again to stop. (Simulated ASR)</p>
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      onClick={holdToSpeak}
                      className={cn(
                        "mt-6 flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lift transition-colors",
                        recording ? "bg-red-500 animate-pulse-soft" : "bg-brand-600 hover:bg-brand-700"
                      )}
                      aria-label={recording ? "Stop recording" : "Start recording"}
                    >
                      <Mic className="h-10 w-10" />
                    </motion.button>
                    <Waveform active={recording} className="mt-4" />
                    {transcribed && (
                      <p className="mt-3 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-900" aria-live="polite">
                        ✓ Transcribed: “{transcribed}”
                      </p>
                    )}
                  </div>
                )}
                {mode === "photo" && (
                  <div className="mb-5 rounded-2xl border border-dashed border-brand-300 bg-brand-50/40 p-5 text-center">
                    <Camera className="mx-auto h-7 w-7 text-brand-600" />
                    <p className="mt-1.5 text-sm font-semibold text-navy-900">You can add photos in the next step</p>
                  </div>
                )}
                <label htmlFor="issue-text" className="mt-2 block text-sm font-bold text-navy-900">
                  Describe the issue <span className="font-normal text-slate-500">(Bangla or English)</span>
                </label>
                <textarea
                  id="issue-text"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="যেমন: আমাদের স্কুলের সামনে বৃষ্টি হলে অনেক পানি জমে যায়।"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-navy-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Chip>💡 Tip: mention what, where, and who is affected</Chip>
                  {!text && (
                    <button onClick={() => setText(SAMPLE)} className="text-xs font-bold text-brand-700 underline">
                      Use sample complaint
                    </button>
                  )}
                </div>
              </Card>
            )}

            {/* Step 2: evidence */}
            {step === 2 && <EvidenceStep photos={photos} setPhotos={setPhotos} onNext={() => setStep(3)} />}

            {/* Step 3: location */}
            {step === 3 && (
              <Card className="p-7">
                <h2 className="text-lg font-bold text-navy-900">Where is the problem?</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setLocMode("current")}
                    className={cn("rounded-xl border p-4 text-left", locMode === "current" ? "border-brand-500 ring-2 ring-brand-200" : "border-slate-200 hover:border-brand-300")}
                  >
                    <p className="flex items-center gap-2 font-bold text-navy-900"><LocateFixed className="h-4.5 w-4.5 text-brand-600" /> Use Current Location</p>
                    <p className="mt-1 text-sm text-slate-500">Simulated GPS fix</p>
                  </button>
                  <button
                    onClick={() => setLocMode("manual")}
                    className={cn("rounded-xl border p-4 text-left", locMode === "manual" ? "border-brand-500 ring-2 ring-brand-200" : "border-slate-200 hover:border-brand-300")}
                  >
                    <p className="flex items-center gap-2 font-bold text-navy-900"><MapPin className="h-4.5 w-4.5 text-brand-600" /> Choose Area Manually</p>
                    <p className="mt-1 text-sm text-slate-500">Pick from pilot areas</p>
                  </button>
                </div>

                {locMode === "manual" && (
                  <div className="mt-4">
                    <label htmlFor="area" className="text-sm font-bold text-navy-900">Pilot area</label>
                    <select
                      id="area"
                      value={area.label}
                      onChange={(e) => setArea(LOCATION_AREAS.find((a) => a.label === e.target.value)!)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    >
                      {LOCATION_AREAS.map((a) => (
                        <option key={a.label} value={a.label}>{a.label} — {a.ward}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mt-5 rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50 to-brand-50/40 p-5">
                  <p className="text-sm font-bold text-navy-900">📍 {area.label}</p>
                  <p className="text-sm text-slate-500">{area.ward}, Chattogram · accuracy ≈ 25 m (simulated)</p>
                  {/* mini map */}
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <svg viewBox="0 0 400 120" className="h-28 w-full" role="img" aria-label="Map preview of selected area">
                      <rect width="400" height="120" fill="#eef6ff" />
                      <path d="M0,70 C90,58 200,84 400,66" stroke="#bfe3f7" strokeWidth="14" fill="none" />
                      <path d="M40,0 L60,120 M140,0 L160,120 M240,0 L262,120 M330,0 L350,120" stroke="#dbe7f3" strokeWidth="5" />
                      <circle cx="200" cy="58" r="10" fill="#2578eb" stroke="white" strokeWidth="3" />
                      <circle cx="200" cy="58" r="18" fill="none" stroke="#2578eb" strokeOpacity="0.35" strokeWidth="2" />
                    </svg>
                  </div>
                  <p className="mt-3 flex items-start gap-2 rounded-xl bg-white px-3.5 py-2.5 text-xs leading-relaxed text-slate-600 shadow-card">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    Your exact personal location will not be shown publicly. Public maps use an approximate area to protect your privacy.
                  </p>
                </div>
              </Card>
            )}

            {/* Step 4: AI analysis */}
            {step === 4 && (
              <Card className="p-7">
                <h2 className="text-lg font-bold text-navy-900">AI Analysis</h2>
                {analyzing ? (
                  <div className="mt-5">
                    <AIPipelineLoader stages={PIPELINE_STAGES} current={stage} />
                  </div>
                ) : analysis && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
                    <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm italic text-slate-700">“{analysis.transcription}”</div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {[
                        ["Category", analysis.category],
                        ["Severity", analysis.severity],
                        ["Urgency", analysis.urgency],
                        ["Affected group", analysis.affectedGroup],
                        ["Location", `Ward ${analysis.ward} · ${analysis.locationLabel}`],
                        ["Similar reports", String(analysis.similarReports)],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-xl border border-slate-200 bg-white p-3.5">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{k}</p>
                          <p className="mt-0.5 font-bold text-navy-900">{v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-navy-900">Matched cluster: {analysis.clusterTitle}</p>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-brand-700 shadow-card">Cluster match {analysis.confidence.clusterMatch}%</span>
                      </div>
                      <div className="mt-3 max-w-sm">
                        <PriorityMeter score={analysis.priorityScore} showLabel />
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            )}

            {/* Step 5: review */}
            {step === 5 && analysis && (
              <Card className="p-7">
                <h2 className="text-lg font-bold text-navy-900">Review your report</h2>
                <dl className="mt-4 divide-y divide-slate-100">
                  {[
                    ["Description", input],
                    ["Category", analysis.category],
                    ["Severity", analysis.severity],
                    ["Urgency", analysis.urgency],
                    ["Affected group", analysis.affectedGroup],
                    ["Location", `${analysis.locationLabel}, Ward ${analysis.ward}`],
                    ["Cluster", analysis.clusterTitle],
                    ["Photos", photos.length ? `${photos.length} attached` : "None"],
                  ].map(([k, v]) => (
                    <div key={k} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr]">
                      <dt className="text-sm font-semibold text-slate-500">{k}</dt>
                      <dd className="text-sm font-medium text-navy-900">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 flex items-start gap-2 rounded-xl bg-sky-50 px-3.5 py-2.5 text-xs leading-relaxed text-sky-900">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  Your identity stays anonymous. Authorities review AI conclusions before taking action.
                </p>
              </Card>
            )}

            {/* Step 6: success */}
            {step === 6 && (
              <Card className="p-10 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600"
                >
                  <PartyPopper className="h-10 w-10" />
                </motion.span>
                <h2 className="mt-5 text-2xl font-extrabold text-navy-900">Report submitted!</h2>
                <p className="mt-2 text-slate-600">Your report has entered the VoiceMap BD pipeline.</p>
                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Report ID</p>
                  <p className="mt-1 text-2xl font-black tabular-nums text-brand-700">{reportId}</p>
                  <p className="mt-2 inline-flex rounded-full bg-sky-100 px-3 py-0.5 text-xs font-bold text-sky-700">Status: Submitted</p>
                </div>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link href={`/track?id=${reportId}`} className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700">
                    Track Report
                  </Link>
                  <Link href="/map" className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-navy-800 hover:bg-slate-50">
                    <MapIcon className="h-4 w-4" /> View Community Map
                  </Link>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Wizard nav */}
        {step < 6 && (
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step === 1 && <Button onClick={() => setStep(2)} disabled={!canNext}>Continue <ChevronRight className="h-4 w-4" /></Button>}
            {step === 2 && null}
            {step === 3 && <Button onClick={runAnalysis}>Analyze with AI <ChevronRight className="h-4 w-4" /></Button>}
            {step === 4 && !analyzing && analysis && <Button onClick={() => setStep(5)}>Continue <ChevronRight className="h-4 w-4" /></Button>}
            {step === 5 && <Button onClick={submit}><Send className="h-4 w-4" /> Submit Report</Button>}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// ─── Evidence step (photo upload mock) ───────────────────────────────────────
function EvidenceStep({ photos, setPhotos, onNext }: { photos: string[]; setPhotos: (p: string[]) => void; onNext: () => void }) {
  const [drag, setDrag] = useState(false);

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const previews = Array.from(files).slice(0, 4).map((f) => URL.createObjectURL(f));
    setPhotos([...photos, ...previews].slice(0, 4));
  }

  return (
    <Card className="p-7">
      <h2 className="text-lg font-bold text-navy-900">Add evidence (optional)</h2>
      <p className="mt-1 text-sm text-slate-500">Photos strengthen your report. They are reviewed before any public display.</p>
      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addPhotos(e.dataTransfer.files); }}
        className={cn(
          "mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          drag ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50/60 hover:border-brand-400"
        )}
      >
        <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addPhotos(e.target.files)} />
        <ImageIcon className="h-9 w-9 text-slate-400" />
        <p className="mt-3 font-semibold text-navy-900">Drag &amp; drop photos here, or click to browse</p>
        <p className="mt-1 text-xs text-slate-500">Frontend preview only — nothing is uploaded to a server.</p>
      </label>
      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`Evidence photo ${i + 1}`} className="h-20 w-full rounded-xl border border-slate-200 object-cover" />
          ))}
        </div>
      )}
      <div className="mt-6">
        <Button onClick={onNext}>Continue <ChevronRight className="h-4 w-4" /></Button>
      </div>
    </Card>
  );
}
