'use client';

import { useLanguage } from '@/context/language-context';
import UnifiedHero from '@/components/ui/unified-hero';
import { Badge } from '@/components/ui/badge';

export default function ProgramsHero() {
  const { locale } = useLanguage();

  return (
    <>
      <UnifiedHero
        title={locale === 'es' ? 'NUESTROS PROGRAMAS' : 'OUR PROGRAMS'}
        subtitle={locale === 'es' 
          ? 'Generando cambios positivos y sostenibles en toda Bolivia'
          : 'Generating positive and sustainable changes throughout Bolivia'
        }
        backgroundImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
        locale={locale}
        buttonColor="#ffb707"
        buttonHoverColor="#ffc633"
      />
      
      {/* Program Types Section - Now separate from Hero */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span>
                  {locale === 'es' ? 'Transformando Comunidades' : 'Transforming Communities'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
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
    </>
  );
}