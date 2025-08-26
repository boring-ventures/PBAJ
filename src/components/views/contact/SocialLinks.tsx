'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

export default function SocialLinks() {
  const params = useParams();
  const locale = params.locale as string;

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: '📘',
      url: 'https://facebook.com/plataformaboliviana',
      handle: '@plataformaboliviana',
      description: locale === 'es' 
        ? 'Síguenos para noticias y actualizaciones diarias'
        : 'Follow us for daily news and updates',
      followers: '15.2K',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: 'https://twitter.com/plataformaboliviana',
      handle: '@plataformaboliviana',
      description: locale === 'es' 
        ? 'Únete a las conversaciones sobre desarrollo social'
        : 'Join conversations about social development',
      followers: '8.7K',
      color: 'bg-sky-50 border-sky-200 hover:bg-sky-100'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: 'https://linkedin.com/company/plataforma-boliviana',
      handle: 'Plataforma Boliviana',
      description: locale === 'es' 
        ? 'Conecta con profesionales y oportunidades'
        : 'Connect with professionals and opportunities',
      followers: '3.1K',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      name: 'Instagram',
      icon: '📷',
      url: 'https://instagram.com/plataformaboliviana',
      handle: '@plataformaboliviana',
      description: locale === 'es' 
        ? 'Descubre historias visuales de nuestro trabajo'
        : 'Discover visual stories of our work',
      followers: '5.3K',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
    },
    {
      name: 'YouTube',
      icon: '🎥',
      url: 'https://youtube.com/@plataformaboliviana',
      handle: '@plataformaboliviana',
      description: locale === 'es' 
        ? 'Videos educativos y documentales'
        : 'Educational videos and documentaries',
      followers: '2.8K',
      color: 'bg-red-50 border-red-200 hover:bg-red-100'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: 'https://wa.me/59172345678',
      handle: '+591 7 234-5678',
      description: locale === 'es' 
        ? 'Contacto directo para consultas urgentes'
        : 'Direct contact for urgent inquiries',
      followers: locale === 'es' ? 'Activo' : 'Active',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    }
  ];

  const newsletterInfo = {
    subscribers: '12.5K',
    frequency: locale === 'es' ? 'Semanal' : 'Weekly',
    description: locale === 'es' 
      ? 'Recibe nuestro boletín con noticias, eventos y oportunidades'
      : 'Get our newsletter with news, events and opportunities'
  };

  return (
    <div className="space-y-8">
      {/* Social Media Links */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">
            {locale === 'es' ? 'Síguenos en Redes Sociales' : 'Follow Us on Social Media'}
          </CardTitle>
          <p className="text-muted-foreground">
            {locale === 'es' 
              ? 'Mantente conectado y al día con todas nuestras actividades'
              : 'Stay connected and up to date with all our activities'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map((platform, index) => (
              <div key={index} className={`p-4 rounded-lg border transition-colors ${platform.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {platform.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {platform.handle}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {platform.followers}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {platform.description}
                </p>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(platform.url, '_blank')}
                >
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  {locale === 'es' ? 'Visitar' : 'Visit'} {platform.name}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Subscription */}
      <Card className="shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">
            {locale === 'es' ? 'Boletín Informativo' : 'Newsletter'}
          </CardTitle>
          <p className="text-muted-foreground">
            {newsletterInfo.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {newsletterInfo.subscribers}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'es' ? 'Suscriptores' : 'Subscribers'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {newsletterInfo.frequency}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'es' ? 'Frecuencia' : 'Frequency'}
                </div>
              </div>
            </div>
            <div className="text-4xl">📧</div>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full"
              onClick={() => {
                // In a real implementation, this would open a newsletter subscription modal
                alert(locale === 'es' ? 'Función de suscripción próximamente disponible' : 'Subscription feature coming soon');
              }}
            >
              {locale === 'es' ? 'Suscribirse al Boletín' : 'Subscribe to Newsletter'}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              {locale === 'es' 
                ? 'Puedes cancelar tu suscripción en cualquier momento. Respetamos tu privacidad.'
                : 'You can unsubscribe at any time. We respect your privacy.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Preferences */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl">🔔</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {locale === 'es' ? 'Preferencias de Comunicación' : 'Communication Preferences'}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {locale === 'es' 
                  ? 'Elige cómo te gustaría recibir actualizaciones de Plataforma Boliviana'
                  : 'Choose how you\'d like to receive updates from Plataforma Boliviana'
                }
              </p>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  alert(locale === 'es' ? 'Panel de preferencias próximamente disponible' : 'Preferences panel coming soon');
                }}
              >
                {locale === 'es' ? 'Configurar Preferencias' : 'Set Preferences'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}