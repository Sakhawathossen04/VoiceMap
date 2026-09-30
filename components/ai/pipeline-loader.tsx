"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIPipelineLoader({ stages, current }: { stages: string[]; current: number }) {
  return (
    <div className="space-y-3" aria-live="polite">
      {stages.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className={cn("flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors", done ? "border-green-200 bg-green-50" : active ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white")}>
            <span className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
              done ? "bg-green-600 text-white" : active ? "bg-brand-600 text-white animate-pulse-soft" : "bg-slate-200 text-slate-500"
            )}>
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={cn("text-sm font-semibold", done ? "text-green-800" : active ? "text-brand-800" : "text-slate-500")}>{s}</span>
            {active && (
              <span className="ml-auto flex gap-1">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-brand-500"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                  />
                ))}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Waveform({ active, bars = 28, className }: { active: boolean; bars?: number; className?: string }) {
  return (
    <div className={cn("flex h-14 items-center justify-center gap-[3px]", className)} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-brand-500/80"
          style={{ height: active ? undefined : 6 }}
          animate={
            active
              ? { height: [6, 10 + ((i * 13) % 34), 6] }
              : { height: 6 }
          }
          transition={
            active
              ? { duration: 0.9, repeat: Infinity, delay: (i % 9) * 0.08, ease: "easeInOut" }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
