"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, MapPin, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { LinkButton } from "./primitives";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/report", label: "Report Issue" },
  { href: "/map", label: "Community Map" },
  { href: "/issues", label: "Issues" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/impact", label: "Impact" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"bn" | "en">("en");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-navy-900">VoiceMap <span className="text-brand-600">BD</span></span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">Civic Intelligence</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === l.href ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-navy-900"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="hidden rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-navy-800 hover:bg-slate-50 sm:block"
            aria-label="Toggle language (simulated)"
          >
            {lang === "en" ? "বাংলা" : "EN"}
          </button>
          <Link href="/track" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-navy-800 hover:bg-slate-100 md:block">
            Track Report
          </Link>
          <LinkButton href="/report" size="sm" className="hidden sm:inline-flex">
            <Mic className="h-4 w-4" />
            Report a Problem
          </LinkButton>
          <button
            className="rounded-lg p-2 text-navy-900 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 lg:hidden">
          {[...LINKS, { href: "/track", label: "Track Report" }].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {l.label}
            </Link>
          ))}
          <LinkButton href="/report" className="mt-2 w-full">
            <Mic className="h-4 w-4" /> Report a Problem
          </LinkButton>
        </div>
      )}
    </header>
  );
}
