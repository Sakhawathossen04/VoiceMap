import type { PriorityFactors } from "./types";

/**
 * Equity-aware priority score (0–100).
 * Frequency alone must not dominate — vulnerability and severity are weighted
 * so low-volume, high-impact issues still surface. In the real backend this
 * lives in the FastAPI scoring service; weights are configuration.
 */
const WEIGHTS = {
  frequency: 0.14,
  severity: 0.26,
  urgency: 0.18,
  vulnerability: 0.2,
  recurrence: 0.12,
  geographicImpact: 0.1,
};

export function computePriorityScore(factors: PriorityFactors): number {
  const s =
    factors.frequency * WEIGHTS.frequency +
    factors.severity * WEIGHTS.severity +
    factors.urgency * WEIGHTS.urgency +
    factors.vulnerability * WEIGHTS.vulnerability +
    factors.recurrence * WEIGHTS.recurrence +
    factors.geographicImpact * WEIGHTS.geographicImpact;
  return Math.round(s);
}

export function priorityBand(score: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (score >= 90) return { label: "Critical Priority", color: "text-red-600", bg: "bg-red-50 border-red-200" };
  if (score >= 80) return { label: "High Priority", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" };
  if (score >= 65) return { label: "Elevated", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" };
  if (score >= 50) return { label: "Moderate", color: "text-sky-600", bg: "bg-sky-50 border-sky-200" };
  return { label: "Low", color: "text-slate-600", bg: "bg-slate-50 border-slate-200" };
}

/**
 * Underheard detection: an issue qualifies when report volume is low but a
 * combination of very high vulnerability, high severity share, and high
 * priority score indicates significant community impact that volume-based
 * ranking would miss.
 */
export function isUnderheard(input: {
  reportCount: number;
  severityShareHighPlus: number; // fraction of High+Critical reports
  factors: PriorityFactors;
}): boolean {
  return (
    input.reportCount < 25 &&
    input.severityShareHighPlus >= 0.7 &&
    input.factors.vulnerability >= 85 &&
    input.factors.severity >= 85
  );
}
