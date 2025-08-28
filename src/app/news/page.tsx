import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import NewsHero from "@/components/views/news/NewsHero";
import NewsFilter from "@/components/views/news/NewsFilter";
import NewsGrid from "@/components/views/news/NewsGrid";
import FeaturedNews from "@/components/views/news/FeaturedNews";

export default function NewsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <NewsHero />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <FeaturedNews />
            <div className="mt-16">
              <NewsFilter />
              <NewsGrid />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}