import Link from "next/link";
import {
  Mic, MapPinned, ArrowRight, ChevronDown, Volume2, ShieldCheck, Users, Sparkles,
  MessageSquareText, Camera, Languages, BrainCircuit, Layers, Radar, Scale,
  FileSearch, ThumbsUp, HeartHandshake, BadgeCheck,
} from "lucide-react";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { Card, SectionHeading, LinkButton, UnderheardBadge, PriorityMeter, Chip, PrototypeNote } from "@/components/common/primitives";
import { LiveDemo } from "@/components/ai/live-demo";
import ChattogramMap from "@/components/maps/chattogram-map";
import { PILOT_STATS } from "@/data/analytics";
import { CLUSTERS } from "@/data/clusters";
import { formatNumber } from "@/lib/utils";

export default function HomePage() {
  const top = [...CLUSTERS].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-[#F8FAFC] to-[#F8FAFC]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered Civic Intelligence
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-900 sm:text-5xl lg:text-[3.4rem]">
              Turn Community Voices Into Action
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              VoiceMap BD helps citizens report local problems using Bangla voice, text, photos, and location — then transforms those reports into actionable civic intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/report" size="lg">
                <Mic className="h-5 w-5" />
                Report a Problem
              </LinkButton>
              <LinkButton href="/map" size="lg" variant="secondary">
                <MapPinned className="h-5 w-5" />
                Explore Community Map
              </LinkButton>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Volume2 className="h-4 w-4 text-brand-600" /> Voice-first</span>
              <span className="inline-flex items-center gap-1.5"><MapPinned className="h-4 w-4 text-brand-600" /> Location-aware</span>
              <span className="inline-flex items-center gap-1.5"><Scale className="h-4 w-4 text-brand-600" /> Equity-focused</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <Card className="overflow-hidden">
              {/* mini map */}
              <div className="relative h-56 bg-gradient-to-b from-sky-50 to-brand-50/40">
                <svg viewBox="0 0 1000 780" className="h-full w-full opacity-90">
                  {[
                    { id: 5, path: "M40,120 L200,96 L318,140 L340,238 L282,322 L150,342 L58,272 Z" },
                    { id: 8, path: "M58,368 L196,352 L312,392 L330,486 L262,560 L120,556 L48,462 Z" },
                    { id: 12, path: "M370,90 L540,64 L664,120 L700,246 L640,368 L486,398 L384,320 L352,196 Z" },
                    { id: 17, path: "M368,436 L518,414 L648,462 L668,580 L576,664 L428,648 L356,548 Z" },
                  ].map((w) => (
                    <path key={w.id} d={w.path} fill="#e3eefc" stroke="#9db8d9" strokeWidth={2} />
                  ))}
                  {[
                    { x: 520, y: 235, r: 13, c: "#ea580c" },
                    { x: 508, y: 540, r: 15, c: "#dc2626" },
                    { x: 188, y: 452, r: 10, c: "#d97706" },
                    { x: 186, y: 220, r: 9, c: "#16a34a" },
                    { x: 560, y: 250, r: 8, c: "#d97706" },
                    { x: 470, y: 250, r: 7, c: "#d97706" },
                  ].map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.c} fillOpacity={0.85} stroke="white" strokeWidth={3} />
                  ))}
                </svg>
                {/* floating cards */}
                <div className="absolute left-4 top-4 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2.5 shadow-lift backdrop-blur">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-sky-700">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-500 opacity-70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-600" />
                    </span>
                    Listening
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-navy-900">“আপনার এলাকার সমস্যাটি বলুন”</p>
                  <div className="mt-1.5 flex items-end gap-[3px]" aria-hidden>
                    {[5, 12, 22, 30, 24, 14, 8, 18, 26, 16, 9, 5].map((h, i) => (
                      <span key={i} className="w-1 rounded-full bg-brand-500/80" style={{ height: h }} />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2.5 shadow-lift backdrop-blur">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Waterlogging detected</p>
                  <p className="text-sm font-bold text-navy-900">Ward 12 · Severity High</p>
                  <p className="text-xs text-slate-500">23 similar reports · Cluster C-01</p>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
                {[
                  { icon: MessageSquareText, label: "Voice / Text / Photo" },
                  { icon: BrainCircuit, label: "AI Understanding" },
                  { icon: Layers, label: "Clustering" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 px-2 py-4 text-center">
                    <Icon className="h-5 w-5 text-brand-600" />
                    <span className="text-[11px] font-semibold text-slate-600">{label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Live demo ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          center
          eyebrow="Live demo"
          title="See VoiceMap BD in Action"
          desc="A simulated end-to-end journey: a citizen speaks in Bangla, the AI pipeline understands, locates, clusters, and prioritizes the issue — all in the browser."
        />
        <div className="mt-10">
          <LiveDemo />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="How VoiceMap BD works"
            title="From citizen voice to verified resolution"
            desc="Individual reports stop being isolated complaints. They become evidence — grouped, located, weighed, and tracked through to outcomes."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Mic, step: "01", title: "Citizens report", desc: "Bangla voice, text, or photo + location. Voice-first for accessibility." },
              { icon: BrainCircuit, step: "02", title: "AI understands", desc: "Bangla ASR, classification, severity and urgency detection." },
              { icon: MapPinned, step: "03", title: "Location intelligence", desc: "GPS + reverse geocoding map every report to wards and roads." },
              { icon: Layers, step: "04", title: "Smart clustering", desc: "Semantic + spatial similarity turns scattered reports into issues." },
            ].map(({ icon: Icon, step, title, desc }, i) => (
              <Card key={step} hover className="relative p-6">
                <span className="absolute right-5 top-4 text-4xl font-black text-slate-100">{step}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <h3 className="mt-4 font-bold text-navy-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{desc}</p>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <LinkButton href="/how-it-works" variant="secondary">
              See the full pipeline <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── Map preview ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading
              eyebrow="Community map"
              title="Problems become places. Patterns become visible."
              desc="Every citizen report is geolocated. VoiceMap BD groups them into geographic clusters, exposing hotspots and recurring problems ward by ward across the Chattogram pilot."
            />
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {[
                "Red markers = critical severity, pulsing for urgency",
                "Cluster size reflects report volume",
                "Filter by category, ward, severity, status, or underheard issues",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <BadgeCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
                  {t}
                </li>
              ))}
            </ul>
            <LinkButton href="/map" className="mt-7">
              Open Community Map <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
          <ChattogramMap compact />
        </div>
      </section>

      {/* ── Priority intelligence ────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Priority intelligence"
            title="Not just the loudest problems — the most important ones"
            desc="Priority blends frequency, severity, urgency, vulnerability, recurrence, and geographic impact. Complaint volume alone never decides."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {top.map((c, i) => (
              <Link key={c.id} href={`/issues/${c.id}`} className="block">
                <Card hover className="flex items-center gap-5 p-5">
                  <span className="text-2xl font-black text-slate-200">#{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-bold text-navy-900">{c.title}</p>
                      {c.underheard && <UnderheardBadge />}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Ward {c.ward} · {formatNumber(c.reportCount)} reports · {c.category}
                    </p>
                    <div className="mt-2 max-w-xs">
                      <PriorityMeter score={c.priorityScore} size="sm" showLabel />
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-slate-300" />
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Underheard voices ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-fuchsia-50/60 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            center
            eyebrow="Underheard voices"
            title="Giving visibility to problems that numbers alone can miss"
            desc="Traditional systems assume more complaints mean more importance. VoiceMap BD also weighs severity, vulnerability, and impact — so quiet problems affecting few people never disappear."
          />
          <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 md:grid-cols-[1fr_auto_1.1fr]">
            <Card className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Frequently reported</p>
              <h3 className="mt-2 text-xl font-extrabold text-navy-900">Road Surface Damage</h3>
              <p className="mt-4 text-4xl font-black tabular-nums text-navy-900">5,000</p>
              <p className="text-sm text-slate-500">reports</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Severity: Medium</span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Ranks first in any volume-based system.</p>
            </Card>

            <div className="hidden items-center justify-center md:flex">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-400 shadow-card">
                <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
              </span>
            </div>

            <Card className="border-fuchsia-200 p-6 shadow-lift ring-1 ring-fuchsia-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-600">Underheard but critical</p>
                <UnderheardBadge />
              </div>
              <h3 className="mt-2 text-xl font-extrabold text-navy-900">Wheelchair Accessibility</h3>
              <div className="mt-4 flex items-end gap-3">
                <p className="text-4xl font-black tabular-nums text-navy-900">17</p>
                <p className="pb-1 text-sm text-slate-500">reports · 92% high severity</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-fuchsia-50 px-3.5 py-2.5">
                  <p className="text-xs font-semibold text-fuchsia-700">Vulnerability</p>
                  <p className="font-bold text-navy-900">Very High</p>
                </div>
                <div className="rounded-xl bg-fuchsia-50 px-3.5 py-2.5">
                  <p className="text-xs font-semibold text-fuchsia-700">Priority</p>
                  <p className="font-bold text-navy-900">89/100</p>
                </div>
              </div>
              <p className="mt-5 text-sm text-slate-600">
                Few report it — but for wheelchair users, this road is impassable. Volume-based ranking would bury it; VoiceMap BD surfaces it.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Citizen → authority workflow ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          center
          eyebrow="The full loop"
          title="Citizen voice → community evidence → data-driven action"
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: Users, title: "Citizens", desc: "Report in seconds — speak in Bangla, snap a photo, done. Track progress transparently." },
            { icon: Radar, title: "Intelligence", desc: "AI clusters, locates and scores every report, turning noise into prioritized evidence." },
            { icon: HeartHandshake, title: "Authorities", desc: "Decide with dashboards, situation reports and intervention planning — then close the loop." },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} hover className="p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-bold text-navy-900">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Impact stats ─────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading center eyebrow="Pilot impact" title="VoiceMap Chattogram — pilot" />
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { label: "Citizen Reports", value: formatNumber(PILOT_STATS.totalReports) },
              { label: "Active Issues", value: formatNumber(PILOT_STATS.activeIssues) },
              { label: "Resolved Reports", value: formatNumber(PILOT_STATS.resolvedReports) },
              { label: "High Priority Issues", value: formatNumber(PILOT_STATS.highPriorityIssues) },
              { label: "Underheard Issues Identified", value: PILOT_STATS.underheardIssues },
              { label: "Wards Monitored", value: PILOT_STATS.wardsMonitored },
            ].map((s) => (
              <Card key={s.label} hover className="p-6 text-center">
                <p className="text-3xl font-black tabular-nums text-navy-900 sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
              </Card>
            ))}
          </div>
          <div className="mx-auto mt-6 max-w-2xl">
            <PrototypeNote />
          </div>
          <div className="mt-8 text-center">
            <LinkButton href="/impact" variant="secondary">
              Explore impact analytics <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── Responsible AI & privacy ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><ShieldCheck className="h-6 w-6" /></span>
            <h3 className="mt-4 text-xl font-extrabold text-navy-900">Privacy by design</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {[
                "Exact home coordinates are never displayed publicly",
                "Public maps use approximate locations only",
                "Citizen identities are anonymized in public reports",
                "Photos are reviewed before public display",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {t}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><BrainCircuit className="h-6 w-6" /></span>
            <h3 className="mt-4 text-xl font-extrabold text-navy-900">Responsible AI</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {[
                "AI suggestions assist human decision-making — they never replace it",
                "Severity and priority can be reviewed by authorities",
                "AI summaries rely only on submitted citizen evidence",
                "Confidence indicators shown on analysis screens",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" /> {t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-gradient-to-b from-brand-50/60 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Your voice, on the map.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Every report strengthens the evidence. Every verified resolution builds trust.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/report" size="lg"><Mic className="h-5 w-5" /> Report a Problem</LinkButton>
            <LinkButton href="/authority" size="lg" variant="secondary">View Authority Dashboard</LinkButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
