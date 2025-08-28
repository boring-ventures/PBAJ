'use client';

import { useTranslations, useLocale } from '@/hooks/use-translations';
import { Badge } from '@/components/ui/badge';
import { ChatBubbleIcon, Pencil1Icon, StarIcon } from '@radix-ui/react-icons';

export default function OpinionHero() {
  const t = useTranslations('opinion');
  const locale = useLocale();

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-16 lg:py-24">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <StarIcon className="h-4 w-4 mr-2" />
            <span>
              {locale === 'es' ? 'Pensamiento y Análisis' : 'Thought and Analysis'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {locale === 'es' ? 'Opinión y Blog' : 'Opinion & Blog'}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {locale === 'es' 
              ? 'Reflexiones, análisis y perspectivas de nuestro equipo sobre desarrollo social, políticas públicas y transformación social en Bolivia.'
              : 'Reflections, analysis and perspectives from our team on social development, public policy and social transformation in Bolivia.'
            }
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Artículos' : 'Articles'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">12</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Autores' : 'Authors'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">8</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Categorías' : 'Categories'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5K+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Lectores' : 'Readers'}
              </div>
            </div>
          </div>

          {/* Article Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { category: 'POLICY', es: 'Políticas Públicas', en: 'Public Policy', icon: ChatBubbleIcon },
              { category: 'EDUCATION', es: 'Educación', en: 'Education', icon: StarIcon },
              { category: 'SUSTAINABILITY', es: 'Sostenibilidad', en: 'Sustainability', icon: Pencil1Icon },
              { category: 'SOCIAL', es: 'Desarrollo Social', en: 'Social Development', icon: ChatBubbleIcon }
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <Badge key={item.category} variant="secondary" className="px-4 py-2 flex items-center gap-2">
                  <IconComponent className="h-3 w-3" />
                  {locale === 'es' ? item.es : item.en}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}