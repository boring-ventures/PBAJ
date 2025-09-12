"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function CoreValues() {
  const params = useParams();
  const locale = params.locale as string;

  const values = [
    // VALORES
    {
      title: locale === "es" ? "COMPROMISO" : "COMMITMENT",
      description:
        locale === "es"
          ? "Dedicación total a nuestra causa y misión"
          : "Total dedication to our cause and mission",
      color: "#8B5CF6",
      bgColor: "from-[#8B5CF6]/5 to-[#8B5CF6]/10",
      borderColor: "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40",
    },
    {
      title: locale === "es" ? "ENERGÍA" : "ENERGY",
      description:
        locale === "es"
          ? "Fuerza y vitalidad para generar cambios positivos"
          : "Strength and vitality to generate positive changes",
      color: "#7C3AED",
      bgColor: "from-[#7C3AED]/5 to-[#7C3AED]/10",
      borderColor: "border-[#7C3AED]/20 hover:border-[#7C3AED]/40",
    },
    {
      title: locale === "es" ? "INNOVACIÓN" : "INNOVATION",
      description:
        locale === "es"
          ? "Búsqueda constante de nuevas formas de abordar desafíos"
          : "Constant search for new ways to address challenges",
      color: "#8B5CF6",
      bgColor: "from-[#8B5CF6]/5 to-[#8B5CF6]/10",
      borderColor: "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40",
    },
    {
      title: locale === "es" ? "CREATIVIDAD" : "CREATIVITY",
      description:
        locale === "es"
          ? "Imaginación y originalidad en nuestras soluciones"
          : "Imagination and originality in our solutions",
      color: "#7C3AED",
      bgColor: "from-[#7C3AED]/5 to-[#7C3AED]/10",
      borderColor: "border-[#7C3AED]/20 hover:border-[#7C3AED]/40",
    },
    {
      title: locale === "es" ? "RESPONSABILIDAD" : "RESPONSIBILITY",
      description:
        locale === "es"
          ? "Asumimos las consecuencias de nuestras acciones"
          : "We assume the consequences of our actions",
      color: "#8B5CF6",
      bgColor: "from-[#8B5CF6]/5 to-[#8B5CF6]/10",
      borderColor: "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40",
    },
    {
      title: locale === "es" ? "HORIZONTALIDAD" : "HORIZONTALITY",
      description:
        locale === "es"
          ? "Trabajamos en igualdad, sin jerarquías"
          : "We work in equality, without hierarchies",
      color: "#7C3AED",
      bgColor: "from-[#7C3AED]/5 to-[#7C3AED]/10",
      borderColor: "border-[#7C3AED]/20 hover:border-[#7C3AED]/40",
    },
    {
      title: locale === "es" ? "INDEPENDENCIA" : "INDEPENDENCE",
      description:
        locale === "es"
          ? "Autonomía en nuestras decisiones y acciones"
          : "Autonomy in our decisions and actions",
      color: "#8B5CF6",
      bgColor: "from-[#8B5CF6]/5 to-[#8B5CF6]/10",
      borderColor: "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40",
    },
    {
      title: locale === "es" ? "NEUTRALIDAD POLÍTICA" : "POLITICAL NEUTRALITY",
      description:
        locale === "es"
          ? "No nos alineamos con ningún partido político"
          : "We do not align with any political party",
      color: "#7C3AED",
      bgColor: "from-[#7C3AED]/5 to-[#7C3AED]/10",
      borderColor: "border-[#7C3AED]/20 hover:border-[#7C3AED]/40",
    },
    {
      title: locale === "es" ? "TRANSPARENCIA" : "TRANSPARENCY",
      description:
        locale === "es"
          ? "Comunicación clara y rendición de cuentas"
          : "Clear communication and accountability",
      color: "#8B5CF6",
      bgColor: "from-[#8B5CF6]/5 to-[#8B5CF6]/10",
      borderColor: "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40",
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
        delayChildren: 0.3,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: "#744C7A",
              fontFamily: "Helvetica LT Std, Helvetica Neue, Arial, sans-serif",
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {locale === "es" ? "VALORES" : "VALUES"}
          </motion.h2>
          <motion.p
            className="text-lg max-w-3xl mx-auto"
            style={{
              color: "#333333",
              fontFamily: "Helvetica LT Std, Helvetica Neue, Arial, sans-serif",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {locale === "es"
              ? "Los principios fundamentales que guían nuestro trabajo y definen nuestra identidad organizacional"
              : "The fundamental principles that guide our work and define our organizational identity"}
          </motion.p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 },
              }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card
                className={`group hover:shadow-xl transition-all duration-500 border-2 ${value.borderColor} h-full bg-gradient-to-br ${value.bgColor} relative overflow-hidden`}
                style={{ boxShadow: "0 4px 6px rgba(116, 76, 122, 0.1)" }}
              >
                {/* Efecto de brillo sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <CardContent className="p-8 relative z-10">
                  <div className="flex-1">
                    <motion.h3
                      className="text-xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300"
                      style={{
                        color: value.color,
                        fontFamily:
                          "Helvetica LT Std, Helvetica Neue, Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                      }
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      {value.title}
                    </motion.h3>

                    {/* Barra decorativa */}
                    <motion.div
                      className="h-1 rounded-full mb-4"
                      style={{ backgroundColor: `${value.color}20` }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: "100%" } : { width: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: value.color }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: "70%" } : { width: 0 }}
                        transition={{ duration: 1, delay: 1 + index * 0.1 }}
                      />
                    </motion.div>

                    <motion.p
                      className="leading-relaxed"
                      style={{
                        color: "#333333",
                        fontFamily:
                          "Helvetica LT Std, Helvetica Neue, Arial, sans-serif",
                        lineHeight: "1.6",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    >
                      {value.description}
                    </motion.p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
