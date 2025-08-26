import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { LibraryService, CategoryService } from '@/lib/content/content-utils';
import type { Locale } from '@/lib/i18n/config';
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import LibraryHero from "@/components/views/library/LibraryHero";
import LibraryFilter from "@/components/views/library/LibraryFilter";
import LibraryGrid from "@/components/views/library/LibraryGrid";
import LibrarySearch from "@/components/views/library/LibrarySearch";
import FeaturedPublications from "@/components/views/library/FeaturedPublications";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  params: { locale: string };
  searchParams?: { 
    type?: string; 
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
    featured?: string;
  };
}

export default async function LibraryPage({ params: { locale }, searchParams }: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 12;
  const showFeatured = searchParams?.featured !== 'false';
  const sortBy = searchParams?.sort || 'publishDate';

  // Fetch publications and categories
  const [allPublications, categories, featuredPublications] = await Promise.all([
    LibraryService.getPublishedPublications(locale as Locale),
    CategoryService.getActiveCategories('PUBLICATION', locale as Locale),
    showFeatured ? LibraryService.getFeaturedPublications(locale as Locale, 4) : Promise.resolve([])
  ]);

  // Apply filters
  let filteredPublications = allPublications;

  if (searchParams?.type && searchParams.type !== 'all') {
    filteredPublications = filteredPublications.filter(p => p.type === searchParams.type);
  }

  if (searchParams?.category && searchParams.category !== 'all') {
    // Filter by category if available
    filteredPublications = filteredPublications.filter(p => 
      p.tags.some(tag => tag.toLowerCase().includes(searchParams.category!.toLowerCase()))
    );
  }

  if (searchParams?.search) {
    const searchTerm = searchParams.search.toLowerCase();
    filteredPublications = filteredPublications.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      (p.abstract && p.abstract.toLowerCase().includes(searchTerm)) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      p.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }

  // Remove featured publications from regular list if showing featured section
  if (showFeatured && featuredPublications.length > 0) {
    const featuredIds = new Set(featuredPublications.map(p => p.id));
    filteredPublications = filteredPublications.filter(p => !featuredIds.has(p.id));
  }

  // Apply sorting
  filteredPublications.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'publishDate':
        return new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime();
      case 'downloads':
        return b.downloadCount - a.downloadCount;
      case 'views':
        return b.viewCount - a.viewCount;
      default:
        return new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime();
    }
  });

  // Pagination
  const totalPublications = filteredPublications.length;
  const totalPages = Math.ceil(totalPublications / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPublications = filteredPublications.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <LibraryHero />

        {/* Featured Publications Section */}
        {showFeatured && featuredPublications.length > 0 && (
          <Suspense fallback={
            <div className="py-16 bg-secondary/30">
              <div className="container mx-auto px-4">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-80 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          }>
            <FeaturedPublications publications={featuredPublications} />
          </Suspense>
        )}

        {/* Library Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search and Filters */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                    <LibrarySearch />
                  </Suspense>
                </div>
                <div className="lg:w-80">
                  <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                    <LibraryFilter categories={categories} />
                  </Suspense>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-muted-foreground">
                  {locale === 'es' 
                    ? `Mostrando ${startIndex + 1}-${Math.min(startIndex + pageSize, totalPublications)} de ${totalPublications} publicaciones`
                    : `Showing ${startIndex + 1}-${Math.min(startIndex + pageSize, totalPublications)} of ${totalPublications} publications`
                  }
                </div>
                
                {(searchParams?.search || searchParams?.type !== 'all' || searchParams?.category !== 'all') && (
                  <div className="text-sm">
                    <a 
                      href={`/${locale}/library`}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      {locale === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Publications Grid */}
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            }>
              <LibraryGrid 
                publications={paginatedPublications}
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalPublications}
              />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}