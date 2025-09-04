"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Star, Building } from "lucide-react";
import { BRAND_COLORS, BRAND_FONTS } from "@/lib/brand-colors";

const stats = [
  {
    number: "17",
    label: "Redes Juveniles",
    description: "activas",
    icon: Users,
    color: BRAND_COLORS.primary
  },
  {
    number: "6",
    label: "Departamentos",
    description: "con presencia",
    icon: MapPin,
    color: BRAND_COLORS.secondary
  },
  {
    number: "809+",
    label: "Líderes Jóvenes",
    description: "comprometidos",
    icon: Star,
    color: BRAND_COLORS.quaternary
  },
  {
    number: "17",
    label: "Municipios",
    description: "alcanzados",
    icon: Building,
    color: BRAND_COLORS.fifth
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function AboutUsSection() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: BRAND_COLORS.grayLight }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Content Side */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4">
                <h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                  style={{ 
                    fontFamily: BRAND_FONTS.primary,
                    color: BRAND_COLORS.primary
                  }}
                >
                  ¿Quiénes{" "}
                  <span style={{ color: BRAND_COLORS.secondary }}>Somos?</span>
                </h2>
                
                <div 
                  className="w-20 h-1 rounded-full"
                  style={{ 
                    background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%)`
                  }}
                ></div>
              </div>

              <p 
                className="text-lg md:text-xl leading-relaxed"
                style={{ 
                  fontFamily: BRAND_FONTS.secondary,
                  color: BRAND_COLORS.grayDark
                }}
              >
                Somos una{" "}
                <span 
                  className="font-semibold"
                  style={{ color: BRAND_COLORS.primary }}
                >
                  articulación nacional de adolescentes y jóvenes
                </span>{" "}
                que trabaja por los derechos sexuales y reproductivos con enfoque de{" "}
                <span 
                  className="font-semibold"
                  style={{ color: BRAND_COLORS.secondary }}
                >
                  género, diversidad e interculturalidad.
                </span>
              </p>

              <motion.div 
                variants={itemVariants}
                className="pt-4"
              >
                <Link href="/about/who-we-are">
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      backgroundColor: BRAND_COLORS.primary,
                      color: BRAND_COLORS.white,
                      fontFamily: BRAND_FONTS.secondary,
                      borderRadius: '25px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = BRAND_COLORS.tertiary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = BRAND_COLORS.primary;
                    }}
                  >
                    Conoce Más
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Side */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={statVariants}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: BRAND_COLORS.white,
                  border: `1px solid ${BRAND_COLORS.grayLight}`,
                  boxShadow: `0 4px 6px ${BRAND_COLORS.primary}1A`
                }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon 
                      className="w-6 h-6"
                      style={{ color: stat.color }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div 
                      className="text-3xl md:text-4xl font-bold"
                      style={{ 
                        color: stat.color,
                        fontFamily: BRAND_FONTS.primary
                      }}
                    >
                      {stat.number}
                    </div>
                    
                    <div className="space-y-1">
                      <div 
                        className="text-sm md:text-base font-semibold"
                        style={{ 
                          color: BRAND_COLORS.grayDark,
                          fontFamily: BRAND_FONTS.secondary
                        }}
                      >
                        {stat.label}
                      </div>
                      <div 
                        className="text-xs md:text-sm"
                        style={{ 
                          color: BRAND_COLORS.grayDark + '99',
                          fontFamily: BRAND_FONTS.secondary
                        }}
                      >
                        {stat.description}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}