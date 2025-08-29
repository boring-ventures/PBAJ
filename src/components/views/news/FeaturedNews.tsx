'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import type { LocalizedNews } from '@/lib/content/content-utils';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface FeaturedNewsProps {
  news?: LocalizedNews[];
}

export default function FeaturedNews({ news = [] }: FeaturedNewsProps) {
  const params = useParams();
  const locale = params.locale as string;

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy', { 
      locale: locale === 'es' ? es : enUS 
    });
  };

  if (!news || news.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {locale === 'es' ? 'Noticias Destacadas' : 'Featured News'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {locale === 'es'
                ? 'Las historias más importantes de nuestro trabajo reciente'
                : 'The most important stories from our recent work'
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <Card key={article.id} className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
              index === 0 && news.length >= 3 ? 'lg:col-span-2 lg:row-span-2' : ''
            }`}>
              <CardHeader className="p-0">
                {article.featuredImageUrl ? (
                  <div className={`bg-muted relative overflow-hidden ${
                    index === 0 && news.length >= 3 ? 'aspect-[2/1]' : 'aspect-[4/3]'
                  }`}>
                    <img
                      src={article.featuredImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {article.category}
                      </Badge>
                    </div>

                    {/* Featured Badge for main article */}
                    {index === 0 && news.length >= 3 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-yellow-950">
                          {locale === 'es' ? 'Destacado' : 'Featured'}
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center ${
                    index === 0 && news.length >= 3 ? 'aspect-[2/1]' : 'aspect-[4/3]'
                  }`}>
                    <div className="text-muted-foreground text-center">
                      <div className="text-4xl mb-2">📰</div>
                      <div className="text-sm">
                        {locale === 'es' ? 'Noticia' : 'News'}
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className={`p-6 ${index === 0 && news.length >= 3 ? 'lg:p-8' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {article.publishDate && formatDate(new Date(article.publishDate))}
                  </div>
                </div>

                <h3 className={`font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors ${
                  index === 0 && news.length >= 3 ? 'text-2xl lg:text-3xl lg:mb-4' : 'text-lg'
                }`}>
                  <Link href={`/${locale}/news/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>

                {article.excerpt && (
                  <p className={`text-muted-foreground mb-4 ${
                    index === 0 && news.length >= 3 ? 'text-base lg:text-lg line-clamp-4' : 'text-sm line-clamp-3'
                  }`}>
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {article.author.firstName} {article.author.lastName}
                  </div>
                  <Link 
                    href={`/${locale}/news/${article.id}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium group-hover:translate-x-1 transform transition-transform"
                  >
                    {locale === 'es' ? 'Leer más' : 'Read more'}
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}