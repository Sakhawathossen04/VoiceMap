"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, Minus, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeedbackVerification({ clusterId }: { clusterId: string }) {
  const [answer, setAnswer] = useState<string | null>(null);

  const options = [
    { id: "solved", label: "Yes, fully solved", icon: ThumbsUp, active: "bg-green-600 border-green-600 text-white" },
    { id: "partial", label: "Partially solved", icon: Minus, active: "bg-amber-500 border-amber-500 text-white" },
    { id: "not", label: "No, problem remains", icon: ThumbsDown, active: "bg-red-500 border-red-500 text-white" },
  ];

  if (answer) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-xl bg-green-100 px-4 py-3 text-sm font-semibold text-green-800"
      >
        Thank you. Your feedback helps verify community outcomes.
      </motion.p>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {options.map(({ id, label, icon: Icon, active }) => (
        <button
          key={id}
          onClick={() => setAnswer(id)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-navy-900 transition-all hover:shadow-card",
            "hover:border-slate-300"
          )}
        >
          <Icon className="h-4.5 w-4.5 text-slate-500" />
          {label}
        </button>
      ))}
    </div>
  );
}
