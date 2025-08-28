import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import ProgramsHero from "@/components/views/programs/ProgramsHero";
import ProgramsFilter from "@/components/views/programs/ProgramsFilter";
import ProgramsGrid from "@/components/views/programs/ProgramsGrid";

export default function ProgramsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <ProgramsHero />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ProgramsFilter />
            <ProgramsGrid />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}