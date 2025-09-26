"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Heart, Lightbulb, Calendar } from "lucide-react";
import { BRAND_COLORS, BRAND_FONTS, BRAND_GRADIENTS } from "@/lib/brand-colors";
import { useLanguage } from "@/context/language-context";

const departments = [
  { name: "La Paz", position: { x: "45%", y: "25%" }, active: true },
  { name: "Santa Cruz", position: { x: "72%", y: "50%" }, active: true },
  { name: "Cochabamba", position: { x: "50%", y: "42%" }, active: true },
  { name: "Potosí", position: { x: "55%", y: "68%" }, active: true },
  { name: "Tarija", position: { x: "60%", y: "85%" }, active: true },
  { name: "Chuquisaca", position: { x: "58%", y: "72%" }, active: true },
  { name: "Oruro", position: { x: "48%", y: "58%" }, active: true },
  { name: "Beni", position: { x: "65%", y: "35%" }, active: true },
  { name: "Pando", position: { x: "58%", y: "18%" }, active: true },
];

const getMilestones = (locale: string) => [
  {
    year: "2012",
    title: locale === "es" ? "Fundación" : "Foundation",
    description: locale === "es" ? "Inicio de la articulación juvenil" : "Beginning of youth articulation",
    icon: Calendar,
  },
  {
    year: "2016",
    title: locale === "es" ? "Expansión Nacional" : "National Expansion",
    description: locale === "es" ? "Presencia en 6 departamentos" : "Presence in 6 departments",
    icon: MapPin,
  },
  {
    year: "2020",
    title: locale === "es" ? "800+ Líderes" : "800+ Leaders",
    description: locale === "es" ? "Red consolidada de jóvenes" : "Consolidated youth network",
    icon: Users,
  },
  {
    year: "2024",
    title: locale === "es" ? "Impacto Sostenible" : "Sustainable Impact",
    description: locale === "es" ? "Transformación comunitaria integral" : "Comprehensive community transformation",
    icon: Heart,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

const mapVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function OurImpactSection() {
  const { locale } = useLanguage();
  const milestones = getMilestones(locale);

  return (
    <section
      className="py-16 md:py-24"
      style={{ backgroundColor: BRAND_COLORS.white }}
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
                color: BRAND_COLORS.primary,
              }}
            >
{locale === "es" ? "Transformando Bolivia desde las" : "Transforming Bolivia from the"}{" "}
              <span style={{ color: BRAND_COLORS.secondary }}>
                {locale === "es" ? "Juventudes" : "Youth"}
              </span>
            </h2>

            <div className="flex justify-center">
              <div
                className="w-24 h-1 rounded-full"
                style={{ background: BRAND_GRADIENTS.secondary }}
              ></div>
            </div>

            <p
              className="text-lg md:text-xl leading-relaxed max-w-4xl mx-auto"
              style={{
                fontFamily: BRAND_FONTS.secondary,
                color: BRAND_COLORS.grayDark,
              }}
            >
              {locale === "es" ? (
                <>
                  <span
                    className="font-semibold"
                    style={{ color: BRAND_COLORS.primary }}
                  >
                    Desde 2012,
                  </span>{" "}
                  hemos construido una red nacional que genera{" "}
                  <span
                    className="font-semibold"
                    style={{ color: BRAND_COLORS.secondary }}
                  >
                    cambios reales
                  </span>{" "}
                  en las comunidades, promoviendo liderazgos diversos y
                  participación activa de las juventudes.
                </>
              ) : (
                <>
                  <span
                    className="font-semibold"
                    style={{ color: BRAND_COLORS.primary }}
                  >
                    Since 2012,
                  </span>{" "}
                  we have built a national network that generates{" "}
                  <span
                    className="font-semibold"
                    style={{ color: BRAND_COLORS.secondary }}
                  >
                    real changes
                  </span>{" "}
                  in communities, promoting diverse leadership and
                  active participation of youth.
                </>
              )}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Bolivia Map Visualization */}
            <motion.div variants={mapVariants} className="relative">
              <div
                className="rounded-3xl p-8 shadow-xl"
                style={{
                  backgroundColor: BRAND_COLORS.white,
                  border: `2px solid ${BRAND_COLORS.grayLight}`,
                  boxShadow: `0 4px 6px ${BRAND_COLORS.primary}20`,
                }}
              >
                <h3
                  className="text-xl font-bold text-center mb-8"
                  style={{
                    fontFamily: BRAND_FONTS.secondary,
                    color: BRAND_COLORS.primary,
                  }}
                >
{locale === "es" ? "Nuestra Presencia Nacional" : "Our National Presence"}
                </h3>

                <div className="relative w-full aspect-[3/4] mx-auto max-w-sm">
                  {/* Bolivia map image */}
                  <div
                    className="w-full h-full rounded-lg overflow-hidden shadow-lg"
                    style={{
                      backgroundImage:
                        "url('/images/png-transparent-bolivia-map-geography-gps-location-bolivia-map-icon-thumbnail.png')",
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundColor: BRAND_COLORS.grayLight,
                      filter: "grayscale(0.3) brightness(1.1)",
                    }}
                  >
                    {/* Department markers */}
                    {departments.map((dept, index) => (
                      <motion.div
                        key={dept.name}
                        variants={dotVariants}
                        custom={index}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: dept.position.x, top: dept.position.y }}
                      >
                        <div className="relative group">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="w-4 h-4 rounded-full border-2 shadow-lg cursor-pointer"
                            style={{
                              backgroundColor: BRAND_COLORS.secondary,
                              borderColor: BRAND_COLORS.white,
                            }}
                          >
                            <div
                              className="absolute inset-0 rounded-full animate-ping opacity-20"
                              style={{
                                backgroundColor: BRAND_COLORS.secondary,
                              }}
                            ></div>
                          </motion.div>

                          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div
                              className="text-xs px-2 py-1 rounded whitespace-nowrap"
                              style={{
                                backgroundColor: BRAND_COLORS.tertiary,
                                color: BRAND_COLORS.white,
                                fontFamily: BRAND_FONTS.secondary,
                              }}
                            >
                              {dept.name}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: BRAND_COLORS.secondary }}
                    ></div>
                    <span
                      style={{
                        color: BRAND_COLORS.grayDark,
                        fontFamily: BRAND_FONTS.secondary,
                      }}
                    >
{locale === "es" ? "9 Departamentos Activos" : "9 Active Departments"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={containerVariants} className="space-y-8">
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    className="flex items-start space-x-4 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: BRAND_COLORS.white,
                      border: `1px solid ${BRAND_COLORS.grayLight}`,
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: BRAND_GRADIENTS.primary,
                          color: BRAND_COLORS.white,
                        }}
                      >
                        <milestone.icon className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span
                          className="text-2xl font-bold"
                          style={{
                            color: BRAND_COLORS.secondary,
                            fontFamily: BRAND_FONTS.primary,
                          }}
                        >
                          {milestone.year}
                        </span>
                        <div
                          className="h-px flex-1"
                          style={{
                            background: `linear-gradient(to right, ${BRAND_COLORS.secondary}, transparent)`,
                          }}
                        ></div>
                      </div>

                      <h4
                        className="text-lg font-bold"
                        style={{
                          color: BRAND_COLORS.primary,
                          fontFamily: BRAND_FONTS.secondary,
                        }}
                      >
                        {milestone.title}
                      </h4>

                      <p
                        style={{
                          color: BRAND_COLORS.grayDark,
                          fontFamily: BRAND_FONTS.secondary,
                        }}
                      >
                        {milestone.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} className="pt-6">
                <Link href="/programs">
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                    style={{
                      background: BRAND_GRADIENTS.complementary,
                      color: BRAND_COLORS.white,
                      fontFamily: BRAND_FONTS.secondary,
                      borderRadius: "25px",
                    }}
                  >
                    <Lightbulb className="w-5 h-5 mr-2" />
{locale === "es" ? "Ver Nuestros Programas" : "View Our Programs"}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
