import type { Metadata } from "next";
import { Mic, BrainCircuit, MapPinned, Layers, Scale, Building2, ThumbsUp, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { Card, SectionHeading, LinkButton } from "@/components/common/primitives";

export const metadata: Metadata = { title: "How It Works — VoiceMap BD" };

const STEPS = [
  {
    n: "01", icon: Mic, title: "Citizen Reports", desc: "Voice, text, or photo with location. Bangla voice-first so anyone can report — no forms, no literacy barrier.",
    chips: ["Bangla voice", "Text", "Photo", "GPS"],
  },
  {
    n: "02", icon: BrainCircuit, title: "AI Understands", desc: "Bangla ASR transcribes; language models classify the problem, its severity, urgency, and affected groups from everyday speech.",
    chips: ["Bangla ASR", "Classification", "Severity", "Urgency"],
  },
  {
    n: "03", icon: MapPinned, title: "Location Intelligence", desc: "GPS and reverse geocoding anchor every report to a ward, road, and coordinate — privacy-protected in public views.",
    chips: ["GPS", "Ward mapping", "GIS", "Privacy zones"],
  },
  {
    n: "04", icon: Layers, title: "Smart Clustering", desc: "Multilingual embeddings find reports that mean the same thing; spatial clustering finds reports from the same place.",
    chips: ["Semantic similarity", "Spatial clustering", "Issue clusters"],
  },
  {
    n: "05", icon: Scale, title: "Priority Engine", desc: "Frequency, severity, urgency, vulnerability, recurrence and geographic impact combine into one equity-aware score.",
    chips: ["Equity-aware", "Vulnerability weight", "0–100 score"],
  },
  {
    n: "06", icon: Building2, title: "Authority Action", desc: "Dashboards, situation reports and intervention planning support evidence-based decisions and resource allocation.",
    chips: ["Decision support", "Situation reports", "Planning"],
  },
  {
    n: "07", icon: ThumbsUp, title: "Citizen Verification", desc: "Resolved issues return to citizens: solved, partial, or not solved. Verification rates keep authorities accountable.",
    chips: ["Verification loop", "Accountability"],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <SectionHeading
          center
          eyebrow="How it works"
          title="Seven steps from voice to verified resolution"
          desc="VoiceMap BD is not a complaint box. It is a pipeline that turns everyday speech into structured, geographic, prioritized civic intelligence."
        />

        <div className="mt-14 space-y-2">
          {STEPS.map((s, i) => (
            <div key={s.n}>
              <Card hover className="flex gap-5 p-6">
                <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <s.icon className="h-6.5 w-6.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black tracking-widest text-slate-300">{s.n}</p>
                  <h2 className="mt-0.5 text-lg font-extrabold text-navy-900">{s.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.chips.map((ch) => (
                      <span key={ch} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">{ch}</span>
                    ))}
                  </div>
                </div>
              </Card>
              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-1.5">
                  <ChevronDown className="h-5 w-5 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-brand-200 bg-gradient-to-b from-brand-50/70 to-white p-8 text-center">
          <h2 className="text-xl font-extrabold text-navy-900">The core transformation</h2>
          <p className="mt-3 font-mono text-sm font-semibold text-brand-800">
            Voice → Understanding → Location → Clustering → Priority → Action → Verification
          </p>
          <LinkButton href="/report" className="mt-6">Try the report flow</LinkButton>
        </div>
      </main>
      <Footer />
    </div>
  );
}
