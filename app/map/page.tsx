import type { Metadata } from "next";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { SectionHeading } from "@/components/common/primitives";
import ChattogramMap from "@/components/maps/chattogram-map";
import { PrototypeNote } from "@/components/common/primitives";

export const metadata: Metadata = { title: "Community Map — VoiceMap BD" };

export default function MapPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SectionHeading
          eyebrow="Community map"
          title="Chattogram pilot — issue hotspots"
          desc="Colored markers show clustered citizen reports. Red = critical, orange = high, amber = medium, green = resolved. Select any marker for full issue intelligence."
        />
        <div className="mt-4">
          <PrototypeNote />
        </div>
        <div className="mt-6">
          <ChattogramMap />
        </div>
      </main>
      <Footer />
    </div>
  );
}
