import { Metadata } from 'next';
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
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, FileText, Download, Upload } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Biblioteca Digital',
  description: 'Gestionar publicaciones y documentos de la biblioteca digital',
};

// Mock data - En producción esto vendría de la API
const publications = [
  {
    id: 1,
    title_es: 'Informe Anual de Desarrollo Sostenible 2023',
    title_en: 'Annual Sustainable Development Report 2023',
    type: 'REPORT',
    status: 'PUBLISHED',
    featured: true,
    fileName: 'informe-anual-2023.pdf',
    fileSize: '2.1 MB',
    downloads: 1234,
    publishDate: '2024-01-15',
    author: 'Equipo de Investigación',
    tags: ['desarrollo', 'sostenibilidad', 'bolivia']
  },
  {
    id: 2,
    title_es: 'Guía de Buenas Prácticas Ambientales',
    title_en: 'Environmental Best Practices Guide',
    type: 'GUIDE',
    status: 'DRAFT',
    featured: false,
    fileName: 'guia-practicas-ambientales.pdf',
    fileSize: '1.5 MB',
    downloads: 0,
    publishDate: null,
    author: 'María González',
    tags: ['medio ambiente', 'guía', 'prácticas']
  },
  {
    id: 3,
    title_es: 'Manual de Gestión Comunitaria',
    title_en: 'Community Management Manual',
    type: 'MANUAL',
    status: 'PUBLISHED',
    featured: true,
    fileName: 'manual-gestion-comunitaria.pdf',
    fileSize: '3.2 MB',
    downloads: 856,
    publishDate: '2023-12-20',
    author: 'Carlos Mamani',
    tags: ['comunidad', 'gestión', 'manual']
  }
];

const publicationTypes = ['TODOS', 'REPORT', 'GUIDE', 'MANUAL', 'RESEARCH', 'POLICY', 'BOOK'];
const statuses = ['TODOS', 'PUBLISHED', 'DRAFT', 'REVIEW', 'ARCHIVED'];

function getStatusBadge(status: string) {
  switch (status) {
    case 'PUBLISHED':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Publicado</Badge>;
    case 'DRAFT':
      return <Badge variant="secondary">Borrador</Badge>;
    case 'REVIEW':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En Revisión</Badge>;
    case 'ARCHIVED':
      return <Badge variant="outline">Archivado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getTypeBadge(type: string) {
  const colors = {
    REPORT: 'bg-blue-100 text-blue-800',
    GUIDE: 'bg-green-100 text-green-800',
    MANUAL: 'bg-purple-100 text-purple-800',
    RESEARCH: 'bg-orange-100 text-orange-800',
    POLICY: 'bg-red-100 text-red-800',
    BOOK: 'bg-indigo-100 text-indigo-800'
  };
  
  return (
    <Badge className={`${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'} hover:${colors[type as keyof typeof colors] || 'bg-gray-100'}`}>
      {type}
    </Badge>
  );
}

export default function LibraryManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca Digital</h1>
          <p className="text-muted-foreground">
            Gestiona publicaciones, documentos y recursos de la biblioteca digital
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Publicación
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Publicaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publications.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 este mes
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
              {publications.filter(p => p.status === 'PUBLISHED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponibles públicamente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Descargas</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publications.reduce((acc, p) => acc + p.downloads, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Este año
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamaño Total</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publications.reduce((acc, p) => acc + parseFloat(p.fileSize), 0).toFixed(1)} MB
            </div>
            <p className="text-xs text-muted-foreground">
              Espacio utilizado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar publicaciones..." className="pl-8" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Tipo
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {publicationTypes.map((type) => (
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

      {/* Publications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Documentos</CardTitle>
          <CardDescription>
            Gestiona todas las publicaciones y documentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Publicación</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Archivo</TableHead>
                <TableHead>Descargas</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications.map((publication) => (
                <TableRow key={publication.id}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {publication.title_es}
                        {publication.featured && (
                          <Badge variant="secondary" className="text-xs">Destacado</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {publication.title_en}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {publication.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {publication.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{publication.tags.length - 2} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(publication.type)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(publication.status)}
                  </TableCell>
                  <TableCell>{publication.author}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-mono">{publication.fileName}</div>
                      <div className="text-xs text-muted-foreground">{publication.fileSize}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3 text-muted-foreground" />
                      <span>{publication.downloads.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {publication.publishDate ? new Date(publication.publishDate).toLocaleDateString('es-ES') : '-'}
                  </TableCell>
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
                          <Download className="h-4 w-4" />
                          Descargar
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