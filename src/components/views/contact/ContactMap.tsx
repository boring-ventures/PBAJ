'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLinkIcon, 
  NavigationIcon, 
  HomeIcon,
  MapIcon
} from '@radix-ui/react-icons';

export default function ContactMap() {
  const params = useParams();
  const locale = params.locale as string;
  const [mapLoaded, setMapLoaded] = useState(false);

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
          {/* Map Container */}
          <div className="relative mb-6">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted border">
              {!mapLoaded ? (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-100 to-slate-200">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <MapIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {locale === 'es' ? 'Mapa Interactivo' : 'Interactive Map'}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {locale === 'es' 
                          ? 'Haz clic para cargar el mapa de Google Maps'
                          : 'Click to load Google Maps'
                        }
                      </p>
                      <Button 
                        onClick={() => setMapLoaded(true)} 
                        variant="outline"
                        size="sm"
                      >
                        {locale === 'es' ? 'Cargar Mapa' : 'Load Map'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.4097887077885!2d-68.15000008475346!3d-16.5000000888398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDMwJzAwLjAiUyA2OMKwMDknMDAuMCJX!5e0!3m2!1sen!2sbo!4v1620000000000!5m2!1sen!2sbo`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={locale === 'es' ? 'Ubicación de Plataforma Boliviana' : 'Plataforma Boliviana Location'}
                />
              )}
            </div>

            {/* Map Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
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
                <NavigationIcon className="h-4 w-4" />
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