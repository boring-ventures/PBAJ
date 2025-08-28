import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import DonateHero from "@/components/views/donate/DonateHero";
import DonationMethods from "@/components/views/donate/DonationMethods";
import DonationImpact from "@/components/views/donate/DonationImpact";
import DonationTestimonials from "@/components/views/donate/DonationTestimonials";
import DonationFAQ from "@/components/views/donate/DonationFAQ";

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <DonateHero />
        <DonationImpact />
        <DonationMethods />
        <DonationTestimonials />
        <DonationFAQ />
      </main>

      <Footer />
    </div>
  );
}