"use client";

import { useLanguage } from "@/context/language-context";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import AboutHero from "@/components/views/about/AboutHero";
import MissionVision from "@/components/views/about/MissionVision";
import CoreValues from "@/components/views/about/CoreValues";
import Timeline from "@/components/views/about/Timeline";

export default function WhoWeArePage() {
  const { locale, t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <AboutHero />
        <MissionVision />
        <CoreValues />
        <Timeline />
      </main>

      <Footer />
    </div>
  );
}
