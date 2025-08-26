'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Globe, ChevronDown } from 'lucide-react';
import { getAlternateLocale } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

const languages = {
  es: {
    name: 'Español',
    flag: '🇪🇸'
  },
  en: {
    name: 'English', 
    flag: '🇺🇸'
  }
} as const;

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  
  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    
    // Remove current locale from pathname
    const segments = pathname.split('/');
    const pathWithoutLocale = '/' + segments.slice(2).join('/');
    
    // Create new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    router.push(newPath);
  };

  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => switchLanguage(getAlternateLocale(currentLocale))}
        className={`h-8 px-2 text-sm ${className}`}
        title={`Switch to ${languages[getAlternateLocale(currentLocale)].name}`}
      >
        <Globe className="w-4 h-4 mr-1" />
        {currentLocale.toUpperCase()}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`h-8 px-3 ${className}`}>
          <span className="mr-2">{languages[currentLocale].flag}</span>
          <span className="hidden sm:inline-block mr-1">
            {languages[currentLocale].name}
          </span>
          <span className="sm:hidden mr-1">
            {currentLocale.toUpperCase()}
          </span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {Object.entries(languages).map(([locale, language]) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLanguage(locale as Locale)}
            className={`cursor-pointer ${
              currentLocale === locale 
                ? 'bg-accent text-accent-foreground' 
                : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
            {currentLocale === locale && (
              <span className="ml-auto text-xs opacity-60">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Alternative compact version for mobile or tight spaces
export function LanguageSwitcherCompact({ className = '' }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  
  const switchLanguage = () => {
    const newLocale = getAlternateLocale(currentLocale);
    const segments = pathname.split('/');
    const pathWithoutLocale = '/' + segments.slice(2).join('/');
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={switchLanguage}
      className={`h-8 w-8 ${className}`}
      title={`Switch to ${languages[getAlternateLocale(currentLocale)].name}`}
    >
      <Globe className="w-4 h-4" />
    </Button>
  );
}