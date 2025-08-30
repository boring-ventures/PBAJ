'use client';

import { useState, useEffect, useMemo } from 'react';
import { MediaType, MediaCategory } from '@prisma/client';
import { formatFileSize, MEDIA_CATEGORY_OPTIONS, MEDIA_TYPE_OPTIONS } from '@/lib/validations/media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  Search, 
  Filter,
  Grid3X3,
  List,
  Download,
  Trash2,
  Edit3,
  Eye,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MediaEditor } from './media-editor';

interface MediaAsset {
  id: string;
  fileName: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  category: MediaCategory;
  mimeType: string;
  fileSize: number;
  altText?: string;
  caption?: string;
  description?: string;
  width?: number;
  height?: number;
  duration?: number;
  tags: string[];
  folder?: string;
  title?: string;
  downloadCount: number;
  usageCount: number;
  isPublic: boolean;
  isOptimized: boolean;
  uploaderId: string;
  createdAt: string;
  updatedAt: string;
  uploader?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

interface MediaFilters {
  search: string;
  type?: MediaType;
  category?: MediaCategory;
  folder?: string;
  tags: string[];
  isPublic?: boolean;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

interface MediaGalleryProps {
  onSelect?: (assets: MediaAsset[]) => void;
  onEdit?: (asset: MediaAsset) => void;
  selectionMode?: 'single' | 'multiple' | 'none';
  maxSelections?: number;
  allowedTypes?: MediaType[];
  selectedAssets?: MediaAsset[];
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'createdAt' | 'fileName' | 'fileSize' | 'usageCount';
type SortOrder = 'asc' | 'desc';

const FILE_TYPE_ICONS = {
  [MediaType.IMAGE]: Image,
  [MediaType.VIDEO]: Video,
  [MediaType.AUDIO]: Music,
  [MediaType.DOCUMENT]: FileText,
  [MediaType.ARCHIVE]: Archive,
};

export function MediaGallery({
  onSelect,
  onEdit,
  selectionMode = 'none',
  maxSelections,
  allowedTypes,
  selectedAssets = [],
  className
}: MediaGalleryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState<MediaFilters>({
    search: '',
    tags: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedAssets.map(asset => asset.id)));
  
  // Preview modal
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  
  // Edit modal
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  
  // Available filters from data
  const [availableFolders, setAvailableFolders] = useState<string[]>([]);

  const fetchAssets = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sortBy,
        sortOrder,
      });
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.folder) params.append('folder', filters.folder);
      if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());
      if (filters.tags.length > 0) params.append('tags', filters.tags.join(','));

      const response = await fetch(`/api/admin/media?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch media assets');
      }

      const data = await response.json();
      
      if (data.success) {
        setAssets(data.assets);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
        
        // Update available filters
        const folders = [...new Set(data.assets.map((a: MediaAsset) => a.folder).filter(Boolean))] as string[];
        setAvailableFolders(folders);
      } else {
        throw new Error(data.error || 'Failed to fetch assets');
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los archivos multimedia',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [currentPage, sortBy, sortOrder, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync selected IDs with selectedAssets prop
  useEffect(() => {
    setSelectedIds(new Set(selectedAssets.map(asset => asset.id)));
  }, [selectedAssets]);

  // Filter assets based on allowed types
  const filteredAssets = useMemo(() => {
    if (!allowedTypes || allowedTypes.length === 0) return assets;
    return assets.filter(asset => allowedTypes.includes(asset.type));
  }, [assets, allowedTypes]);

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<MediaFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSelection = (asset: MediaAsset, isSelected: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    
    if (selectionMode === 'single') {
      if (isSelected) {
        newSelectedIds.clear();
        newSelectedIds.add(asset.id);
      } else {
        newSelectedIds.clear();
      }
    } else if (selectionMode === 'multiple') {
      if (isSelected) {
        if (maxSelections && selectedIds.size >= maxSelections) {
          toast({
            title: 'Límite alcanzado',
            description: `Solo puedes seleccionar hasta ${maxSelections} archivos`,
            variant: 'destructive',
          });
          return;
        }
        newSelectedIds.add(asset.id);
      } else {
        newSelectedIds.delete(asset.id);
      }
    }
    
    setSelectedIds(newSelectedIds);
    
    if (onSelect) {
      const selectedAssets = filteredAssets.filter(a => newSelectedIds.has(a.id));
      onSelect(selectedAssets);
    }
  };

  const handleBulkAction = async (action: 'delete' | 'public' | 'private') => {
    if (selectedIds.size === 0) return;

    try {
      const response = await fetch('/api/admin/media/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          mediaIds: Array.from(selectedIds),
        }),
      });

      if (!response.ok) {
        throw new Error('Bulk action failed');
      }

      toast({
        title: 'Acción completada',
        description: `${action === 'delete' ? 'Eliminados' : action === 'public' ? 'Publicados' : 'Privados'} ${selectedIds.size} archivos`,
      });

      setSelectedIds(new Set());
      fetchAssets();
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar la acción',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado',
      description: 'URL copiada al portapapeles',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {filteredAssets.map((asset) => {
        const isSelected = selectedIds.has(asset.id);
        const FileIcon = FILE_TYPE_ICONS[asset.type];
        
        return (
          <Card key={asset.id} className={cn(
            "group relative overflow-hidden cursor-pointer transition-all hover:shadow-md",
            isSelected && "ring-2 ring-primary"
          )}>
            <CardContent className="p-0">
              {/* Thumbnail */}
              <div className="relative aspect-square bg-muted">
                {asset.thumbnailUrl || asset.type === MediaType.IMAGE ? (
                  <img
                    src={asset.thumbnailUrl || asset.url}
                    alt={asset.altText || asset.originalName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <FileIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Selection checkbox */}
                {selectionMode !== 'none' && (
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelection(asset, checked as boolean)}
                      className="bg-white/80 border-white"
                    />
                  </div>
                )}
                
                {/* Action menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setPreviewAsset(asset)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Vista previa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingAsset(asset)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard(asset.url)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar URL
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={asset.url} download target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleBulkAction('delete')}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* File type badge */}
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {MEDIA_TYPE_OPTIONS.find(opt => opt.value === asset.type)?.icon}
                  </Badge>
                </div>
                
                {/* Public indicator */}
                {asset.isPublic && (
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="outline" className="text-xs bg-white/80">
                      Público
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* File info */}
              <div className="p-3">
                <p className="text-sm font-medium truncate" title={asset.originalName}>
                  {asset.originalName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(asset.fileSize)}
                </p>
                
                {/* Tags */}
                {asset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {asset.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {asset.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{asset.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredAssets.map((asset) => {
        const isSelected = selectedIds.has(asset.id);
        const FileIcon = FILE_TYPE_ICONS[asset.type];
        
        return (
          <Card key={asset.id} className={cn(
            "hover:bg-muted/50 transition-colors",
            isSelected && "bg-primary/5 border-primary"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Selection */}
                {selectionMode !== 'none' && (
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelection(asset, checked as boolean)}
                  />
                )}
                
                {/* Thumbnail */}
                <div className="w-12 h-12 flex-shrink-0">
                  {asset.thumbnailUrl || asset.type === MediaType.IMAGE ? (
                    <img
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.altText || asset.originalName}
                      className="w-full h-full object-cover rounded border"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border rounded bg-muted">
                      <FileIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {/* File info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{asset.originalName}</p>
                    {asset.isPublic && (
                      <Badge variant="outline" className="text-xs">Público</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{formatFileSize(asset.fileSize)}</span>
                    <span>{asset.type}</span>
                    {asset.folder && (
                      <>
                        <Folder className="w-3 h-3" />
                        <span>{asset.folder}</span>
                      </>
                    )}
                    <span>{formatDate(asset.createdAt)}</span>
                  </div>
                  
                  {/* Tags */}
                  {asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setPreviewAsset(asset)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Vista previa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditingAsset(asset)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyToClipboard(asset.url)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar URL
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={asset.url} download target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with search and controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar archivos..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Filters toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-muted")}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          
          {/* View mode */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Sort */}
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value) => {
              const [newSortBy, newSortOrder] = value.split('-') as [SortBy, SortOrder];
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Más reciente</SelectItem>
              <SelectItem value="createdAt-asc">Más antiguo</SelectItem>
              <SelectItem value="fileName-asc">Nombre A-Z</SelectItem>
              <SelectItem value="fileName-desc">Nombre Z-A</SelectItem>
              <SelectItem value="fileSize-desc">Tamaño mayor</SelectItem>
              <SelectItem value="fileSize-asc">Tamaño menor</SelectItem>
              <SelectItem value="usageCount-desc">Más usado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type filter */}
              <div>
                <Label>Tipo de archivo</Label>
                <Select
                  value={filters.type || ''}
                  onValueChange={(value) => 
                    handleFilterChange({ type: value as MediaType || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los tipos</SelectItem>
                    {MEDIA_TYPE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category filter */}
              <div>
                <Label>Categoría</Label>
                <Select
                  value={filters.category || ''}
                  onValueChange={(value) => 
                    handleFilterChange({ category: value as MediaCategory || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    {MEDIA_CATEGORY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Folder filter */}
              <div>
                <Label>Carpeta</Label>
                <Select
                  value={filters.folder || ''}
                  onValueChange={(value) => handleFilterChange({ folder: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las carpetas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las carpetas</SelectItem>
                    {availableFolders.map(folder => (
                      <SelectItem key={folder} value={folder}>
                        {folder}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Public filter */}
              <div>
                <Label>Visibilidad</Label>
                <Select
                  value={filters.isPublic?.toString() || ''}
                  onValueChange={(value) => 
                    handleFilterChange({ isPublic: value === 'true' ? true : value === 'false' ? false : undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="true">Públicos</SelectItem>
                    <SelectItem value="false">Privados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection info and bulk actions */}
      {selectedIds.size > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {selectedIds.size} archivo{selectedIds.size > 1 ? 's' : ''} seleccionado{selectedIds.size > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('public')}
                >
                  Hacer públicos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('private')}
                >
                  Hacer privados
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assets display */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando archivos...</p>
          </div>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-12">
          <File className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No se encontraron archivos</p>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros o sube algunos archivos
          </p>
        </div>
      ) : (
        <>
          {/* Results info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredAssets.length} de {totalCount} archivo{totalCount !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Assets */}
          {viewMode === 'grid' ? renderGridView() : renderListView()}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Preview Modal */}
      {previewAsset && (
        <Dialog open={!!previewAsset} onOpenChange={() => setPreviewAsset(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{previewAsset.originalName}</DialogTitle>
              <DialogDescription>
                {formatFileSize(previewAsset.fileSize)} • {previewAsset.type} • {formatDate(previewAsset.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview */}
              <div className="space-y-4">
                {previewAsset.type === MediaType.IMAGE ? (
                  <img
                    src={previewAsset.url}
                    alt={previewAsset.altText || previewAsset.originalName}
                    className="w-full h-auto max-h-96 object-contain rounded border"
                  />
                ) : previewAsset.type === MediaType.VIDEO ? (
                  <video
                    src={previewAsset.url}
                    controls
                    className="w-full h-auto max-h-96 rounded border"
                  />
                ) : previewAsset.type === MediaType.AUDIO ? (
                  <audio
                    src={previewAsset.url}
                    controls
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 border rounded bg-muted">
                    <div className="text-center">
                      <File className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Vista previa no disponible</p>
                      <Button className="mt-4" asChild>
                        <a href={previewAsset.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir archivo
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">ARCHIVO</Label>
                  <p className="font-medium">{previewAsset.originalName}</p>
                </div>

                {previewAsset.altText && (
                  <div>
                    <Label className="text-xs text-muted-foreground">TEXTO ALT</Label>
                    <p>{previewAsset.altText}</p>
                  </div>
                )}

                {previewAsset.caption && (
                  <div>
                    <Label className="text-xs text-muted-foreground">LEYENDA</Label>
                    <p>{previewAsset.caption}</p>
                  </div>
                )}

                {previewAsset.description && (
                  <div>
                    <Label className="text-xs text-muted-foreground">DESCRIPCIÓN</Label>
                    <p>{previewAsset.description}</p>
                  </div>
                )}

                <div>
                  <Label className="text-xs text-muted-foreground">CATEGORÍA</Label>
                  <p>{MEDIA_CATEGORY_OPTIONS.find(opt => opt.value === previewAsset.category)?.label}</p>
                </div>

                {previewAsset.folder && (
                  <div>
                    <Label className="text-xs text-muted-foreground">CARPETA</Label>
                    <p>{previewAsset.folder}</p>
                  </div>
                )}

                {previewAsset.tags.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">ETIQUETAS</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {previewAsset.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label className="text-xs text-muted-foreground">DESCARGAS</Label>
                    <p>{previewAsset.downloadCount}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">USOS</Label>
                    <p>{previewAsset.usageCount}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={() => copyToClipboard(previewAsset.url)} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar URL
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href={previewAsset.url} download>
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Modal */}
      {editingAsset && (
        <MediaEditor
          asset={editingAsset}
          isOpen={!!editingAsset}
          onClose={() => setEditingAsset(null)}
          onSave={(updatedAsset) => {
            // Update the asset in the list
            setAssets(prev => prev.map(a => a.id === updatedAsset.id ? { ...a, ...updatedAsset } : a));
            setEditingAsset(null);
          }}
          onDelete={(assetId) => {
            // Remove the asset from the list
            setAssets(prev => prev.filter(a => a.id !== assetId));
            setEditingAsset(null);
          }}
        />
      )}
    </div>
  );
}