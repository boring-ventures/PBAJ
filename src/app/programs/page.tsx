import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import ProgramsHero from "@/components/views/programs/ProgramsHero";
import ProgramsFilter from "@/components/views/programs/ProgramsFilter";
import ProgramsGrid from "@/components/views/programs/ProgramsGrid";
import ProgramsSearch from "@/components/views/programs/ProgramsSearch";
import FeaturedPrograms from "@/components/views/programs/FeaturedPrograms";
import { ProgramsService } from "@/lib/content/content-utils";

export default async function ProgramsPage() {
  // For now, default to Spanish locale
  // In a full implementation, this would come from the URL or context
  const locale = "es";

  // Fetch programs data
  const [featuredPrograms, allPrograms] = await Promise.all([
    ProgramsService.getFeaturedPrograms(locale, 3),
    ProgramsService.getActivePrograms(locale, 50),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <ProgramsHero />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <FeaturedPrograms programs={featuredPrograms} />
            <div className="mt-16">
              <ProgramsSearch />
              <div className="mt-8">
                <ProgramsFilter categories={[]} />
                <ProgramsGrid 
                  programs={allPrograms}
                  currentPage={1}
                  totalPages={Math.ceil(allPrograms.length / 12)}
                  totalResults={allPrograms.length}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}