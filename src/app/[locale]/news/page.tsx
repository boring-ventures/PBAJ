import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { NewsService, CategoryService } from '@/lib/content/content-utils';
import type { Locale } from '@/lib/i18n/config';
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import NewsHero from "@/components/views/news/NewsHero";
import NewsFilter from "@/components/views/news/NewsFilter";
import NewsGrid from "@/components/views/news/NewsGrid";
import NewsSearch from "@/components/views/news/NewsSearch";
import FeaturedNews from "@/components/views/news/FeaturedNews";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  params: { locale: string };
  searchParams?: { 
    category?: string; 
    search?: string;
    page?: string;
    featured?: string;
  };
}

export default async function NewsPage({ params: { locale }, searchParams }: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 12;
  const showFeatured = searchParams?.featured !== 'false';

  // Fetch news and categories
  const [allNews, categories, featuredNews] = await Promise.all([
    NewsService.getPublishedNews(locale as Locale),
    CategoryService.getActiveCategories('NEWS', locale as Locale),
    showFeatured ? NewsService.getFeaturedNews(locale as Locale, 3) : Promise.resolve([])
  ]);

  // Apply filters
  let filteredNews = allNews;

  if (searchParams?.category && searchParams.category !== 'all') {
    filteredNews = filteredNews.filter(n => n.category === searchParams.category);
  }

  if (searchParams?.search) {
    const searchTerm = searchParams.search.toLowerCase();
    filteredNews = filteredNews.filter(n => 
      n.title.toLowerCase().includes(searchTerm) ||
      n.content.toLowerCase().includes(searchTerm) ||
      (n.excerpt && n.excerpt.toLowerCase().includes(searchTerm))
    );
  }

  // Remove featured news from regular news if showing featured section
  if (showFeatured && featuredNews.length > 0) {
    const featuredIds = new Set(featuredNews.map(n => n.id));
    filteredNews = filteredNews.filter(n => !featuredIds.has(n.id));
  }

  // Pagination
  const totalNews = filteredNews.length;
  const totalPages = Math.ceil(totalNews / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <NewsHero />

        {/* Featured News Section */}
        {showFeatured && featuredNews.length > 0 && (
          <Suspense fallback={
            <div className="py-16 bg-secondary/30">
              <div className="container mx-auto px-4">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          }>
            <FeaturedNews news={featuredNews} />
          </Suspense>
        )}

        {/* News Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search and Filters */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                    <NewsSearch />
                  </Suspense>
                </div>
                <div className="lg:w-80">
                  <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                    <NewsFilter categories={categories} />
                  </Suspense>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-muted-foreground">
                  {locale === 'es' 
                    ? `Mostrando ${startIndex + 1}-${Math.min(startIndex + pageSize, totalNews)} de ${totalNews} noticias`
                    : `Showing ${startIndex + 1}-${Math.min(startIndex + pageSize, totalNews)} of ${totalNews} news articles`
                  }
                </div>
                
                {(searchParams?.search || searchParams?.category !== 'all') && (
                  <div className="text-sm">
                    <a 
                      href={`/${locale}/news`}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      {locale === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* News Grid */}
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            }>
              <NewsGrid 
                news={paginatedNews}
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalNews}
              />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}