import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Calendar
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analíticas',
  description: 'Estadísticas detalladas del sitio web y engagement de contenido',
};

// Mock analytics data
const analyticsData = {
  overview: {
    totalVisitors: 15234,
    pageViews: 45678,
    bounceRate: 34.5,
    avgSessionDuration: 245, // seconds
    topPages: [
      { path: '/', views: 12345, title: 'Página Principal' },
      { path: '/programs', views: 8756, title: 'Programas' },
      { path: '/news', views: 6543, title: 'Noticias' },
      { path: '/library', views: 4321, title: 'Biblioteca Digital' },
    ],
    deviceStats: {
      desktop: 45,
      mobile: 35,
      tablet: 20
    },
    trafficSources: {
      direct: 40,
      search: 30,
      social: 20,
      referral: 10
    }
  },
  content: {
    mostViewedNews: [
      { title: 'Nueva iniciativa educativa', views: 2456, publishDate: '2024-01-15' },
      { title: 'Programa de desarrollo rural', views: 1876, publishDate: '2024-01-10' },
      { title: 'Campaña de salud preventiva', views: 1543, publishDate: '2024-01-08' }
    ],
    mostDownloadedDocs: [
      { title: 'Informe Anual 2023', downloads: 1234, publishDate: '2024-01-15' },
      { title: 'Guía de Buenas Prácticas', downloads: 856, publishDate: '2023-12-20' },
      { title: 'Manual de Gestión', downloads: 654, publishDate: '2023-11-30' }
    ]
  }
};

function StatCard({ title, value, change, icon: Icon, trend = 'up' }: { 
  title: string; 
  value: string | number; 
  change?: string; 
  icon: any; 
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs flex items-center gap-1 mt-1 ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-muted-foreground'
          }`}>
            {trend === 'up' && <TrendingUp className="h-3 w-3" />}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Analytics() {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analíticas</h1>
          <p className="text-muted-foreground">
            Estadísticas detalladas del sitio web y engagement de contenido
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Visitantes Únicos"
          value={analyticsData.overview.totalVisitors.toLocaleString()}
          change="+12% vs mes anterior"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Vistas de Página"
          value={analyticsData.overview.pageViews.toLocaleString()}
          change="+8% vs mes anterior"
          icon={Eye}
          trend="up"
        />
        <StatCard
          title="Tasa de Rebote"
          value={`${analyticsData.overview.bounceRate}%`}
          change="-2% vs mes anterior"
          icon={BarChart3}
          trend="up"
        />
        <StatCard
          title="Duración Promedio"
          value={formatDuration(analyticsData.overview.avgSessionDuration)}
          change="+15s vs mes anterior"
          icon={Clock}
          trend="up"
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="audience">Audiencia</TabsTrigger>
          <TabsTrigger value="traffic">Tráfico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Páginas Más Visitadas
                </CardTitle>
                <CardDescription>Top 5 páginas por vistas este mes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.overview.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{page.title}</p>
                      <p className="text-xs text-muted-foreground">{page.path}</p>
                    </div>
                    <Badge variant="secondary">{page.views.toLocaleString()}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Device Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Dispositivos
                </CardTitle>
                <CardDescription>Distribución por tipo de dispositivo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Escritorio</span>
                  </div>
                  <Badge variant="secondary">{analyticsData.overview.deviceStats.desktop}%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Móvil</span>
                  </div>
                  <Badge variant="secondary">{analyticsData.overview.deviceStats.mobile}%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Tablet</span>
                  </div>
                  <Badge variant="secondary">{analyticsData.overview.deviceStats.tablet}%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Most Viewed News */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Noticias Más Vistas
                </CardTitle>
                <CardDescription>Contenido con mayor engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.content.mostViewedNews.map((news, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{news.title}</p>
                      <Badge>{news.views.toLocaleString()}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Publicado: {new Date(news.publishDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Most Downloaded Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Documentos Más Descargados
                </CardTitle>
                <CardDescription>Publicaciones con más descargas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.content.mostDownloadedDocs.map((doc, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{doc.title}</p>
                      <Badge variant="secondary">{doc.downloads.toLocaleString()}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Publicado: {new Date(doc.publishDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Información de Audiencia
              </CardTitle>
              <CardDescription>Próximamente: Datos demográficos y de comportamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Esta sección estará disponible cuando se implemente Google Analytics
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Fuentes de Tráfico
              </CardTitle>
              <CardDescription>De dónde vienen los visitantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Directo</span>
                <Badge variant="secondary">{analyticsData.overview.trafficSources.direct}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Búsquedas orgánicas</span>
                <Badge variant="secondary">{analyticsData.overview.trafficSources.search}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Redes sociales</span>
                <Badge variant="secondary">{analyticsData.overview.trafficSources.social}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Referidos</span>
                <Badge variant="secondary">{analyticsData.overview.trafficSources.referral}%</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}