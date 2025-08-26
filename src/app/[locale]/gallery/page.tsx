import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import type { Locale } from '@/lib/i18n/config';
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import GalleryHero from "@/components/views/gallery/GalleryHero";
import GalleryFilter from "@/components/views/gallery/GalleryFilter";
import GalleryGrid from "@/components/views/gallery/GalleryGrid";
import GallerySearch from "@/components/views/gallery/GallerySearch";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  params: { locale: string };
  searchParams?: { 
    type?: string; 
    category?: string;
    search?: string;
    page?: string;
    year?: string;
  };
}

// Mock data for media items - in real implementation, this would come from a database
const mockMediaItems = [
  {
    id: '1',
    title: 'Inauguración Centro Comunitario La Paz',
    description: 'Evento de inauguración del nuevo centro comunitario en La Paz con la participación de líderes locales.',
    type: 'IMAGE',
    url: '/gallery/community-center-opening.jpg',
    thumbnailUrl: '/gallery/thumbnails/community-center-opening.jpg',
    category: 'EVENTS',
    tags: ['inauguración', 'centro comunitario', 'la paz'],
    createdAt: new Date('2024-03-15'),
    author: 'María González',
    featured: true,
  },
  {
    id: '2',
    title: 'Programa de Educación Rural',
    description: 'Documentación del programa de educación en comunidades rurales de Cochabamba.',
    type: 'VIDEO',
    url: '/gallery/rural-education-program.mp4',
    thumbnailUrl: '/gallery/thumbnails/rural-education.jpg',
    category: 'PROGRAMS',
    tags: ['educación', 'rural', 'cochabamba'],
    createdAt: new Date('2024-02-20'),
    author: 'Carlos Mendoza',
    duration: 180, // 3 minutes
  },
  // Add more mock items...
];

export default async function GalleryPage({ params: { locale }, searchParams }: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 12;

  // Mock filtering logic - replace with real implementation
  let filteredItems = mockMediaItems;

  if (searchParams?.type && searchParams.type !== 'all') {
    filteredItems = filteredItems.filter(item => item.type === searchParams.type);
  }

  if (searchParams?.category && searchParams.category !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === searchParams.category);
  }

  if (searchParams?.year && searchParams.year !== 'all') {
    filteredItems = filteredItems.filter(item => 
      new Date(item.createdAt).getFullYear().toString() === searchParams.year
    );
  }

  if (searchParams?.search) {
    const searchTerm = searchParams.search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <GalleryHero />

        {/* Gallery Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search and Filters */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                    <GallerySearch />
                  </Suspense>
                </div>
                <div className="lg:w-80">
                  <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                    <GalleryFilter />
                  </Suspense>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-muted-foreground">
                  {locale === 'es' 
                    ? `Mostrando ${startIndex + 1}-${Math.min(startIndex + pageSize, totalItems)} de ${totalItems} elementos`
                    : `Showing ${startIndex + 1}-${Math.min(startIndex + pageSize, totalItems)} of ${totalItems} items`
                  }
                </div>
                
                {(searchParams?.search || searchParams?.type !== 'all' || searchParams?.category !== 'all' || searchParams?.year !== 'all') && (
                  <div className="text-sm">
                    <a 
                      href={`/${locale}/gallery`}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      {locale === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Grid */}
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
              <GalleryGrid 
                items={paginatedItems}
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalItems}
              />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}