import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import HeroComponent from "@/components/hero";
import AboutUsSection from "@/components/views/homepage/AboutUsSection";
import OurImpactSection from "@/components/views/homepage/OurImpactSection";
import WorkPillarsSection from "@/components/views/homepage/WorkPillarsSection";
import FeaturedNewsSection from "@/components/views/homepage/FeaturedNewsSection";
import JoinUsSection from "@/components/views/homepage/JoinUsSection";

// Homepage - new structure based on copy requirements
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section - kept as requested */}
        <HeroComponent />

        {/* About Us Section with Impact Numbers */}
        <AboutUsSection />

        {/* Our Impact Section with Bolivia Map */}
        <OurImpactSection />

        {/* Work Pillars Section */}
        <WorkPillarsSection />

        {/* Featured News Section */}
        <FeaturedNewsSection />

        {/* Join Us/CTA Section */}
        <JoinUsSection />
      </main>

      <Footer />
    </div>
  );
}
