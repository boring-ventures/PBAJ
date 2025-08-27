import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  FileText, 
  FolderOpen, 
  Image, 
  Users, 
  TrendingUp,
  Eye,
  Calendar
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Panel principal de administración con estadísticas y resumen del contenido',
};

// Mock data - En producción esto vendría de la API
const dashboardStats = {
  content: {
    news: { total: 45, published: 32, draft: 13, thisMonth: 8 },
    programs: { total: 12, active: 8, completed: 4, thisMonth: 2 },
    publications: { total: 28, published: 25, pending: 3, thisMonth: 5 },
    media: { total: 156, images: 120, documents: 36, thisMonth: 15 }
  },
  analytics: {
    pageViews: 12543,
    uniqueVisitors: 3241,
    bounceRate: 32.5,
    avgSessionDuration: '3:42'
  }
};

const recentActivity = [
  { type: 'news', title: 'Nueva noticia sobre educación', action: 'publicado', date: '2024-01-15', author: 'María García' },
  { type: 'program', title: 'Programa de Desarrollo Rural', action: 'actualizado', date: '2024-01-14', author: 'Carlos López' },
  { type: 'publication', title: 'Informe Anual 2023', action: 'subido', date: '2024-01-13', author: 'Ana Rodríguez' },
  { type: 'media', title: '5 imágenes nuevas', action: 'subido', date: '2024-01-12', author: 'Juan Pérez' },
];

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = 'up' 
}: { 
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
          <p className={`text-xs flex items-center gap-1 ${
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

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
          <p className="text-muted-foreground">
            Resumen general del contenido y estadísticas del sitio web
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Noticias Publicadas"
          value={dashboardStats.content.news.published}
          change={`+${dashboardStats.content.news.thisMonth} este mes`}
          icon={FileText}
          trend="up"
        />
        <StatCard
          title="Programas Activos"
          value={dashboardStats.content.programs.active}
          change={`+${dashboardStats.content.programs.thisMonth} este mes`}
          icon={FolderOpen}
          trend="up"
        />
        <StatCard
          title="Publicaciones"
          value={dashboardStats.content.publications.published}
          change={`+${dashboardStats.content.publications.thisMonth} este mes`}
          icon={FileText}
          trend="up"
        />
        <StatCard
          title="Archivos de Media"
          value={dashboardStats.content.media.total}
          change={`+${dashboardStats.content.media.thisMonth} este mes`}
          icon={Image}
          trend="up"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Activity */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>
                  Últimas acciones realizadas en el CMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'news' ? 'bg-blue-500' :
                      activity.type === 'program' ? 'bg-green-500' :
                      activity.type === 'publication' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action} por {activity.author} • {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estadísticas Rápidas
                </CardTitle>
                <CardDescription>
                  Métricas del sitio web este mes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Vistas de página</span>
                  <Badge variant="secondary">{dashboardStats.analytics.pageViews.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Visitantes únicos</span>
                  <Badge variant="secondary">{dashboardStats.analytics.uniqueVisitors.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tasa de rebote</span>
                  <Badge variant="secondary">{dashboardStats.analytics.bounceRate}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Duración promedio</span>
                  <Badge variant="secondary">{dashboardStats.analytics.avgSessionDuration}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Noticias & Campañas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <Badge>{dashboardStats.content.news.total}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Publicadas:</span>
                    <Badge variant="secondary">{dashboardStats.content.news.published}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Borradores:</span>
                    <Badge variant="outline">{dashboardStats.content.news.draft}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Programas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <Badge>{dashboardStats.content.programs.total}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Activos:</span>
                    <Badge variant="secondary">{dashboardStats.content.programs.active}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Completados:</span>
                    <Badge variant="outline">{dashboardStats.content.programs.completed}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Biblioteca Digital</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <Badge>{dashboardStats.content.publications.total}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Publicadas:</span>
                    <Badge variant="secondary">{dashboardStats.content.publications.published}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pendientes:</span>
                    <Badge variant="outline">{dashboardStats.content.publications.pending}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Páginas Vistas"
              value={dashboardStats.analytics.pageViews.toLocaleString()}
              change="+12% vs mes anterior"
              icon={Eye}
              trend="up"
            />
            <StatCard
              title="Visitantes Únicos"
              value={dashboardStats.analytics.uniqueVisitors.toLocaleString()}
              change="+8% vs mes anterior"
              icon={Users}
              trend="up"
            />
            <StatCard
              title="Tasa de Rebote"
              value={`${dashboardStats.analytics.bounceRate}%`}
              change="-5% vs mes anterior"
              icon={TrendingUp}
              trend="up"
            />
            <StatCard
              title="Duración Promedio"
              value={dashboardStats.analytics.avgSessionDuration}
              change="+15s vs mes anterior"
              icon={Calendar}
              trend="up"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}