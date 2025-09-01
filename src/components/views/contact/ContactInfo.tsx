'use client';

import { useParams } from 'next/navigation';
import { 
  EnvelopeClosedIcon, 
  MobileIcon, 
  HomeIcon, 
  ClockIcon
} from '@radix-ui/react-icons';

export default function ContactInfo() {
  const params = useParams();
  const locale = params.locale as string;

  const contactDetails = [
    {
      icon: EnvelopeClosedIcon,
      title: locale === 'es' ? 'Email' : 'Email',
      primary: 'info@plataformaboliviana.org',
      description: locale === 'es' ? 'Respuesta en 24 horas' : '24-hour response'
    },
    {
      icon: MobileIcon,
      title: locale === 'es' ? 'Teléfono' : 'Phone',
      primary: '+591 (2) 234-5678',
      description: locale === 'es' ? 'Lun - Vie, 9:00 - 17:00' : 'Mon - Fri, 9:00 - 17:00'
    },
    {
      icon: HomeIcon,
      title: locale === 'es' ? 'Dirección' : 'Address',
      primary: 'Av. 16 de Julio #1234',
      secondary: 'La Paz, Bolivia',
      description: locale === 'es' ? 'Zona Central' : 'Central Zone'
    },
    {
      icon: ClockIcon,
      title: locale === 'es' ? 'Horarios' : 'Hours',
      primary: locale === 'es' ? 'Lunes a Viernes' : 'Monday to Friday',
      secondary: '9:00 AM - 5:00 PM',
      description: locale === 'es' ? 'GMT-4' : 'GMT-4'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {locale === 'es' ? 'Información de Contacto' : 'Contact Information'}
      </h3>
      
      <div className="space-y-6">
        {contactDetails.map((contact, index) => {
          const IconComponent = contact.icon;
          return (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <IconComponent className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {contact.title}
                </h4>
                <p className="text-gray-800 font-medium">
                  {contact.primary}
                </p>
                {contact.secondary && (
                  <p className="text-gray-600 text-sm">
                    {contact.secondary}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {contact.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Contact Note */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          {locale === 'es' 
            ? '💬 También puedes contactarnos a través de nuestras redes sociales para una respuesta más rápida.'
            : '💬 You can also contact us through our social media for a faster response.'
          }
        </p>
      </div>
    </div>
  );
}

