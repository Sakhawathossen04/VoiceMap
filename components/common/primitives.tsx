import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { SEVERITY_STYLE, STATUS_STYLE } from "@/data/reports";

// ─── Badges ──────────────────────────────────────────────────────────────────
export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold", SEVERITY_STYLE[severity])}>
      {severity === "Critical" && <AlertTriangle className="h-3 w-3" />}
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLE[status] ?? "bg-slate-100 text-slate-700 border-slate-200")}>
      {status}
    </span>
  );
}

export function UnderheardBadge({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-fuchsia-200 bg-fuchsia-50 font-semibold text-fuchsia-700",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden>
        <path d="M3 12h3l3-7 4 14 3-7h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Underheard Issue
    </span>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600", className)}>
      {children}
    </span>
  );
}

// ─── Buttons ─────────────────────────────────────────────────────────────────
type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
type BtnSize = "sm" | "md" | "lg";

const btnStyles: Record<BtnVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary: "bg-white text-navy-800 border border-slate-300 hover:bg-slate-50 shadow-sm",
  ghost: "text-navy-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const btnSizes: Record<BtnSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        btnStyles[variant],
        btnSizes[size],
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: BtnVariant;
  size?: BtnSize;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        btnStyles[variant],
        btnSizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

// ─── Cards ───────────────────────────────────────────────────────────────────
export function Card({ children, className, hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-card", hover && "transition-shadow hover:shadow-lift", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, desc, center = false }: { eyebrow?: string; title: string; desc?: string; center?: boolean }) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{title}</h2>
      {desc && <p className="mt-3 text-base leading-relaxed text-slate-600">{desc}</p>}
    </div>
  );
}

// ─── Priority meter ──────────────────────────────────────────────────────────
export function PriorityMeter({ score, size = "md", showLabel = false }: { score: number; size?: "sm" | "md" | "lg"; showLabel?: boolean }) {
  const color = score >= 90 ? "#dc2626" : score >= 80 ? "#ea580c" : score >= 65 ? "#d97706" : score >= 50 ? "#0284c7" : "#64748b";
  const height = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between">
        <span className={cn("font-extrabold tabular-nums", size === "lg" ? "text-3xl" : "text-sm", "text-navy-900")}>
          {score}
          <span className="text-slate-400 font-bold text-xs">/100</span>
        </span>
        {showLabel && (
          <span className="text-xs font-semibold" style={{ color }}>
            {score >= 90 ? "Critical" : score >= 80 ? "High" : score >= 65 ? "Elevated" : "Moderate"}
          </span>
        )}
      </div>
      <div className={cn("mt-1.5 w-full overflow-hidden rounded-full bg-slate-100", height)}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color, transition: "width .8s cubic-bezier(.22,1,.36,1)" }}
        />
      </div>
    </div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, tone = "brand" }: { label: string; value: string | number; sub?: string; icon?: ReactNode; tone?: "brand" | "green" | "red" | "amber" | "violet" }) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-navy-900 tabular-nums">{value}</p>
          {sub && <p className="mt-1 text-xs font-medium text-slate-500">{sub}</p>}
        </div>
        {icon && <div className={cn("rounded-xl p-2.5", tones[tone])}>{icon}</div>}
      </div>
    </Card>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }: { icon?: ReactNode; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-14 text-center">
      {icon && <div className="mb-3 rounded-full bg-white p-3 shadow-card">{icon}</div>}
      <p className="text-base font-semibold text-navy-900">{title}</p>
      {desc && <p className="mt-1 max-w-sm text-sm text-slate-500">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PrototypeNote({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
      <span className="font-semibold">Prototype demonstration data.</span>{" "}
      {children ?? "Statistics shown simulate a Chattogram pilot and are not live deployment figures."}
    </div>
  );
}
