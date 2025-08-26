'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeartIcon, PersonIcon, GlobeIcon } from '@radix-ui/react-icons';

export default function DonateHero() {
  const params = useParams();
  const locale = params.locale as string;

  const impactStats = [
    {
      icon: PersonIcon,
      number: '25,000+',
      label: locale === 'es' ? 'Personas Beneficiadas' : 'People Benefited',
      description: locale === 'es' ? 'en 2024' : 'in 2024'
    },
    {
      icon: GlobeIcon,
      number: '45',
      label: locale === 'es' ? 'Comunidades' : 'Communities',
      description: locale === 'es' ? 'rurales atendidas' : 'rural communities served'
    },
    {
      icon: HeartIcon,
      number: '120',
      label: locale === 'es' ? 'Proyectos' : 'Projects',
      description: locale === 'es' ? 'completados exitosamente' : 'successfully completed'
    }
  ];

  const scrollToDonation = () => {
    const donationSection = document.querySelector('#donation-methods');
    if (donationSection) {
      donationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-28">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <HeartIcon className="h-4 w-4 mr-2" />
              <span>
                {locale === 'es' ? 'Únete a Nuestro Impacto' : 'Join Our Impact'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {locale === 'es' ? (
                <>
                  Transforma Vidas con tu{' '}
                  <span className="text-primary">Donación</span>
                </>
              ) : (
                <>
                  Transform Lives with your{' '}
                  <span className="text-primary">Donation</span>
                </>
              )}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
              {locale === 'es' 
                ? 'Tu apoyo hace posible que continuemos trabajando por el desarrollo social sostenible en Bolivia. Cada donación, sin importar el monto, genera un impacto real en las comunidades más necesitadas.'
                : 'Your support makes it possible for us to continue working for sustainable social development in Bolivia. Every donation, regardless of amount, creates real impact in the most needy communities.'
              }
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={scrollToDonation}
              >
                {locale === 'es' ? 'Donar Ahora' : 'Donate Now'}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => {
                  const impactSection = document.querySelector('#donation-impact');
                  if (impactSection) {
                    impactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {locale === 'es' ? 'Ver Nuestro Impacto' : 'See Our Impact'}
              </Button>
            </div>
          </div>

          {/* Impact Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-10 w-10 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-muted/50">
            <div className="flex flex-wrap justify-center items-center gap-6">
              <Badge variant="outline" className="px-4 py-2">
                {locale === 'es' ? '🔒 Transacciones Seguras' : '🔒 Secure Transactions'}
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                {locale === 'es' ? '📋 Transparencia Total' : '📋 Full Transparency'}
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                {locale === 'es' ? '🎯 100% para Proyectos' : '🎯 100% to Projects'}
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                {locale === 'es' ? '📊 Reportes de Impacto' : '📊 Impact Reports'}
              </Badge>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-12 text-center">
            <blockquote className="text-lg italic text-muted-foreground max-w-3xl mx-auto">
              "{locale === 'es' 
                ? 'Creemos que cada persona merece acceso a oportunidades que le permitan alcanzar su máximo potencial. Tu donación es una inversión en el futuro de Bolivia.'
                : 'We believe that every person deserves access to opportunities that allow them to reach their full potential. Your donation is an investment in Bolivia\'s future.'
              }"
            </blockquote>
            <p className="text-primary font-medium mt-4">
              — {locale === 'es' ? 'Equipo Plataforma Boliviana' : 'Plataforma Boliviana Team'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}