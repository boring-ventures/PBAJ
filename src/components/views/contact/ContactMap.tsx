'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLinkIcon, 
  CursorArrowIcon, 
  HomeIcon,
  GlobeIcon
} from '@radix-ui/react-icons';

export default function ContactMap() {
  const params = useParams();
  const locale = params.locale as string;

  // Office location coordinates
  const officeLocation = {
    lat: -16.500000,
    lng: -68.150000,
    address: 'Av. 16 de Julio #1234, La Paz, Bolivia',
    zone: locale === 'es' ? 'Zona Central' : 'Central Zone'
  };

  const handleOpenMaps = () => {
    const googleMapsUrl = `https://maps.google.com/?q=${officeLocation.lat},${officeLocation.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleGetDirections = () => {
    const directionsUrl = `https://maps.google.com/dir/?api=1&destination=${officeLocation.lat},${officeLocation.lng}`;
    window.open(directionsUrl, '_blank');
  };

  const publicTransportOptions = [
    {
      type: locale === 'es' ? 'Minibús' : 'Minibus',
      routes: ['2', '7', '12', '16'],
      description: locale === 'es' 
        ? 'Parada frente al edificio principal'
        : 'Stop in front of main building'
    },
    {
      type: locale === 'es' ? 'Micro' : 'Bus',
      routes: ['101', '102', '273'],
      description: locale === 'es' 
        ? 'Parada a 2 cuadras (Plaza del Estudiante)'
        : 'Stop 2 blocks away (Plaza del Estudiante)'
    },
    {
      type: locale === 'es' ? 'Teleférico' : 'Cable Car',
      routes: [locale === 'es' ? 'Línea Amarilla' : 'Yellow Line'],
      description: locale === 'es' 
        ? 'Estación Plaza del Estudiante (5 min caminando)'
        : 'Plaza del Estudiante Station (5 min walk)'
    }
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground">
              {locale === 'es' ? 'Nuestra Ubicación' : 'Our Location'}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {locale === 'es' ? 'La Paz, Bolivia' : 'La Paz, Bolivia'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Map Links */}
          <div className="text-center mb-6 p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <GlobeIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {locale === 'es' ? 'Ver Ubicación en Mapa' : 'View Location on Map'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {locale === 'es' 
                ? 'Accede a nuestro mapa de ubicación en Google Maps'
                : 'Access our location map on Google Maps'
              }
            </p>
            
            {/* Map Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                onClick={handleOpenMaps} 
                variant="default" 
                size="sm"
                className="flex items-center gap-2"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                {locale === 'es' ? 'Abrir en Google Maps' : 'Open in Google Maps'}
              </Button>
              <Button 
                onClick={handleGetDirections} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <CursorArrowIcon className="h-4 w-4" />
                {locale === 'es' ? 'Cómo Llegar' : 'Get Directions'}
              </Button>
            </div>
          </div>

          {/* Address Information */}
          <div className="border rounded-lg p-4 bg-card mb-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <HomeIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {locale === 'es' ? 'Dirección Completa' : 'Full Address'}
                </h3>
                <p className="text-foreground font-medium">
                  {officeLocation.address}
                </p>
                <p className="text-muted-foreground text-sm">
                  {officeLocation.zone}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {locale === 'es' 
                    ? 'Edificio moderno con acceso para personas con discapacidad'
                    : 'Modern building with wheelchair accessibility'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Public Transportation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {locale === 'es' ? 'Transporte Público' : 'Public Transportation'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {publicTransportOptions.map((transport, index) => (
                <div key={index} className="border rounded-lg p-4 bg-card">
                  <h4 className="font-medium text-foreground mb-2">
                    {transport.type}
                  </h4>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {transport.routes.map((route, routeIndex) => (
                      <Badge key={routeIndex} variant="secondary" className="text-xs">
                        {route}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {transport.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Parking Information */}
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">
              {locale === 'es' ? 'Información de Estacionamiento' : 'Parking Information'}
            </h4>
            <div className="text-blue-700 text-sm space-y-1">
              <p>
                {locale === 'es' 
                  ? '• Estacionamiento gratuito disponible (espacios limitados)'
                  : '• Free parking available (limited spaces)'
                }
              </p>
              <p>
                {locale === 'es' 
                  ? '• Estacionamiento público pagado a 1 cuadra'
                  : '• Paid public parking 1 block away'
                }
              </p>
              <p>
                {locale === 'es' 
                  ? '• Se recomienda usar transporte público'
                  : '• Public transportation recommended'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}