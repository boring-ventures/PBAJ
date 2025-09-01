import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import ContactForm from "@/components/views/contact/ContactForm";
import ContactInfo from "@/components/views/contact/ContactInfo";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Simple Hero Section */}
        <section className="bg-white py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Contáctanos
              </h1>
              <p className="text-lg text-gray-600">
                Estamos aquí para ayudarte. Ponte en contacto con nosotros para cualquier consulta.
              </p>
            </div>
          </div>
        </section>
        
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