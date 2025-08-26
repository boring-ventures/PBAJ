'use client';

import { useState } from 'react';
import { ProgramFilterData, ProgramBulkActionData } from '@/lib/validations/programs';
import { ProgramStatus, ProgramType } from '@prisma/client';
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
  MapPin,
  DollarSign
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

interface Program {
  id: string;
  titleEs: string;
  titleEn: string;
  type: ProgramType;
  status: ProgramStatus;
  featured: boolean;
  startDate: Date | null;
  endDate: Date | null;
  region: string | null;
  budget: number | null;
  progressPercentage: number;
  featuredImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProgramsListProps {
  programs: Program[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onEdit: (program: Program) => void;
  onDelete: (programId: string) => Promise<void>;
  onBulkAction: (action: ProgramBulkActionData) => Promise<void>;
  onFiltersChange: (filters: ProgramFilterData) => void;
  loading?: boolean;
}

const statusLabels = {
  [ProgramStatus.PLANNING]: { label: 'Planificación', variant: 'secondary' as const },
  [ProgramStatus.ACTIVE]: { label: 'Activo', variant: 'default' as const },
  [ProgramStatus.ON_HOLD]: { label: 'En Pausa', variant: 'outline' as const },
  [ProgramStatus.COMPLETED]: { label: 'Completado', variant: 'secondary' as const },
  [ProgramStatus.CANCELLED]: { label: 'Cancelado', variant: 'destructive' as const },
};

const typeLabels = {
  [ProgramType.ADVOCACY]: 'Incidencia',
  [ProgramType.CAPACITY_BUILDING]: 'Fortalecimiento',
  [ProgramType.RESEARCH]: 'Investigación',
  [ProgramType.EDUCATION]: 'Educación',
  [ProgramType.COMMUNITY]: 'Comunitario',
};

export function ProgramsList({
  programs,
  totalCount,
  currentPage,
  totalPages,
  onEdit,
  onDelete,
  onBulkAction,
  onFiltersChange,
  loading = false
}: ProgramsListProps) {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProgramFilterData>({
    search: '',
    status: undefined,
    type: undefined,
    featured: undefined,
    region: '',
    page: currentPage,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof ProgramFilterData, value: unknown) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrograms(programs.map(p => p.id));
    } else {
      setSelectedPrograms([]);
    }
  };

  const handleSelectProgram = (programId: string, checked: boolean) => {
    if (checked) {
      setSelectedPrograms([...selectedPrograms, programId]);
    } else {
      setSelectedPrograms(selectedPrograms.filter(id => id !== programId));
    }
  };

  const handleBulkAction = async (action: ProgramBulkActionData['action']) => {
    if (selectedPrograms.length === 0) {
      toast({
        title: 'Error',
        description: 'Selecciona al menos un programa',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onBulkAction({ action, programIds: selectedPrograms });
      setSelectedPrograms([]);
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

  const handleDelete = async (programId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este programa?');
    if (confirmed) {
      try {
        await onDelete(programId);
        toast({
          title: 'Éxito',
          description: 'Programa eliminado correctamente',
        });
      } catch {
        toast({
          title: 'Error',
          description: 'Ocurrió un error al eliminar el programa',
          variant: 'destructive',
        });
      }
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'No especificado';
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
          <h1 className="text-2xl font-bold">Gestión de Programas</h1>
          <p className="text-muted-foreground">
            {totalCount} programa{totalCount !== 1 ? 's' : ''} en total
          </p>
        </div>
        
        <Button onClick={() => onEdit({} as Program)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Programa
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar programas..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value={ProgramStatus.PLANNING}>Planificación</SelectItem>
                  <SelectItem value={ProgramStatus.ACTIVE}>Activo</SelectItem>
                  <SelectItem value={ProgramStatus.ON_HOLD}>En Pausa</SelectItem>
                  <SelectItem value={ProgramStatus.COMPLETED}>Completado</SelectItem>
                  <SelectItem value={ProgramStatus.CANCELLED}>Cancelado</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value={ProgramType.ADVOCACY}>Incidencia</SelectItem>
                  <SelectItem value={ProgramType.CAPACITY_BUILDING}>Fortalecimiento</SelectItem>
                  <SelectItem value={ProgramType.RESEARCH}>Investigación</SelectItem>
                  <SelectItem value={ProgramType.EDUCATION}>Educación</SelectItem>
                  <SelectItem value={ProgramType.COMMUNITY}>Comunitario</SelectItem>
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
                placeholder="Región"
                value={filters.region || ''}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPrograms.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedPrograms.length} programa{selectedPrograms.length !== 1 ? 's' : ''} seleccionado{selectedPrograms.length !== 1 ? 's' : ''}
              </p>
              
              <div className="flex items-center gap-2">
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
                  onClick={() => handleBulkAction('activate')}
                >
                  Activar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('pause')}
                >
                  Pausar
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

      {/* Programs Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedPrograms.length === programs.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Progreso</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Región</TableHead>
              <TableHead>Presupuesto</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPrograms.includes(program.id)}
                    onCheckedChange={(checked) => handleSelectProgram(program.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-3">
                    {program.featuredImageUrl && (
                      <img
                        src={program.featuredImageUrl}
                        alt="Program"
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <p className="font-medium">{program.titleEs}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {program.featured && (
                          <Badge variant="secondary">Destacado</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(program.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {typeLabels[program.type]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusLabels[program.status].variant}>
                    {statusLabels[program.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${program.progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {program.progressPercentage}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(program.startDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {program.region || 'No especificado'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="w-3 h-3" />
                    {formatCurrency(program.budget)}
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
                      <DropdownMenuItem onClick={() => window.open(`/preview/program/${program.id}`, '_blank')}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(program)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(program.id)}
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

      {programs.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron programas.</p>
              <Button className="mt-4" onClick={() => onEdit({} as Program)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Programa
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}