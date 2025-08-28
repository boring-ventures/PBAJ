import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import GalleryHero from "@/components/views/gallery/GalleryHero";
import GalleryFilter from "@/components/views/gallery/GalleryFilter";
import GalleryGrid from "@/components/views/gallery/GalleryGrid";

export default function MultimediaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <GalleryHero />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <GalleryFilter />
            <GalleryGrid />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}