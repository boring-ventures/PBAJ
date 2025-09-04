"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Timeline() {
  const params = useParams();
  const locale = params.locale as string;

  const timelineEvents = [
    {
      year: "2010",
      title:
        locale === "es"
          ? "Fundación de la organización"
          : "Organization foundation",
      description:
        locale === "es"
          ? "Inicio de operaciones con el primer programa piloto en La Paz, enfocado en desarrollo comunitario."
          : "Start of operations with the first pilot program in La Paz, focused on community development.",
      type: "milestone",
      impact:
        locale === "es"
          ? "100+ Familias beneficiadas"
          : "100+ Families benefited",
    },
    {
      year: "2012",
      title: locale === "es" ? "Expansión nacional" : "National expansion",
      description:
        locale === "es"
          ? "Ampliación de programas a 5 departamentos de Bolivia, estableciendo alianzas estratégicas."
          : "Program expansion to 5 departments of Bolivia, establishing strategic alliances.",
      type: "growth",
      impact:
        locale === "es"
          ? "5 Departamentos alcanzados"
          : "5 Departments reached",
    },
    {
      year: "2015",
      title:
        locale === "es"
          ? "Primera publicación académica"
          : "First academic publication",
      description:
        locale === "es"
          ? "Lanzamiento de nuestro primer estudio de impacto social documentando resultados en comunidades rurales."
          : "Launch of our first social impact study documenting results in rural communities.",
      type: "achievement",
      impact:
        locale === "es"
          ? "50+ Comunidades estudiadas"
          : "50+ Communities studied",
    },
    {
      year: "2018",
      title:
        locale === "es"
          ? "Programa de becas educativas"
          : "Educational scholarship program",
      description:
        locale === "es"
          ? "Inicio del programa de becas que ha beneficiado a más de 500 jóvenes bolivianos."
          : "Start of the scholarship program that has benefited more than 500 young Bolivians.",
      type: "program",
      impact:
        locale === "es"
          ? "500+ Jóvenes becados"
          : "500+ Young people with scholarships",
    },
    {
      year: "2020",
      title: locale === "es" ? "Respuesta a la pandemia" : "Pandemic response",
      description:
        locale === "es"
          ? "Adaptación de programas para apoyo durante COVID-19, llegando a 2000 familias vulnerables."
          : "Program adaptation for COVID-19 support, reaching 2000 vulnerable families.",
      type: "challenge",
      impact:
        locale === "es"
          ? "2000+ Familias apoyadas"
          : "2000+ Families supported",
    },
    {
      year: "2022",
      title:
        locale === "es"
          ? "Reconocimiento internacional"
          : "International recognition",
      description:
        locale === "es"
          ? "Premio regional por innovación en desarrollo sostenible y excelencia en gestión social."
          : "Regional award for innovation in sustainable development and excellence in social management.",
      type: "achievement",
      impact: locale === "es" ? "1er lugar regional" : "1st regional place",
    },
    {
      year: "2024",
      title: locale === "es" ? "Plataforma digital" : "Digital platform",
      description:
        locale === "es"
          ? "Lanzamiento de la plataforma digital para mayor transparencia y participación ciudadana."
          : "Launch of the digital platform for greater transparency and citizen participation.",
      type: "innovation",
      impact:
        locale === "es"
          ? "100% Transparencia digital"
          : "100% Digital transparency",
    },
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      milestone: "bg-blue-500",
      growth: "bg-green-500",
      achievement: "bg-yellow-500",
      program: "bg-purple-500",
      challenge: "bg-red-500",
      innovation: "bg-cyan-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      milestone:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      growth:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      achievement:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      program:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      challenge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      innovation:
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {locale === "es" ? "Nuestra Historia" : "Our History"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {locale === "es"
              ? "Un viaje extraordinario por los momentos más importantes de nuestra trayectoria transformando Bolivia"
              : "An extraordinary journey through the most important moments of our trajectory transforming Bolivia"}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative" ref={ref}>
            {/* Timeline line */}
            <motion.div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-primary/40 transform md:-translate-x-0.5 rounded-full"
              initial={{ height: 0 }}
              animate={inView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -100 : 100,
                    scale: 0.8,
                  }}
                  animate={
                    inView
                      ? {
                          opacity: 1,
                          x: 0,
                          scale: 1,
                        }
                      : {
                          opacity: 0,
                          x: index % 2 === 0 ? -100 : 100,
                          scale: 0.8,
                        }
                  }
                  transition={{
                    duration: 0.8,
                    delay: index * 0.3,
                    ease: "easeOut",
                  }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className={`absolute left-4 md:left-1/2 w-6 h-6 rounded-full transform -translate-x-3 md:-translate-x-3 ${getTypeColor(event.type)} z-20 border-4 border-white dark:border-gray-900 shadow-lg`}
                    initial={{ scale: 0 }}
                    animate={
                      inView
                        ? {
                            scale: 1,
                          }
                        : {
                            scale: 0,
                          }
                    }
                    transition={{
                      duration: 0.6,
                      delay: index * 0.3 + 0.5,
                      ease: "backOut",
                    }}
                    whileHover={{ scale: 1.3 }}
                  />

                  {/* Content */}
                  <div
                    className={`w-full md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.02,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="ml-12 md:ml-0 group hover:shadow-lg transition-all duration-300 border-l-4 border-primary/50 hover:border-primary bg-background">
                        <CardContent className="p-8">
                          <div
                            className={`flex items-center gap-4 mb-4 ${
                              index % 2 === 0
                                ? "md:flex-row-reverse md:justify-start"
                                : ""
                            }`}
                          >
                            <Badge
                              className={`${getTypeBadgeColor(event.type)} text-lg font-bold px-4 py-2`}
                            >
                              {event.year}
                            </Badge>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                              {event.title}
                            </h3>
                          </div>

                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {event.description}
                          </p>

                          {/* Impacto */}
                          <motion.div
                            className="bg-primary/10 rounded-lg p-3 inline-block"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={
                              inView
                                ? { opacity: 1, scale: 1 }
                                : { opacity: 0, scale: 0.8 }
                            }
                            transition={{
                              duration: 0.5,
                              delay: index * 0.3 + 1.5,
                            }}
                          >
                            <span className="text-primary font-semibold text-sm">
                              {event.impact}
                            </span>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
