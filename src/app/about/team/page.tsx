import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import TeamSection from "@/components/views/about/TeamSection";

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nuestro Equipo
              </h1>
              <p className="text-xl text-gray-600">
                Conoce a las personas comprometidas que hacen posible nuestra misión
              </p>
            </div>
          </div>
        </section>
        
        <TeamSection />
      </main>

      <Footer />
    </div>
  );
}