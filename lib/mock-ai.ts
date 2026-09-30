import type { Category, Severity, Urgency } from "./types";

// ─── Simulated AI engine ─────────────────────────────────────────────────────
// Frontend-only helpers that return the same structured objects a real
// FastAPI AI service would produce, so the UI needs no changes when the
// backend is attached.

export interface AIAnalysis {
  transcription: string;
  category: Category;
  severity: Severity;
  urgency: Urgency;
  affectedGroup: string;
  entities: string[];
  locationLabel: string;
  ward: number;
  similarReports: number;
  clusterId: string;
  clusterTitle: string;
  priorityScore: number;
  confidence: { category: number; location: number; clusterMatch: number };
  reasoning: string[];
}

export const PIPELINE_STAGES = [
  "Listening…",
  "Transcribing Bangla…",
  "Understanding issue…",
  "Detecting location…",
  "Finding similar reports…",
  "Calculating priority…",
];

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Ordered keyword rules — first match wins. In production these become
// LLM structured-output calls; rules keep the demo deterministic.
const RULES: { test: RegExp; patch: Partial<AIAnalysis> }[] = [
  {
    test: /(স্কুল|পানি|বৃষ্টি|waterlog|flood|জমে)/i,
    patch: {
      category: "Waterlogging",
      severity: "High",
      urgency: "High",
      affectedGroup: "Students / Pedestrians",
      entities: ["school", "road", "water"],
      locationLabel: "School Road, Khulshi",
      ward: 12,
      similarReports: 23,
      clusterId: "C-01",
      clusterTitle: "School Road Waterlogging",
      priorityScore: 91,
      reasoning: [
        "Water-related vocabulary detected in Bangla transcription",
        "‘স্কুল’ entity extracted → affected group mapped to students",
        "Location phrase matched to Khulshi ward boundary (Ward 12)",
        "Embedding similarity ≥ 0.82 with 23 reports in cluster C-01",
      ],
    },
  },
  {
    test: /(লাইট|light|অন্ধকার|রাতে|street)/i,
    patch: {
      category: "Street Lighting",
      severity: "Medium",
      urgency: "Medium",
      affectedGroup: "Night commuters",
      entities: ["street light", "road"],
      locationLabel: "Nasirabad Main Rd",
      ward: 17,
      similarReports: 42,
      clusterId: "C-02",
      clusterTitle: "Night-time Street Lighting",
      priorityScore: 88,
      reasoning: [
        "Lighting/outage vocabulary detected",
        "Time-of-day cue ‘রাতে’ raises urgency",
        "Matched to Ward 17 lighting cluster (C-02, 42 similar reports)",
      ],
    },
  },
  {
    test: /(wheelchair|হুইলচেয়ার|ramp|accessibility|প্রতিবন্ধ)/i,
    patch: {
      category: "Accessibility",
      severity: "Critical",
      urgency: "High",
      affectedGroup: "Wheelchair users",
      entities: ["footpath", "ramp"],
      locationLabel: "Zakir Hossain Rd",
      ward: 12,
      similarReports: 17,
      clusterId: "C-03",
      clusterTitle: "Wheelchair Accessibility Barrier",
      priorityScore: 89,
      reasoning: [
        "Accessibility vocabulary detected",
        "Vulnerability weight elevated (affected group: wheelchair users)",
        "Underheard Voices engine flagged this cluster",
      ],
    },
  },
  {
    test: /(ময়লা|waste|bin|আবর্জনা)/i,
    patch: {
      category: "Waste Management",
      severity: "Medium",
      urgency: "Medium",
      affectedGroup: "Residents",
      entities: ["bin", "road"],
      locationLabel: "Agrabad Block D",
      ward: 8,
      similarReports: 31,
      clusterId: "C-06",
      clusterTitle: "Missed Waste Collection — Block D",
      priorityScore: 72,
      reasoning: ["Waste-related vocabulary detected", "Matched to Ward 8 waste cluster (C-06)"],
    },
  },
  {
    test: /(গর্ত|পথ|রাস্তা|road|pothole|damage)/i,
    patch: {
      category: "Road Damage",
      severity: "High",
      urgency: "Medium",
      affectedGroup: "Commuters",
      entities: ["pothole", "road"],
      locationLabel: "Halishahar Block C",
      ward: 5,
      similarReports: 18,
      clusterId: "C-05",
      clusterTitle: "Halishahar Pothole Cluster",
      priorityScore: 77,
      reasoning: ["Road damage vocabulary detected", "Matched to Ward 5 road cluster (C-05)"],
    },
  },
];

const FALLBACK: Omit<AIAnalysis, "transcription"> = {
  category: "Public Infrastructure",
  severity: "Medium",
  urgency: "Medium",
  affectedGroup: "Residents",
  entities: ["public asset"],
  locationLabel: "Ward 12, Chattogram",
  ward: 12,
  similarReports: 6,
  clusterId: "C-11",
  clusterTitle: "School Zone Congestion",
  priorityScore: 64,
  confidence: { category: 82, location: 78, clusterMatch: 71 },
  reasoning: [
    "No strong category signal — classified as Public Infrastructure with lower confidence",
    "Defaulted location to pilot centroid",
  ],
};

export async function simulateTranscription(text: string): Promise<string> {
  await sleep(1400);
  return text;
}

export async function simulateIssueAnalysis(
  text: string,
  opts?: { ward?: number; locationLabel?: string },
): Promise<AIAnalysis> {
  const rule = RULES.find((r) => r.test.test(text));
  const base = rule ? rule.patch : FALLBACK;
  const analysis: AIAnalysis = {
    transcription: text,
    ...FALLBACK,
    ...base,
    confidence: {
      category: rule ? 91 + Math.floor(Math.random() * 7) : 82,
      location: rule ? 90 + Math.floor(Math.random() * 7) : 78,
      clusterMatch: rule ? 85 + Math.floor(Math.random() * 8) : 71,
    },
    reasoning: base.reasoning ?? FALLBACK.reasoning,
  };
  if (opts?.ward) {
    analysis.ward = opts.ward;
    if (opts.locationLabel) analysis.locationLabel = opts.locationLabel;
  }
  await sleep(1600);
  return analysis;
}

export function simulatePriorityCalculation(score: number): number {
  return score;
}

export function simulateClusterMatching(clusterId: string, title: string) {
  return { clusterId, title };
}

export async function simulateSituationReport(): Promise<{
  title: string;
  overview: string;
  keyIssues: string[];
  highPriorityAreas: string[];
  underheardConcerns: string[];
  evidence: string[];
  followUp: string[];
}> {
  await sleep(2600);
  return {
    title: "Ward 12 Community Situation Report",
    overview:
      "823 reports were identified concerning waterlogging, with the highest concentration around the school zone and adjacent main road. A smaller but high-severity accessibility cluster was also identified involving wheelchair access. All findings derive from anonymized citizen reports submitted between 14 Jun and 28 Sep 2026.",
    keyIssues: [
      "School Road Waterlogging — 823 reports, priority 94/100, severity High",
      "Wheelchair Accessibility Barrier — 17 reports, priority 89/100, severity Critical",
      "School Zone Congestion — 88 reports, priority 71/100 (compounds flooding impact)",
    ],
    highPriorityAreas: [
      "School Road and the school gate vicinity (peak flooding point)",
      "Zakir Hossain Road footpath segment lacking ramps",
    ],
    underheardConcerns: [
      "Wheelchair accessibility reports are few in number but uniformly Critical — affected citizens appear to have reduced reporting behaviour over time.",
    ],
    evidence: [
      "“স্কুল গেটের সামনে পানি কোমর পর্যন্ত উঠে যায়।” (12 reports share this phrasing)",
      "“বাচ্চারা স্কুলে ঢুকতে পারে না।” (student access blocked)",
      "“Wheelchair নিয়ে এই ফুটপাতে উঠতে পারি না।” (accessibility cluster evidence)",
    ],
    followUp: [
      "Commission a drainage capacity survey for School Road before next monsoon",
      "Accessibility audit of the Zakir Hossain Rd footpath with disability representatives",
      "Coordinate traffic marshals during school hours while waterlogging persists",
    ],
  };
}

export async function simulateInterventionAnalysis(): Promise<void> {
  await sleep(2400);
}
