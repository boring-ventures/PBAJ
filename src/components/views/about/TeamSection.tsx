'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LinkedInLogoIcon, TwitterLogoIcon, EnvelopeClosedIcon, PersonIcon, ReaderIcon, CalendarIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

export default function TeamSection() {
  const params = useParams();
  const locale = params.locale as string;
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const teamMembers = [
    {
      name: 'María Elena Vargas',
      position: locale === 'es' ? 'Directora Ejecutiva' : 'Executive Director',
      department: locale === 'es' ? 'Liderazgo Estratégico' : 'Strategic Leadership',
      bio: locale === 'es' 
        ? 'Socióloga con más de 15 años de experiencia en desarrollo social, gestión organizacional y liderazgo de equipos multidisciplinarios en proyectos de alto impacto.'
        : 'Sociologist with more than 15 years of experience in social development, organizational management and leadership of multidisciplinary teams in high-impact projects.',
      image: '/team/maria-vargas.jpg',
      experience: '15+',
      education: locale === 'es' ? 'Maestría en Desarrollo Social' : 'Master in Social Development',
      achievements: locale === 'es' ? '25+ Proyectos Liderados' : '25+ Projects Led',
      expertise: [
        locale === 'es' ? 'Liderazgo Estratégico' : 'Strategic Leadership',
        locale === 'es' ? 'Gestión Organizacional' : 'Organizational Management',
        locale === 'es' ? 'Políticas Públicas' : 'Public Policy',
        locale === 'es' ? 'Desarrollo Comunitario' : 'Community Development'
      ],
      brandColor: '#744C7A'
    },
    {
      name: 'Carlos Mendoza',
      position: locale === 'es' ? 'Director de Programas' : 'Programs Director',
      department: locale === 'es' ? 'Gestión de Programas' : 'Program Management',
      bio: locale === 'es'
        ? 'Ingeniero en desarrollo rural especializado en diseño, implementación y evaluación de proyectos de impacto social y sostenibilidad ambiental.'
        : 'Rural development engineer specialized in design, implementation and evaluation of social impact and environmental sustainability projects.',
      image: '/team/carlos-mendoza.jpg',
      experience: '12+',
      education: locale === 'es' ? 'Ing. Desarrollo Rural' : 'Rural Development Engineer',
      achievements: locale === 'es' ? '50+ Comunidades Impactadas' : '50+ Communities Impacted',
      expertise: [
        locale === 'es' ? 'Gestión de Proyectos' : 'Project Management',
        locale === 'es' ? 'Desarrollo Sostenible' : 'Sustainable Development',
        locale === 'es' ? 'Evaluación de Impacto' : 'Impact Assessment',
        locale === 'es' ? 'Planificación Estratégica' : 'Strategic Planning'
      ],
      brandColor: '#D93069'
    },
    {
      name: 'Ana Luz Rojas',
      position: locale === 'es' ? 'Coordinadora de Investigación' : 'Research Coordinator',
      department: locale === 'es' ? 'Investigación y Análisis' : 'Research & Analytics',
      bio: locale === 'es'
        ? 'Doctora en Ciencias Sociales con especialización en metodologías de investigación participativa, sistematización de experiencias y análisis de políticas sociales.'
        : 'Doctor in Social Sciences specialized in participatory research methodologies, systematization of experiences and social policy analysis.',
      image: '/team/ana-rojas.jpg',
      experience: '10+',
      education: locale === 'es' ? 'PhD. Ciencias Sociales' : 'PhD. Social Sciences',
      achievements: locale === 'es' ? '15+ Publicaciones Académicas' : '15+ Academic Publications',
      expertise: [
        locale === 'es' ? 'Investigación Cualitativa' : 'Qualitative Research',
        locale === 'es' ? 'Metodologías Participativas' : 'Participatory Methodologies',
        locale === 'es' ? 'Análisis de Políticas' : 'Policy Analysis',
        locale === 'es' ? 'Sistematización' : 'Systematization'
      ],
      brandColor: '#5A3B85'
    },
    {
      name: 'Roberto Choque',
      position: locale === 'es' ? 'Coordinador Regional' : 'Regional Coordinator',
      department: locale === 'es' ? 'Desarrollo Territorial' : 'Territorial Development',
      bio: locale === 'es'
        ? 'Antropólogo con amplia experiencia en gestión intercultural, trabajo con pueblos originarios y coordinación de programas territoriales en contextos multiculturales.'
        : 'Anthropologist with extensive experience in intercultural management, work with indigenous peoples and coordination of territorial programs in multicultural contexts.',
      image: '/team/roberto-choque.jpg',
      experience: '13+',
      education: locale === 'es' ? 'Lic. Antropología' : 'Bachelor in Anthropology',
      achievements: locale === 'es' ? '30+ Comunidades Indígenas' : '30+ Indigenous Communities',
      expertise: [
        locale === 'es' ? 'Gestión Intercultural' : 'Intercultural Management',
        locale === 'es' ? 'Desarrollo Territorial' : 'Territorial Development',
        locale === 'es' ? 'Pueblos Originarios' : 'Indigenous Peoples',
        locale === 'es' ? 'Mediación Cultural' : 'Cultural Mediation'
      ],
      brandColor: '#F4B942'
    },
    {
      name: 'Laura Mamani',
      position: locale === 'es' ? 'Coordinadora de Comunicación' : 'Communications Coordinator',
      department: locale === 'es' ? 'Comunicación Estratégica' : 'Strategic Communications',
      bio: locale === 'es'
        ? 'Comunicadora social especializada en estrategias de comunicación para el desarrollo, gestión de medios digitales y construcción de narrativas de impacto social.'
        : 'Social communicator specialized in communication strategies for development, digital media management and construction of social impact narratives.',
      image: '/team/laura-mamani.jpg',
      experience: '8+',
      education: locale === 'es' ? 'Lic. Comunicación Social' : 'Bachelor in Social Communication',
      achievements: locale === 'es' ? '2M+ Personas Alcanzadas' : '2M+ People Reached',
      expertise: [
        locale === 'es' ? 'Comunicación Digital' : 'Digital Communication',
        locale === 'es' ? 'Marketing Social' : 'Social Marketing',
        locale === 'es' ? 'Gestión de Medios' : 'Media Management',
        locale === 'es' ? 'Narrativas de Impacto' : 'Impact Narratives'
      ],
      brandColor: '#1BB5A0'
    },
    {
      name: 'David Quispe',
      position: locale === 'es' ? 'Coordinador de Administración' : 'Administration Coordinator',
      department: locale === 'es' ? 'Gestión Administrativa' : 'Administrative Management',
      bio: locale === 'es'
        ? 'Contador público especializado en gestión financiera de organizaciones sociales, transparencia operativa y cumplimiento de marcos normativos internacionales.'
        : 'Public accountant specialized in financial management of social organizations, operational transparency and compliance with international regulatory frameworks.',
      image: '/team/david-quispe.jpg',
      experience: '11+',
      education: locale === 'es' ? 'CPA - Contador Público' : 'CPA - Public Accountant',
      achievements: locale === 'es' ? '100% Transparencia Financiera' : '100% Financial Transparency',
      expertise: [
        locale === 'es' ? 'Gestión Financiera' : 'Financial Management',
        locale === 'es' ? 'Auditoría Interna' : 'Internal Audit',
        locale === 'es' ? 'Cumplimiento Normativo' : 'Regulatory Compliance',
        locale === 'es' ? 'Transparencia' : 'Transparency'
      ],
      brandColor: '#744C7A'
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            style={{
              fontFamily: 'Helvetica LT Std, Helvetica Neue, Arial, sans-serif',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {locale === 'es' ? 'Equipo Directivo' : 'Leadership Team'}
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            style={{
              fontFamily: 'Helvetica LT Std, Helvetica Neue, Arial, sans-serif',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {locale === 'es'
              ? 'Líderes experimentados comprometidos con la excelencia operacional y el impacto social sostenible en Bolivia'
              : 'Experienced leaders committed to operational excellence and sustainable social impact in Bolivia'
            }
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, rotateY: -10 }}
              animate={
                inView
                  ? { opacity: 1, y: 0, rotateY: 0 }
                  : { opacity: 0, y: 60, rotateY: -10 }
              }
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: 'easeOut'
              }}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.3 } 
              }}
              className="h-full"
            >
              <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Professional Header with Brand Accent */}
                    <div 
                      className="h-2 w-full"
                      style={{ backgroundColor: `${member.brandColor}20` }}
                    />
                    
                    {/* Member Photo */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
                      {member.image ? (
                        <motion.img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      
                      {/* Professional Fallback Avatar */}
                      <div className={`absolute inset-0 flex flex-col items-center justify-center ${member.image ? 'hidden' : ''}`}>
                        <div 
                          className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg"
                          style={{ backgroundColor: `${member.brandColor}15` }}
                        >
                          <span 
                            className="text-3xl font-bold"
                            style={{ 
                              color: member.brandColor,
                              fontFamily: 'Helvetica LT Std, Helvetica Neue, Arial, sans-serif' 
                            }}
                          >
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>

                      {/* Floating Stats Badge */}
                      <motion.div
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={
                          inView
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0 }
                        }
                        transition={{ delay: index * 0.15 + 0.8 }}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-slate-600" />
                          <span 
                            className="text-sm font-bold"
                            style={{ color: member.brandColor }}
                          >
                            {member.experience} {locale === 'es' ? 'años' : 'years'}
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Professional Info Card */}
                    <div className="p-8">
                      <div className="mb-6">
                        <motion.h3 
                          className="text-xl font-bold text-slate-900 mb-2 group-hover:scale-105 transition-transform"
                          style={{
                            fontFamily: 'Helvetica LT Std, Helvetica Neue, Arial, sans-serif',
                          }}
                        >
                          {member.name}
                        </motion.h3>
                        <div 
                          className="font-semibold text-sm uppercase tracking-wider mb-1"
                          style={{ color: member.brandColor }}
                        >
                          {member.position}
                        </div>
                        <div className="text-slate-600 text-sm font-medium">
                          {member.department}
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 mb-6 leading-relaxed">
                        {member.bio}
                      </p>

                      {/* Professional Metrics */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                          <ReaderIcon className="h-4 w-4 text-slate-500" />
                          <span className="text-xs text-slate-600 font-medium">
                            {member.education}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <PersonIcon className="h-4 w-4 text-slate-500" />
                          <span 
                            className="text-xs font-semibold"
                            style={{ color: member.brandColor }}
                          >
                            {member.achievements}
                          </span>
                        </div>
                      </div>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {member.expertise.map((skill, skillIndex) => (
                          <Badge 
                            key={skillIndex} 
                            variant="outline" 
                            className="text-xs bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Professional Contact */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                        <div className="flex items-center gap-3">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <LinkedInLogoIcon className="h-4 w-4 text-slate-600 hover:text-blue-600" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <EnvelopeClosedIcon className="h-4 w-4 text-slate-600 hover:text-green-600" />
                          </motion.button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs font-medium hover:bg-slate-100"
                          onClick={() => setSelectedMember(selectedMember === index ? null : index)}
                        >
                          {locale === 'es' ? 'Ver más' : 'View more'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Professional Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 bg-gradient-to-r from-slate-50 to-white p-8 rounded-2xl shadow-lg"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">60+</div>
              <div className="text-sm text-slate-600 uppercase tracking-wide">
                {locale === 'es' ? 'Años Experiencia' : 'Years Experience'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">100+</div>
              <div className="text-sm text-slate-600 uppercase tracking-wide">
                {locale === 'es' ? 'Proyectos Liderados' : 'Projects Led'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">85+</div>
              <div className="text-sm text-slate-600 uppercase tracking-wide">
                {locale === 'es' ? 'Comunidades' : 'Communities'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">15+</div>
              <div className="text-sm text-slate-600 uppercase tracking-wide">
                {locale === 'es' ? 'Publicaciones' : 'Publications'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}