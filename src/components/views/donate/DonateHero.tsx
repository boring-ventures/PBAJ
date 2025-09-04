'use client';

import { useParams } from 'next/navigation';
import UnifiedHero from '@/components/ui/unified-hero';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeartIcon, PersonIcon, GlobeIcon } from '@radix-ui/react-icons';

export default function DonateHero() {
  const params = useParams();
  const locale = (params.locale as string) || 'es';

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

  return (
    <>
      <UnifiedHero
        title={locale === 'es' ? 'HAZ LA DIFERENCIA' : 'MAKE A DIFFERENCE'}
        subtitle={locale === 'es' 
          ? 'Tu apoyo transforma vidas y construye un futuro mejor para Bolivia'
          : 'Your support transforms lives and builds a better future for Bolivia'
        }
        backgroundImage="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
        locale={locale}
        buttonColor="#420ff4"
        buttonHoverColor="#5d2bff"
      />
      
      {/* Impact Statistics Section - Now separate from Hero */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
            <div className="pt-8 border-t border-muted/50">
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
          </div>
        </div>
      </section>
    </>
  );
}