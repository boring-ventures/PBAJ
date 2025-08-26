'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUpIcon, UsersIcon, BookOpenIcon, CalendarIcon } from '@radix-ui/react-icons';

export default function StatisticsSection() {
  const t = useTranslations('homepage');
  const params = useParams();
  const locale = params.locale as string;

  const stats = [
    {
      icon: CalendarIcon,
      value: '50+',
      label: locale === 'es' ? 'Programas Implementados' : 'Programs Implemented',
      description: locale === 'es' ? 'Proyectos exitosos en toda Bolivia' : 'Successful projects across Bolivia',
      color: 'text-blue-600'
    },
    {
      icon: UsersIcon,
      value: '10,000+',
      label: locale === 'es' ? 'Personas Beneficiadas' : 'People Benefited',
      description: locale === 'es' ? 'Vidas transformadas positivamente' : 'Lives positively transformed',
      color: 'text-green-600'
    },
    {
      icon: BookOpenIcon,
      value: '25+',
      label: locale === 'es' ? 'Publicaciones Académicas' : 'Academic Publications',
      description: locale === 'es' ? 'Investigaciones y estudios publicados' : 'Research and studies published',
      color: 'text-purple-600'
    },
    {
      icon: TrendingUpIcon,
      value: '85%',
      label: locale === 'es' ? 'Tasa de Éxito' : 'Success Rate',
      description: locale === 'es' ? 'En objetivos cumplidos' : 'In achieved objectives',
      color: 'text-orange-600'
    }
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('statistics')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'es' 
              ? 'Nuestro compromiso se refleja en resultados tangibles que transforman comunidades'
              : 'Our commitment is reflected in tangible results that transform communities'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full bg-background ${stat.color} bg-opacity-10`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {stat.label}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Decorative gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}