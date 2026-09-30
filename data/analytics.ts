import type { Category } from "@/lib/types";

// Simulated pilot aggregates — prototype demonstration data, not real counts.
export const PILOT_STATS = {
  totalReports: 24821,
  activeIssues: 1240,
  resolvedReports: 4812,
  highPriorityIssues: 184,
  underheardIssues: 36,
  wardsMonitored: 12,
};

export const CATEGORY_TOTALS: { category: Category; count: number }[] = [
  { category: "Waterlogging", count: 6820 },
  { category: "Street Lighting", count: 5240 },
  { category: "Road Damage", count: 4310 },
  { category: "Waste Management", count: 3480 },
  { category: "Drainage", count: 2190 },
  { category: "Accessibility", count: 640 },
  { category: "Public Safety", count: 980 },
  { category: "Footpath", count: 760 },
  { category: "Traffic", count: 411 },
  { category: "Public Infrastructure", count: 120 },
];

export const WARD_TOTALS: { ward: string; count: number }[] = [
  { ward: "Ward 12", count: 6140 },
  { ward: "Ward 17", count: 5980 },
  { ward: "Ward 8", count: 4460 },
  { ward: "Ward 5", count: 3820 },
  { ward: "Ward 22", count: 2210 },
  { ward: "Ward 26", count: 1470 },
  { ward: "Ward 31", count: 741 },
];

export const MONTHLY_TREND: { month: string; reports: number; resolved: number }[] = [
  { month: "Mar", reports: 980, resolved: 210 },
  { month: "Apr", reports: 1420, resolved: 380 },
  { month: "May", reports: 2180, resolved: 560 },
  { month: "Jun", reports: 3540, resolved: 780 },
  { month: "Jul", reports: 4820, resolved: 1040 },
  { month: "Aug", reports: 5360, resolved: 1290 },
  { month: "Sep", reports: 6521, resolved: 552 },
];

export const WEEKLY_TREND: { day: string; reports: number }[] = [
  { day: "Mon", reports: 186 },
  { day: "Tue", reports: 204 },
  { day: "Wed", reports: 241 },
  { day: "Thu", reports: 228 },
  { day: "Fri", reports: 310 },
  { day: "Sat", reports: 268 },
  { day: "Sun", reports: 195 },
];

export const PRIORITY_DISTRIBUTION: { band: string; count: number }[] = [
  { band: "90–100", count: 22 },
  { band: "80–89", count: 61 },
  { band: "70–79", count: 148 },
  { band: "60–69", count: 264 },
  { band: "50–59", count: 388 },
  { band: "40–49", count: 357 },
];

export const RESOLUTION_BY_MONTH: { month: string; rate: number }[] = [
  { month: "Apr", rate: 21 },
  { month: "May", rate: 26 },
  { month: "Jun", rate: 31 },
  { month: "Jul", rate: 34 },
  { month: "Aug", rate: 38 },
  { month: "Sep", rate: 42 },
];

export const VERIFICATION_TOTALS = { solved: 72, partial: 18, notSolved: 10 };

export const UNDERHEARD_TREND: { month: string; detected: number }[] = [
  { month: "Apr", detected: 2 },
  { month: "May", detected: 4 },
  { month: "Jun", detected: 6 },
  { month: "Jul", detected: 9 },
  { month: "Aug", detected: 13 },
  { month: "Sep", detected: 18 },
];

export const AVG_RESOLUTION_DAYS = { overall: 19, critical: 6, high: 11, medium: 24, low: 38 };

export const WARD_COMPARISON: { ward: string; reports: number; resolved: number; underheard: number }[] = [
  { ward: "Ward 5", reports: 3820, resolved: 1490, underheard: 5 },
  { ward: "Ward 8", reports: 4460, resolved: 1980, underheard: 7 },
  { ward: "Ward 12", reports: 6140, resolved: 2410, underheard: 9 },
  { ward: "Ward 17", reports: 5980, resolved: 2330, underheard: 8 },
  { ward: "Ward 22", reports: 2210, resolved: 690, underheard: 4 },
  { ward: "Ward 26", reports: 1470, resolved: 520, underheard: 2 },
  { ward: "Ward 31", reports: 741, resolved: 392, underheard: 1 },
];
