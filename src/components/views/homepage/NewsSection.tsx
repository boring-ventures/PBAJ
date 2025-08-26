'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import type { LocalizedNews } from '@/lib/content/content-utils';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface NewsSectionProps {
  news: LocalizedNews[];
}

export default function NewsSection({ news }: NewsSectionProps) {
  const t = useTranslations('homepage');
  const params = useParams();
  const locale = params.locale as string;

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy', { 
      locale: locale === 'es' ? es : enUS 
    });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('latestNews')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {locale === 'es' 
                ? 'Mantente informado sobre nuestras últimas iniciativas, logros y eventos'
                : 'Stay informed about our latest initiatives, achievements and events'
              }
            </p>
          </div>
          
          <Button asChild variant="outline" className="group">
            <Link href={`/${locale}/news`}>
              {locale === 'es' ? 'Ver todas' : 'View all'}
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.slice(0, 4).map((article) => (
            <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardHeader className="p-0">
                {article.featuredImageUrl ? (
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <img
                      src={article.featuredImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <div className="text-muted-foreground">
                      {locale === 'es' ? 'Sin imagen' : 'No image'}
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {article.publishDate && formatDate(new Date(article.publishDate))}
                  </div>
                </div>

                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/${locale}/news/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>

                {article.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {article.author.firstName} {article.author.lastName}
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

        {news.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {locale === 'es' 
                ? 'No hay noticias destacadas en este momento'
                : 'No featured news at this time'
              }
            </div>
            <Button asChild variant="outline">
              <Link href={`/${locale}/news`}>
                {locale === 'es' ? 'Ver todas las noticias' : 'View all news'}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}