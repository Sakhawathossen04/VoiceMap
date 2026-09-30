"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, MapPinned, Flame, Ear, FileText, Layers3, FileBarChart2,
  Wrench, CheckCircle2, BarChart3, Settings, Menu, X, ChevronLeft, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/authority", label: "Overview", icon: LayoutDashboard },
  { href: "/authority/map", label: "Live Map", icon: MapPinned },
  { href: "/authority/priority", label: "Priority Issues", icon: Flame },
  { href: "/authority/underheard", label: "Underheard Voices", icon: Ear },
  { href: "/authority/reports", label: "Reports", icon: FileText },
  { href: "/authority/clusters", label: "Issue Clusters", icon: Layers3 },
  { href: "/authority/situation-reports", label: "Situation Reports", icon: FileBarChart2 },
  { href: "/authority/intervention-planner", label: "Intervention Planner", icon: Wrench },
  { href: "/authority/resolution", label: "Resolution", icon: CheckCircle2 },
  { href: "/authority/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/authority/settings", label: "Settings", icon: Settings },
];

export function AuthorityShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Building2 className="h-5 w-5" />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-extrabold text-navy-900">VoiceMap BD</span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-700">Authority Console</span>
        </span>
      </Link>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Authority">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/authority" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                active ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-navy-900"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("h-4.5 w-4.5", active ? "text-white" : "text-slate-400")} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 px-5 py-4">
        <p className="text-xs font-bold text-navy-900">Chattogram Pilot</p>
        <p className="mt-0.5 text-[11px] text-slate-500">12 wards · prototype data</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-lift">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold text-navy-900">{title}</h1>
            {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-200 sm:inline-flex">
              Live pilot feed (simulated)
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-black text-brand-800">AD</span>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
