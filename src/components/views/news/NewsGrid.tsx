'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PersonIcon, ArrowLeftIcon, ArrowRightIcon, ClockIcon } from '@radix-ui/react-icons';
import type { LocalizedNews } from '@/lib/content/content-utils';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface NewsGridProps {
  news: LocalizedNews[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

export default function NewsGrid({ news, currentPage, totalPages, totalResults }: NewsGridProps) {
  const params = useParams();
  const locale = params.locale as string;

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy', { 
      locale: locale === 'es' ? es : enUS 
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return locale === 'es' ? 'Hoy' : 'Today';
    } else if (days === 1) {
      return locale === 'es' ? 'Ayer' : 'Yesterday';
    } else if (days < 7) {
      return locale === 'es' ? `Hace ${days} días` : `${days} days ago`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      return locale === 'es' 
        ? `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
        : `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return formatDate(date);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      PROGRAMS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      CAMPAIGNS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      ACHIEVEMENTS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      EVENTS: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      PARTNERSHIPS: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      RESEARCH: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      COMMUNITY: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      POLICY: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (news.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-muted-foreground text-lg mb-4">
          {locale === 'es' 
            ? 'No se encontraron noticias que coincidan con tu búsqueda'
            : 'No news found matching your search'
          }
        </div>
        <div className="text-sm text-muted-foreground mb-6">
          {locale === 'es' 
            ? 'Intenta ajustar los filtros o términos de búsqueda'
            : 'Try adjusting your filters or search terms'
          }
        </div>
        <Button asChild variant="outline">
          <Link href={`/${locale}/news`}>
            {locale === 'es' ? 'Ver todas las noticias' : 'View all news'}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((article) => (
          <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
            <CardHeader className="p-0">
              {article.featuredImageUrl ? (
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                    src={article.featuredImageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(article.category)}>
                      {article.category}
                    </Badge>
                  </div>

                  {/* Time indicator for recent articles */}
                  {article.publishDate && new Date(article.publishDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-500 text-white">
                        {locale === 'es' ? 'Nuevo' : 'New'}
                      </Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
                  <div className="text-4xl mb-4">📰</div>
                  <div className="text-muted-foreground text-sm text-center px-4">
                    {locale === 'es' ? 'Noticia' : 'News Article'}
                  </div>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {article.publishDate && formatTimeAgo(new Date(article.publishDate))}
                  </div>
                  {article.featured && (
                    <Badge variant="outline" className="text-xs">
                      {locale === 'es' ? 'Destacado' : 'Featured'}
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/${locale}/news/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>

                {article.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                )}

                {/* Reading time estimate */}
                <div className="text-xs text-muted-foreground mb-4">
                  {(() => {
                    const wordCount = article.content.split(' ').length;
                    const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
                    return locale === 'es' 
                      ? `${readingTime} min de lectura`
                      : `${readingTime} min read`;
                  })()}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div className="flex items-center text-xs text-muted-foreground">
                  <PersonIcon className="h-3 w-3 mr-1" />
                  <span>{article.author.firstName} {article.author.lastName}</span>
                </div>
                <Link 
                  href={`/${locale}/news/${article.id}`}
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  {locale === 'es' ? 'Leer más' : 'Read more'}
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link href={`/${locale}/news?page=${currentPage - 1}`}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                {locale === 'es' ? 'Anterior' : 'Previous'}
              </Link>
            ) : (
              <span>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                {locale === 'es' ? 'Anterior' : 'Previous'}
              </span>
            )}
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={i}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={`/${locale}/news?page=${pageNumber}`}>
                    {pageNumber}
                  </Link>
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={`/${locale}/news?page=${currentPage + 1}`}>
                {locale === 'es' ? 'Siguiente' : 'Next'}
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            ) : (
              <span>
                {locale === 'es' ? 'Siguiente' : 'Next'}
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Results summary */}
      <div className="text-center text-sm text-muted-foreground">
        {locale === 'es' 
          ? `Página ${currentPage} de ${totalPages} • ${totalResults} noticias en total`
          : `Page ${currentPage} of ${totalPages} • ${totalResults} news articles total`
        }
      </div>
    </div>
  );
}