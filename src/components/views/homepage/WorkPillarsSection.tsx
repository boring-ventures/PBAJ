"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, Palette } from "lucide-react";
import { BRAND_COLORS, BRAND_FONTS, BRAND_GRADIENTS } from "@/lib/brand-colors";
import { useLanguage } from "@/context/language-context";

const getPillars = (locale: string) => [
  {
    title: locale === "es" ? "Derechos Sexuales y Reproductivos" : "Sexual and Reproductive Rights",
    description: locale === "es"
      ? "Promovemos el ejercicio pleno de los derechos sexuales y reproductivos como base del desarrollo juvenil."
      : "We promote the full exercise of sexual and reproductive rights as the basis for youth development.",
    icon: Heart,
    color: BRAND_COLORS.secondary,
    bgColor: `${BRAND_COLORS.secondary}10`,
  },
  {
    title: locale === "es" ? "Participación Juvenil" : "Youth Participation",
    description: locale === "es"
      ? "Fortalecemos liderazgos y espacios de incidencia para que las juventudes sean protagonistas del cambio."
      : "We strengthen leadership and advocacy spaces so that youth are protagonists of change.",
    icon: Users,
    color: BRAND_COLORS.primary,
    bgColor: `${BRAND_COLORS.primary}10`,
  },
  {
    title: locale === "es" ? "Prevención de Violencia de Género" : "Gender-Based Violence Prevention",
    description: locale === "es"
      ? "Trabajamos por la deconstrucción del sistema patriarcal y la prevención de todas las formas de violencia."
      : "We work for the deconstruction of the patriarchal system and the prevention of all forms of violence.",
    icon: Shield,
    color: BRAND_COLORS.tertiary,
    bgColor: `${BRAND_COLORS.tertiary}10`,
  },
  {
    title: locale === "es" ? "Interculturalidad y Diversidad" : "Interculturality and Diversity",
    description: locale === "es"
      ? "Respetamos y valoramos la diversidad cultural, sexual y de género en todas nuestras acciones."
      : "We respect and value cultural, sexual and gender diversity in all our actions.",
    icon: Palette,
    color: BRAND_COLORS.fifth,
    bgColor: `${BRAND_COLORS.fifth}10`,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function WorkPillarsSection() {
  const { locale } = useLanguage();
  const pillars = getPillars(locale);

  return (
    <section
      className="py-16 md:py-24"
      style={{ background: BRAND_GRADIENTS.primary }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              style={{
                fontFamily: BRAND_FONTS.primary,
                color: BRAND_COLORS.white,
              }}
            >
{locale === "es" ? "Nuestros Pilares de" : "Our Pillars of"}{" "}
              <span style={{ color: BRAND_COLORS.quaternary }}>
                {locale === "es" ? "Transformación" : "Transformation"}
              </span>
            </h2>

            <div className="flex justify-center">
              <div
                className="w-24 h-1 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${BRAND_COLORS.quaternary}, ${BRAND_COLORS.fifth})`,
                }}
              ></div>
            </div>

            <p
              className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
              style={{
                color: BRAND_COLORS.white + "E6",
                fontFamily: BRAND_FONTS.secondary,
              }}
            >
{locale === "es"
                ? "Trabajamos en cuatro ejes fundamentales que nos permiten generar un impacto integral y sostenible en las comunidades juveniles de Bolivia."
                : "We work on four fundamental axes that allow us to generate a comprehensive and sustainable impact in youth communities in Bolivia."}
            </p>
          </motion.div>

          {/* Pillars Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8 lg:gap-12"
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div
                  className="relative rounded-3xl p-8 h-full shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  style={{
                    backgroundColor: BRAND_COLORS.white,
                    border: `1px solid ${BRAND_COLORS.grayLight}`,
                  }}
                >
                  {/* Background pattern */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{ backgroundColor: pillar.color }}
                  ></div>

                  <div className="relative z-10 space-y-6">
                    {/* Icon */}
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center border-2 shadow-lg group-hover:scale-110 transition-transform duration-300 bg-white"
                        style={{
                          borderColor: pillar.color,
                          color: pillar.color,
                        }}
                      >
                        <pillar.icon className="w-8 h-8" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3
                        className="text-xl md:text-2xl font-bold group-hover:opacity-90 transition-opacity duration-300"
                        style={{
                          color: BRAND_COLORS.primary,
                          fontFamily: BRAND_FONTS.secondary,
                        }}
                      >
                        {pillar.title}
                      </h3>

                      <p
                        className="leading-relaxed group-hover:opacity-80 transition-opacity duration-300"
                        style={{
                          color: BRAND_COLORS.grayDark,
                          fontFamily: BRAND_FONTS.secondary,
                        }}
                      >
                        {pillar.description}
                      </p>
                    </div>

                    {/* Hover gradient line */}
                    <div
                      className="h-1 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{ backgroundColor: pillar.color }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center pt-8">
            <Link href="/resources">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: BRAND_COLORS.quaternary,
                  color: BRAND_COLORS.white,
                  fontFamily: BRAND_FONTS.secondary,
                  borderRadius: "25px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND_COLORS.fifth;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    BRAND_COLORS.quaternary;
                }}
              >
{locale === "es" ? "Explora Nuestros Recursos" : "Explore Our Resources"}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
