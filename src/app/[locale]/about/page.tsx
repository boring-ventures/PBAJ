import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n/config';
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import AboutHero from "@/components/views/about/AboutHero";
import MissionVision from "@/components/views/about/MissionVision";
import CoreValues from "@/components/views/about/CoreValues";
import TeamSection from "@/components/views/about/TeamSection";
import OrganizationalStructure from "@/components/views/about/OrganizationalStructure";
import Timeline from "@/components/views/about/Timeline";

interface Props {
  params: { locale: string };
}

export default async function AboutPage({ params: { locale } }: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <AboutHero />

        {/* Mission & Vision */}
        <MissionVision />

        {/* Core Values */}
        <CoreValues />

        {/* Timeline/History */}
        <Timeline />

        {/* Team Section */}
        <TeamSection />

        {/* Organizational Structure */}
        <OrganizationalStructure />
      </main>

      <Footer />
    </div>
  );
}