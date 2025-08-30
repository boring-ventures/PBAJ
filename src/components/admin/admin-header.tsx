'use client';

import { useTranslations } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ThemeSwitch } from '@/components/sidebar/theme-switch';
import { ProfileDropdown } from '@/components/sidebar/profile-dropdown';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function AdminHeader({ onMenuToggle, showMenuButton = true }: AdminHeaderProps) {
  const t = useTranslations('admin');
  const { user } = useCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={handleMenuToggle}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PB</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold leading-none">
                {t('dashboard')}
              </h1>
              <span className="text-xs text-muted-foreground hidden sm:block">
                {t('contentManagement')}
              </span>
            </div>
          </div>
        </div>

        {/* Center section - Search or breadcrumbs could go here */}
        <div className="flex-1 max-w-md mx-4">
          {/* Reserved for future search functionality */}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="minimal" />
          <ThemeSwitch />
          
          {user && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
}