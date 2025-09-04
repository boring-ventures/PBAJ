'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, Users, Globe, Target } from 'lucide-react';

export default function BoliviaBanner() {
  const params = useParams();
  const locale = params.locale as string;
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      backgroundImage: 'https://images.unsplash.com/photo-1621473078384-a2a6886e1a3b?q=80&w=2074&auto=format&fit=crop',
      icon: Heart,
      emoji: '❤️',
      title: locale === 'es' ? 'Plataforma Boliviana' : 'Bolivian Platform',
      subtitle: locale === 'es' 
        ? 'Transformando Vidas, Construyendo Futuro' 
        : 'Transforming Lives, Building Future',
      description: locale === 'es'
        ? 'Somos el puente entre los sueños de los bolivianos y las oportunidades que merecen. Unidos por un país próspero e inclusivo. 🇧🇴'
        : 'We are the bridge between Bolivians\' dreams and the opportunities they deserve. United for a prosperous and inclusive country. 🇧🇴',
      cta: locale === 'es' ? 'Únete a la Transformación' : 'Join the Transformation',
      stats: [
        { number: '25K+', label: locale === 'es' ? 'Vidas Impactadas' : 'Lives Impacted', emoji: '👥' },
        { number: '120+', label: locale === 'es' ? 'Proyectos' : 'Projects', emoji: '🚀' },
        { number: '9', label: locale === 'es' ? 'Departamentos' : 'Departments', emoji: '🏢' }
      ]
    },
    {
      id: 2,
      backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
      icon: Users,
      emoji: '🤝',
      title: locale === 'es' ? 'Juntos por Bolivia' : 'Together for Bolivia',
      subtitle: locale === 'es' 
        ? 'Cada Boliviano Cuenta, Cada Historia Importa' 
        : 'Every Bolivian Counts, Every Story Matters',
      description: locale === 'es'
        ? 'Creemos en el poder de la comunidad, en la fuerza de la solidaridad y en el potencial infinito de nuestro pueblo. Cada proyecto es una historia de esperanza. ✨'
        : 'We believe in the power of community, in the strength of solidarity and in the infinite potential of our people. Every project is a story of hope. ✨',
      cta: locale === 'es' ? 'Sé Parte del Cambio' : 'Be Part of the Change',
      stats: [
        { number: '14+', label: locale === 'es' ? 'Años de Experiencia' : 'Years of Experience', emoji: '📅' },
        { number: '2K+', label: locale === 'es' ? 'Familias Apoyadas' : 'Families Supported', emoji: '🏠' },
        { number: '100%', label: locale === 'es' ? 'Compromiso' : 'Commitment', emoji: '💪' }
      ]
    },
    {
      id: 3,
      backgroundImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop',
      icon: Globe,
      emoji: '🌍',
      title: locale === 'es' ? 'Bolivia Próspera' : 'Prosperous Bolivia',
      subtitle: locale === 'es' 
        ? 'Desarrollo Sostenible, Impacto Duradero' 
        : 'Sustainable Development, Lasting Impact',
      description: locale === 'es'
        ? 'Trabajamos incansablemente para crear oportunidades equitativas, fomentar la innovación y construir un legado de progreso para las futuras generaciones de Bolivia. 🌟'
        : 'We work tirelessly to create equitable opportunities, foster innovation and build a legacy of progress for future generations of Bolivia. 🌟',
      cta: locale === 'es' ? 'Construye con Nosotros' : 'Build with Us',
      stats: [
        { number: '500+', label: locale === 'es' ? 'Jóvenes Becados' : 'Scholarship Recipients', emoji: '🎓' },
        { number: '50+', label: locale === 'es' ? 'Comunidades' : 'Communities', emoji: '🏘️' },
        { number: '∞', label: locale === 'es' ? 'Esperanza' : 'Hope', emoji: '💫' }
      ]
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].backgroundImage})`,
            }}
          />
          
          {/* Overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Icon and Emoji */}
                <motion.div
                  className="flex items-center gap-4 mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    {React.createElement(slides[currentSlide].icon, { 
                      className: "h-8 w-8 text-white" 
                    })}
                  </div>
                  <motion.div
                    className="text-6xl"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {slides[currentSlide].emoji}
                  </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  className="text-5xl md:text-7xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {slides[currentSlide].title}
                </motion.h1>

                {/* Subtitle */}
                <motion.h2
                  className="text-2xl md:text-3xl font-semibold text-white/90 mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {slides[currentSlide].subtitle}
                </motion.h2>

                {/* Description */}
                <motion.p
                  className="text-xl text-white/80 leading-relaxed mb-12 max-w-3xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  {slides[currentSlide].description}
                </motion.p>

                {/* Stats */}
                <motion.div
                  className="grid grid-cols-3 gap-8 mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {slides[currentSlide].stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-4xl mb-2">{stat.emoji}</div>
                      <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-white/70 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                  >
                    {slides[currentSlide].cta} ✨
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
        {/* Dots Indicator */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white shadow-lg scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 z-20 group"
      >
        <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 z-20 group"
      >
        <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              rotate: [0, 180, 360],
              opacity: [0.05, 0.2, 0.05]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          >
            🇧🇴
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 6,
            ease: "linear",
            repeat: Infinity
          }}
          key={currentSlide}
        />
      </div>
    </section>
  );
}