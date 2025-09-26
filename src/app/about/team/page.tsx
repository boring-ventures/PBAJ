"use client";

import { useLanguage } from "@/context/language-context";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import TeamHero from "@/components/views/about/TeamHero";
import TeamSection from "@/components/views/about/TeamSection";

export default function TeamPage() {
  const { locale, t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <TeamHero />
        <TeamSection />
      </main>

      <Footer />
    </div>
  );
}