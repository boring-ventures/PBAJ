'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuoteIcon, StarIcon } from '@radix-ui/react-icons';

export default function DonationTestimonials() {
  const params = useParams();
  const locale = params.locale as string;

  const testimonials = [
    {
      id: 1,
      name: 'Ana María Condori',
      role: locale === 'es' ? 'Madre de Familia, El Alto' : 'Mother, El Alto',
      image: '👩‍🌾',
      quote: locale === 'es' 
        ? 'Gracias a la donación de personas generosas, mi hija María puede ir a la escuela con materiales nuevos. Ahora sueña con ser maestra y enseñar a otros niños de nuestra comunidad. Su apoyo cambió nuestras vidas.'
        : 'Thanks to generous donations, my daughter María can go to school with new materials. Now she dreams of being a teacher and educating other children in our community. Your support changed our lives.',
      category: locale === 'es' ? 'Beneficiaria Educación' : 'Education Beneficiary',
      location: 'El Alto, La Paz',
      rating: 5
    },
    {
      id: 2,
      name: 'Carlos Mamani',
      role: locale === 'es' ? 'Agricultor, Cochabamba' : 'Farmer, Cochabamba',
      image: '👨‍🌾',
      quote: locale === 'es' 
        ? 'Con el curso de agricultura sostenible que financiaron los donantes, aprendí nuevas técnicas que triplicaron mi cosecha. Ahora puedo mantener mejor a mi familia y ayudar a otros agricultores de la región.'
        : 'With the sustainable agriculture course funded by donors, I learned new techniques that tripled my harvest. Now I can better support my family and help other farmers in the region.',
      category: locale === 'es' ? 'Beneficiario Agricultura' : 'Agriculture Beneficiary',
      location: 'Cochabamba, Bolivia',
      rating: 5
    },
    {
      id: 3,
      name: 'Rosa Quispe',
      role: locale === 'es' ? 'Emprendedora, Potosí' : 'Entrepreneur, Potosí',
      image: '👩‍💼',
      quote: locale === 'es' 
        ? 'El taller de emprendimiento femenino me dio las herramientas para iniciar mi negocio de tejidos. Hoy genero ingresos propios y empleo tres mujeres más. Las donaciones multiplican oportunidades.'
        : 'The women\'s entrepreneurship workshop gave me the tools to start my textile business. Today I generate my own income and employ three more women. Donations multiply opportunities.',
      category: locale === 'es' ? 'Beneficiaria Emprendimiento' : 'Entrepreneurship Beneficiary',
      location: 'Potosí, Bolivia',
      rating: 5
    },
    {
      id: 4,
      name: 'Dr. Elena Vargas',
      role: locale === 'es' ? 'Coordinadora Médica' : 'Medical Coordinator',
      image: '👩‍⚕️',
      quote: locale === 'es' 
        ? 'Como coordinadora de salud comunitaria, he visto cómo las donaciones salvan vidas. Cada medicamento, cada consulta gratuita marca la diferencia. Los donantes son verdaderos héroes anónimos.'
        : 'As community health coordinator, I\'ve seen how donations save lives. Every medicine, every free consultation makes a difference. Donors are true anonymous heroes.',
      category: locale === 'es' ? 'Personal de Salud' : 'Health Staff',
      location: 'La Paz, Bolivia',
      rating: 5
    },
    {
      id: 5,
      name: 'Prof. Miguel Torres',
      role: locale === 'es' ? 'Maestro Rural' : 'Rural Teacher',
      image: '👨‍🏫',
      quote: locale === 'es' 
        ? 'Enseño en una escuela rural donde cada material cuenta. Las donaciones nos permitieron tener libros, cuadernos y una pizarra nueva. Ver la alegría en los ojos de mis estudiantes no tiene precio.'
        : 'I teach in a rural school where every material counts. Donations allowed us to have books, notebooks and a new blackboard. Seeing the joy in my students\' eyes is priceless.',
      category: locale === 'es' ? 'Educador Rural' : 'Rural Educator',
      location: 'Santa Cruz, Bolivia',
      rating: 5
    },
    {
      id: 6,
      name: 'Familia Choque',
      role: locale === 'es' ? 'Beneficiarios Vivienda' : 'Housing Beneficiaries',
      image: '👨‍👩‍👧‍👦',
      quote: locale === 'es' 
        ? 'Vivíamos en una casa de adobe muy deteriorada. Gracias a los donantes, ahora tenemos una vivienda digna, segura y cálida. Nuestros hijos pueden estudiar tranquilos y crecer en un ambiente sano.'
        : 'We lived in a very deteriorated adobe house. Thanks to donors, we now have a dignified, safe and warm home. Our children can study peacefully and grow up in a healthy environment.',
      category: locale === 'es' ? 'Beneficiarios Vivienda' : 'Housing Beneficiaries',
      location: 'Oruro, Bolivia',
      rating: 5
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {locale === 'es' ? 'Historias de Impacto Real' : 'Real Impact Stories'}
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {locale === 'es' 
            ? 'Escucha las voces de quienes han sido directamente beneficiados por la generosidad de nuestros donantes.'
            : 'Listen to the voices of those who have been directly benefited by the generosity of our donors.'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className="absolute top-4 right-4 text-primary/20">
              <QuoteIcon className="h-8 w-8" />
            </div>
            
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📍 {testimonial.location}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-sm text-foreground leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Category Badge */}
                <div className="flex justify-between items-center pt-4 border-t border-muted">
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.category}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'es' ? 'Testimonio verificado' : 'Verified testimonial'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-16 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {locale === 'es' ? 'Impacto en Números' : 'Impact in Numbers'}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">98.5%</div>
            <div className="text-sm text-muted-foreground">
              {locale === 'es' ? 'Satisfacción de Beneficiarios' : 'Beneficiary Satisfaction'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">25,340</div>
            <div className="text-sm text-muted-foreground">
              {locale === 'es' ? 'Vidas Transformadas' : 'Lives Transformed'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">45</div>
            <div className="text-sm text-muted-foreground">
              {locale === 'es' ? 'Comunidades Atendidas' : 'Communities Served'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">142</div>
            <div className="text-sm text-muted-foreground">
              {locale === 'es' ? 'Proyectos Exitosos' : 'Successful Projects'}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 p-8 border-2 border-dashed border-primary/30 rounded-lg">
        <h3 className="text-xl font-bold text-foreground mb-4">
          {locale === 'es' ? '¿Quieres ser parte de estas historias?' : 'Want to be part of these stories?'}
        </h3>
        <p className="text-muted-foreground mb-6">
          {locale === 'es' 
            ? 'Tu donación puede crear la próxima historia de transformación. Cada contribución cuenta y genera un impacto real.'
            : 'Your donation can create the next transformation story. Every contribution counts and generates real impact.'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => {
              const donationSection = document.querySelector('#donation-methods');
              if (donationSection) {
                donationSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {locale === 'es' ? 'Donar Ahora' : 'Donate Now'}
          </button>
          <button className="px-6 py-3 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors">
            {locale === 'es' ? 'Conocer Más Historias' : 'Read More Stories'}
          </button>
        </div>
      </div>
    </div>
  );
}