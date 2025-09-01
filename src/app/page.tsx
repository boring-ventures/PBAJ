import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import HeroComponent from "@/components/hero";
import ProgramsSection from "@/components/views/homepage/ProgramsSection";
import StatisticsSection from "@/components/views/homepage/StatisticsSection";
import CallToAction from "@/components/views/homepage/CallToAction";

// Homepage - fetches content dynamically on client side
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroComponent />

        {/* Statistics Overview */}
        <StatisticsSection />

        {/* Featured Programs Section */}
        <ProgramsSection />

        {/* Call to Action */}
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
