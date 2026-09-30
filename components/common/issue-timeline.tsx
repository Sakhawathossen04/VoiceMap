import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function IssueTimeline({ items }: { items: { label: string; date: string; done: boolean; note?: string }[] }) {
  return (
    <ol className="relative space-y-0">
      {items.map((t, i) => (
        <li key={t.label} className="relative flex gap-4 pb-5 last:pb-0">
          {/* connector */}
          {i < items.length - 1 && (
            <span
              className={cn("absolute left-[13px] top-7 h-[calc(100%-24px)] w-0.5", t.done ? "bg-green-400" : "bg-slate-200")}
              aria-hidden
            />
          )}
          <span
            className={cn(
              "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px]",
              t.done ? "border-green-500 bg-green-500 text-white" : "border-slate-300 bg-white text-slate-400"
            )}
          >
            {t.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </span>
          <div className="min-w-0 pt-0.5">
            <p className={cn("text-sm font-bold", t.done ? "text-navy-900" : "text-slate-500")}>{t.label}</p>
            <p className="text-xs text-slate-400">
              {t.date}{t.note ? ` · ${t.note}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
