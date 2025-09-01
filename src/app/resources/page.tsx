"use client";

import { useState, useEffect } from "react";
import { MediaType, MediaCategory } from "@prisma/client";
import { formatFileSize, MEDIA_CATEGORY_OPTIONS, MEDIA_TYPE_OPTIONS } from "@/lib/validations/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Search, 
  Filter,
  Grid3X3,
  List,
  Download,
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
  ChevronRight,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function ResourcesPage() {
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
  
  // Preview modal
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  
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
        isPublic: 'true', // Only show public assets
      });
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.folder) params.append('folder', filters.folder);
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
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchAssets();
  }, []);

  // Fetch assets when dependencies change
  useEffect(() => {
    fetchAssets();
  }, [currentPage, sortBy, sortOrder]);

  // Handle filter changes
  useEffect(() => {
    setCurrentPage(1);
    const timer = setTimeout(() => {
      fetchAssets();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [filters.search, filters.type, filters.category, filters.folder, filters.tags]);

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleFilterChange = (newFilters: Partial<MediaFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {assets.map((asset) => {
        const FileIcon = FILE_TYPE_ICONS[asset.type];
        
        return (
          <Card key={asset.id} className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-md">
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
                
                {/* Action menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    onClick={() => setPreviewAsset(asset)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* File type badge */}
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {MEDIA_TYPE_OPTIONS.find(opt => opt.value === asset.type)?.icon}
                  </Badge>
                </div>
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
      {assets.map((asset) => {
        const FileIcon = FILE_TYPE_ICONS[asset.type];
        
        return (
          <Card key={asset.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewAsset(asset)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={asset.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Recursos</h1>
        <p className="text-lg text-gray-600">
          Explora nuestra colección de recursos multimedia, documentos y materiales educativos.
        </p>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar recursos..."
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
        <Card className="mb-6">
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results display */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando recursos...</p>
          </div>
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12">
          <File className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No se encontraron recursos</p>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <>
          {/* Results info */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {assets.length} de {totalCount} recurso{totalCount !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Assets */}
          {viewMode === 'grid' ? renderGridView() : renderListView()}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
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
    </div>
  );
}
