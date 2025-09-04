'use client';

import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TargetIcon, EyeOpenIcon, HeartIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function MissionVision() {
  const { locale, t } = useLanguage();

  const sections = [
    {
      icon: TargetIcon,
      emoji: '🎯',
      title: locale === 'es' ? 'Nuestra Misión' : 'Our Mission',
      content: locale === 'es' 
        ? 'Promover el desarrollo sostenible y la inclusión social en Bolivia 🇧🇴 a través de programas innovadores que fortalezcan las capacidades locales, fomenten la participación ciudadana y generen oportunidades equitativas para todos los bolivianos. ✨'
        : 'Promote sustainable development and social inclusion in Bolivia 🇧🇴 through innovative programs that strengthen local capacities, encourage citizen participation and generate equitable opportunities for all Bolivians. ✨',
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      icon: EyeOpenIcon,
      emoji: '👁️‍🗨️',
      title: locale === 'es' ? 'Nuestra Visión' : 'Our Vision',
      content: locale === 'es'
        ? 'Ser reconocidos como la organización líder en Bolivia que impulsa transformaciones sociales positivas 💪, contribuyendo a la construcción de una sociedad más justa, próspera e inclusiva donde cada persona pueda alcanzar su máximo potencial. 🌟'
        : 'To be recognized as the leading organization in Bolivia that drives positive social transformations 💪, contributing to building a more just, prosperous and inclusive society where every person can reach their full potential. 🌟',
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      icon: HeartIcon,
      emoji: '💝',
      title: locale === 'es' ? 'Nuestros Valores' : 'Our Values',
      content: locale === 'es'
        ? 'Integridad 🔒, transparencia 🔍, respeto por la diversidad 🤝, compromiso social ❤️, innovación 💡 y colaboración 👥. Estos valores guían cada una de nuestras acciones y decisiones, asegurando que nuestro trabajo sea ético, efectivo e inclusivo.'
        : 'Integrity 🔒, transparency 🔍, respect for diversity 🤝, social commitment ❤️, innovation 💡 and collaboration 👥. These values guide each of our actions and decisions, ensuring that our work is ethical, effective and inclusive.',
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Título principal con animación */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {locale === 'es' ? '🚀 Quiénes Somos' : '🚀 Who We Are'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {locale === 'es'
                ? 'Conoce nuestra esencia, propósito y los valores que nos impulsan a transformar Bolivia 🇧🇴'
                : 'Learn about our essence, purpose and the values that drive us to transform Bolivia 🇧🇴'
              }
            </p>
          </motion.div>

          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: index % 2 === 0 ? 1 : -1,
                    transition: { duration: 0.3 }
                  }}
                  className="h-full"
                >
                  <Card className={`h-full group hover:shadow-2xl transition-all duration-500 border-2 ${section.borderColor} hover:border-primary/50 relative overflow-hidden`}>
                    {/* Efecto de brillo animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    
                    <CardHeader className={`${section.bgColor} rounded-t-lg relative z-10`}>
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className={`p-3 rounded-full bg-white/90 shadow-lg ${section.color} relative`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <IconComponent className="h-6 w-6" />
                          {/* Emoji flotante */}
                          <motion.div
                            className="absolute -top-2 -right-2 text-2xl"
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
                            {section.emoji}
                          </motion.div>
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {section.title}
                          </h3>
                          <motion.div
                            className="h-1 bg-primary rounded-full mt-1"
                            initial={{ width: 0 }}
                            animate={inView ? { width: "60%" } : { width: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 relative z-10">
                      <motion.p 
                        className="text-muted-foreground leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      >
                        {section.content}
                      </motion.p>
                    </CardContent>

                    {/* Partículas decorativas */}
                    <div className="absolute top-4 right-4 opacity-20">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="text-2xl"
                      >
                        ✨
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Estadísticas adicionales */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { number: "14+", label: locale === 'es' ? "Años de Experiencia" : "Years of Experience", emoji: "📅" },
              { number: "25K+", label: locale === 'es' ? "Vidas Transformadas" : "Lives Transformed", emoji: "👥" },
              { number: "100+", label: locale === 'es' ? "Proyectos Ejecutados" : "Projects Executed", emoji: "🚀" },
              { number: "9", label: locale === 'es' ? "Departamentos" : "Departments", emoji: "🏢" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-2xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}