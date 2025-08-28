'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DownloadIcon, EyeOpenIcon, FileTextIcon, CalendarIcon, PersonIcon, ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import type { LocalizedPublication } from '@/lib/content/content-utils';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface LibraryGridProps {
  publications: LocalizedPublication[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

export default function LibraryGrid({ publications, currentPage, totalPages, totalResults }: LibraryGridProps) {
  const params = useParams();
  const locale = params.locale as string;

  const formatDate = (date: Date) => {
    return format(date, 'MMM yyyy', { 
      locale: locale === 'es' ? es : enUS 
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      RESEARCH: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      REPORT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      GUIDE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      PUBLICATION: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      POLICY_BRIEF: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      CASE_STUDY: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      MANUAL: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      TOOLKIT: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const handleDownload = async (publication: LocalizedPublication) => {
    // Increment download count (would call API in real implementation)
    if (publication.fileUrl) {
      window.open(publication.fileUrl, '_blank');
    }
  };

  const handlePreview = (publication: LocalizedPublication) => {
    // Navigate to publication detail page for preview
    window.open(`/${locale}/library/${publication.id}`, '_blank');
  };

  if (!publications || publications.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-muted-foreground text-lg mb-4">
          {locale === 'es' 
            ? 'No se encontraron publicaciones que coincidan con tu búsqueda'
            : 'No publications found matching your search'
          }
        </div>
        <div className="text-sm text-muted-foreground mb-6">
          {locale === 'es' 
            ? 'Intenta ajustar los filtros o términos de búsqueda'
            : 'Try adjusting your filters or search terms'
          }
        </div>
        <Button asChild variant="outline">
          <Link href={`/${locale}/library`}>
            {locale === 'es' ? 'Ver todas las publicaciones' : 'View all publications'}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Publications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(publications || []).map((publication) => (
          <Card key={publication.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
            <CardHeader className="p-0">
              {publication.coverImageUrl || publication.thumbnailUrl ? (
                <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                  <img
                    src={publication.coverImageUrl || publication.thumbnailUrl}
                    alt={publication.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={getTypeColor(publication.type)}>
                      {publication.type}
                    </Badge>
                  </div>

                  {/* Featured Badge */}
                  {publication.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-yellow-950">
                        {locale === 'es' ? 'Destacado' : 'Featured'}
                      </Badge>
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handlePreview(publication)}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <EyeOpenIcon className="h-4 w-4 mr-1" />
                      {locale === 'es' ? 'Ver' : 'View'}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(publication)}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <DownloadIcon className="h-4 w-4 mr-1" />
                      {locale === 'es' ? 'Descargar' : 'Download'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
                  <FileTextIcon className="h-16 w-16 text-primary mb-4" />
                  <div className="text-muted-foreground text-sm text-center px-4 mb-2">
                    {publication.fileName || publication.title}
                  </div>
                  {publication.fileSize && (
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(publication.fileSize)}
                    </div>
                  )}
                </div>
              )}
            </CardHeader>
            
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/${locale}/library/${publication.id}`}>
                    {publication.title}
                  </Link>
                </h3>

                {publication.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {publication.description}
                  </p>
                )}

                {/* Publication Metadata */}
                <div className="space-y-2 mb-4">
                  {publication.publishDate && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3 mr-2" />
                      <span>{formatDate(new Date(publication.publishDate))}</span>
                    </div>
                  )}

                  {publication.author && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <PersonIcon className="h-3 w-3 mr-2" />
                      <span>{publication.author.firstName} {publication.author.lastName}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {publication.fileSize && (
                      <span>📄 {formatFileSize(publication.fileSize)}</span>
                    )}
                    {publication.mimeType && (
                      <span className="uppercase">{publication.mimeType.split('/')[1]}</span>
                    )}
                  </div>

                  {/* ISBN/DOI */}
                  {(publication.isbn || publication.doi) && (
                    <div className="text-xs text-muted-foreground">
                      {publication.isbn && <span>ISBN: {publication.isbn}</span>}
                      {publication.doi && <span>DOI: {publication.doi}</span>}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {publication.tags && publication.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {publication.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(publication.tags || []).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(publication.tags || []).length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <EyeOpenIcon className="h-3 w-3" />
                    <span>{publication.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DownloadIcon className="h-3 w-3" />
                    <span>{publication.downloadCount}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/${locale}/library/${publication.id}`}>
                      {locale === 'es' ? 'Ver detalles' : 'View details'}
                    </Link>
                  </Button>
                </div>
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
              <Link href={`/${locale}/library?page=${currentPage - 1}`}>
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
                  <Link href={`/${locale}/library?page=${pageNumber}`}>
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
              <Link href={`/${locale}/library?page=${currentPage + 1}`}>
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

      {/* Results Summary */}
      <div className="text-center text-sm text-muted-foreground">
        {locale === 'es' 
          ? `Página ${currentPage} de ${totalPages} • ${totalResults} publicaciones en total`
          : `Page ${currentPage} of ${totalPages} • ${totalResults} publications total`
        }
      </div>
    </div>
  );
}