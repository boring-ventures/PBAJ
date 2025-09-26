"use client";

import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  Phone,
  Mail,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function Footer() {
  const { locale } = useLanguage();
  return (
    <footer className="py-12" style={{ backgroundColor: "#262626" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/images/LOGO OFICIAL PLATAFORMA LETRA BLANCA-02.png"
                alt="Plataforma Boliviana de Adolescentes y Jóvenes por los Derechos Sexuales y Derechos Reproductivos"
                className="h-36 w-auto"
              />
            </div>
            <p className="text-white text-sm">
              {locale === "es"
                ? "Plataforma Boliviana de Adolescentes y Jóvenes por los Derechos Sexuales y Derechos Reproductivos"
                : "Bolivian Platform for Adolescents and Youth for Sexual and Reproductive Rights"}
            </p>
          </div>

          {/* Navigation Column - Split into two sub-columns */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              {locale === "es" ? "Navegación" : "Navigation"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {/* First sub-column */}
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {locale === "es" ? "Inicio" : "Home"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {locale === "es" ? "Acerca de nosotros" : "About Us"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/who-we-are"
                    className="text-gray-400 hover:text-white transition-colors text-sm ml-2"
                  >
                    {locale === "es" ? "Quiénes somos" : "Who We Are"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/team"
                    className="text-gray-400 hover:text-white transition-colors text-sm ml-2"
                  >
                    {locale === "es" ? "Nuestro equipo" : "Our Team"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/transparency"
                    className="text-gray-400 hover:text-white transition-colors text-sm ml-2"
                  >
                    {locale === "es" ? "Transparencia" : "Transparency"}
                  </Link>
                </li>
              </ul>

              {/* Second sub-column */}
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/programs"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {locale === "es" ? "Programas" : "Programs"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {locale === "es" ? "Recursos" : "Resources"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {locale === "es" ? "Noticias" : "News"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {locale === "es" ? "Contacto" : "Contact"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donate"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {locale === "es" ? "Donar" : "Donate"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact and Social Media Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              {locale === "es"
                ? "Contacto y Redes Sociales"
                : "Contact and Social Media"}
            </h4>

            {/* Contact Information */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Mail size={16} className="text-gray-300" />
                <a
                  href="mailto:plataformaboliviana@gmail.com"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  plataformaboliviana@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Phone size={16} className="text-gray-300" />
                <span className="text-gray-300 text-sm">+ 591 73429657</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-300" />
                <span className="text-gray-300 text-sm">+ 591 78566426</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h5 className="font-medium mb-3 text-white">
                {locale === "es" ? "Síguenos" : "Follow Us"}
              </h5>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/PlataformaBolivianaDDSSyDDRR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon size={24} />
                </a>
                <a
                  href="https://www.instagram.com/plataformabolivianadsydr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/plataforma-boliviana-411ba0375/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={24} />
                </a>
                <a
                  href="https://www.youtube.com/@plataformabolivianaporlosd5827"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeIcon size={24} />
                </a>
                <a
                  href="https://www.tiktok.com/@plataformaboliviana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-600 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()}{" "}
            {locale === "es"
              ? "Plataforma Boliviana de Adolescentes y Jóvenes por los Derechos Sexuales y Derechos Reproductivos. Todos los derechos reservados."
              : "Bolivian Platform for Adolescents and Youth for Sexual and Reproductive Rights. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
