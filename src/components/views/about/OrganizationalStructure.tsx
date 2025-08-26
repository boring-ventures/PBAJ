'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OrganizationalStructure() {
  const params = useParams();
  const locale = params.locale as string;

  const structure = [
    {
      level: 1,
      title: locale === 'es' ? 'Asamblea General' : 'General Assembly',
      description: locale === 'es' 
        ? 'Órgano máximo de decisión compuesto por todos los miembros de la organización'
        : 'Maximum decision-making body composed of all organization members',
      members: 25,
      color: 'bg-blue-500'
    },
    {
      level: 2,
      title: locale === 'es' ? 'Directorio' : 'Board of Directors',
      description: locale === 'es'
        ? 'Órgano de gobierno elegido por la Asamblea General para períodos de 3 años'
        : 'Governing body elected by the General Assembly for 3-year terms',
      members: 7,
      color: 'bg-green-500'
    },
    {
      level: 3,
      title: locale === 'es' ? 'Dirección Ejecutiva' : 'Executive Management',
      description: locale === 'es'
        ? 'Responsable de la implementación de las decisiones y gestión operativa'
        : 'Responsible for implementing decisions and operational management',
      members: 1,
      color: 'bg-purple-500'
    },
    {
      level: 4,
      title: locale === 'es' ? 'Coordinaciones' : 'Coordinations',
      description: locale === 'es'
        ? 'Áreas especializadas: Programas, Investigación, Comunicación, Administración'
        : 'Specialized areas: Programs, Research, Communication, Administration',
      members: 4,
      color: 'bg-orange-500'
    },
    {
      level: 5,
      title: locale === 'es' ? 'Equipos Territoriales' : 'Territorial Teams',
      description: locale === 'es'
        ? 'Equipos regionales en cada departamento donde operamos'
        : 'Regional teams in each department where we operate',
      members: 45,
      color: 'bg-cyan-500'
    }
  ];

  const committees = [
    {
      name: locale === 'es' ? 'Comité de Ética' : 'Ethics Committee',
      purpose: locale === 'es' 
        ? 'Supervisa el cumplimiento de principios éticos y resolución de conflictos'
        : 'Oversees compliance with ethical principles and conflict resolution',
      members: 5
    },
    {
      name: locale === 'es' ? 'Comité de Auditoría' : 'Audit Committee',
      purpose: locale === 'es'
        ? 'Garantiza la transparencia financiera y el uso adecuado de recursos'
        : 'Ensures financial transparency and proper use of resources',
      members: 3
    },
    {
      name: locale === 'es' ? 'Comité Técnico' : 'Technical Committee',
      purpose: locale === 'es'
        ? 'Asesora en la formulación y evaluación de programas y proyectos'
        : 'Advises on program and project formulation and evaluation',
      members: 7
    }
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {locale === 'es' ? 'Estructura Organizacional' : 'Organizational Structure'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Organización democrática y participativa que garantiza la toma de decisiones transparente'
              : 'Democratic and participatory organization that ensures transparent decision-making'
            }
          </p>
        </div>

        {/* Organizational Hierarchy */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
            {locale === 'es' ? 'Jerarquía Institucional' : 'Institutional Hierarchy'}
          </h3>
          
          <div className="space-y-6">
            {structure.map((level, index) => (
              <div key={index} className="relative">
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Level indicator */}
                      <div className={`w-12 h-12 rounded-full ${level.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                        {level.level}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {level.title}
                          </h4>
                          <Badge variant="secondary">
                            {level.members} {locale === 'es' ? 'miembros' : 'members'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          {level.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Connector line */}
                {index < structure.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-0.5 h-6 bg-primary/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specialized Committees */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
            {locale === 'es' ? 'Comités Especializados' : 'Specialized Committees'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees.map((committee, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {committee.name}
                  </h4>
                  <Badge variant="outline" className="w-fit">
                    {committee.members} {locale === 'es' ? 'integrantes' : 'members'}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {committee.purpose}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Governance Principles */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-6">
            {locale === 'es' ? 'Principios de Gobernanza' : 'Governance Principles'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: locale === 'es' ? 'Participación' : 'Participation',
                description: locale === 'es' ? 'Todos los niveles participan en decisiones' : 'All levels participate in decisions'
              },
              {
                title: locale === 'es' ? 'Transparencia' : 'Transparency',
                description: locale === 'es' ? 'Procesos abiertos y accesibles' : 'Open and accessible processes'
              },
              {
                title: locale === 'es' ? 'Responsabilidad' : 'Accountability',
                description: locale === 'es' ? 'Rendición de cuentas permanente' : 'Permanent accountability'
              },
              {
                title: locale === 'es' ? 'Eficacia' : 'Effectiveness',
                description: locale === 'es' ? 'Resultados medibles y sostenibles' : 'Measurable and sustainable results'
              }
            ].map((principle, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {principle.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}