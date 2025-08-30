'use client';

import { useState } from 'react';
import { ScheduleFilterData } from '@/lib/validations/scheduling';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Play,
  X,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ScheduleItem {
  id: string;
  contentId: string;
  contentType: 'news' | 'program' | 'publication';
  scheduledDate: Date;
  action: 'publish' | 'unpublish' | 'archive';
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'CANCELLED';
  timezone: string;
  executedAt?: Date;
  failureReason?: string;
  createdBy: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

interface ScheduleManagerProps {
  schedules: ScheduleItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onFiltersChange: (filters: ScheduleFilterData) => void;
  onExecute: (scheduleId: string) => Promise<void>;
  onCancel: (scheduleId: string) => Promise<void>;
  onRetry: (scheduleId: string) => Promise<void>;
  loading?: boolean;
}

const contentTypeLabels = {
  news: 'Noticia',
  program: 'Programa',
  publication: 'Publicación',
};

const actionLabels = {
  publish: 'Publicar',
  unpublish: 'Despublicar',
  archive: 'Archivar',
};

const statusConfig = {
  PENDING: { 
    variant: 'secondary' as const, 
    label: 'Pendiente', 
    icon: Clock,
    color: 'text-yellow-600'
  },
  EXECUTED: { 
    variant: 'default' as const, 
    label: 'Ejecutado', 
    icon: CheckCircle,
    color: 'text-green-600'
  },
  FAILED: { 
    variant: 'destructive' as const, 
    label: 'Fallido', 
    icon: AlertCircle,
    color: 'text-red-600'
  },
  CANCELLED: { 
    variant: 'outline' as const, 
    label: 'Cancelado', 
    icon: XCircle,
    color: 'text-gray-600'
  },
};

export function ScheduleManager({
  schedules,
  totalCount,
  currentPage,
  totalPages,
  onFiltersChange,
  onExecute,
  onCancel,
  onRetry,
  loading = false
}: ScheduleManagerProps) {
  const [filters, setFilters] = useState<ScheduleFilterData>({
    page: currentPage,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof ScheduleFilterData, value: unknown) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = new Date(date).getTime() - now.getTime();
    const diffMinutes = Math.round(diff / (1000 * 60));
    const diffHours = Math.round(diff / (1000 * 60 * 60));
    const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      const absDiffMinutes = Math.abs(diffMinutes);
      const absDiffHours = Math.abs(diffHours);
      const absDiffDays = Math.abs(diffDays);
      
      if (absDiffMinutes < 60) return `Hace ${absDiffMinutes} min`;
      if (absDiffHours < 24) return `Hace ${absDiffHours}h`;
      return `Hace ${absDiffDays}d`;
    }

    if (diffMinutes < 60) return `En ${diffMinutes} min`;
    if (diffHours < 24) return `En ${diffHours}h`;
    return `En ${diffDays}d`;
  };

  const handleExecute = async (scheduleId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas ejecutar esta programación ahora?');
    if (confirmed) {
      try {
        await onExecute(scheduleId);
        toast({
          title: 'Éxito',
          description: 'Programación ejecutada correctamente',
        });
      } catch {
        toast({
          title: 'Error',
          description: 'Ocurrió un error al ejecutar la programación',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCancel = async (scheduleId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas cancelar esta programación?');
    if (confirmed) {
      try {
        await onCancel(scheduleId);
        toast({
          title: 'Éxito',
          description: 'Programación cancelada correctamente',
        });
      } catch {
        toast({
          title: 'Error',
          description: 'Ocurrió un error al cancelar la programación',
          variant: 'destructive',
        });
      }
    }
  };

  const handleRetry = async (scheduleId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas reintentar esta programación?');
    if (confirmed) {
      try {
        await onRetry(scheduleId);
        toast({
          title: 'Éxito',
          description: 'Programación reintentada correctamente',
        });
      } catch {
        toast({
          title: 'Error',
          description: 'Ocurrió un error al reintentar la programación',
          variant: 'destructive',
        });
      }
    }
  };

  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Programaciones de Contenido</h1>
          <p className="text-muted-foreground">
            {totalCount} programación{totalCount !== 1 ? 'es' : ''} en total
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar programaciones..."
                value={filters.search || ''}
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
                value={filters.contentType}
                onValueChange={(value) => handleFilterChange('contentType', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de contenido" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="news">Noticias</SelectItem>
                  <SelectItem value="program">Programas</SelectItem>
                  <SelectItem value="publication">Publicaciones</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="executed">Ejecutado</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.action}
                onValueChange={(value) => handleFilterChange('action', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las acciones</SelectItem>
                  <SelectItem value="publish">Publicar</SelectItem>
                  <SelectItem value="unpublish">Despublicar</SelectItem>
                  <SelectItem value="archive">Archivar</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="Fecha programada"
                onChange={(e) => handleFilterChange('scheduledAfter', e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedules Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contenido</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Programado para</TableHead>
              <TableHead>Ejecutado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => {
              return (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {contentTypeLabels[schedule.contentType]}
                        </Badge>
                        <span className="text-sm font-mono text-muted-foreground">
                          {schedule.contentId.slice(-8)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {actionLabels[schedule.action]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(schedule.status)}
                    {schedule.failureReason && (
                      <p className="text-xs text-destructive mt-1">
                        {schedule.failureReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {formatDate(schedule.scheduledDate)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(schedule.scheduledDate)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {schedule.executedAt ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {formatDate(schedule.executedAt)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {schedule.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem onClick={() => handleExecute(schedule.id)}>
                              <Play className="w-4 h-4 mr-2" />
                              Ejecutar Ahora
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCancel(schedule.id)}>
                              <X className="w-4 h-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          </>
                        )}
                        {schedule.status === 'FAILED' && (
                          <DropdownMenuItem onClick={() => handleRetry(schedule.id)}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reintentar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
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

      {schedules.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron programaciones.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}