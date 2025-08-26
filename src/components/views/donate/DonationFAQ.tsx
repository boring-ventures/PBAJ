'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDownIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';

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
      id: 'security',
      question: locale === 'es' ? '¿Qué tan seguras son las donaciones?' : 'How secure are donations?',
      answer: locale === 'es' 
        ? 'Todas nuestras transacciones están protegidas con encriptación de extremo a extremo. Trabajamos con bancos certificados y plataformas de pago reconocidas internacionalmente. Nunca almacenamos información de tarjetas de crédito y cumplimos con estándares de seguridad bancaria.'
        : 'All our transactions are protected with end-to-end encryption. We work with certified banks and internationally recognized payment platforms. We never store credit card information and comply with banking security standards.'
    },
    {
      id: 'tax',
      question: locale === 'es' ? '¿Las donaciones son deducibles de impuestos?' : 'Are donations tax deductible?',
      answer: locale === 'es' 
        ? 'Sí, somos una organización sin fines de lucro registrada oficialmente. Emitimos recibos fiscales válidos para deducciones en Bolivia y certificados internacionales para donantes extranjeros. Consulta con tu contador sobre la aplicabilidad en tu país.'
        : 'Yes, we are an officially registered non-profit organization. We issue valid tax receipts for deductions in Bolivia and international certificates for foreign donors. Consult with your accountant about applicability in your country.'
    },
    {
      id: 'transparency',
      question: locale === 'es' ? '¿Cómo sé que mi donación se usa correctamente?' : 'How do I know my donation is used correctly?',
      answer: locale === 'es' 
        ? 'Publicamos informes trimestrales detallados de cómo se utilizan los fondos. Enviamos actualizaciones por email con fotos y videos de los proyectos. También puedes solicitar visitar nuestros proyectos o recibir reportes específicos de tu donación.'
        : 'We publish detailed quarterly reports on how funds are used. We send email updates with photos and videos of projects. You can also request to visit our projects or receive specific reports on your donation.'
    },
    {
      id: 'amount',
      question: locale === 'es' ? '¿Cuál es el monto mínimo para donar?' : 'What is the minimum donation amount?',
      answer: locale === 'es' 
        ? 'No hay monto mínimo. Valoramos cada contribución, desde 10 Bs en adelante. Incluso las donaciones pequeñas, cuando se suman, crean un impacto significativo. Lo importante es la intención de ayudar, no el monto.'
        : 'There is no minimum amount. We value every contribution, from 10 Bs onwards. Even small donations, when added together, create significant impact. What matters is the intention to help, not the amount.'
    },
    {
      id: 'recurring',
      question: locale === 'es' ? '¿Puedo hacer donaciones recurrentes?' : 'Can I make recurring donations?',
      answer: locale === 'es' 
        ? 'Actualmente aceptamos donaciones únicas. Para donaciones recurrentes, puedes configurar transferencias automáticas desde tu banco o contactarnos para establecer un plan personalizado. Estamos trabajando en un sistema automático de suscripciones.'
        : 'We currently accept one-time donations. For recurring donations, you can set up automatic transfers from your bank or contact us to establish a personalized plan. We are working on an automatic subscription system.'
    },
    {
      id: 'international',
      question: locale === 'es' ? '¿Puedo donar desde el extranjero?' : 'Can I donate from abroad?',
      answer: locale === 'es' 
        ? 'Absolutamente. Aceptamos donaciones internacionales a través de PayPal, Wise, Western Union y transferencias bancarias SWIFT. Para criptomonedas no hay restricciones geográficas. Los costos de transacción varían según el método elegido.'
        : 'Absolutely. We accept international donations through PayPal, Wise, Western Union and SWIFT bank transfers. For cryptocurrencies there are no geographical restrictions. Transaction costs vary according to the chosen method.'
    },
    {
      id: 'specific-projects',
      question: locale === 'es' ? '¿Puedo elegir a qué proyecto va mi donación?' : 'Can I choose which project my donation goes to?',
      answer: locale === 'es' 
        ? 'Sí, puedes especificar si quieres que tu donación vaya a educación, salud, vivienda o empoderamiento femenino. También puedes elegir una comunidad específica. Si no especificas, usaremos tu donación donde más se necesite en ese momento.'
        : 'Yes, you can specify if you want your donation to go to education, health, housing or women empowerment. You can also choose a specific community. If you don\'t specify, we\'ll use your donation where it\'s most needed at that time.'
    },
    {
      id: 'administrative-costs',
      question: locale === 'es' ? '¿Qué porcentaje va a gastos administrativos?' : 'What percentage goes to administrative costs?',
      answer: locale === 'es' 
        ? 'Solo el 5% de las donaciones se destina a gastos administrativos básicos (oficina, personal mínimo, auditorías). El 95% restante va directamente a los programas y beneficiarios. Somos una de las organizaciones con menor costo administrativo en Bolivia.'
        : 'Only 5% of donations go to basic administrative expenses (office, minimal staff, audits). The remaining 95% goes directly to programs and beneficiaries. We are one of the organizations with the lowest administrative cost in Bolivia.'
    },
    {
      id: 'emergency-donations',
      question: locale === 'es' ? '¿Aceptan donaciones de emergencia?' : 'Do you accept emergency donations?',
      answer: locale === 'es' 
        ? 'Sí, durante crisis (inundaciones, sequías, emergencias sanitarias) activamos fondos de respuesta rápida. Estas donaciones se procesan con prioridad y se distribuyen inmediatamente a las familias afectadas con kits de emergencia.'
        : 'Yes, during crises (floods, droughts, health emergencies) we activate rapid response funds. These donations are processed with priority and distributed immediately to affected families with emergency kits.'
    },
    {
      id: 'volunteer-donate',
      question: locale === 'es' ? '¿Puedo donar tiempo en lugar de dinero?' : 'Can I donate time instead of money?',
      answer: locale === 'es' 
        ? 'Por supuesto. Valoramos mucho el voluntariado. Necesitamos profesionales en educación, salud, construcción, contabilidad y comunicaciones. También organizamos jornadas de voluntariado familiar en comunidades rurales los fines de semana.'
        : 'Of course. We value volunteering very much. We need professionals in education, health, construction, accounting and communications. We also organize family volunteering days in rural communities on weekends.'
    },
    {
      id: 'company-donations',
      question: locale === 'es' ? '¿Mi empresa puede hacer donaciones corporativas?' : 'Can my company make corporate donations?',
      answer: locale === 'es' 
        ? 'Sí, trabajamos con empresas que buscan responsabilidad social corporativa. Ofrecemos programas de patrocinio, adopción de comunidades, y días de voluntariado corporativo. También emitimos certificados especiales para empresas donantes.'
        : 'Yes, we work with companies seeking corporate social responsibility. We offer sponsorship programs, community adoption, and corporate volunteering days. We also issue special certificates for donor companies.'
    },
    {
      id: 'contact-help',
      question: locale === 'es' ? '¿A quién contacto si tengo más preguntas?' : 'Who do I contact if I have more questions?',
      answer: locale === 'es' 
        ? 'Puedes escribirnos a donaciones@plataformaboliviana.org, llamar al +591 (2) 234-5678, o usar WhatsApp +591 7 234-5678. También puedes visitarnos en nuestra oficina en La Paz de lunes a viernes de 9:00 a 17:00.'
        : 'You can write to us at donaciones@plataformaboliviana.org, call +591 (2) 234-5678, or use WhatsApp +591 7 234-5678. You can also visit us at our office in La Paz Monday to Friday from 9:00 to 17:00.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {locale === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
        </h2>
        <p className="text-lg text-muted-foreground">
          {locale === 'es' 
            ? 'Resolvemos las dudas más comunes sobre donaciones y nuestro trabajo'
            : 'We resolve the most common doubts about donations and our work'
          }
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((faq) => (
          <Card key={faq.id} className="shadow-sm hover:shadow-md transition-shadow">
            <Collapsible
              open={openItems.includes(faq.id)}
              onOpenChange={() => toggleItem(faq.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-6 h-auto text-left hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <QuestionMarkCircledIcon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-semibold text-foreground">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDownIcon 
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openItems.includes(faq.id) ? 'rotate-180' : ''
                    }`} 
                  />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 pb-6 px-6">
                  <div className="pl-8 border-l-2 border-primary/20">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Contact Section */}
      <Card className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold text-foreground mb-4">
            {locale === 'es' ? '¿No encontraste tu respuesta?' : 'Didn\'t find your answer?'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {locale === 'es' 
              ? 'Nuestro equipo está aquí para ayudarte con cualquier pregunta específica sobre donaciones.'
              : 'Our team is here to help you with any specific questions about donations.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default">
              {locale === 'es' ? 'Contactar por Email' : 'Contact by Email'}
            </Button>
            <Button variant="outline">
              {locale === 'es' ? 'WhatsApp Directo' : 'Direct WhatsApp'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="space-y-2">
          <div className="text-3xl">🔒</div>
          <h4 className="font-semibold text-foreground">
            {locale === 'es' ? 'Donaciones Seguras' : 'Secure Donations'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {locale === 'es' 
              ? 'Encriptación y protocolos bancarios certificados'
              : 'Encryption and certified banking protocols'
            }
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl">📊</div>
          <h4 className="font-semibold text-foreground">
            {locale === 'es' ? 'Total Transparencia' : 'Full Transparency'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {locale === 'es' 
              ? 'Reportes detallados y auditorías externas'
              : 'Detailed reports and external audits'
            }
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl">🎯</div>
          <h4 className="font-semibold text-foreground">
            {locale === 'es' ? 'Impacto Real' : 'Real Impact'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {locale === 'es' 
              ? '95% destinado directamente a programas'
              : '95% goes directly to programs'
            }
          </p>
        </div>
      </div>
    </div>
  );
}