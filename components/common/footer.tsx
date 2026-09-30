import Link from "next/link";
import { MapPin } from "lucide-react";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { href: "/report", label: "Report Issue" },
      { href: "/map", label: "Community Map" },
      { href: "/issues", label: "Issues Directory" },
      { href: "/track", label: "Track Report" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/impact", label: "Impact" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/about#privacy", label: "Privacy" },
      { href: "/about#responsible-ai", label: "Responsible AI" },
      { href: "/authority", label: "Authority Dashboard (demo)" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="text-base font-extrabold tracking-tight text-navy-900">VoiceMap <span className="text-brand-600">BD</span></span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
            Every voice matters. Every problem gets a place on the map.
          </p>
          <p className="mt-2 text-sm text-slate-500">Turning citizen voices into actionable civic intelligence.</p>
          <p className="mt-6 inline-block rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            VoiceMap BD is currently presented as a civic-tech pilot/prototype.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-bold text-navy-900">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-slate-600 transition-colors hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 VoiceMap BD — Chattogram pilot. Frontend prototype with simulated data.</p>
          <p>Voice → Understanding → Location → Clustering → Priority → Action → Verification</p>
        </div>
      </div>
    </footer>
  );
}
