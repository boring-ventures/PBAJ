import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { NewsService, ProgramsService, LibraryService } from '@/lib/content/content-utils';
import type { Locale } from '@/lib/i18n/config';
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import HomepageHero from "@/components/views/homepage/HomepageHero";
import NewsSection from "@/components/views/homepage/NewsSection";
import ProgramsSection from "@/components/views/homepage/ProgramsSection";
import StatisticsSection from "@/components/views/homepage/StatisticsSection";
import FeaturedLibrarySection from "@/components/views/homepage/FeaturedLibrarySection";
import CallToAction from "@/components/views/homepage/CallToAction";

interface Props {
  params: { locale: string };
}

export default async function LocaleHomePage({ params: { locale } }: Props) {
  // Enable static rendering
  setRequestLocale(locale);
  
  // Fetch content for the homepage
  const [featuredNews, featuredPrograms, featuredPublications] = await Promise.all([
    NewsService.getFeaturedNews(locale as Locale, 4),
    ProgramsService.getFeaturedPrograms(locale as Locale, 3),
    LibraryService.getFeaturedPublications(locale as Locale, 3)
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <HomepageHero />

        {/* Statistics Overview */}
        <StatisticsSection />

        {/* Featured News Section */}
        <NewsSection news={featuredNews} />

        {/* Featured Programs Section */}
        <ProgramsSection programs={featuredPrograms} />

        {/* Featured Library Publications */}
        <FeaturedLibrarySection publications={featuredPublications} />

        {/* Call to Action */}
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}