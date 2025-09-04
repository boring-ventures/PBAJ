import { Suspense } from "react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import ProgramsHero from "@/components/views/programs/ProgramsHero";
import ProgramsFilter from "@/components/views/programs/ProgramsFilter";
import ProgramsGrid from "@/components/views/programs/ProgramsGrid";
import ProgramsSearch from "@/components/views/programs/ProgramsSearch";
import FeaturedPrograms from "@/components/views/programs/FeaturedPrograms";
import AllPrograms from "@/components/views/programs/AllPrograms";
import {
  ProgramsService,
  type LocalizedProgram,
} from "@/lib/content/content-utils";

export default async function ProgramsPage() {
  // For now, default to Spanish locale
  // In a full implementation, this would come from the URL or context
  const locale = "es";

  let featuredPrograms: LocalizedProgram[] = [];
  let allPrograms: LocalizedProgram[] = [];

  try {
    // Fetch programs data with error handling
    const results = await Promise.allSettled([
      ProgramsService.getFeaturedPrograms(locale, 3),
      ProgramsService.getActivePrograms(locale, 50),
    ]);

    // Extract results with fallback to empty arrays
    if (results[0].status === "fulfilled") {
      featuredPrograms = results[0].value;
    }
    if (results[1].status === "fulfilled") {
      allPrograms = results[1].value;
    }
  } catch (error) {
    console.error("Error loading programs:", error);
    // Continue with empty arrays
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <ProgramsHero />

        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Featured Programs Section */}
            <FeaturedPrograms programs={featuredPrograms} />

            {/* All Programs Section */}
            <div className="mt-16">
              {/* Title moved above search */}
              <div className="flex items-center mb-8">
                <h2
                  className="text-6xl font-bold"
                  style={{ color: "#000000" }}
                >
                  Todos los Programas
                </h2>
              </div>

              {/* Search and Filter Section */}
              <div className="mb-12">
                <Suspense fallback={<div>Loading search...</div>}>
                  <ProgramsSearch />
                </Suspense>
                <div className="mt-6">
                  <Suspense fallback={<div>Loading filters...</div>}>
                    <ProgramsFilter categories={[]} />
                  </Suspense>
                </div>
              </div>

              <AllPrograms programs={allPrograms} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
