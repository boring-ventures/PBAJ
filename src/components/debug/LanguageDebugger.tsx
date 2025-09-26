"use client";

import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";

export default function LanguageDebugger() {
  const { locale, setLocale, isInitialized } = useLanguage();

  const handleLanguageChange = (newLocale: "es" | "en") => {
    console.log(`🔄 Changing language from ${locale} to ${newLocale}`);
    setLocale(newLocale);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold mb-2">Language Debugger</h3>
      <div className="space-y-2">
        <p className="text-sm">
          <strong>Current:</strong> {locale}
        </p>
        <p className="text-sm">
          <strong>Initialized:</strong> {isInitialized ? "Yes" : "No"}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={locale === "es" ? "default" : "outline"}
            onClick={() => handleLanguageChange("es")}
          >
            ES
          </Button>
          <Button
            size="sm"
            variant={locale === "en" ? "default" : "outline"}
            onClick={() => handleLanguageChange("en")}
          >
            EN
          </Button>
        </div>
        <p className="text-xs text-gray-500">Check console for debug logs</p>
      </div>
    </div>
  );
}
