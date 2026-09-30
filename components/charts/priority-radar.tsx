"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import type { PriorityFactors } from "@/lib/types";

export function PriorityRadar({ factors }: { factors: PriorityFactors }) {
  const data = [
    { factor: "Frequency", value: factors.frequency },
    { factor: "Severity", value: factors.severity },
    { factor: "Urgency", value: factors.urgency },
    { factor: "Vulnerability", value: factors.vulnerability },
    { factor: "Recurrence", value: factors.recurrence },
    { factor: "Geo Impact", value: factors.geographicImpact },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="factor" tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }} />
        <Radar dataKey="value" stroke="#2578eb" fill="#2578eb" fillOpacity={0.32} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
