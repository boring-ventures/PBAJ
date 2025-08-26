'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShieldIcon, 
  TransparencyGridIcon, 
  PersonIcon, 
  HeartIcon, 
  LightbulbIcon, 
  Share2Icon 
} from '@radix-ui/react-icons';

export default function CoreValues() {
  const params = useParams();
  const locale = params.locale as string;

  const values = [
    {
      icon: ShieldIcon,
      title: locale === 'es' ? 'Integridad' : 'Integrity',
      description: locale === 'es' 
        ? 'Actuamos con honestidad y coherencia en todos nuestros procesos'
        : 'We act with honesty and consistency in all our processes',
      color: 'text-blue-600'
    },
    {
      icon: TransparencyGridIcon,
      title: locale === 'es' ? 'Transparencia' : 'Transparency',
      description: locale === 'es'
        ? 'Mantenemos comunicación abierta y rendición de cuentas constante'
        : 'We maintain open communication and constant accountability',
      color: 'text-cyan-600'
    },
    {
      icon: PersonIcon,
      title: locale === 'es' ? 'Respeto' : 'Respect',
      description: locale === 'es'
        ? 'Valoramos la diversidad cultural y la dignidad de cada persona'
        : 'We value cultural diversity and the dignity of each person',
      color: 'text-green-600'
    },
    {
      icon: HeartIcon,
      title: locale === 'es' ? 'Compromiso Social' : 'Social Commitment',
      description: locale === 'es'
        ? 'Nos dedicamos completamente al bienestar de las comunidades'
        : 'We are fully dedicated to the well-being of communities',
      color: 'text-red-600'
    },
    {
      icon: LightbulbIcon,
      title: locale === 'es' ? 'Innovación' : 'Innovation',
      description: locale === 'es'
        ? 'Buscamos constantemente soluciones creativas y efectivas'
        : 'We constantly seek creative and effective solutions',
      color: 'text-yellow-600'
    },
    {
      icon: Share2Icon,
      title: locale === 'es' ? 'Colaboración' : 'Collaboration',
      description: locale === 'es'
        ? 'Trabajamos en equipo con todos los actores para lograr mayor impacto'
        : 'We work as a team with all stakeholders to achieve greater impact',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {locale === 'es' ? 'Nuestros Valores' : 'Our Values'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Los principios que guían nuestro trabajo y definen nuestra identidad organizacional'
              : 'The principles that guide our work and define our organizational identity'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-background ${value.color} bg-opacity-10 flex-shrink-0`}>
                      <IconComponent className={`h-6 w-6 ${value.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}