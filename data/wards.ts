import type { WardInfo } from "@/lib/types";

/**
 * Stylized Chattogram ward geometry (SVG viewBox 0 0 1000 780).
 * Not survey data - a hand-drawn schematic of the pilot area so the map
 * feels like real GIS output while remaining frontend-only. A future
 * backend can swap these for actual PostGIS/GeoJSON ward polygons.
 */
export const WARDS: WardInfo[] = [
  {
    id: 5,
    name: "Ward 5 · Halishahar",
    path: "M40,120 L200,96 L318,140 L340,238 L282,322 L150,342 L58,272 Z",
    centroid: [188, 218],
  },
  {
    id: 8,
    name: "Ward 8 · Agrabad",
    path: "M58,368 L196,352 L312,392 L330,486 L262,560 L120,556 L48,462 Z",
    centroid: [186, 452],
  },
  {
    id: 12,
    name: "Ward 12 · Khulshi",
    path: "M370,90 L540,64 L664,120 L700,246 L640,368 L486,398 L384,320 L352,196 Z",
    centroid: [518, 228],
  },
  {
    id: 17,
    name: "Ward 17 · Nasirabad",
    path: "M368,436 L518,414 L648,462 L668,580 L576,664 L428,648 L356,548 Z",
    centroid: [506, 538],
  },
  {
    id: 22,
    name: "Ward 22 · Pahartali",
    path: "M716,84 L880,72 L952,168 L934,300 L806,352 L716,288 L690,168 Z",
    centroid: [818, 212],
  },
  {
    id: 26,
    name: "Ward 26 · Bakalia",
    path: "M704,404 L862,392 L944,478 L922,606 L788,658 L694,590 L676,486 Z",
    centroid: [812, 520],
  },
  {
    id: 31,
    name: "Ward 31 · Chandgaon",
    path: "M420,690 L610,676 L760,700 L742,762 L520,774 L418,748 Z",
    centroid: [578, 724],
  },
];

export const WARD_MAP: Record<number, WardInfo> = Object.fromEntries(
  WARDS.map((w) => [w.id, w]),
);
