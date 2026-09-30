import type { Metadata } from "next";
import { Eye, Target, BrainCircuit, ShieldCheck, Scale, MapPinned, HeartHandshake, Sparkles } from "lucide-react";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { Card, SectionHeading, Chip, LinkButton } from "@/components/common/primitives";

export const metadata: Metadata = { title: "About — VoiceMap BD" };

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="About"
          title="What is VoiceMap BD?"
          desc="VoiceMap BD is an AI-powered participatory civic intelligence platform. It helps citizens report community problems through Bangla voice, text, photos, and location — then transforms those unstructured reports into structured, location-based civic intelligence for authorities."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Card className="p-7">
            <Eye className="h-7 w-7 text-brand-600" />
            <h2 className="mt-3 text-xl font-extrabold text-navy-900">Our Vision</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              To create an inclusive civic intelligence infrastructure where community experiences can be systematically transformed into evidence for better local decision-making.
            </p>
          </Card>
          <Card className="p-7">
            <Target className="h-7 w-7 text-brand-600" />
            <h2 className="mt-3 text-xl font-extrabold text-navy-900">Our Mission</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              To transform citizens' everyday voices into actionable, geospatial, prioritized civic intelligence that helps authorities identify, understand, prioritize, and respond to community problems more effectively and fairly.
            </p>
          </Card>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: BrainCircuit,
              title: "How AI is used",
              points: [
                "Bangla speech recognition turns voice into text",
                "Language models classify problem type, severity, and urgency",
                "Multilingual embeddings find semantically similar reports",
                "Clustering groups reports into community issues",
                "Summaries are generated only from submitted evidence",
              ],
            },
            {
              icon: ShieldCheck,
              title: "Privacy principles",
              points: [
                "Exact home coordinates are never public",
                "Public maps use approximate areas",
                "Citizen identities are anonymized",
                "Photos reviewed before public display",
                "Sensitive information is filtered out",
              ],
            },
            {
              icon: Scale,
              title: "Responsible AI",
              points: [
                "AI assists human decisions — never replaces them",
                "Authorities can review AI severity and priority",
                "Confidence indicators accompany analysis",
                "No autonomous public decisions by AI",
                "Evidence-first: no data, no claim",
              ],
            },
          ].map(({ icon: Icon, title, points }) => (
            <Card key={title} className="p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-3.5 font-bold text-navy-900">{title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-7">
          <h2 className="text-xl font-extrabold text-navy-900">Why it exists</h2>
          <div className="mt-4 grid gap-4 text-sm leading-relaxed text-slate-600 md:grid-cols-2">
            <p>
              Citizens experience civic problems daily — waterlogging, broken roads, dead streetlights, blocked drains — but existing reporting is fragmented and form-heavy. Written complaints are hard for many. Authorities receive thousands of unstructured complaints and treat similar ones independently. Geographic hotspots hide inside the noise, and problems affecting vulnerable communities can go unnoticed because fewer people report them.
            </p>
            <p>
              VoiceMap BD starts from a different assumption: every report is evidence, and every voice deserves a place on the map regardless of how many people managed to file a complaint. The pilot begins in Chattogram and is designed to scale city by city across Bangladesh.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Chip>Chattogram pilot first</Chip>
            <Chip>Bangladesh-scalable design</Chip>
            <Chip>Equity-aware by default</Chip>
          </div>
        </Card>

        <Card className="mt-6 border-brand-200 bg-gradient-to-b from-brand-50/60 to-white p-7 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-brand-600" />
          <h2 className="mt-3 text-xl font-extrabold text-navy-900">Future vision</h2>
          <p className="mx-auto mt-2 max-w-2xl leading-relaxed text-slate-600">
            A nationwide civic intelligence layer: ward-level dashboards in every city, voice reporting in every major language, and a permanent feedback loop between citizens and the institutions that serve them.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <LinkButton href="/report">Report a problem</LinkButton>
            <LinkButton href="/how-it-works" variant="secondary">See the pipeline</LinkButton>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
