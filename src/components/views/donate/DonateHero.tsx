'use client';

import { useLanguage } from '@/context/language-context';
import UnifiedHero from '@/components/ui/unified-hero';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { GlowCard } from '@/components/spotlight-card';
import { PersonIcon, GlobeIcon, HeartIcon } from '@radix-ui/react-icons';

export default function DonateHero() {
  const { locale } = useLanguage();

  const impactStats = [
    {
      icon: PersonIcon,
      number: '809+',
      label: locale === 'es' ? 'Líderes Jóvenes Formados' : 'Young Leaders Trained',
      description: locale === 'es' ? 'desde 2012' : 'since 2012'
    },
    {
      icon: GlobeIcon,
      number: '17',
      label: locale === 'es' ? 'Municipios Alcanzados' : 'Municipalities Reached',
      description: locale === 'es' ? 'en 6 departamentos' : 'in 6 departments'
    },
    {
      icon: HeartIcon,
      number: '12',
      label: locale === 'es' ? 'Años de Experiencia' : 'Years of Experience',
      description: locale === 'es' ? 'trabajo continuo' : 'continuous work'
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
        buttonColor="#744C7A"
        buttonHoverColor="#5A3B85"
      />
      
      {/* Impact Statistics Section */}
      <section className="py-20" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: '#744C7A' }}
              >
                {locale === 'es' ? 'Impacto Demostrable' : 'Demonstrable Impact'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {locale === 'es' 
                  ? 'Resultados verificables que transforman vidas y comunidades'
                  : 'Verifiable results that transform lives and communities'
                }
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {impactStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <GlowCard 
                    key={index}
                    glowColor="purple"
                    customSize={true}
                    className="text-center p-8 bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{ backgroundColor: 'rgba(116, 76, 122, 0.1)' }}
                      >
                        <IconComponent 
                          className="h-10 w-10"
                          style={{ color: '#744C7A' }}
                        />
                      </div>
                      <div 
                        className="text-4xl md:text-5xl font-bold mb-3"
                        style={{ color: '#744C7A' }}
                      >
                        {stat.number}
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800">
                        {stat.label}
                      </h3>
                      <p className="text-gray-600">
                        {stat.description}
                      </p>
                    </div>
                  </GlowCard>
                );
              })}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}