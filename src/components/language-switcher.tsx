"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Loader2 } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleLanguageChange = async (newLocale: "es" | "en") => {
    if (newLocale === locale) {
      console.log("⚠️ Language already set to:", newLocale);
      return;
    }

    try {
      console.log(
        "🔄 Language switcher: Changing from",
        locale,
        "to",
        newLocale
      );
      setIsTranslating(true);

      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      // The translation happens automatically via context
      setLocale(newLocale);
      console.log("✅ Language switcher: Language changed successfully");

      // No page reload needed - the context will handle the translation
    } catch (error) {
      console.error("❌ Language switch translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          disabled={isTranslating}
        >
          <Globe className="h-4 w-4" />
          {isTranslating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">
                {locale === "es" ? "Changing..." : "Cambiando..."}
              </span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">{currentLanguage?.name}</span>
              <span className="sm:hidden">{currentLanguage?.flag}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as "es" | "en")}
            className={locale === lang.code ? "bg-accent" : ""}
            disabled={isTranslating}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
