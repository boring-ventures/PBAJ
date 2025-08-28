import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import HomepageHero from "@/components/views/homepage/HomepageHero";
import NewsSection from "@/components/views/homepage/NewsSection";
import ProgramsSection from "@/components/views/homepage/ProgramsSection";
import StatisticsSection from "@/components/views/homepage/StatisticsSection";
import FeaturedLibrarySection from "@/components/views/homepage/FeaturedLibrarySection";
import CallToAction from "@/components/views/homepage/CallToAction";

// Homepage - fetches content dynamically on client side
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <HomepageHero />

        {/* Statistics Overview */}
        <StatisticsSection />

        {/* Featured News Section */}
        <NewsSection />

        {/* Featured Programs Section */}
        <ProgramsSection />

        {/* Featured Library Publications */}
        <FeaturedLibrarySection />

        {/* Call to Action */}
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
