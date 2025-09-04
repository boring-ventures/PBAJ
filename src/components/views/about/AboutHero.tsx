'use client';

import { useLanguage } from '@/context/language-context';
import UnifiedHero from '@/components/ui/unified-hero';

export default function AboutHero() {
  const { locale } = useLanguage();

  return (
    <>
      <UnifiedHero
        title={locale === 'es' ? 'QUIÉNES SOMOS' : 'WHO WE ARE'}
        subtitle={locale === 'es' 
          ? [
              'Construyendo un futuro más justo para Bolivia',
              'Empoderando a jóvenes y adolescentes',
              'Defendiendo derechos sexuales y reproductivos',
              'Transformando comunidades con educación',
              'Creando oportunidades para todos'
            ]
          : [
              'Building a more just future for Bolivia',
              'Empowering youth and adolescents',
              'Defending sexual and reproductive rights',
              'Transforming communities through education',
              'Creating opportunities for everyone'
            ]
        }
        backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
        locale={locale}
        buttonColor="#30ffa8"
        buttonHoverColor="#52ffba"
      />
      
      {/* Key Stats Section - Now separate from Hero */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Años de Trayectoria' : 'Years of Experience'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Programas Ejecutados' : 'Programs Executed'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">9</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Departamentos' : 'Departments'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Aliados Estratégicos' : 'Strategic Partners'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}