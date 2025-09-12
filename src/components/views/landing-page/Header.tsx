"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
// Theme switch removed per request

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { name: t("navigation.resources.main"), href: "/resources" },
    { name: t("navigation.news"), href: "/news" },
    { name: t("navigation.contact"), href: "/contact" },
    { name: t("navigation.donate"), href: "/donate" },
  ];

  return (
    <header className="fixed inset-x-0 top-3 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={`mx-auto flex items-center justify-between rounded-full bg-neutral-900 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] ring-1 ring-black/10 transition-all ${
            scrolled
              ? "backdrop-blur supports-[backdrop-filter]:bg-neutral-900/95"
              : ""
          }`}
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {/* Left circular logo */}
          <Link
            href="/"
            className="ml-2 flex h-12 w-36 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white px-3 text-neutral-900 shadow-sm md:w-44"
            aria-label="Inicio"
          >
            <Image
              src="/images/LOGO HORIZONTAL PLATAFORMA.png"
              alt="Plataforma Boliviana de Acción Juvenil"
              width={160}
              height={40}
              className="h-8 w-auto object-contain md:h-9"
              priority
            />
          </Link>

          {/* Center nav - compressed spacing */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8 px-6">
            {navigation.map((item) =>
              item.dropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="py-4 text-base font-medium text-white/90 hover:text-white hover:bg-neutral-800/50"
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.dropdown.map((sub) => (
                      <DropdownMenuItem key={sub.name} asChild>
                        <Link href={sub.href}>{sub.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="py-4 text-base font-medium text-white/90 hover:text-white"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Right capsule with actions */}
          <div className="mr-2 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-neutral-900">
            <LanguageSwitcher />
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-neutral-900">
                {locale === "es" ? "Iniciar sesión" : "Sign in"}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden mr-2 p-2 text-white"
            aria-label="Abrir menú"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className="md:hidden mx-auto mt-2 rounded-2xl bg-neutral-900/95 p-3 text-white shadow ring-1 ring-black/10"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            <div className="flex flex-col">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div className="mb-2">
                      <Link
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base text-white hover:bg-white/10"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <div className="ml-3 mt-1 flex flex-col">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="rounded-md px-3 py-2 text-base text-white/90 hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              <div className="mt-2 flex items-center justify-between rounded-xl bg-white px-3 py-2 text-neutral-900">
                <LanguageSwitcher />
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-900"
                  >
                    {locale === "es" ? "Iniciar sesión" : "Sign in"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
