'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DownloadIcon, BookOpenIcon, FileTextIcon } from '@radix-ui/react-icons';

export default function LibraryHero() {
  const t = useTranslations('library');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-16 lg:py-24">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <BookOpenIcon className="h-4 w-4 mr-2" />
            <span>
              {locale === 'es' ? 'Conocimiento Abierto' : 'Open Knowledge'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('title')}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {locale === 'es' 
              ? 'Accede a nuestra colección de investigaciones, informes, guías y publicaciones sobre desarrollo social en Bolivia.'
              : 'Access our collection of research, reports, guides and publications on social development in Bolivia.'
            }
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Publicaciones' : 'Publications'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15K+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Descargas' : 'Downloads'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">8</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Categorías' : 'Categories'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Acceso Gratuito' : 'Free Access'}
              </div>
            </div>
          </div>

          {/* Publication Types */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { type: 'RESEARCH', es: 'Investigaciones', en: 'Research', icon: FileTextIcon },
              { type: 'REPORTS', es: 'Informes', en: 'Reports', icon: FileTextIcon },
              { type: 'GUIDES', es: 'Guías', en: 'Guides', icon: BookOpenIcon },
              { type: 'PUBLICATIONS', es: 'Publicaciones', en: 'Publications', icon: FileTextIcon }
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <Badge key={item.type} variant="secondary" className="px-4 py-2 flex items-center gap-2">
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