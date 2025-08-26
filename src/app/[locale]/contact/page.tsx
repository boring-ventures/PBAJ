import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import ContactHero from "@/components/views/contact/ContactHero";
import ContactForm from "@/components/views/contact/ContactForm";
import ContactInfo from "@/components/views/contact/ContactInfo";
import ContactMap from "@/components/views/contact/ContactMap";
import SocialLinks from "@/components/views/contact/SocialLinks";

interface Props {
  params: { locale: string };
}

export default async function ContactPage({ params: { locale } }: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <ContactHero />

        {/* Contact Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <ContactForm />
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                  <ContactInfo />
                  <SocialLinks />
                </div>
              </div>

              {/* Map Section */}
              <div className="mt-16">
                <ContactMap />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}