'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DownloadIcon, ArrowRightIcon, FileTextIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import type { LocalizedPublication } from '@/lib/content/content-utils';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface FeaturedLibrarySectionProps {
  publications: LocalizedPublication[];
}

export default function FeaturedLibrarySection({ publications }: FeaturedLibrarySectionProps) {
  const t = useTranslations('library');
  const params = useParams();
  const locale = params.locale as string;

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy', { 
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

  const getTypeIcon = (type: string) => {
    const typeMap: Record<string, { icon: typeof FileTextIcon, color: string }> = {
      REPORT: { icon: FileTextIcon, color: 'text-blue-600' },
      RESEARCH: { icon: FileTextIcon, color: 'text-green-600' },
      PUBLICATION: { icon: FileTextIcon, color: 'text-purple-600' },
      GUIDE: { icon: FileTextIcon, color: 'text-orange-600' }
    };
    
    return typeMap[type] || { icon: FileTextIcon, color: 'text-gray-600' };
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {locale === 'es' 
                ? 'Accede a nuestras últimas publicaciones, investigaciones e informes'
                : 'Access our latest publications, research and reports'
              }
            </p>
          </div>
          
          <Button asChild variant="outline" className="group">
            <Link href={`/${locale}/library`}>
              {locale === 'es' ? 'Ver biblioteca' : 'View library'}
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.slice(0, 3).map((publication) => {
            const typeInfo = getTypeIcon(publication.type);
            const IconComponent = typeInfo.icon;

            return (
              <Card key={publication.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardHeader className="p-0">
                  {publication.coverImageUrl ? (
                    <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                      <img
                        src={publication.coverImageUrl}
                        alt={publication.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
                      <IconComponent className={`h-16 w-16 ${typeInfo.color} mb-4`} />
                      <div className="text-muted-foreground text-sm text-center px-4">
                        {publication.fileName || publication.title}
                      </div>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {publication.type}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <EyeOpenIcon className="h-3 w-3" />
                        <span>{publication.viewCount}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/${locale}/library/${publication.id}`}>
                        {publication.title}
                      </Link>
                    </h3>

                    {publication.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {publication.description}
                      </p>
                    )}
                  </div>

                  {/* Publication Details */}
                  <div className="space-y-2 mb-4">
                    {publication.publishDate && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="font-medium mr-2">
                          {locale === 'es' ? 'Publicado:' : 'Published:'}
                        </span>
                        <span>{formatDate(new Date(publication.publishDate))}</span>
                      </div>
                    )}

                    {publication.fileSize && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="font-medium mr-2">
                          {locale === 'es' ? 'Tamaño:' : 'Size:'}
                        </span>
                        <span>{formatFileSize(publication.fileSize)}</span>
                      </div>
                    )}

                    {publication.author && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="font-medium mr-2">
                          {locale === 'es' ? 'Autor:' : 'Author:'}
                        </span>
                        <span>{publication.author.firstName} {publication.author.lastName}</span>
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
                        {publication.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{publication.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <DownloadIcon className="h-3 w-3" />
                      <span>{publication.downloadCount} {locale === 'es' ? 'descargas' : 'downloads'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/${locale}/library/${publication.id}`}
                        className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                      >
                        {locale === 'es' ? 'Ver detalles' : 'View details'}
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {publications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {locale === 'es' 
                ? 'No hay publicaciones destacadas en este momento'
                : 'No featured publications at this time'
              }
            </div>
            <Button asChild variant="outline">
              <Link href={`/${locale}/library`}>
                {locale === 'es' ? 'Explorar biblioteca' : 'Explore library'}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}