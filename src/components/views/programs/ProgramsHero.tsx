'use client';

import { useLanguage } from '@/context/language-context';
import { Badge } from '@/components/ui/badge';

export default function ProgramsHero() {
  const { locale, t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-16 lg:py-24">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span>
              {locale === 'es' ? 'Transformando Comunidades' : 'Transforming Communities'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {locale === 'es' ? 'Nuestros Programas' : 'Our Programs'}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {locale === 'es' 
              ? 'Descubre nuestros programas de desarrollo social que están generando cambios positivos y sostenibles en comunidades de toda Bolivia.'
              : 'Discover our social development programs that are generating positive and sustainable changes in communities throughout Bolivia.'
            }
          </p>

          {/* Program Types Overview */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {[
              { type: 'EDUCATION', es: 'Educación', en: 'Education' },
              { type: 'HEALTH', es: 'Salud', en: 'Health' },
              { type: 'ECONOMIC', es: 'Desarrollo Económico', en: 'Economic Development' },
              { type: 'ENVIRONMENT', es: 'Medio Ambiente', en: 'Environment' },
              { type: 'GOVERNANCE', es: 'Gobernanza', en: 'Governance' }
            ].map((item) => (
              <Badge key={item.type} variant="secondary" className="px-4 py-2">
                {locale === 'es' ? item.es : item.en}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}