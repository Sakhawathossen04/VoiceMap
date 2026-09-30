"use client";

import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const AX = { stroke: "#94a3b8", fontSize: 12 };
const TIP = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px -8px rgba(23,45,84,.18)",
    fontSize: 13,
  },
};

export const CHART_COLORS = ["#2578eb", "#0284c7", "#7c3aed", "#15803d", "#d97706", "#dc2626", "#0e7490", "#be185d", "#4d7c0f", "#475569"];

export function ChartCard({ title, desc, children, className, note }: { title: string; desc?: string; children: ReactNode; className?: string; note?: string }) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-card", className)}>
      <p className="font-bold text-navy-900">{title}</p>
      {desc && <p className="mt-0.5 text-sm text-slate-500">{desc}</p>}
      <div className="mt-4 h-64">{children}</div>
      {note && <p className="mt-3 text-xs text-slate-400">{note}</p>}
    </div>
  );
}

export function ReportsAreaChart({ data }: { data: { month: string; reports: number; resolved: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id="gRep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2578eb" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#2578eb" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity={0.24} />
            <stop offset="100%" stopColor="#16a34a" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="month" tick={AX} axisLine={false} tickLine={false} />
        <YAxis tick={AX} axisLine={false} tickLine={false} />
        <Tooltip {...TIP} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="reports" name="Reports" stroke="#2578eb" strokeWidth={2.4} fill="url(#gRep)" />
        <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#16a34a" strokeWidth={2.4} fill="url(#gRes)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoryBarChart({ data, dataKey = "count", nameKey = "category" }: { data: Record<string, unknown>[]; dataKey?: string; nameKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 30, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
        <XAxis type="number" tick={AX} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey={nameKey} tick={{ ...AX, fontSize: 11 }} width={110} axisLine={false} tickLine={false} />
        <Tooltip {...TIP} />
        <Bar dataKey={dataKey} name="Reports" fill="#2578eb" radius={[0, 6, 6, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PriorityDistChart({ data }: { data: { band: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="band" tick={AX} axisLine={false} tickLine={false} />
        <YAxis tick={AX} axisLine={false} tickLine={false} />
        <Tooltip {...TIP} />
        <Bar dataKey="count" name="Issues" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={["#dc2626", "#ea580c", "#d97706", "#0284c7", "#2578eb", "#94a3b8"][i % 6]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SeverityPie({ data }: { data: { name: string; value: number }[] }) {
  const colors: Record<string, string> = { Low: "#94a3b8", Medium: "#d97706", High: "#ea580c", Critical: "#dc2626" };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={3} strokeWidth={2}>
          {data.map((d) => (
            <Cell key={d.name} fill={colors[d.name] ?? "#2578eb"} />
          ))}
        </Pie>
        <Tooltip {...TIP} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ResolutionLineChart({ data }: { data: { month: string; rate: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="month" tick={AX} axisLine={false} tickLine={false} />
        <YAxis tick={AX} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
        <Tooltip {...TIP} />
        <Line type="monotone" dataKey="rate" name="Resolution rate" stroke="#16a34a" strokeWidth={2.6} dot={{ r: 3.5, fill: "#16a34a" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MiniTrend({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-bold tabular-nums", up ? "text-red-600" : "text-green-600")}>
      <svg viewBox="0 0 24 24" className={cn("h-3.5 w-3.5", !up && "rotate-180")} fill="none" aria-hidden>
        <path d="M4 17l6-6 4 4 6-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {up ? "+" : ""}{pct}%
    </span>
  );
}
export { WardCompare } from "./ward-compare";