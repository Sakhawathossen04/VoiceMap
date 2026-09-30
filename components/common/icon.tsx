"use client";

import * as Lucide from "lucide-react";
import type { LucideProps } from "lucide-react";

// Maps a metadata icon name to the Lucide component. Kept narrow so the
// bundle only includes icons actually referenced.
const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  Droplets: Lucide.Droplets,
  Construction: Lucide.Construction,
  Lightbulb: Lucide.Lightbulb,
  Trash2: Lucide.Trash2,
  Waves: Lucide.Waves,
  Accessibility: Lucide.Accessibility,
  ShieldAlert: Lucide.ShieldAlert,
  Footprints: Lucide.Footprints,
  CarFront: Lucide.CarFront,
  Landmark: Lucide.Landmark,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? Lucide.CircleDashed;
  return <Cmp className={className} />;
}
