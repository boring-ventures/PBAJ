'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface NewsItem {
  id: string;
  title: string;
  excerpt?: string;
  featuredImageUrl?: string;
  publishDate?: string;
  category?: string;
  author?: {
    firstName?: string;
    lastName?: string;
  };
}

interface NewsSectionProps {
  news?: NewsItem[];
}

export default function NewsSection({ news: propNews }: NewsSectionProps) {
  const { locale, t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propNews) {
      setNews(propNews);
      setLoading(false);
    } else {
      // Add a small delay to prevent simultaneous API calls
      const timer = setTimeout(() => {
        fetchNews();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [propNews, locale]);

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/public/news?featured=true&limit=4&locale=${locale}`);
      if (response.ok) {
        const data = await response.json();
        setNews(data || []);
      } else if (response.status === 429) {
        // Rate limit exceeded, retry after a longer delay
        console.warn('Rate limit exceeded for news, retrying in 2 seconds...');
        setTimeout(() => fetchNews(), 2000);
        return;
      } else {
        console.warn('Failed to fetch news:', response.status, response.statusText);
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy', { 
      locale: locale === 'es' ? es : enUS 
    });
  };

  const getTitle = (item: NewsItem) => {
    return item.title;
  };

  const getExcerpt = (item: NewsItem) => {
    return item.excerpt;
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
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
              {t('homepage.latestNews')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              {locale === 'es' 
                ? 'Mantente informado sobre nuestras últimas iniciativas, logros y eventos'
                : 'Stay informed about our latest initiatives, achievements and events'
              }
            </p>
          </div>
          
          <Button asChild variant="outline" className="group">
            <Link href="/news">
              {t('homepage.news.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(news || []).slice(0, 4).map((article) => (
            <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
              <CardHeader className="p-0">
                {article.featuredImageUrl ? (
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <img
                      src={article.featuredImageUrl}
                      alt={getTitle(article)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <div className="text-gray-400">
                      {locale === 'es' ? 'Sin imagen' : 'No image'}
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {article.category && (
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {article.publishDate && formatDate(new Date(article.publishDate))}
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  <Link href={`/news/${article.id}`}>
                    {getTitle(article)}
                  </Link>
                </h3>

                {getExcerpt(article) && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {getExcerpt(article)}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {article.author?.firstName} {article.author?.lastName}
                  </div>
                  <Link 
                    href={`/news/${article.id}`}
                    className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                  >
                    {locale === 'es' ? 'Leer más' : 'Read more'}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!news || news.length === 0) && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {locale === 'es' 
                ? 'No hay noticias destacadas en este momento'
                : 'No featured news at this time'
              }
            </div>
            <Button asChild variant="outline">
              <Link href="/news">
                {locale === 'es' ? 'Ver todas las noticias' : 'View all news'}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}