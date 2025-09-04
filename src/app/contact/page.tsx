import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import ContactHero from "@/components/views/contact/ContactHero";
import ContactForm from "@/components/views/contact/ContactForm";
import ContactInfo from "@/components/views/contact/ContactInfo";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow">
        <ContactHero />
        
        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Contact Form - Takes 3/5 of space */}
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
              
              {/* Contact Info - Takes 2/5 of space */}
              <div className="lg:col-span-2">
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}