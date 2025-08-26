'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Timeline() {
  const params = useParams();
  const locale = params.locale as string;

  const timelineEvents = [
    {
      year: '2010',
      title: locale === 'es' ? 'Fundación de la organización' : 'Organization foundation',
      description: locale === 'es' 
        ? 'Inicio de operaciones con el primer programa piloto en La Paz, enfocado en desarrollo comunitario.'
        : 'Start of operations with the first pilot program in La Paz, focused on community development.',
      type: 'milestone'
    },
    {
      year: '2012',
      title: locale === 'es' ? 'Expansión nacional' : 'National expansion',
      description: locale === 'es'
        ? 'Ampliación de programas a 5 departamentos de Bolivia, estableciendo alianzas estratégicas.'
        : 'Program expansion to 5 departments of Bolivia, establishing strategic alliances.',
      type: 'growth'
    },
    {
      year: '2015',
      title: locale === 'es' ? 'Primera publicación académica' : 'First academic publication',
      description: locale === 'es'
        ? 'Lanzamiento de nuestro primer estudio de impacto social documentando resultados en comunidades rurales.'
        : 'Launch of our first social impact study documenting results in rural communities.',
      type: 'achievement'
    },
    {
      year: '2018',
      title: locale === 'es' ? 'Programa de becas educativas' : 'Educational scholarship program',
      description: locale === 'es'
        ? 'Inicio del programa de becas que ha beneficiado a más de 500 jóvenes bolivianos.'
        : 'Start of the scholarship program that has benefited more than 500 young Bolivians.',
      type: 'program'
    },
    {
      year: '2020',
      title: locale === 'es' ? 'Respuesta a la pandemia' : 'Pandemic response',
      description: locale === 'es'
        ? 'Adaptación de programas para apoyo durante COVID-19, llegando a 2000 familias vulnerables.'
        : 'Program adaptation for COVID-19 support, reaching 2000 vulnerable families.',
      type: 'challenge'
    },
    {
      year: '2022',
      title: locale === 'es' ? 'Reconocimiento internacional' : 'International recognition',
      description: locale === 'es'
        ? 'Premio regional por innovación en desarrollo sostenible y excelencia en gestión social.'
        : 'Regional award for innovation in sustainable development and excellence in social management.',
      type: 'achievement'
    },
    {
      year: '2024',
      title: locale === 'es' ? 'Plataforma digital' : 'Digital platform',
      description: locale === 'es'
        ? 'Lanzamiento de la plataforma digital para mayor transparencia y participación ciudadana.'
        : 'Launch of the digital platform for greater transparency and citizen participation.',
      type: 'innovation'
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      milestone: 'bg-blue-500',
      growth: 'bg-green-500',
      achievement: 'bg-yellow-500',
      program: 'bg-purple-500',
      challenge: 'bg-red-500',
      innovation: 'bg-cyan-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      milestone: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      growth: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      achievement: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      program: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      challenge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      innovation: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {locale === 'es' ? 'Nuestra Historia' : 'Our History'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Un recorrido por los momentos más importantes de nuestra trayectoria'
              : 'A journey through the most important moments of our trajectory'
            }
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform md:-translate-x-0.5" />

            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* Timeline dot */}
                  <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full transform -translate-x-2 md:-translate-x-2 ${getTypeColor(event.type)} z-10`} />
                  
                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
                  }`}>
                    <Card className="ml-8 md:ml-0 group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className={`flex items-center gap-3 mb-3 ${
                          index % 2 === 0 ? 'md:flex-row-reverse md:justify-start' : ''
                        }`}>
                          <Badge className={getTypeBadgeColor(event.type)}>
                            {event.year}
                          </Badge>
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}