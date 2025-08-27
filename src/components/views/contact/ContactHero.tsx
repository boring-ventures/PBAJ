'use client';

import { useTranslations, useLocale } from '@/hooks/use-translations';
import { Badge } from '@/components/ui/badge';
import { EnvelopeClosedIcon, ChatBubbleIcon } from '@radix-ui/react-icons';

export default function ContactHero() {
  const t = useTranslations('contact');
  const locale = useLocale();

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-16 lg:py-24">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <ChatBubbleIcon className="h-4 w-4 mr-2" />
            <span>
              {locale === 'es' ? 'Conectemos Juntos' : 'Let\'s Connect'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('title')}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {locale === 'es' 
              ? 'Estamos aquí para escucharte. Ponte en contacto con nosotros para cualquier consulta, colaboración o para conocer más sobre nuestro trabajo.'
              : 'We are here to listen. Get in touch with us for any inquiries, collaborations or to learn more about our work.'
            }
          </p>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeClosedIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {locale === 'es' ? 'Correo Electrónico' : 'Email'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'es' 
                  ? 'Respuesta en 24 horas'
                  : '24-hour response'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {locale === 'es' ? 'Teléfono' : 'Phone'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'es' 
                  ? 'Lun - Vie, 9:00 - 17:00'
                  : 'Mon - Fri, 9:00 - 17:00'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {locale === 'es' ? 'Oficina' : 'Office'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'es' 
                  ? 'La Paz, Bolivia'
                  : 'La Paz, Bolivia'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}