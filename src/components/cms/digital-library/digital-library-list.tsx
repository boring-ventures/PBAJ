'use client';

import { useState } from 'react';
import { DigitalLibraryFilterData, DigitalLibraryBulkActionData } from '@/lib/validations/digital-library';
import { PublicationStatus, PublicationType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Calendar,
  FileText,
  Download,
  BookOpen,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DigitalLibraryItem {
  id: string;
  title: string;
  description: string;
  titleEs?: string;
  titleEn?: string;
  descriptionEs?: string;
  descriptionEn?: string;
  abstractEs?: string;
  abstractEn?: string;
  type: PublicationType;
  status: PublicationStatus;
  featured: boolean;
  publishDate: Date | null;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  coverImageUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  keywords: string[];
  relatedPrograms: string[];
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DigitalLibraryListProps {
  publications: DigitalLibraryItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onEdit: (publication: DigitalLibraryItem) => void;
  onDelete: (publicationId: string) => Promise<void>;
  onBulkAction: (action: DigitalLibraryBulkActionData) => Promise<void>;
  onFiltersChange: (filters: DigitalLibraryFilterData) => void;
  loading?: boolean;
}

const statusLabels = {
  [PublicationStatus.DRAFT]: { label: 'Borrador', variant: 'secondary' as const },
  [PublicationStatus.REVIEW]: { label: 'En Revisión', variant: 'destructive' as const },
  [PublicationStatus.PUBLISHED]: { label: 'Publicado', variant: 'default' as const },
  [PublicationStatus.ARCHIVED]: { label: 'Archivado', variant: 'outline' as const },
};

const typeLabels = {
  [PublicationType.REPORT]: 'Informe',
  [PublicationType.RESEARCH_PAPER]: 'Investigación',
  [PublicationType.POLICY_BRIEF]: 'Política',
  [PublicationType.GUIDE]: 'Guía',
  [PublicationType.INFOGRAPHIC]: 'Infografía',
  [PublicationType.PRESENTATION]: 'Presentación',
  [PublicationType.VIDEO]: 'Video',
  [PublicationType.PODCAST]: 'Podcast',
};

const languageLabels = {
  es: 'Español',
  en: 'English',
  both: 'Bilingüe',
};

export function DigitalLibraryList({
  publications,
  totalCount,
  currentPage,
  totalPages,
  onEdit,
  onDelete,
  onBulkAction,
  onFiltersChange,
  loading = false
}: DigitalLibraryListProps) {
  const [selectedPublications, setSelectedPublications] = useState<string[]>([]);
  const [filters, setFilters] = useState<DigitalLibraryFilterData>({
    search: '',
    status: undefined,
    type: undefined,
    featured: undefined,
    authors: '',
    tags: '',
    language: undefined,
    page: currentPage,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof DigitalLibraryFilterData, value: unknown) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPublications(publications.map(p => p.id));
    } else {
      setSelectedPublications([]);
    }
  };

  const handleSelectPublication = (publicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedPublications([...selectedPublications, publicationId]);
    } else {
      setSelectedPublications(selectedPublications.filter(id => id !== publicationId));
    }
  };

  const handleBulkAction = async (action: DigitalLibraryBulkActionData['action']) => {
    if (selectedPublications.length === 0) {
      toast({
        title: 'Error',
        description: 'Selecciona al menos una publicación',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onBulkAction({ action, publicationIds: selectedPublications });
      setSelectedPublications([]);
      toast({
        title: 'Éxito',
        description: 'Acción ejecutada correctamente',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al ejecutar la acción',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (publicationId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta publicación?');
    if (confirmed) {
      try {
        await onDelete(publicationId);
        toast({
          title: 'Éxito',
          description: 'Publicación eliminada correctamente',
        });
      } catch {
        toast({
          title: 'Error',
          description: 'Ocurrió un error al eliminar la publicación',
          variant: 'destructive',
        });
      }
    }
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'No especificado';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'No especificado';
    return new Date(date).toLocaleDateString('es-BO');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Biblioteca Digital</h1>
          <p className="text-muted-foreground">
            {totalCount} publicación{totalCount !== 1 ? 'es' : ''} en total
          </p>
        </div>
        
        <Button onClick={() => onEdit({} as DigitalLibraryItem)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Publicación
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar publicaciones..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value={PublicationStatus.DRAFT}>Borrador</SelectItem>
                  <SelectItem value={PublicationStatus.PUBLISHED}>Publicado</SelectItem>
                  <SelectItem value={PublicationStatus.ARCHIVED}>Archivado</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value={PublicationType.REPORT}>Informe</SelectItem>
                  <SelectItem value={PublicationType.RESEARCH_PAPER}>Investigación</SelectItem>
                  <SelectItem value={PublicationType.POLICY_BRIEF}>Política</SelectItem>
                  <SelectItem value={PublicationType.GUIDE}>Guía</SelectItem>
                  <SelectItem value={PublicationType.INFOGRAPHIC}>Infografía</SelectItem>
                  <SelectItem value={PublicationType.PRESENTATION}>Presentación</SelectItem>
                  <SelectItem value={PublicationType.VIDEO}>Video</SelectItem>
                  <SelectItem value={PublicationType.PODCAST}>Podcast</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.language}
                onValueChange={(value) => handleFilterChange('language', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los idiomas</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="both">Bilingüe</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.featured?.toString()}
                onValueChange={(value) => handleFilterChange('featured', value === 'all' ? undefined : value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Destacados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Destacados</SelectItem>
                  <SelectItem value="false">No destacados</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Autores"
                value={filters.authors || ''}
                onChange={(e) => handleFilterChange('authors', e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPublications.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedPublications.length} publicación{selectedPublications.length !== 1 ? 'es' : ''} seleccionada{selectedPublications.length !== 1 ? 's' : ''}
              </p>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('publish')}
                >
                  Publicar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('unpublish')}
                >
                  Despublicar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('feature')}
                >
                  Destacar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('unfeature')}
                >
                  No destacar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('archive')}
                >
                  Archivar
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publications Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedPublications.length === publications.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Publicación</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
{/* Language header removed - not in schema */}
{/* Authors header removed - not in schema */}
              <TableHead>Estadísticas</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publications.map((publication) => (
              <TableRow key={publication.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPublications.includes(publication.id)}
                    onCheckedChange={(checked) => handleSelectPublication(publication.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-3">
                    {publication.coverImageUrl ? (
                      <img
                        src={publication.coverImageUrl}
                        alt="Cover"
                        className="w-12 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{publication.titleEs}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {publication.featured && (
                          <Badge variant="secondary">Destacado</Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText className="w-3 h-3" />
                          {formatFileSize(publication.fileSize)}
                        </div>
{/* Page count removed - not in schema */}
                      </div>
                      {publication.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {publication.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {publication.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{publication.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {typeLabels[publication.type]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusLabels[publication.status].variant}>
                    {statusLabels[publication.status].label}
                  </Badge>
                </TableCell>
{/* Language column removed - not in schema */}
{/* Authors column removed - not in schema */}
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-muted-foreground" />
                      {publication.downloadCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-muted-foreground" />
                      {publication.viewCount}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(publication.publishDate || publication.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(`/preview/library/${publication.id}`, '_blank')}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(publication.fileUrl, '_blank')}>
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(publication)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(publication.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handleFilterChange('page', currentPage - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handleFilterChange('page', currentPage + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {publications.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron publicaciones.</p>
              <Button className="mt-4" onClick={() => onEdit({} as DigitalLibraryItem)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Publicación
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}