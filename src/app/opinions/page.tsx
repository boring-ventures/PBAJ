"use client";

import { Suspense } from "react";
import { useLanguage } from "@/context/language-context";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import OpinionsHero from "@/components/views/opinions/OpinionsHero";
import OpinionsContent from "@/components/views/opinions/OpinionsContent";

export default function OpinionsPage() {
  const { locale, t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <OpinionsHero />

        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Content wrapper that handles data fetching based on locale */}
            <OpinionsContent locale={locale} t={t} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
