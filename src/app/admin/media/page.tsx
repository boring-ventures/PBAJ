'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { MediaGallerySimple } from '@/components/cms/media/media-gallery-simple';
import { MediaUploader } from '@/components/cms/media/media-uploader';
import { formatFileSize, MEDIA_CATEGORY_OPTIONS } from '@/lib/validations/media';
import { MediaType, MediaCategory } from '@prisma/client';
import { 
  Upload, 
  Image, 
  BarChart3,
  HardDrive,
  FileText,
  Eye,
  Folder,
  Tag
} from 'lucide-react';

interface MediaStats {
  totalAssets: number;
  totalSize: number;
  byType: Array<{ type: MediaType; count: number }>;
  byCategory: Array<{ category: MediaCategory; count: number }>;
}

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
  altTextEs?: string;
  altTextEn?: string;
  captionEs?: string;
  captionEn?: string;
  dimensions?: string;
  duration?: number;
  tags: string[];
  metadata?: any;
  isPublic: boolean;
  downloadCount: number;
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

export default function MediaPage() {
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [activeTab, setActiveTab] = useState('gallery');

  // Fetch media statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/media/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.statistics);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleEditAsset = (asset: MediaAsset) => {
    setEditingAsset(asset);
  };

  const handleSaveAsset = async (updatedAsset: Partial<MediaAsset>) => {
    if (!editingAsset) return;

    try {
      const response = await fetch(`/api/admin/media/${editingAsset.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAsset),
      });

      if (response.ok) {
        toast({
          title: 'Archivo actualizado',
          description: 'Los cambios se han guardado exitosamente',
        });
        setEditingAsset(null);
        // Refresh stats
        fetchStats();
      } else {
        throw new Error('Failed to update asset');
      }
    } catch (error) {
      console.error('Error updating asset:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el archivo',
        variant: 'destructive',
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case MediaType.IMAGE:
        return <Image className="w-4 h-4" />;
      case MediaType.VIDEO:
        return <FileText className="w-4 h-4" />;
      case MediaType.AUDIO:
        return <FileText className="w-4 h-4" />;
      case MediaType.DOCUMENT:
        return <FileText className="w-4 h-4" />;
      case MediaType.ARCHIVE:
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeName = (type: MediaType) => {
    switch (type) {
      case MediaType.IMAGE:
        return 'Imágenes';
      case MediaType.VIDEO:
        return 'Videos';
      case MediaType.AUDIO:
        return 'Audio';
      case MediaType.DOCUMENT:
        return 'Documentos';
      case MediaType.ARCHIVE:
        return 'Archivos';
      default:
        return 'Otros';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gestión de Medios</h1>
        <p className="text-muted-foreground mt-2">
          Administra tu biblioteca multimedia, sube nuevos archivos y organiza contenido
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Archivos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssets.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Espacio Utilizado</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(stats.totalSize)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tipo Más Común</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stats.byType.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{stats.byType[0].count}</div>
                  <Badge variant="secondary">
                    {getTypeName(stats.byType[0].type)}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorías</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byCategory.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statistics Details */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Archivos por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.byType.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span>{getTypeName(item.type)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.count}</Badge>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ 
                            width: `${(item.count / stats.totalAssets) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* By Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Archivos por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.byCategory.map((item) => {
                  const categoryOption = MEDIA_CATEGORY_OPTIONS.find(opt => opt.value === item.category);
                  return (
                    <div key={item.category} className="flex items-center justify-between">
                      <span>{categoryOption?.label || item.category}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.count}</Badge>
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-secondary rounded-full transition-all"
                            style={{ 
                              width: `${(item.count / stats.totalAssets) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Biblioteca de Medios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Ver Archivos
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Subir Archivos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="mt-6">
              <MediaGallerySimple
                onEdit={handleEditAsset}
              />
            </TabsContent>

            <TabsContent value="upload" className="mt-6">
              <MediaUploader
                onUploadComplete={() => {
                  // Switch back to gallery and refresh stats
                  setActiveTab('gallery');
                  fetchStats();
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Asset Dialog */}
      {editingAsset && (
        <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Archivo</DialogTitle>
            </DialogHeader>

            <EditAssetForm
              asset={editingAsset}
              onSave={handleSaveAsset}
              onCancel={() => setEditingAsset(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Edit Asset Form Component
interface EditAssetFormProps {
  asset: MediaAsset;
  onSave: (updatedAsset: Partial<MediaAsset>) => void;
  onCancel: () => void;
}

function EditAssetForm({ asset, onSave, onCancel }: EditAssetFormProps) {
  const [formData, setFormData] = useState({
    originalName: asset.originalName,
    altTextEs: asset.altTextEs || '',
    altTextEn: asset.altTextEn || '',
    captionEs: asset.captionEs || '',
    captionEn: asset.captionEn || '',
    category: asset.category,
    tags: asset.tags,
    isPublic: asset.isPublic,
  });

  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Preview */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 flex-shrink-0">
          {asset.thumbnailUrl || asset.type === MediaType.IMAGE ? (
            <img
              src={asset.thumbnailUrl || asset.url}
              alt={asset.altTextEs || asset.altTextEn || asset.originalName}
              className="w-full h-full object-cover rounded border"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center border rounded bg-muted">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <p className="font-medium">{asset.fileName}</p>
          <p className="text-sm text-muted-foreground">
            {formatFileSize(asset.fileSize)} • {asset.mimeType}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="originalName">Nombre del Archivo</Label>
            <Input
              id="originalName"
              value={formData.originalName}
              onChange={(e) => setFormData(prev => ({ ...prev, originalName: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="altTextEs">Texto Alternativo (Español)</Label>
            <Input
              id="altTextEs"
              value={formData.altTextEs}
              onChange={(e) => setFormData(prev => ({ ...prev, altTextEs: e.target.value }))}
              placeholder="Descripción para accesibilidad en español"
            />
          </div>

          <div>
            <Label htmlFor="altTextEn">Texto Alternativo (Inglés)</Label>
            <Input
              id="altTextEn"
              value={formData.altTextEn}
              onChange={(e) => setFormData(prev => ({ ...prev, altTextEn: e.target.value }))}
              placeholder="Descripción para accesibilidad en inglés"
            />
          </div>

          <div>
            <Label htmlFor="captionEs">Leyenda (Español)</Label>
            <Input
              id="captionEs"
              value={formData.captionEs}
              onChange={(e) => setFormData(prev => ({ ...prev, captionEs: e.target.value }))}
              placeholder="Leyenda del archivo en español"
            />
          </div>

          <div>
            <Label htmlFor="captionEn">Leyenda (Inglés)</Label>
            <Input
              id="captionEn"
              value={formData.captionEn}
              onChange={(e) => setFormData(prev => ({ ...prev, captionEn: e.target.value }))}
              placeholder="Leyenda del archivo en inglés"
            />
          </div>
        </div>

        {/* Organization */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as MediaCategory }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEDIA_CATEGORY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <div>
            <Label>Etiquetas</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nueva etiqueta"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isPublic: checked as boolean }))
              }
            />
            <Label htmlFor="isPublic">Archivo público</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}