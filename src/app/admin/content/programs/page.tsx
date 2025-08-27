import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, FolderOpen, Calendar, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gestión de Programas',
  description: 'Administrar programas y proyectos de la organización',
};

// Mock data - En producción esto vendría de la API
const programs = [
  {
    id: 1,
    title_es: 'Programa de Desarrollo Rural Sostenible',
    title_en: 'Sustainable Rural Development Program',
    type: 'DEVELOPMENT',
    status: 'ACTIVE',
    progress: 65,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 150000,
    region: 'Altiplano Norte',
    manager: 'María García'
  },
  {
    id: 2,
    title_es: 'Educación Digital para Comunidades',
    title_en: 'Digital Education for Communities',
    type: 'EDUCATION',
    status: 'PLANNING',
    progress: 15,
    startDate: '2024-03-01',
    endDate: '2024-11-30',
    budget: 85000,
    region: 'Cochabamba',
    manager: 'Carlos López'
  },
  {
    id: 3,
    title_es: 'Fortalecimiento de Salud Comunitaria',
    title_en: 'Community Health Strengthening',
    type: 'HEALTH',
    status: 'COMPLETED',
    progress: 100,
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    budget: 120000,
    region: 'Santa Cruz',
    manager: 'Ana Rodríguez'
  }
];

const programTypes = ['TODOS', 'DEVELOPMENT', 'EDUCATION', 'HEALTH', 'ENVIRONMENT', 'CULTURE'];
const statuses = ['TODOS', 'PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'];

function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>;
    case 'PLANNING':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Planificación</Badge>;
    case 'COMPLETED':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Completado</Badge>;
    case 'PAUSED':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pausado</Badge>;
    case 'CANCELLED':
      return <Badge variant="destructive">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getTypeBadge(type: string) {
  const colors = {
    DEVELOPMENT: 'bg-purple-100 text-purple-800',
    EDUCATION: 'bg-blue-100 text-blue-800',
    HEALTH: 'bg-red-100 text-red-800',
    ENVIRONMENT: 'bg-emerald-100 text-emerald-800',
    CULTURE: 'bg-orange-100 text-orange-800'
  };
  
  return (
    <Badge className={`${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'} hover:${colors[type as keyof typeof colors] || 'bg-gray-100'}`}>
      {type}
    </Badge>
  );
}

export default function ProgramsManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Programas</h1>
          <p className="text-muted-foreground">
            Administra programas y proyectos de la organización
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Programa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Programas</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.length}</div>
            <p className="text-xs text-muted-foreground">
              En diferentes etapas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {programs.filter(p => p.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              En ejecución
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {programs.filter(p => p.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Finalizados exitosamente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${programs.reduce((acc, p) => acc + p.budget, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              USD
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar programas..." className="pl-8" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Tipo
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {programTypes.map((type) => (
              <DropdownMenuItem key={type}>{type}</DropdownMenuItem>
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

      {/* Programs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Programas</CardTitle>
          <CardDescription>
            Gestiona todos los programas y proyectos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Programa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Región</TableHead>
                <TableHead>Gestor</TableHead>
                <TableHead>Presupuesto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div>{program.title_es}</div>
                      <div className="text-sm text-muted-foreground">
                        {program.title_en}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(program.startDate).toLocaleDateString('es-ES')} - {new Date(program.endDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(program.type)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(program.status)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="w-[100px]" />
                    </div>
                  </TableCell>
                  <TableCell>{program.region}</TableCell>
                  <TableCell>{program.manager}</TableCell>
                  <TableCell>${program.budget.toLocaleString()}</TableCell>
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
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Cronograma
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