"use client";

import { useSyncExternalStore } from "react";
import type { CitizenReport } from "./types";

// ─── Demo session store ─────────────────────────────────────────────────────
// Persists reports submitted during a demo into localStorage so they appear
// in recent reports, issue details, and the authority dashboard. Real backend
// replaces this with API calls; component code stays identical.

const KEY = "voicemap_demo_reports_v1";
const MAX = 30;

let reports: CitizenReport[] | null = null;
const listeners = new Set<() => void>();

function load(): CitizenReport[] {
  if (reports) return reports;
  if (typeof window === "undefined") return [];
  try {
    reports = JSON.parse(localStorage.getItem(KEY) ?? "[]") as CitizenReport[];
  } catch {
    reports = [];
  }
  return reports!;
}

function save() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(reports ?? []));
    } catch {
      /* storage unavailable — demo continues in-memory */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function addDemoReport(r: CitizenReport) {
  load().unshift(r);
  if (reports && reports.length > MAX) reports.length = MAX;
  save();
}

export function getDemoReports(): CitizenReport[] {
  return load();
}

export function useDemoReports(): CitizenReport[] {
  return useSyncExternalStore(
    subscribe,
    () => load(),
    () => []
  );
}

export function nextReportId(): string {
  const n = 10482 + getDemoReports().length + 1;
  return `VMB-2026-${n}`;
}

export function clearDemoReports() {
  reports = [];
  save();
}
