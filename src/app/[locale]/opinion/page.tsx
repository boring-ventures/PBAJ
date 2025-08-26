import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import type { Locale } from '@/lib/i18n/config';
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import OpinionHero from "@/components/views/opinion/OpinionHero";
import OpinionFilter from "@/components/views/opinion/OpinionFilter";
import OpinionGrid from "@/components/views/opinion/OpinionGrid";
import OpinionSearch from "@/components/views/opinion/OpinionSearch";
import FeaturedOpinions from "@/components/views/opinion/FeaturedOpinions";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  params: { locale: string };
  searchParams?: { 
    category?: string; 
    author?: string;
    search?: string;
    page?: string;
    sort?: string;
    featured?: string;
  };
}

// Mock data for opinion articles - in real implementation, this would come from a database
const mockOpinionArticles = [
  {
    id: '1',
    title: 'El Futuro de la Educación Rural en Bolivia',
    excerpt: 'Reflexiones sobre los desafíos y oportunidades para transformar la educación en las comunidades rurales bolivianas.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: {
      id: '1',
      firstName: 'María Elena',
      lastName: 'Vargas',
      title: 'Directora Ejecutiva',
      bio: 'Socióloga especializada en desarrollo rural',
      imageUrl: '/authors/maria-vargas.jpg'
    },
    category: 'EDUCATION',
    tags: ['educación', 'desarrollo rural', 'inclusión'],
    publishDate: new Date('2024-03-10'),
    readTime: 8,
    featured: true,
    imageUrl: '/blog/rural-education-future.jpg',
    likes: 45,
    comments: 12,
    shares: 23
  },
  {
    id: '2',
    title: 'Building Sustainable Communities: Lessons from Bolivia',
    excerpt: 'Key insights from our work with indigenous communities on sustainable development practices.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: {
      id: '2',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      title: 'Director de Programas',
      bio: 'Ingeniero en desarrollo sostenible',
      imageUrl: '/authors/carlos-mendoza.jpg'
    },
    category: 'SUSTAINABILITY',
    tags: ['sustainability', 'indigenous communities', 'development'],
    publishDate: new Date('2024-02-28'),
    readTime: 12,
    featured: true,
    imageUrl: '/blog/sustainable-communities.jpg',
    likes: 67,
    comments: 18,
    shares: 34
  },
  // Add more mock articles...
];

export default async function OpinionPage({ params: { locale }, searchParams }: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 9;
  const showFeatured = searchParams?.featured !== 'false';
  const sortBy = searchParams?.sort || 'publishDate';

  // Mock filtering logic - replace with real implementation
  let filteredArticles = mockOpinionArticles;

  if (searchParams?.category && searchParams.category !== 'all') {
    filteredArticles = filteredArticles.filter(article => article.category === searchParams.category);
  }

  if (searchParams?.author && searchParams.author !== 'all') {
    filteredArticles = filteredArticles.filter(article => article.author.id === searchParams.author);
  }

  if (searchParams?.search) {
    const searchTerm = searchParams.search.toLowerCase();
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Remove featured articles from regular list if showing featured section
  const featuredArticles = showFeatured ? filteredArticles.filter(a => a.featured) : [];
  if (showFeatured && featuredArticles.length > 0) {
    const featuredIds = new Set(featuredArticles.map(a => a.id));
    filteredArticles = filteredArticles.filter(a => !featuredIds.has(a.id));
  }

  // Apply sorting
  filteredArticles.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'publishDate':
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      case 'readTime':
        return a.readTime - b.readTime;
      case 'likes':
        return b.likes - a.likes;
      default:
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    }
  });

  // Pagination
  const totalArticles = filteredArticles.length;
  const totalPages = Math.ceil(totalArticles / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <OpinionHero />

        {/* Featured Articles Section */}
        {showFeatured && featuredArticles.length > 0 && (
          <Suspense fallback={
            <div className="py-16 bg-secondary/30">
              <div className="container mx-auto px-4">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-80 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          }>
            <FeaturedOpinions articles={featuredArticles} />
          </Suspense>
        )}

        {/* Opinion Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search and Filters */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                    <OpinionSearch />
                  </Suspense>
                </div>
                <div className="lg:w-80">
                  <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                    <OpinionFilter />
                  </Suspense>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-muted-foreground">
                  {locale === 'es' 
                    ? `Mostrando ${startIndex + 1}-${Math.min(startIndex + pageSize, totalArticles)} de ${totalArticles} artículos`
                    : `Showing ${startIndex + 1}-${Math.min(startIndex + pageSize, totalArticles)} of ${totalArticles} articles`
                  }
                </div>
                
                {(searchParams?.search || searchParams?.category !== 'all' || searchParams?.author !== 'all') && (
                  <div className="text-sm">
                    <a 
                      href={`/${locale}/opinion`}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      {locale === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Articles Grid */}
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
              <OpinionGrid 
                articles={paginatedArticles}
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalArticles}
              />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}