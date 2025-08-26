import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import DonateHero from "@/components/views/donate/DonateHero";
import DonationMethods from "@/components/views/donate/DonationMethods";
import DonationImpact from "@/components/views/donate/DonationImpact";
import DonationTestimonials from "@/components/views/donate/DonationTestimonials";
import DonationFAQ from "@/components/views/donate/DonationFAQ";

interface Props {
  params: { locale: string };
}

export default async function DonatePage({ params: { locale } }: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <DonateHero />

        {/* Donation Methods Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <DonationMethods />
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <DonationImpact />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <DonationTestimonials />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <DonationFAQ />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}