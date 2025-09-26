"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  MessageSquare,
  Heart,
  Users,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import { useState, useEffect } from "react";
import { BRAND_COLORS, BRAND_FONTS, BRAND_GRADIENTS } from "@/lib/brand-colors";
import { useLanguage } from "@/context/language-context";

const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: Facebook,
    color: "hover:text-blue-600",
  },
  {
    name: "Instagram",
    href: "#",
    icon: Instagram,
    color: "hover:text-pink-600",
  },
  {
    name: "Twitter",
    href: "#",
    icon: Twitter,
    color: "hover:text-blue-400",
  },
  {
    name: "YouTube",
    href: "#",
    icon: Youtube,
    color: "hover:text-red-600",
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

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export default function JoinUsSection() {
  const { locale } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [floatingPositions, setFloatingPositions] = useState<
    Array<{ left: string; top: string; delay: string }>
  >([]);

  useEffect(() => {
    setIsClient(true);
    // Generate consistent positions for client side rendering
    const positions = Array.from({ length: 8 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${i * 0.5}s`,
    }));
    setFloatingPositions(positions);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background with gradient and pattern */}
      <div
        className="absolute inset-0"
        style={{ background: BRAND_GRADIENTS.primary }}
      ></div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `${BRAND_COLORS.black}40` }}
      ></div>

      {/* Floating elements */}
      {isClient && floatingPositions.length > 0 && (
        <div className="absolute inset-0 overflow-hidden">
          {floatingPositions.map((position, i) => (
            <motion.div
              key={i}
              variants={floatingVariants}
              animate="animate"
              custom={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full"
              style={{
                left: position.left,
                top: position.top,
                animationDelay: position.delay,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative container mx-auto px-4 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-16"
        >
          {/* Main CTA */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h2
              className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight"
              style={{
                fontFamily: BRAND_FONTS.primary,
                color: BRAND_COLORS.white,
              }}
            >
              {locale === "es" ? "¡Forma Parte del" : "Be Part of the"}{" "}
              <span style={{ color: BRAND_COLORS.quaternary }}>
                {locale === "es" ? "Cambio!" : "Change!"}
              </span>
            </h2>

            <div className="flex justify-center">
              <div
                className="w-32 h-1 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${BRAND_COLORS.quaternary}, ${BRAND_COLORS.fifth})`,
                }}
              ></div>
            </div>

            <p
              className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto"
              style={{
                color: BRAND_COLORS.white + "E6",
                fontFamily: BRAND_FONTS.secondary,
              }}
            >
              {locale === "es" ? (
                <>
                  ¿Eres joven y quieres contribuir a una Bolivia más justa?
                  Únete a nuestra red nacional y sé parte de la{" "}
                  <span
                    className="font-bold"
                    style={{ color: BRAND_COLORS.quaternary }}
                  >
                    transformación social
                  </span>{" "}
                  que nuestro país necesita.
                </>
              ) : (
                <>
                  Are you young and want to contribute to a more just Bolivia?
                  Join our national network and be part of the{" "}
                  <span
                    className="font-bold"
                    style={{ color: BRAND_COLORS.quaternary }}
                  >
                    social transformation
                  </span>{" "}
                  that our country needs.
                </>
              )}
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-neutral-100 px-8 py-6 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 min-w-48"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                {locale === "es" ? "Contáctanos" : "Contact Us"}
              </Button>
            </Link>

            <Link href="/donate">
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 min-w-48"
                style={{
                  fontFamily: BRAND_FONTS.secondary,
                }}
              >
                <Heart className="w-5 h-5 mr-2" />
                {locale === "es" ? "Apoya Nuestro Trabajo" : "Support Our Work"}
              </Button>
            </Link>
          </motion.div>

          {/* Newsletter signup */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                {locale === "es" ? "Mantente Conectado" : "Stay Connected"}
              </h3>

              <p className="text-white/80 mb-6">
                {locale === "es"
                  ? "Suscríbete a nuestro boletín para recibir las últimas noticias y oportunidades de participación."
                  : "Subscribe to our newsletter to receive the latest news and participation opportunities."}
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder={
                        locale === "es" ? "Tu correo electrónico" : "Your email"
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-full px-6 py-4 text-lg"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubscribed}
                    className="bg-yellow-400 text-neutral-900 hover:bg-yellow-300 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    {isSubscribed
                      ? locale === "es"
                        ? "¡Suscrito!"
                        : "Subscribed!"
                      : locale === "es"
                        ? "Suscribirse"
                        : "Subscribe"}
                  </Button>
                </div>

                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-yellow-400 font-medium"
                  >
                    {locale === "es"
                      ? "¡Gracias por suscribirte! Pronto recibirás nuestras actualizaciones."
                      : "Thank you for subscribing! You will soon receive our updates."}
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>

          {/* Social links and team link */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Social media */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">
                {locale === "es" ? "Síguenos" : "Follow Us"}
              </h4>

              <div className="flex justify-center space-x-6">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 bg-white/20 rounded-full text-white ${social.color} hover:bg-white/30 transition-all duration-300`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Team link */}
            <div className="pt-4">
              <Link href="/about/team">
                <Button
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full px-6 py-3 transition-all duration-300"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {locale === "es" ? "Conoce Nuestro Equipo" : "Meet Our Team"}
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
