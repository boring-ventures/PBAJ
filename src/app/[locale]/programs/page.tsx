import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { ProgramsService, CategoryService } from '@/lib/content/content-utils';
import type { Locale } from '@/lib/i18n/config';
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import ProgramsHero from "@/components/views/programs/ProgramsHero";
import ProgramsFilter from "@/components/views/programs/ProgramsFilter";
import ProgramsGrid from "@/components/views/programs/ProgramsGrid";
import ProgramsSearch from "@/components/views/programs/ProgramsSearch";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  params: { locale: string };
  searchParams?: { 
    type?: string; 
    status?: string; 
    search?: string;
    page?: string;
  };
}

export default async function ProgramsPage({ params: { locale }, searchParams }: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 9;

  // Fetch programs and categories
  const [allPrograms, categories] = await Promise.all([
    ProgramsService.getActivePrograms(locale as Locale),
    CategoryService.getActiveCategories('PROGRAM', locale as Locale)
  ]);

  // Apply filters
  let filteredPrograms = allPrograms;

  if (searchParams?.type && searchParams.type !== 'all') {
    filteredPrograms = filteredPrograms.filter(p => p.type === searchParams.type);
  }

  if (searchParams?.status && searchParams.status !== 'all') {
    filteredPrograms = filteredPrograms.filter(p => p.status === searchParams.status);
  }

  if (searchParams?.search) {
    const searchTerm = searchParams.search.toLowerCase();
    filteredPrograms = filteredPrograms.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }

  // Pagination
  const totalPrograms = filteredPrograms.length;
  const totalPages = Math.ceil(totalPrograms / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPrograms = filteredPrograms.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <ProgramsHero />

        {/* Programs Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search and Filters */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                    <ProgramsSearch />
                  </Suspense>
                </div>
                <div className="lg:w-80">
                  <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                    <ProgramsFilter categories={categories} />
                  </Suspense>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-muted-foreground">
                  {locale === 'es' 
                    ? `Mostrando ${startIndex + 1}-${Math.min(startIndex + pageSize, totalPrograms)} de ${totalPrograms} programas`
                    : `Showing ${startIndex + 1}-${Math.min(startIndex + pageSize, totalPrograms)} of ${totalPrograms} programs`
                  }
                </div>
                
                {(searchParams?.search || searchParams?.type !== 'all' || searchParams?.status !== 'all') && (
                  <div className="text-sm">
                    <a 
                      href={`/${locale}/programs`}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      {locale === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Programs Grid */}
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
              <ProgramsGrid 
                programs={paginatedPrograms}
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalPrograms}
              />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}