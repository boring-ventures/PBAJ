"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";

export default function HeroComponent() {
  const { locale, t } = useLanguage();

  // Background image
  const backgroundImage = "/images/WhatsApp Image 2025-08-27 at 01.12.52.jpeg";

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={backgroundImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to a solid color if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.nextElementSibling?.classList.remove("hidden");
            }}
          />
          {/* Fallback background if image fails */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 hidden" />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>

      {/* Main Content */}
      <main className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center max-w-4xl px-6">
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="block font-black text-white drop-shadow-2xl">
              {locale === "es" ? "DERECHOS" : "RIGHTS"}
            </span>
            <span className="block font-black text-white drop-shadow-2xl text-4xl md:text-5xl lg:text-6xl">
              {locale === "es" ? "SEXUALES" : "SEXUAL"}
            </span>
            <span className="block font-light text-white/90 text-xl md:text-2xl lg:text-3xl mb-2 tracking-wider mt-4">
              {locale === "es"
                ? "Plataforma Boliviana de Adolescentes y Jóvenes"
                : "Bolivian Platform for Adolescents and Youth"}
            </span>
          </motion.h1>

          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Link href="/programs">
              <motion.button
                className="px-10 py-4 rounded-full bg-transparent border-2 border-white/30 text-white font-medium text-lg transition-all duration-300 hover:bg-white/10 hover:border-blue-400/50 hover:text-blue-100 cursor-pointer backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {locale === "es" ? "Únete" : "Join Us"}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
