'use client';

import { useLanguage } from '@/context/language-context';

export default function AboutHero() {
  const { locale, t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {locale === 'es' ? 'Quiénes Somos' : 'Who We Are'}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {locale === 'es' 
              ? 'Somos una organización comprometida con la construcción de un futuro más justo e inclusivo para Bolivia, trabajando directamente con las comunidades para generar cambios sostenibles y duraderos.'
              : 'We are an organization committed to building a more just and inclusive future for Bolivia, working directly with communities to generate sustainable and lasting changes.'
            }
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
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
      </div>
    </section>
  );
}