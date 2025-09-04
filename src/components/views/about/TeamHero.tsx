'use client';

import { useLanguage } from '@/context/language-context';
import UnifiedHero from '@/components/ui/unified-hero';

export default function TeamHero() {
  const { locale } = useLanguage();

  return (
    <UnifiedHero
      title={locale === 'es' ? 'NUESTRO EQUIPO' : 'OUR TEAM'}
      subtitle={locale === 'es' 
        ? [
            'Líderes comprometidos con el desarrollo social',
            'Expertos en gestión y transformación comunitaria',
            'Profesionales especializados en impacto social',
            'Equipo multidisciplinario de alto rendimiento',
            'Unidos por la excelencia y los resultados'
          ]
        : [
            'Leaders committed to social development',
            'Experts in management and community transformation',
            'Professionals specialized in social impact',
            'High-performance multidisciplinary team',
            'United by excellence and results'
          ]
      }
      backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
      locale={locale}
      buttonColor="#744C7A"
      buttonHoverColor="#5A3B85"
    />
  );
}