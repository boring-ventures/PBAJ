'use client';

import { useTranslations, useLocale } from '@/hooks/use-translations';
import { Badge } from '@/components/ui/badge';

export default function NewsHero() {
  const t = useTranslations('news');
  const locale = useLocale();

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-16 lg:py-24">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span>
              {locale === 'es' ? 'Mantente Informado' : 'Stay Informed'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('title')}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {locale === 'es' 
              ? 'Descubre las últimas noticias, campañas y logros de nuestro trabajo en el desarrollo social de Bolivia.'
              : 'Discover the latest news, campaigns and achievements from our work in Bolivia\'s social development.'
            }
          </p>

          {/* News Categories Overview */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {[
              { category: 'PROGRAMS', es: 'Programas', en: 'Programs' },
              { category: 'CAMPAIGNS', es: 'Campañas', en: 'Campaigns' },
              { category: 'ACHIEVEMENTS', es: 'Logros', en: 'Achievements' },
              { category: 'EVENTS', es: 'Eventos', en: 'Events' },
              { category: 'PARTNERSHIPS', es: 'Alianzas', en: 'Partnerships' }
            ].map((item) => (
              <Badge key={item.category} variant="secondary" className="px-4 py-2">
                {locale === 'es' ? item.es : item.en}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}