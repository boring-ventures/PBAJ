import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Database,
  Bell,
  Palette,
  Save
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Configuración del Sistema',
  description: 'Configuraciones generales del sitio web y CMS',
};

export default function SystemSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
          <p className="text-muted-foreground">
            Administra las configuraciones generales del sitio web y CMS
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="localization">Localización</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Site Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Información del Sitio
                </CardTitle>
                <CardDescription>
                  Configuración básica del sitio web
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Nombre del Sitio</Label>
                  <Input 
                    id="site-name" 
                    defaultValue="Plataforma Boliviana"
                    placeholder="Nombre del sitio web"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Descripción</Label>
                  <Textarea 
                    id="site-description"
                    defaultValue="Construyendo un futuro más justo e inclusivo"
                    placeholder="Descripción del sitio web"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-url">URL del Sitio</Label>
                  <Input 
                    id="site-url"
                    defaultValue="https://plataformaboliviana.org"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="site-active" defaultChecked />
                  <Label htmlFor="site-active">Sitio activo</Label>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Información de Contacto
                </CardTitle>
                <CardDescription>
                  Detalles de contacto de la organización
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email Principal</Label>
                  <Input 
                    id="contact-email"
                    type="email"
                    defaultValue="info@plataformaboliviana.org"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Teléfono</Label>
                  <Input 
                    id="contact-phone"
                    defaultValue="+591 2 123-4567"
                    placeholder="+591 X XXXX-XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-address">Dirección</Label>
                  <Textarea 
                    id="contact-address"
                    defaultValue="La Paz, Bolivia"
                    placeholder="Dirección física"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social-media">Redes Sociales</Label>
                  <Input 
                    id="social-facebook"
                    className="mb-2"
                    defaultValue="https://facebook.com/plataformaboliviana"
                    placeholder="Facebook URL"
                  />
                  <Input 
                    id="social-twitter"
                    defaultValue="https://twitter.com/plataformabo"
                    placeholder="Twitter/X URL"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuración de Idiomas
              </CardTitle>
              <CardDescription>
                Gestiona los idiomas disponibles en el sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Idioma Principal</Label>
                  <p className="text-sm text-muted-foreground">
                    Idioma por defecto del sitio web
                  </p>
                </div>
                <Badge variant="secondary">Español</Badge>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-base font-medium">Idiomas Activos</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Idiomas disponibles para el contenido
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🇪🇸</span>
                      <div>
                        <p className="font-medium">Español</p>
                        <p className="text-sm text-muted-foreground">es</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🇺🇸</span>
                      <div>
                        <p className="font-medium">English</p>
                        <p className="text-sm text-muted-foreground">en</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>
                Gestiona cómo y cuándo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibir notificaciones importantes por correo
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Nuevo Contenido</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando se publique nuevo contenido
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Comentarios</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre nuevos comentarios
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Actualizaciones del Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre actualizaciones importantes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>
                Configuraciones de seguridad y acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Autenticación de Dos Factores</Label>
                    <p className="text-sm text-muted-foreground">
                      Requerir 2FA para administradores
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Sesiones Limitadas</Label>
                    <p className="text-sm text-muted-foreground">
                      Límite de sesiones simultáneas por usuario
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                  <Input 
                    id="session-timeout"
                    type="number"
                    defaultValue="120"
                    placeholder="120"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowed-domains">Dominios Permitidos para CORS</Label>
                  <Textarea 
                    id="allowed-domains"
                    defaultValue="plataformaboliviana.org"
                    placeholder="ejemplo.com, *.ejemplo.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Información del Sistema
              </CardTitle>
              <CardDescription>
                Estado actual del sistema y configuraciones técnicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Versión del Sistema</Label>
                  <div className="text-lg font-mono">v1.0.0</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Base de Datos</Label>
                  <div className="text-lg font-mono">PostgreSQL</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Servidor</Label>
                  <div className="text-lg font-mono">Vercel</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                  <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Modo de Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilitar página de mantenimiento para el sitio público
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Logs de Debug</Label>
                    <p className="text-sm text-muted-foreground">
                      Activar logs detallados para debugging
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}