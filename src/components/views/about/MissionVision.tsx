"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TargetIcon, EyeOpenIcon, HeartIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function MissionVision() {
  const { locale, t } = useLanguage();

  const sections = [
    {
      icon: TargetIcon,
      title: locale === "es" ? "MISIÓN" : "MISSION",
      content:
        locale === "es"
          ? "Plataforma es una articulación nacional de adolescentes y jóvenes que busca, a partir de un trabajo organizado y voluntario, contribuir al desarrollo integral de los y las adolescentes y jóvenes del país, promoviendo la reflexión y acción en temáticas de derechos sexuales y reproductivos, participación juvenil y prevención de la violencia basada en género. Creemos en que es posible transformar el mundo adulto centrista y machista, a través del empoderamiento de niñas, niños y adolescentes. Buscamos que los y las jóvenes sean protagonistas y se formen como agentes de cambio, para que aporten a transformar la sociedad, deconstruyendo el sistema patriarcal y promoviendo un mundo más igualitario y equitativo."
          : "Platform is a national articulation of adolescents and young people that seeks, through organized and voluntary work, to contribute to the comprehensive development of adolescents and young people in the country, promoting reflection and action on issues of sexual and reproductive rights, youth participation, and prevention of gender-based violence. We believe that it is possible to transform the adult-centric and macho world, through the empowerment of girls, boys, and adolescents. We seek for young people to be protagonists and to be formed as agents of change, so that they contribute to transforming society, deconstructing the patriarchal system, and promoting a more egalitarian and equitable world.",
      color: "text-blue-600",
      bgColor:
        "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: EyeOpenIcon,
      title: locale === "es" ? "VISIÓN" : "VISION",
      content:
        locale === "es"
          ? "Plataforma es una organización feminista e inclusiva, reconocida a nivel nacional como un referente en la transformación social y promoción de los derechos sexuales y derechos reproductivos, con perspectiva de género y respeto a la diversidad sexual. Así somos: Un actor clave para la construcción de una sociedad más justa, equitativa e inclusiva, donde cada persona pueda tener una vida digna con respeto a sus derechos. Una articuladora de redes y organizaciones juveniles con presencia en los 9 departamentos de Bolivia que brinde espacios de participación activa para la promoción de derechos. Una ejecutora de acciones concretas, con las y los jóvenes de los nueve departamentos, para aportar a la deconstrucción de ideas adulto centristas y patriarcales desde la visión de las y los jóvenes."
          : "Platform is a feminist and inclusive organization, nationally recognized as a benchmark in social transformation and the promotion of sexual and reproductive rights, with a gender perspective and respect for sexual diversity. This is how we are: A key actor for the construction of a more just, equitable, and inclusive society, where every person can have a dignified life with respect for their rights. A network articulator of youth networks and organizations with presence in the 9 departments of Bolivia that provides spaces for active participation for the promotion of rights. An executor of concrete actions, with young people from the nine departments, to contribute to the deconstruction of adult-centric and patriarchal ideas from the perspective of young people.",
      color: "text-green-600",
      bgColor:
        "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
      borderColor: "border-green-200 dark:border-green-800",
    },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
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
              {locale === "es" ? "Quiénes Somos" : "Who We Are"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {locale === "es"
                ? "Conoce nuestra esencia, propósito y los valores que nos impulsan a transformar Bolivia"
                : "Learn about our essence, purpose and the values that drive us to transform Bolivia"}
            </p>
          </motion.div>

          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
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
                    transition: { duration: 0.3 },
                  }}
                  className="h-full"
                >
                  <Card
                    className={`h-full group hover:shadow-2xl transition-all duration-500 border-2 ${section.borderColor} hover:border-primary/50 relative overflow-hidden`}
                  >
                    {/* Efecto de brillo animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                    <CardHeader
                      className={`${section.bgColor} rounded-t-lg relative z-10`}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`p-3 rounded-lg bg-white border-2 ${section.color} shadow-lg relative`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <IconComponent className="h-6 w-6" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {section.title}
                          </h3>
                          <motion.div
                            className="h-1 bg-primary rounded-full mt-1"
                            initial={{ width: 0 }}
                            animate={inView ? { width: "60%" } : { width: 0 }}
                            transition={{
                              duration: 0.8,
                              delay: 0.5 + index * 0.2,
                            }}
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
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
