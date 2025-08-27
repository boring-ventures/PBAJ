'use client';

import { useTranslations, useLocale } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, PlayIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function HomepageHero() {
  const t = useTranslations('homepage');
  const locale = useLocale();

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span>Construyendo el futuro de Bolivia</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('title')}
            <span className="block text-primary mt-2">
              {locale === 'es' ? 'Juntos' : 'Together'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group">
              <Link href={`/${locale}/programs`}>
                {locale === 'es' ? 'Conoce nuestros programas' : 'Learn about our programs'}
                <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="group">
              <PlayIcon className="mr-2 h-4 w-4" />
              {locale === 'es' ? 'Ver video institucional' : 'Watch institutional video'}
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Programas Activos' : 'Active Programs'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Personas Beneficiadas' : 'People Benefited'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Publicaciones' : 'Publications'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Años de Experiencia' : 'Years of Experience'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}