import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import LibraryHero from "@/components/views/library/LibraryHero";
import LibraryFilter from "@/components/views/library/LibraryFilter";
import LibraryGrid from "@/components/views/library/LibraryGrid";

export default function LibraryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <LibraryHero />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <LibraryFilter />
            <LibraryGrid />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}