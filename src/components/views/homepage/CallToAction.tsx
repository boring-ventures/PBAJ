'use client';

import { useTranslations, useLocale } from '@/hooks/use-translations';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeartIcon, EnvelopeClosedIcon, HandIcon } from '@radix-ui/react-icons';

export default function CallToAction() {
  const t = useTranslations('donate');
  const locale = useLocale();

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {locale === 'es' 
              ? '¿Quieres ser parte del cambio?'
              : 'Want to be part of the change?'
            }
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'es' 
              ? 'Tu apoyo nos permite continuar construyendo un futuro más justo e inclusivo para Bolivia'
              : 'Your support allows us to continue building a more just and inclusive future for Bolivia'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Donate Card */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <HeartIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {locale === 'es' ? 'Donar' : 'Donate'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {locale === 'es' 
                  ? 'Contribuye económicamente con nuestros programas de desarrollo social'
                  : 'Contribute financially to our social development programs'
                }
              </p>
              <Button asChild className="w-full">
                <Link href={`/${locale}/donate`}>
                  {locale === 'es' ? 'Hacer una donación' : 'Make a donation'}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <EnvelopeClosedIcon className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {locale === 'es' ? 'Contactar' : 'Contact'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {locale === 'es' 
                  ? 'Ponte en contacto para conocer más sobre nuestro trabajo'
                  : 'Get in touch to learn more about our work'
                }
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/${locale}/contact`}>
                  {locale === 'es' ? 'Enviar mensaje' : 'Send message'}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Volunteer Card */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <HandIcon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {locale === 'es' ? 'Voluntariar' : 'Volunteer'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {locale === 'es' 
                  ? 'Únete como voluntario y aporta tu tiempo y talento'
                  : 'Join as a volunteer and contribute your time and talent'
                }
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/${locale}/contact`}>
                  {locale === 'es' ? 'Ser voluntario' : 'Become volunteer'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {locale === 'es' 
                  ? 'Mantente informado'
                  : 'Stay informed'
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {locale === 'es' 
                  ? 'Suscríbete a nuestro boletín para recibir las últimas noticias y actualizaciones'
                  : 'Subscribe to our newsletter to receive the latest news and updates'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={locale === 'es' ? 'Tu correo electrónico' : 'Your email address'}
                  className="flex-1 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button>
                  {locale === 'es' ? 'Suscribirse' : 'Subscribe'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}