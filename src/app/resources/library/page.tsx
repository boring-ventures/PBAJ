import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import LibraryHero from "@/components/views/library/LibraryHero";
import LibraryFilter from "@/components/views/library/LibraryFilter";
import LibraryGrid from "@/components/views/library/LibraryGrid";
import LibrarySearch from "@/components/views/library/LibrarySearch";
import FeaturedPublications from "@/components/views/library/FeaturedPublications";
import { LibraryService } from "@/lib/content/content-utils";

export default async function LibraryPage() {
  // For now, default to Spanish locale
  // In a full implementation, this would come from the URL or context
  const locale = "es";

  // Fetch library data
  const [featuredPublications, allPublications] = await Promise.all([
    LibraryService.getFeaturedPublications(locale, 3),
    LibraryService.getPublishedPublications(locale, 50),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <LibraryHero />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <FeaturedPublications publications={featuredPublications} />
            <div className="mt-16">
              <LibrarySearch />
              <div className="mt-8">
                <LibraryFilter categories={[]} />
                <LibraryGrid 
                  publications={allPublications}
                  currentPage={1}
                  totalPages={Math.ceil(allPublications.length / 12)}
                  totalResults={allPublications.length}
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