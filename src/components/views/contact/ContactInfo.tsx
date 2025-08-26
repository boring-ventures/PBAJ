'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  EnvelopeClosedIcon, 
  MobileIcon, 
  HomeIcon, 
  ClockIcon,
  PersonIcon
} from '@radix-ui/react-icons';

export default function ContactInfo() {
  const params = useParams();
  const locale = params.locale as string;

  const contactDetails = [
    {
      icon: EnvelopeClosedIcon,
      title: locale === 'es' ? 'Correo Electrónico' : 'Email Address',
      primary: 'info@plataformaboliviana.org',
      secondary: 'contacto@plataformaboliviana.org',
      description: locale === 'es' ? 'Respuesta en 24 horas' : '24-hour response time',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      icon: MobileIcon,
      title: locale === 'es' ? 'Teléfono de Oficina' : 'Office Phone',
      primary: '+591 (2) 234-5678',
      secondary: '+591 (2) 234-5679',
      description: locale === 'es' ? 'Lun - Vie, 9:00 - 17:00' : 'Mon - Fri, 9:00 AM - 5:00 PM',
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      icon: HomeIcon,
      title: locale === 'es' ? 'Oficina Principal' : 'Main Office',
      primary: 'Av. 16 de Julio #1234',
      secondary: 'La Paz, Bolivia',
      description: locale === 'es' ? 'Zona Central' : 'Central Zone',
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      icon: ClockIcon,
      title: locale === 'es' ? 'Horarios de Atención' : 'Office Hours',
      primary: locale === 'es' ? 'Lunes a Viernes' : 'Monday to Friday',
      secondary: '9:00 AM - 5:00 PM',
      description: locale === 'es' ? 'Hora de Bolivia (GMT-4)' : 'Bolivia Time (GMT-4)',
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    }
  ];

  const teamContacts = [
    {
      name: 'María Elena Vargas',
      position: locale === 'es' ? 'Directora Ejecutiva' : 'Executive Director',
      email: 'maria.vargas@plataformaboliviana.org',
      department: locale === 'es' ? 'Dirección General' : 'General Management'
    },
    {
      name: 'Carlos Mendoza',
      position: locale === 'es' ? 'Director de Programas' : 'Programs Director',
      email: 'carlos.mendoza@plataformaboliviana.org',
      department: locale === 'es' ? 'Desarrollo de Programas' : 'Program Development'
    },
    {
      name: 'Ana Lucía Torres',
      position: locale === 'es' ? 'Coordinadora de Comunicaciones' : 'Communications Coordinator',
      email: 'ana.torres@plataformaboliviana.org',
      department: locale === 'es' ? 'Comunicaciones y Prensa' : 'Communications & Press'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Contact Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">
            {locale === 'es' ? 'Información de Contacto' : 'Contact Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactDetails.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
                  <div className={`p-3 rounded-full ${contact.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {contact.title}
                    </h3>
                    <p className="font-medium text-foreground">
                      {contact.primary}
                    </p>
                    {contact.secondary && (
                      <p className="text-muted-foreground text-sm">
                        {contact.secondary}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {contact.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Contacts */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">
            {locale === 'es' ? 'Contactos del Equipo' : 'Team Contacts'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamContacts.map((member, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="p-2 rounded-full bg-primary/10">
                  <PersonIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {member.department}
                    </Badge>
                  </div>
                  <p className="text-primary text-sm font-medium mb-1">
                    {member.position}
                  </p>
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-yellow-200">
              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-700" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">
                {locale === 'es' ? 'Contacto de Emergencia' : 'Emergency Contact'}
              </h3>
              <p className="text-yellow-700 text-sm mb-2">
                {locale === 'es' 
                  ? 'Para asuntos urgentes fuera del horario de oficina:'
                  : 'For urgent matters outside office hours:'
                }
              </p>
              <p className="font-medium text-yellow-800">
                {locale === 'es' ? 'Teléfono de Emergencia:' : 'Emergency Phone:'} +591 7 123-4567
              </p>
              <p className="text-yellow-700 text-xs mt-1">
                {locale === 'es' 
                  ? 'Disponible 24/7 solo para emergencias'
                  : 'Available 24/7 for emergencies only'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExclamationTriangleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="m12 17 .01 0" />
    </svg>
  );
}