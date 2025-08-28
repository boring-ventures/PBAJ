'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, ArrowRight, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface PublicationItem {
  id: string;
  titleEs: string;
  titleEn: string;
  descriptionEs?: string;
  descriptionEn?: string;
  coverImageUrl?: string;
  type: string;
  publishDate?: string;
  fileSize?: number;
  fileName?: string;
  viewCount?: number;
  downloadCount?: number;
  tags?: string[];
  author?: {
    firstName?: string;
    lastName?: string;
  };
}

interface FeaturedLibrarySectionProps {
  publications?: PublicationItem[];
}

export default function FeaturedLibrarySection({ publications: propPublications }: FeaturedLibrarySectionProps) {
  const { locale, t } = useLanguage();
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propPublications) {
      setPublications(propPublications);
      setLoading(false);
    } else {
      fetchPublications();
    }
  }, [propPublications]);

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/public/digital-library?featured=true&limit=3');
      if (response.ok) {
        const data = await response.json();
        setPublications(data || []);
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

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

  const getTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      REPORT: 'text-blue-600',
      RESEARCH_PAPER: 'text-green-600',
      INFOGRAPHIC: 'text-purple-600',
      GUIDE: 'text-orange-600',
      POLICY_BRIEF: 'text-red-600',
      PRESENTATION: 'text-indigo-600'
    };
    
    return typeMap[type] || 'text-gray-600';
  };

  const getTitle = (item: PublicationItem) => {
    return locale === 'es' ? item.titleEs : item.titleEn || item.titleEs;
  };

  const getDescription = (item: PublicationItem) => {
    return locale === 'es' ? item.descriptionEs : item.descriptionEn || item.descriptionEs;
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('homepage.library.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              {locale === 'es' 
                ? 'Accede a nuestras últimas publicaciones, investigaciones e informes'
                : 'Access our latest publications, research and reports'
              }
            </p>
          </div>
          
          <Button asChild variant="outline" className="group">
            <Link href="/resources/library">
              {t('homepage.library.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(publications || []).slice(0, 3).map((publication) => {
            return (
              <Card key={publication.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
                <CardHeader className="p-0">
                  {publication.coverImageUrl ? (
                    <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                      <img
                        src={publication.coverImageUrl}
                        alt={getTitle(publication)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
                      <FileText className={`h-16 w-16 ${getTypeColor(publication.type)} mb-4`} />
                      <div className="text-gray-400 text-sm text-center px-4">
                        {publication.fileName || getTitle(publication)}
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
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="h-3 w-3" />
                        <span>{publication.viewCount || 0}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/resources/library/${publication.id}`}>
                        {getTitle(publication)}
                      </Link>
                    </h3>

                    {getDescription(publication) && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {getDescription(publication)}
                      </p>
                    )}
                  </div>

                  {/* Publication Details */}
                  <div className="space-y-2 mb-4">
                    {publication.publishDate && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="font-medium mr-2">
                          {locale === 'es' ? 'Publicado:' : 'Published:'}
                        </span>
                        <span>{formatDate(new Date(publication.publishDate))}</span>
                      </div>
                    )}

                    {publication.fileSize && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="font-medium mr-2">
                          {locale === 'es' ? 'Tamaño:' : 'Size:'}
                        </span>
                        <span>{formatFileSize(publication.fileSize)}</span>
                      </div>
                    )}

                    {publication.author && (
                      <div className="flex items-center text-xs text-gray-500">
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
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Download className="h-3 w-3" />
                      <span>{publication.downloadCount || 0} {locale === 'es' ? 'descargas' : 'downloads'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/resources/library/${publication.id}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
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

        {(!publications || publications.length === 0) && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {locale === 'es' 
                ? 'No hay publicaciones destacadas en este momento'
                : 'No featured publications at this time'
              }
            </div>
            <Button asChild variant="outline">
              <Link href="/resources/library">
                {locale === 'es' ? 'Explorar biblioteca' : 'Explore library'}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}