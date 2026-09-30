import type { Category } from "@/lib/types";

export const CATEGORIES: Category[] = [
  "Waterlogging",
  "Road Damage",
  "Street Lighting",
  "Waste Management",
  "Drainage",
  "Accessibility",
  "Public Safety",
  "Footpath",
  "Traffic",
  "Public Infrastructure",
];

export const WARD_LIST = ["Ward 5", "Ward 8", "Ward 12", "Ward 17", "Ward 22", "Ward 26", "Ward 31"];

export const LOCATION_AREAS: { label: string; ward: number; lat: number; lng: number }[] = [
  { label: "School Road, Khulshi", ward: 12, lat: 22.3602, lng: 91.8224 },
  { label: "Zakir Hossain Rd, Khulshi", ward: 12, lat: 22.3646, lng: 91.8155 },
  { label: "Nasirabad Main Rd", ward: 17, lat: 22.3504, lng: 91.8351 },
  { label: "Agrabad C/A", ward: 8, lat: 22.3286, lng: 91.8137 },
  { label: "Agrabad Block D", ward: 8, lat: 22.3272, lng: 91.8156 },
  { label: "Halishahar Block C", ward: 5, lat: 22.3724, lng: 91.8240 },
  { label: "Halishahar Link Rd", ward: 5, lat: 22.3737, lng: 91.8231 },
  { label: "Pahartali Rail Gate", ward: 22, lat: 22.3831, lng: 91.8392 },
  { label: "Bakalia Crossing", ward: 26, lat: 22.3420, lng: 91.8440 },
  { label: "Chandgaon", ward: 31, lat: 22.4118, lng: 91.8317 },
];
