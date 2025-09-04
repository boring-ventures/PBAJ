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
            'Personas comprometidas con el cambio social',
            'Líderes en derechos sexuales y reproductivos',
            'Expertos en desarrollo comunitario',
            'Defensores de la juventud boliviana',
            'Unidos por un futuro mejor'
          ]
        : [
            'People committed to social change',
            'Leaders in sexual and reproductive rights',
            'Community development experts',
            'Defenders of Bolivian youth',
            'United for a better future'
          ]
      }
      backgroundImage="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2070&auto=format&fit=crop"
      locale={locale}
      buttonColor="#420ff4"
      buttonHoverColor="#5d2bff"
    />
  );
}