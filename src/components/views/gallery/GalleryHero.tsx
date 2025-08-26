'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, VideoIcon, CameraIcon } from '@radix-ui/react-icons';

export default function GalleryHero() {
  const t = useTranslations('gallery');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-16 lg:py-24">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <CameraIcon className="h-4 w-4 mr-2" />
            <span>
              {locale === 'es' ? 'Memorias Visuales' : 'Visual Memories'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('title')}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {locale === 'es' 
              ? 'Explora nuestra colección de imágenes y videos que documentan nuestro trabajo y el impacto en las comunidades de Bolivia.'
              : 'Explore our collection of images and videos documenting our work and impact in Bolivia\'s communities.'
            }
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Fotografías' : 'Photographs'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Videos' : 'Videos'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Eventos Documentados' : 'Events Documented'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Años de Historia' : 'Years of History'}
              </div>
            </div>
          </div>

          {/* Media Types */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { type: 'PHOTOS', es: 'Fotografías', en: 'Photos', icon: ImageIcon },
              { type: 'VIDEOS', es: 'Videos', en: 'Videos', icon: VideoIcon },
              { type: 'EVENTS', es: 'Eventos', en: 'Events', icon: CameraIcon },
              { type: 'PROGRAMS', es: 'Programas', en: 'Programs', icon: ImageIcon }
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