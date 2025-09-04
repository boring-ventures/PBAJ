"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroComponent() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background images for the carousel
  const backgroundImages = [
    "/images/LOGO HORIZONTAL PLATAFORMA.png",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=800&fit=crop",
  ];

  // Image carousel effect - transitions every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={backgroundImages[currentImageIndex]}
              alt={`Background ${currentImageIndex + 1}`}
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Image carousel indicators */}
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-30">
        <div className="flex flex-col space-y-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-white scale-125"
                  : "bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
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
              PBAJ
            </span>
            <span className="block font-light text-white/90 text-4xl md:text-5xl lg:text-6xl mb-2 tracking-wider">
              Plataforma Juvenil de Acción Juvenil
            </span>
          </motion.h1>

          <motion.p
            className="text-xl font-light text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Empoderando a jóvenes bolivianos para crear un cambio positivo en
            sus comunidades a través de programas educativos, desarrollo de
            liderazgo y acción social.
          </motion.p>

          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.button
              className="px-10 py-4 rounded-full bg-transparent border-2 border-white/30 text-white font-medium text-lg transition-all duration-300 hover:bg-white/10 hover:border-blue-400/50 hover:text-blue-100 cursor-pointer backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Conoce Nuestros Programas
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
