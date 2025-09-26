"use client";

import { Suspense } from "react";
import { useLanguage } from "@/context/language-context";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import ProgramsHero from "@/components/views/programs/ProgramsHero";
import ProgramsFilter from "@/components/views/programs/ProgramsFilter";
import ProgramsGrid from "@/components/views/programs/ProgramsGrid";
import ProgramsSearch from "@/components/views/programs/ProgramsSearch";
import FeaturedPrograms from "@/components/views/programs/FeaturedPrograms";
import AllPrograms from "@/components/views/programs/AllPrograms";
import ProgramsContent from "@/components/views/programs/ProgramsContent";

export default function ProgramsPage() {
  const { locale, t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <ProgramsHero />

        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Content wrapper that handles data fetching based on locale */}
            <ProgramsContent locale={locale} t={t} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
