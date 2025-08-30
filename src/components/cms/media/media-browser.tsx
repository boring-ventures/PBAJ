'use client';

import { useState } from 'react';
import { MediaType, MediaCategory } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MediaGallery } from './media-gallery';
import { MediaUploader } from './media-uploader';
import { Upload, Image, Check } from 'lucide-react';

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

interface MediaBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (assets: MediaAsset[]) => void;
  selectedAssets?: MediaAsset[];
  selectionMode?: 'single' | 'multiple';
  maxSelections?: number;
  allowedTypes?: MediaType[];
  title?: string;
  description?: string;
  category?: MediaCategory;
  folder?: string;
}

export function MediaBrowser({
  isOpen,
  onClose,
  onSelect,
  selectedAssets = [],
  selectionMode = 'single',
  maxSelections,
  allowedTypes,
  title = 'Seleccionar Media',
  description = 'Elige archivos de tu biblioteca multimedia o sube nuevos archivos',
  category,
  folder
}: MediaBrowserProps) {
  const [currentSelectedAssets, setCurrentSelectedAssets] = useState<MediaAsset[]>(selectedAssets);
  const [activeTab, setActiveTab] = useState('gallery');

  const handleSelect = (assets: MediaAsset[]) => {
    setCurrentSelectedAssets(assets);
  };

  const handleConfirm = () => {
    onSelect(currentSelectedAssets);
    onClose();
  };

  const handleUploadComplete = (uploadedAssets: unknown[]) => {
    // Switch to gallery tab to show uploaded files
    setActiveTab('gallery');
    
    // If in single selection mode, automatically select the first uploaded asset
    if (selectionMode === 'single' && uploadedAssets.length > 0) {
      const firstAsset = uploadedAssets[0] as { asset: MediaAsset };
      setCurrentSelectedAssets([firstAsset.asset]);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            {title}
          </DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>

        {/* Selection summary */}
        {currentSelectedAssets.length > 0 && (
          <div className="flex items-center gap-2 px-1">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Check className="w-3 h-3" />
              {currentSelectedAssets.length} seleccionado{currentSelectedAssets.length > 1 ? 's' : ''}
              {maxSelections && ` de ${maxSelections}`}
            </Badge>
            {currentSelectedAssets.map((asset, index) => (
              <Badge key={asset.id} variant="outline" className="text-xs">
                {asset.originalName}
                {index < currentSelectedAssets.length - 1 && ', '}
              </Badge>
            ))}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Biblioteca
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Subir archivos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="flex-1 mt-4 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <MediaGallery
                onSelect={handleSelect}
                selectionMode={selectionMode}
                selectedAssets={currentSelectedAssets}
                maxSelections={maxSelections}
                allowedTypes={allowedTypes}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 mt-4 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <MediaUploader
                category={category}
                folder={folder}
                onUploadComplete={handleUploadComplete}
                maxFiles={maxSelections || 10}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectionMode === 'single' 
              ? 'Selecciona un archivo' 
              : `Selecciona hasta ${maxSelections || 'varios'} archivos`
            }
            {allowedTypes && allowedTypes.length > 0 && (
              <span className="ml-2">
                • Solo {allowedTypes.join(', ').toLowerCase()}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={currentSelectedAssets.length === 0}
            >
              Seleccionar ({currentSelectedAssets.length})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Media picker component for forms
interface MediaPickerProps {
  value?: MediaAsset | MediaAsset[];
  onChange: (value: MediaAsset | MediaAsset[] | undefined) => void;
  selectionMode?: 'single' | 'multiple';
  maxSelections?: number;
  allowedTypes?: MediaType[];
  placeholder?: string;
  category?: MediaCategory;
  folder?: string;
  className?: string;
}

export function MediaPicker({
  value,
  onChange,
  selectionMode = 'single',
  maxSelections,
  allowedTypes,
  placeholder = 'Seleccionar archivo',
  category,
  folder,
  className
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedAssets = value 
    ? Array.isArray(value) 
      ? value 
      : [value]
    : [];

  const handleSelect = (assets: MediaAsset[]) => {
    if (selectionMode === 'single') {
      onChange(assets[0] || undefined);
    } else {
      onChange(assets.length > 0 ? assets : undefined);
    }
  };

  const handleRemove = (assetToRemove: MediaAsset) => {
    if (selectionMode === 'single') {
      onChange(undefined);
    } else if (Array.isArray(value)) {
      const newAssets = value.filter(asset => asset.id !== assetToRemove.id);
      onChange(newAssets.length > 0 ? newAssets : undefined);
    }
  };

  return (
    <div className={className}>
      {selectedAssets.length > 0 ? (
        <div className="space-y-2">
          {selectedAssets.map((asset) => (
            <div key={asset.id} className="flex items-center gap-3 p-3 border rounded-lg">
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
                    <Image className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{asset.originalName}</p>
                <p className="text-sm text-muted-foreground">
                  {asset.type} • {asset.mimeType}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(true)}
                >
                  Cambiar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(asset)}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
          
          {selectionMode === 'multiple' && (!maxSelections || selectedAssets.length < maxSelections) && (
            <Button
              variant="outline"
              onClick={() => setIsOpen(true)}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Agregar más archivos
            </Button>
          )}
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full h-24 border-dashed"
        >
          <div className="text-center">
            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p>{placeholder}</p>
          </div>
        </Button>
      )}

      <MediaBrowser
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelect}
        selectedAssets={selectedAssets}
        selectionMode={selectionMode}
        maxSelections={maxSelections}
        allowedTypes={allowedTypes}
        category={category}
        folder={folder}
      />
    </div>
  );
}