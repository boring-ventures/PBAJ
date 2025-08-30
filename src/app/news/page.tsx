import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import NewsHero from "@/components/views/news/NewsHero";
import NewsFilter from "@/components/views/news/NewsFilter";
import NewsGrid from "@/components/views/news/NewsGrid";
import FeaturedNews from "@/components/views/news/FeaturedNews";
import NewsSearch from "@/components/views/news/NewsSearch";
import { NewsService } from "@/lib/content/content-utils";

export default async function NewsPage() {
  // For now, default to Spanish locale
  // In a full implementation, this would come from the URL or context
  const locale = "es";

  // Fetch news data
  const [featuredNews, allNews] = await Promise.all([
    NewsService.getFeaturedNews(locale, 3),
    NewsService.getPublishedNews(locale, 50),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <NewsHero />

        <section className="py-16">
          <div className="container mx-auto px-4">
            <FeaturedNews news={featuredNews} />
            <div className="mt-16">
              <NewsSearch />
              <div className="mt-8">
                <NewsFilter categories={[]} />
                <NewsGrid
                  news={allNews}
                  currentPage={1}
                  totalPages={Math.ceil(allNews.length / 12)}
                  totalResults={allNews.length}
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
