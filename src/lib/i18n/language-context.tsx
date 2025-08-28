'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'es' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  // Load language from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Simple translation function - you can expand this with actual translation files
  const t = (key: string, fallback?: string) => {
    // This is a simple implementation - you can integrate with i18n libraries later
    const translations = getTranslations(language);
    return translations[key] || fallback || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Translation data - this can be moved to separate JSON files later
function getTranslations(lang: Language): Record<string, string> {
  const translations = {
    es: {
      // Navigation
      'nav.home': 'Inicio',
      'nav.about': 'Nosotros',
      'nav.about.who_we_are': 'Quiénes Somos',
      'nav.about.our_team': 'Nuestro Equipo',
      'nav.about.transparency': 'Transparencia',
      'nav.programs': 'Programas',
      'nav.resources': 'Recursos',
      'nav.resources.library': 'Biblioteca Digital',
      'nav.resources.multimedia': 'Centro Multimedia',
      'nav.resources.blog': 'Blog y Opinión',
      'nav.news': 'Noticias',
      'nav.contact': 'Contacto',
      'nav.donate': 'Donar',
      
      // Homepage
      'home.hero.title': 'Transformando Bolivia a través de la Educación y el Desarrollo',
      'home.hero.subtitle': 'Trabajamos para crear un futuro más justo y próspero para todos los bolivianos.',
      'home.hero.cta': 'Conoce nuestros programas',
      'home.stats.title': 'Nuestro Impacto',
      'home.news.title': 'Últimas Noticias',
      'home.news.view_all': 'Ver todas las noticias',
      'home.programs.title': 'Programas Destacados',
      'home.programs.view_all': 'Ver todos los programas',
      'home.library.title': 'Biblioteca Digital',
      'home.library.view_all': 'Ver biblioteca completa',
      'home.cta.title': '¿Quieres ser parte del cambio?',
      'home.cta.description': 'Tu contribución puede transformar vidas. Únete a nuestra misión.',
      'home.cta.donate': 'Donar Ahora',
      'home.cta.volunteer': 'Ser Voluntario',
      
      // Footer
      'footer.about': 'Acerca de',
      'footer.programs': 'Programas',
      'footer.resources': 'Recursos',
      'footer.contact': 'Contacto',
      'footer.social': 'Síguenos',
      'footer.newsletter': 'Boletín',
      'footer.newsletter.placeholder': 'Tu email',
      'footer.newsletter.subscribe': 'Suscribirse',
      'footer.rights': 'Todos los derechos reservados',
      
      // Common
      'common.read_more': 'Leer más',
      'common.learn_more': 'Conoce más',
      'common.download': 'Descargar',
      'common.share': 'Compartir',
      'common.search': 'Buscar',
      'common.filter': 'Filtrar',
      'common.all': 'Todos',
      'common.featured': 'Destacado',
      'common.published': 'Publicado',
      'common.author': 'Por',
    },
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.about.who_we_are': 'Who We Are',
      'nav.about.our_team': 'Our Team',
      'nav.about.transparency': 'Transparency',
      'nav.programs': 'Programs',
      'nav.resources': 'Resources',
      'nav.resources.library': 'Digital Library',
      'nav.resources.multimedia': 'Multimedia Center',
      'nav.resources.blog': 'Blog & Opinion',
      'nav.news': 'News',
      'nav.contact': 'Contact',
      'nav.donate': 'Donate',
      
      // Homepage
      'home.hero.title': 'Transforming Bolivia through Education and Development',
      'home.hero.subtitle': 'We work to create a more just and prosperous future for all Bolivians.',
      'home.hero.cta': 'Discover our programs',
      'home.stats.title': 'Our Impact',
      'home.news.title': 'Latest News',
      'home.news.view_all': 'View all news',
      'home.programs.title': 'Featured Programs',
      'home.programs.view_all': 'View all programs',
      'home.library.title': 'Digital Library',
      'home.library.view_all': 'View complete library',
      'home.cta.title': 'Want to be part of the change?',
      'home.cta.description': 'Your contribution can transform lives. Join our mission.',
      'home.cta.donate': 'Donate Now',
      'home.cta.volunteer': 'Volunteer',
      
      // Footer
      'footer.about': 'About',
      'footer.programs': 'Programs',
      'footer.resources': 'Resources',
      'footer.contact': 'Contact',
      'footer.social': 'Follow Us',
      'footer.newsletter': 'Newsletter',
      'footer.newsletter.placeholder': 'Your email',
      'footer.newsletter.subscribe': 'Subscribe',
      'footer.rights': 'All rights reserved',
      
      // Common
      'common.read_more': 'Read more',
      'common.learn_more': 'Learn more',
      'common.download': 'Download',
      'common.share': 'Share',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.all': 'All',
      'common.featured': 'Featured',
      'common.published': 'Published',
      'common.author': 'By',
    },
  };

  return translations[lang] || {};
}