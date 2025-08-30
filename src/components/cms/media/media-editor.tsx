'use client';

import { useState, useEffect } from 'react';
import { MediaType, MediaCategory } from '@prisma/client';
import { formatFileSize, MEDIA_CATEGORY_OPTIONS } from '@/lib/validations/media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Tag, 
  Eye, 
  Globe, 
  Lock,
  Image,
  FileText,
  Video,
  Music,
  Archive,
  File,
  Download,
  Copy,
  Trash2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  createdAt: string;
  updatedAt: string;
  uploader?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

interface MediaEditorProps {
  asset: MediaAsset;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedAsset: MediaAsset) => void;
  onDelete?: (assetId: string) => void;
}

const FILE_TYPE_ICONS = {
  [MediaType.IMAGE]: Image,
  [MediaType.VIDEO]: Video,
  [MediaType.AUDIO]: Music,
  [MediaType.DOCUMENT]: FileText,
  [MediaType.ARCHIVE]: Archive,
};

export function MediaEditor({ asset, isOpen, onClose, onSave, onDelete }: MediaEditorProps) {
  const [editedAsset, setEditedAsset] = useState<MediaAsset>(asset);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('metadata');

  useEffect(() => {
    setEditedAsset(asset);
  }, [asset]);

  const handleInputChange = (field: keyof MediaAsset, value: any) => {
    setEditedAsset(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !editedAsset.tags.includes(newTag.trim())) {
      const tag = newTag.trim();
      setEditedAsset(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedAsset(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/media/${asset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          altTextEs: editedAsset.altTextEs,
          altTextEn: editedAsset.altTextEn,
          captionEs: editedAsset.captionEs,
          captionEn: editedAsset.captionEn,
          tags: editedAsset.tags,
          category: editedAsset.category,
          isPublic: editedAsset.isPublic,
        }),
      });

      if (!response.ok) throw new Error('Failed to update asset');

      const result = await response.json();
      
      toast.success('Asset updated successfully');
      onSave?.(result.asset || editedAsset);
      onClose();
    } catch (error) {
      console.error('Error updating asset:', error);
      toast.error('Failed to update asset');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this media asset? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/media/${asset.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete asset');

      toast.success('Asset deleted successfully');
      onDelete?.(asset.id);
      onClose();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const FileIcon = FILE_TYPE_ICONS[asset.type] || File;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Edit Media Asset
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>

          <TabsContent value="metadata" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editedAsset.category}
                      onValueChange={(value) => handleInputChange('category', value as MediaCategory)}
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

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublic"
                      checked={editedAsset.isPublic}
                      onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                    />
                    <Label htmlFor="isPublic" className="flex items-center gap-2">
                      {editedAsset.isPublic ? (
                        <>
                          <Globe className="w-4 h-4 text-green-600" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-gray-600" />
                          Private
                        </>
                      )}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bilingual Alt Text */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alt Text (Accessibility)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="altTextEs">Spanish Alt Text</Label>
                    <Textarea
                      id="altTextEs"
                      value={editedAsset.altTextEs || ''}
                      onChange={(e) => handleInputChange('altTextEs', e.target.value)}
                      placeholder="Descripción de la imagen en español"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="altTextEn">English Alt Text</Label>
                    <Textarea
                      id="altTextEn"
                      value={editedAsset.altTextEn || ''}
                      onChange={(e) => handleInputChange('altTextEn', e.target.value)}
                      placeholder="Image description in English"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bilingual Captions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Captions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="captionEs">Spanish Caption</Label>
                    <Textarea
                      id="captionEs"
                      value={editedAsset.captionEs || ''}
                      onChange={(e) => handleInputChange('captionEs', e.target.value)}
                      placeholder="Leyenda en español"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="captionEn">English Caption</Label>
                    <Textarea
                      id="captionEn"
                      value={editedAsset.captionEn || ''}
                      onChange={(e) => handleInputChange('captionEn', e.target.value)}
                      placeholder="Caption in English"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a new tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {editedAsset.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {editedAsset.tags.length === 0 && (
                    <p className="text-sm text-muted-foreground">No tags added</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  File Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {asset.type === MediaType.IMAGE ? (
                    <div className="space-y-4">
                      <img
                        src={asset.url}
                        alt={asset.altTextEs || asset.altTextEn || asset.originalName}
                        className="max-w-full h-auto max-h-96 mx-auto rounded-lg border"
                      />
                      {asset.dimensions && (
                        <p className="text-sm text-muted-foreground">
                          Dimensions: {asset.dimensions}
                        </p>
                      )}
                    </div>
                  ) : asset.type === MediaType.VIDEO ? (
                    <div className="space-y-4">
                      <video
                        src={asset.url}
                        controls
                        className="max-w-full h-auto max-h-96 mx-auto rounded-lg border"
                      />
                      {asset.dimensions && (
                        <p className="text-sm text-muted-foreground">
                          Dimensions: {asset.dimensions}
                        </p>
                      )}
                      {asset.duration && (
                        <p className="text-sm text-muted-foreground">
                          Duration: {Math.floor(asset.duration / 60)}:{(asset.duration % 60).toString().padStart(2, '0')}
                        </p>
                      )}
                    </div>
                  ) : asset.type === MediaType.AUDIO ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center h-32 border rounded-lg bg-muted">
                        <Music className="w-16 h-16 text-muted-foreground" />
                      </div>
                      <audio
                        src={asset.url}
                        controls
                        className="w-full max-w-md mx-auto"
                      />
                      {asset.duration && (
                        <p className="text-sm text-muted-foreground">
                          Duration: {Math.floor(asset.duration / 60)}:{(asset.duration % 60).toString().padStart(2, '0')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center h-32 border rounded-lg bg-muted">
                        <FileIcon className="w-16 h-16 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Preview not available for this file type
                      </p>
                      <Button variant="outline" asChild>
                        <a href={asset.url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Download to view
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">File Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">FILENAME</Label>
                    <p className="font-medium">{asset.fileName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">ORIGINAL NAME</Label>
                    <p>{asset.originalName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">FILE SIZE</Label>
                    <p>{formatFileSize(asset.fileSize)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">MIME TYPE</Label>
                    <p className="font-mono text-sm">{asset.mimeType}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">TYPE</Label>
                    <p>{asset.type}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={asset.url}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(asset.url)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics & Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics & Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">DOWNLOADS</Label>
                    <p>{asset.downloadCount}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">CREATED</Label>
                    <p>{formatDate(asset.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">UPDATED</Label>
                    <p>{formatDate(asset.updatedAt)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">UPLOADER</Label>
                    <p>{asset.uploader?.firstName} {asset.uploader?.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">VISIBILITY</Label>
                    <div className="flex items-center gap-2">
                      {asset.isPublic ? (
                        <>
                          <Globe className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Public</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Private</span>
                        </>
                      )}
                    </div>
                  </div>
                  {asset.thumbnailUrl && (
                    <div>
                      <Label className="text-xs text-muted-foreground">THUMBNAIL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={asset.thumbnailUrl}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(asset.thumbnailUrl!)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSaving || isDeleting}
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}