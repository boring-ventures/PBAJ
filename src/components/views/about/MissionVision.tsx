'use client';

import { useTranslations, useLocale } from '@/hooks/use-translations';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TargetIcon, EyeOpenIcon, HeartIcon } from '@radix-ui/react-icons';

export default function MissionVision() {
  const t = useTranslations('about');
  const locale = useLocale();

  const sections = [
    {
      icon: TargetIcon,
      title: t('ourMission'),
      content: locale === 'es' 
        ? 'Promover el desarrollo sostenible y la inclusión social en Bolivia a través de programas innovadores que fortalezcan las capacidades locales, fomenten la participación ciudadana y generen oportunidades equitativas para todos los bolivianos.'
        : 'Promote sustainable development and social inclusion in Bolivia through innovative programs that strengthen local capacities, encourage citizen participation and generate equitable opportunities for all Bolivians.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      icon: EyeOpenIcon,
      title: t('ourVision'),
      content: locale === 'es'
        ? 'Ser reconocidos como la organización líder en Bolivia que impulsa transformaciones sociales positivas, contribuyendo a la construcción de una sociedad más justa, próspera e inclusiva donde cada persona pueda alcanzar su máximo potencial.'
        : 'To be recognized as the leading organization in Bolivia that drives positive social transformations, contributing to building a more just, prosperous and inclusive society where every person can reach their full potential.',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      icon: HeartIcon,
      title: t('ourValues'),
      content: locale === 'es'
        ? 'Integridad, transparencia, respeto por la diversidad, compromiso social, innovación y colaboración. Estos valores guían cada una de nuestras acciones y decisiones, asegurando que nuestro trabajo sea ético, efectivo e inclusivo.'
        : 'Integrity, transparency, respect for diversity, social commitment, innovation and collaboration. These values guide each of our actions and decisions, ensuring that our work is ethical, effective and inclusive.',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950'
    }
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Card key={index} className="h-full group hover:shadow-lg transition-all duration-300">
                  <CardHeader className={`${section.bgColor} rounded-t-lg`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full bg-white/80 ${section.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {section.title}
                      </h3>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}