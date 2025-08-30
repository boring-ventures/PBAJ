"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation structure with dropdowns
  const navigation = [
    { name: t("navigation.home"), href: "/" },
    {
      name: t("navigation.about.main"),
      href: "/about",
      dropdown: [
        { name: t("navigation.about.whoWeAre"), href: "/about/who-we-are" },
        { name: t("navigation.about.ourTeam"), href: "/about/team" },
        {
          name: t("navigation.about.transparency"),
          href: "/about/transparency",
        },
      ],
    },
    { name: t("navigation.programs"), href: "/programs" },
    {
      name: t("navigation.resources.main"),
      href: "/resources",
      dropdown: [
        { name: t("navigation.resources.library"), href: "/resources/library" },
        {
          name: t("navigation.resources.multimedia"),
          href: "/resources/multimedia",
        },
        { name: t("navigation.resources.blog"), href: "/resources/blog" },
      ],
    },
    { name: t("navigation.news"), href: "/news" },
    { name: t("navigation.contact"), href: "/contact" },
    { name: t("navigation.donate"), href: "/donate" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/images/LOGO HORIZONTAL PLATAFORMA.png"
              alt="Plataforma Boliviana de Acción Juvenil"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) =>
              item.dropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link href={subItem.href} className="cursor-pointer">
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-blue-600"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {locale === "es" ? "ES" : "EN"}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setLocale("es")}
                  className="cursor-pointer"
                >
                  🇧🇴 Español
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocale("en")}
                  className="cursor-pointer"
                >
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons */}
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-blue-600"
              >
                {locale === "es" ? "Iniciar Sesión" : "Sign In"}
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                {locale === "es" ? "Registrarse" : "Sign Up"}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {item.name}
                      </div>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-6 py-2 rounded-md text-base text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex flex-col space-y-2 px-3">
                  <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-blue-600"
                    >
                      {locale === "es" ? "Iniciar Sesión" : "Sign In"}
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      {locale === "es" ? "Registrarse" : "Sign Up"}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="px-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 hover:text-blue-600"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        {locale === "es" ? "ES" : "EN"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => setLocale("es")}
                        className="cursor-pointer"
                      >
                        🇧🇴 Español
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setLocale("en")}
                        className="cursor-pointer"
                      >
                        🇺🇸 English
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
