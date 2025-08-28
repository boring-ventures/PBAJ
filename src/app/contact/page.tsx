import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import ContactHero from "@/components/views/contact/ContactHero";
import ContactForm from "@/components/views/contact/ContactForm";
import ContactInfo from "@/components/views/contact/ContactInfo";
import ContactMap from "@/components/views/contact/ContactMap";
import SocialLinks from "@/components/views/contact/SocialLinks";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <ContactHero />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <ContactForm />
              </div>
              <div>
                <ContactInfo />
                <div className="mt-8">
                  <SocialLinks />
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <ContactMap />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}