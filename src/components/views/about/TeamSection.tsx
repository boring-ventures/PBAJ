'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LinkedInLogoIcon, TwitterLogoIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons';

export default function TeamSection() {
  const params = useParams();
  const locale = params.locale as string;

  const teamMembers = [
    {
      name: 'María Elena Vargas',
      position: locale === 'es' ? 'Directora Ejecutiva' : 'Executive Director',
      bio: locale === 'es' 
        ? 'Socióloga con más de 15 años de experiencia en desarrollo social y gestión de programas comunitarios.'
        : 'Sociologist with more than 15 years of experience in social development and community program management.',
      image: '/team/maria-vargas.jpg',
      expertise: [
        locale === 'es' ? 'Liderazgo estratégico' : 'Strategic leadership',
        locale === 'es' ? 'Desarrollo comunitario' : 'Community development',
        locale === 'es' ? 'Políticas públicas' : 'Public policies'
      ]
    },
    {
      name: 'Carlos Mendoza',
      position: locale === 'es' ? 'Director de Programas' : 'Programs Director',
      bio: locale === 'es'
        ? 'Ingeniero en desarrollo rural con especialización en proyectos de impacto social y sostenibilidad.'
        : 'Rural development engineer specializing in social impact and sustainability projects.',
      image: '/team/carlos-mendoza.jpg',
      expertise: [
        locale === 'es' ? 'Gestión de proyectos' : 'Project management',
        locale === 'es' ? 'Desarrollo rural' : 'Rural development',
        locale === 'es' ? 'Sostenibilidad' : 'Sustainability'
      ]
    },
    {
      name: 'Ana Luz Rojas',
      position: locale === 'es' ? 'Coordinadora de Investigación' : 'Research Coordinator',
      bio: locale === 'es'
        ? 'Doctora en Ciencias Sociales, especialista en investigación participativa y sistematización de experiencias.'
        : 'Doctor in Social Sciences, specialist in participatory research and systematization of experiences.',
      image: '/team/ana-rojas.jpg',
      expertise: [
        locale === 'es' ? 'Investigación social' : 'Social research',
        locale === 'es' ? 'Metodologías participativas' : 'Participatory methodologies',
        locale === 'es' ? 'Sistematización' : 'Systematization'
      ]
    },
    {
      name: 'Roberto Choque',
      position: locale === 'es' ? 'Coordinador Regional' : 'Regional Coordinator',
      bio: locale === 'es'
        ? 'Antropólogo con amplia experiencia en trabajo con comunidades indígenas y gestión intercultural.'
        : 'Anthropologist with extensive experience working with indigenous communities and intercultural management.',
      image: '/team/roberto-choque.jpg',
      expertise: [
        locale === 'es' ? 'Gestión intercultural' : 'Intercultural management',
        locale === 'es' ? 'Comunidades indígenas' : 'Indigenous communities',
        locale === 'es' ? 'Territorio y cultura' : 'Territory and culture'
      ]
    },
    {
      name: 'Laura Mamani',
      position: locale === 'es' ? 'Coordinadora de Comunicación' : 'Communications Coordinator',
      bio: locale === 'es'
        ? 'Comunicadora social especializada en comunicación para el desarrollo y gestión de medios digitales.'
        : 'Social communicator specialized in communication for development and digital media management.',
      image: '/team/laura-mamani.jpg',
      expertise: [
        locale === 'es' ? 'Comunicación estratégica' : 'Strategic communication',
        locale === 'es' ? 'Medios digitales' : 'Digital media',
        locale === 'es' ? 'Narrativas sociales' : 'Social narratives'
      ]
    },
    {
      name: 'David Quispe',
      position: locale === 'es' ? 'Coordinador de Administración' : 'Administration Coordinator',
      bio: locale === 'es'
        ? 'Contador público con especialización en gestión financiera de organizaciones sin fines de lucro.'
        : 'Public accountant specializing in financial management of non-profit organizations.',
      image: '/team/david-quispe.jpg',
      expertise: [
        locale === 'es' ? 'Gestión financiera' : 'Financial management',
        locale === 'es' ? 'Transparencia' : 'Transparency',
        locale === 'es' ? 'Cumplimiento normativo' : 'Regulatory compliance'
      ]
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {locale === 'es' ? 'Nuestro Equipo' : 'Our Team'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Profesionales comprometidos con la transformación social de Bolivia'
              : 'Professionals committed to the social transformation of Bolivia'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                {/* Member Photo */}
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {/* Fallback avatar */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center text-primary ${member.image ? 'hidden' : ''}`}>
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                      <span className="text-2xl font-bold text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{member.name}</div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-primary font-medium mb-3">
                    {member.position}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Social Links (placeholder) */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                      <LinkedInLogoIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                      <TwitterLogoIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                      <EnvelopeClosedIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}