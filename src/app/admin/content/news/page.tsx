import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gestión de Noticias',
  description: 'Administrar noticias y campañas del sitio web',
};

// Mock data - En producción esto vendría de la API
const newsItems = [
  {
    id: 1,
    title_es: 'Nueva iniciativa educativa en comunidades rurales',
    title_en: 'New educational initiative in rural communities',
    category: 'EDUCATION',
    status: 'PUBLISHED',
    featured: true,
    publishDate: '2024-01-15',
    author: 'María García',
    views: 1234
  },
  {
    id: 2,
    title_es: 'Programa de desarrollo económico local',
    title_en: 'Local economic development program',
    category: 'ECONOMY',
    status: 'DRAFT',
    featured: false,
    publishDate: null,
    author: 'Carlos López',
    views: 0
  },
  {
    id: 3,
    title_es: 'Campaña de salud preventiva 2024',
    title_en: 'Preventive health campaign 2024',
    category: 'HEALTH',
    status: 'SCHEDULED',
    featured: true,
    publishDate: '2024-02-01',
    author: 'Ana Rodríguez',
    views: 567
  }
];

const categories = ['TODOS', 'EDUCATION', 'HEALTH', 'ECONOMY', 'ENVIRONMENT', 'CULTURE'];
const statuses = ['TODOS', 'PUBLISHED', 'DRAFT', 'SCHEDULED', 'ARCHIVED'];

function getStatusBadge(status: string) {
  switch (status) {
    case 'PUBLISHED':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Publicado</Badge>;
    case 'DRAFT':
      return <Badge variant="secondary">Borrador</Badge>;
    case 'SCHEDULED':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Programado</Badge>;
    case 'ARCHIVED':
      return <Badge variant="outline">Archivado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getCategoryBadge(category: string) {
  const colors = {
    EDUCATION: 'bg-purple-100 text-purple-800',
    HEALTH: 'bg-red-100 text-red-800',
    ECONOMY: 'bg-green-100 text-green-800',
    ENVIRONMENT: 'bg-emerald-100 text-emerald-800',
    CULTURE: 'bg-orange-100 text-orange-800'
  };
  
  return (
    <Badge className={`${colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'} hover:${colors[category as keyof typeof colors] || 'bg-gray-100'}`}>
      {category}
    </Badge>
  );
}

export default function NewsManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Noticias</h1>
          <p className="text-muted-foreground">
            Administra noticias, comunicados y campañas del sitio web
          </p>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/admin/content/news/new">
            <Plus className="h-4 w-4" />
            Nueva Noticia
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Noticias</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsItems.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde la semana pasada
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newsItems.filter(item => item.status === 'PUBLISHED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              67% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newsItems.filter(item => item.status === 'DRAFT').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pendientes de revisión
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vistas Totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newsItems.reduce((acc, item) => acc + item.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar noticias..." className="pl-8" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Categoría
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categories.map((category) => (
              <DropdownMenuItem key={category}>{category}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Estado
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statuses.map((status) => (
              <DropdownMenuItem key={status}>{status}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* News Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Noticias</CardTitle>
          <CardDescription>
            Gestiona todas las noticias y comunicados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vistas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.title_es}
                        {item.featured && (
                          <Badge variant="secondary" className="text-xs">Destacado</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.title_en}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(item.category)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    {item.publishDate ? new Date(item.publishDate).toLocaleDateString('es-ES') : '-'}
                  </TableCell>
                  <TableCell>{item.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}