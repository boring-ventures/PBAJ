"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function CoreValues() {
  const params = useParams();
  const locale = params.locale as string;

  const values = [
    {
      title: locale === "es" ? "Integridad" : "Integrity",
      description:
        locale === "es"
          ? "Actuamos con honestidad y coherencia en todos nuestros procesos"
          : "We act with honesty and consistency in all our processes",
      color: "#744C7A",
      bgColor: "from-[#744C7A]/5 to-[#744C7A]/10",
      borderColor: "border-[#744C7A]/20 hover:border-[#744C7A]/40",
    },
    {
      title: locale === "es" ? "Transparencia" : "Transparency",
      description:
        locale === "es"
          ? "Mantenemos comunicación abierta y rendición de cuentas constante"
          : "We maintain open communication and constant accountability",
      color: "#D93069",
      bgColor: "from-[#D93069]/5 to-[#D93069]/10",
      borderColor: "border-[#D93069]/20 hover:border-[#D93069]/40",
    },
    {
      title: locale === "es" ? "Respeto" : "Respect",
      description:
        locale === "es"
          ? "Valoramos la diversidad cultural y la dignidad de cada persona"
          : "We value cultural diversity and the dignity of each person",
      color: "#5A3B85",
      bgColor: "from-[#5A3B85]/5 to-[#5A3B85]/10",
      borderColor: "border-[#5A3B85]/20 hover:border-[#5A3B85]/40",
    },
    {
      title: locale === "es" ? "Compromiso Social" : "Social Commitment",
      description:
        locale === "es"
          ? "Nos dedicamos completamente al bienestar de las comunidades"
          : "We are fully dedicated to the well-being of communities",
      color: "#F4B942",
      bgColor: "from-[#F4B942]/5 to-[#F4B942]/10",
      borderColor: "border-[#F4B942]/20 hover:border-[#F4B942]/40",
    },
    {
      title: locale === "es" ? "Innovación" : "Innovation",
      description:
        locale === "es"
          ? "Buscamos constantemente soluciones creativas y efectivas"
          : "We constantly seek creative and effective solutions",
      color: "#1BB5A0",
      bgColor: "from-[#1BB5A0]/5 to-[#1BB5A0]/10",
      borderColor: "border-[#1BB5A0]/20 hover:border-[#1BB5A0]/40",
    },
    {
      title: locale === "es" ? "Colaboración" : "Collaboration",
      description:
        locale === "es"
          ? "Trabajamos en equipo con todos los actores para lograr mayor impacto"
          : "We work as a team with all stakeholders to achieve greater impact",
      color: "#744C7A",
      bgColor: "from-[#744C7A]/5 to-[#744C7A]/10",
      borderColor: "border-[#744C7A]/20 hover:border-[#744C7A]/40",
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
            {locale === "es" ? "Nuestros Valores" : "Our Values"}
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

        {/* Grid de valores */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
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
