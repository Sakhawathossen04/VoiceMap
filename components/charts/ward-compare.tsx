"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const AX = { stroke: "#94a3b8", fontSize: 12 };
const TIP = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px -8px rgba(23,45,84,.18)",
    fontSize: 13,
  },
};

export function WardCompare({ data }: { data: { ward: string; reports: number; resolved: number; underheard: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="ward" tick={{ ...AX, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={AX} axisLine={false} tickLine={false} />
        <Tooltip {...TIP} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="reports" name="Reports" fill="#2578eb" radius={[5, 5, 0, 0]} barSize={16} />
        <Bar dataKey="resolved" name="Resolved" fill="#16a34a" radius={[5, 5, 0, 0]} barSize={16} />
        <Bar dataKey="underheard" name="Underheard" fill="#c026d3" radius={[5, 5, 0, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}
