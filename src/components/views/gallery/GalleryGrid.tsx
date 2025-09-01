'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ImageIcon, VideoIcon, PlayIcon, CalendarIcon, PersonIcon, ArrowLeftIcon, ArrowRightIcon, ZoomInIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  createdAt: Date;
  author: string;
  featured?: boolean;
  duration?: number; // For videos, in seconds
}

interface GalleryGridProps {
  items: MediaItem[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

export default function GalleryGrid({ items, currentPage, totalPages, totalResults }: GalleryGridProps) {
  // Default to 'es' if no locale is available
  const locale = 'es';
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy', { 
      locale: locale === 'es' ? es : enUS 
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      EVENTS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      PROGRAMS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      COMMUNITIES: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      TEAM: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      FACILITIES: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      PARTNERSHIPS: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      ACHIEVEMENTS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const openLightbox = (index: number) => {
    setCurrentItemIndex(index);
    setLightboxOpen(true);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!items || items.length === 0) return;
    if (direction === 'prev') {
      setCurrentItemIndex((prev) => prev > 0 ? prev - 1 : items.length - 1);
    } else {
      setCurrentItemIndex((prev) => prev < items.length - 1 ? prev + 1 : 0);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-muted-foreground text-lg mb-4">
          {locale === 'es' 
            ? 'No se encontraron elementos que coincidan con tu búsqueda'
            : 'No items found matching your search'
          }
        </div>
        <div className="text-sm text-muted-foreground mb-6">
          {locale === 'es' 
            ? 'Intenta ajustar los filtros o términos de búsqueda'
            : 'Try adjusting your filters or search terms'
          }
        </div>
        <Button asChild variant="outline">
          <Link href="/resources/multimedia">
            {locale === 'es' ? 'Ver toda la galería' : 'View all gallery'}
          </Link>
        </Button>
      </div>
    );
  }

  const currentItem = items && items[currentItemIndex];

  return (
    <div className="space-y-12">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(items || []).map((item, index) => (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
            <CardContent className="p-0">
              <div 
                className="aspect-square bg-muted relative overflow-hidden"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Media Type Indicator */}
                <div className="absolute top-3 left-3">
                  <Badge className={getCategoryColor(item.category)}>
                    {item.type === 'VIDEO' ? (
                      <VideoIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ImageIcon className="h-3 w-3 mr-1" />
                    )}
                    {item.category}
                  </Badge>
                </div>

                {/* Video Duration */}
                {item.type === 'VIDEO' && item.duration && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      {formatDuration(item.duration)}
                    </Badge>
                  </div>
                )}

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute bottom-3 right-3">
                    <Badge className="bg-yellow-500 text-yellow-950">
                      {locale === 'es' ? 'Destacado' : 'Featured'}
                    </Badge>
                  </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {item.type === 'VIDEO' ? (
                    <PlayIcon className="h-12 w-12 text-white" />
                  ) : (
                    <ZoomInIcon className="h-8 w-8 text-white" />
                  )}
                </div>
              </div>

              {/* Item Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <PersonIcon className="h-3 w-3 mr-1" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.slice(0, 2).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl p-0 bg-black border-none">
          {currentItem && (
            <div className="relative">
              {/* Media Content */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                {currentItem.type === 'VIDEO' ? (
                  <video
                    src={currentItem.url}
                    controls
                    className="max-w-full max-h-full"
                    autoPlay
                  >
                    {locale === 'es' 
                      ? 'Tu navegador no soporta el elemento de video.'
                      : 'Your browser does not support the video element.'
                    }
                  </video>
                ) : (
                  <img
                    src={currentItem.url}
                    alt={currentItem.title}
                    className="max-w-full max-h-full object-contain"
                  />
                )}

                {/* Navigation Arrows */}
                {items && items.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => navigateLightbox('prev')}
                    >
                      <ArrowLeftIcon className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => navigateLightbox('next')}
                    >
                      <ArrowRightIcon className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>

              {/* Media Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{currentItem.title}</h3>
                <p className="text-sm text-gray-200 mb-3">{currentItem.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span>{currentItem.author}</span>
                    <span>{formatDate(currentItem.createdAt)}</span>
                  </div>
                  <div className="text-gray-300">
                    {currentItemIndex + 1} / {items ? items.length : 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
              <Link href={`/resources/multimedia?page=${currentPage - 1}`}>
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
                  <Link href={`/resources/multimedia?page=${pageNumber}`}>
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
              <Link href={`/resources/multimedia?page=${currentPage + 1}`}>
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
          ? `Página ${currentPage} de ${totalPages} • ${totalResults} elementos en total`
          : `Page ${currentPage} of ${totalPages} • ${totalResults} items total`
        }
      </div>
    </div>
  );
}