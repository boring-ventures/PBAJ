"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDownIcon, QuestionMarkCircledIcon, StarFilledIcon } from "@radix-ui/react-icons";

export default function DonationFAQ() {
  const params = useParams();
  const locale = params.locale as string;
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const faqData = [
    {
      id: 'how-to-donate',
      question: locale === 'es' ? '¿Cómo puedo hacer una donación?' : 'How can I make a donation?',
      answer: locale === 'es' 
        ? 'Puedes donar de forma segura a través de transferencia bancaria, depósito directo o plataformas digitales. Contáctanos para recibir los datos específicos según tu preferencia de pago.'
        : 'You can donate securely through bank transfer, direct deposit or digital platforms. Contact us to receive specific information according to your payment preference.'
    },
    {
      id: 'donation-impact',
      question: locale === 'es' ? '¿Cómo sabré el impacto de mi donación?' : 'How will I know the impact of my donation?',
      answer: locale === 'es' 
        ? 'Enviamos reportes trimestrales con historias reales y métricas específicas de cómo tu donación está transformando vidas. También puedes seguir nuestras redes sociales para actualizaciones constantes.'
        : 'We send quarterly reports with real stories and specific metrics on how your donation is transforming lives. You can also follow our social media for constant updates.'
    },
    {
      id: 'tax-deduction',
      question: locale === 'es' ? '¿Mi donación es deducible de impuestos?' : 'Is my donation tax deductible?',
      answer: locale === 'es' 
        ? 'Sí, somos una organización sin fines de lucro registrada. Te proporcionaremos el recibo oficial para que puedas aplicar la deducción fiscal correspondiente.'
        : 'Yes, we are a registered non-profit organization. We will provide you with the official receipt so you can apply the corresponding tax deduction.'
    },
    {
      id: 'recurring-donations',
      question: locale === 'es' ? '¿Puedo hacer donaciones recurrentes?' : 'Can I make recurring donations?',
      answer: locale === 'es' 
        ? 'Absolutamente. Las donaciones mensuales nos ayudan a planificar mejor y tener un impacto más sostenido. Puedes configurar donaciones automáticas del monto que prefieras.'
        : 'Absolutely. Monthly donations help us plan better and have a more sustained impact. You can set up automatic donations for any amount you prefer.'
    },
    {
      id: 'small-donations',
      question: locale === 'es' ? '¿Las donaciones pequeñas realmente ayudan?' : 'Do small donations really help?',
      answer: locale === 'es' 
        ? '¡Por supuesto! Cada boliviano cuenta. Con 50 Bs podemos proporcionar material escolar para un niño por un mes. Tu donación, sin importar el monto, hace la diferencia.'
        : 'Of course! Every boliviano counts. With 50 Bs we can provide school supplies for a child for a month. Your donation, regardless of the amount, makes a difference.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="py-20" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Section Header */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Badge 
              className="mb-6 px-6 py-2 text-sm font-semibold border-none"
              style={{ backgroundColor: '#F4B942', color: '#000000' }}
            >
              <StarFilledIcon className="h-4 w-4 mr-2" />
              {locale === "es" ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
            </Badge>
            <h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ color: '#744C7A' }}
            >
              {locale === "es" ? "Dudas sobre Donaciones" : "Donation Questions"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {locale === "es" 
                ? "Respuestas a las preguntas más comunes sobre cómo donar y hacer la diferencia"
                : "Answers to the most common questions about how to donate and make a difference"
              }
            </p>
          </motion.div>

          {/* FAQ Section */}
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {faqData.map((faq, index) => (
              <motion.div
                key={faq.id}
                variants={cardVariants}
                whileHover="hover"
                custom={index}
              >
                <Card 
                  className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: 'white' }}
                >
                <Collapsible
                  open={openItems.includes(faq.id)}
                  onOpenChange={() => toggleItem(faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-8 h-auto text-left hover:bg-gray-50 rounded-3xl"
                    >
                      <div className="flex items-start space-x-4">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                          style={{ backgroundColor: 'rgba(116, 76, 122, 0.1)' }}
                        >
                          <QuestionMarkCircledIcon 
                            className="h-5 w-5" 
                            style={{ color: '#744C7A' }}
                          />
                        </div>
                        <span 
                          className="font-bold text-lg text-left leading-relaxed"
                          style={{ color: '#744C7A' }}
                        >
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDownIcon 
                        className={`h-6 w-6 text-gray-500 transition-transform flex-shrink-0 ml-4 ${
                          openItems.includes(faq.id) ? 'rotate-180' : ''
                        }`} 
                      />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-8 px-8">
                      <div className="pl-14">
                        <div 
                          className="border-l-3 pl-6"
                          style={{ borderColor: 'rgba(116, 76, 122, 0.2)' }}
                        >
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
                </Card>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
}