'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DigitalLibraryFormData, digitalLibraryFormSchema } from '@/lib/validations/digital-library';
import { PublicationType, PublicationStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RichTextEditor } from '@/components/cms/editor/rich-text-editor';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Save, 
  Eye, 
  Trash2, 
  Upload, 
  FileText, 
  Plus, 
  X,
  Download
} from 'lucide-react';

interface DigitalLibraryFormProps {
  initialData?: Partial<DigitalLibraryFormData>;
  publicationId?: string;
  onSave?: (data: DigitalLibraryFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function DigitalLibraryForm({ initialData, publicationId, onSave, onDelete }: DigitalLibraryFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [keywords, setKeywords] = useState<string[]>(initialData?.keywords || []);
  const [relatedPrograms, setRelatedPrograms] = useState<string[]>(initialData?.relatedPrograms || []);
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const form = useForm<DigitalLibraryFormData>({
    resolver: zodResolver(digitalLibraryFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      titleEs: initialData?.titleEs || initialData?.title || '',
      titleEn: initialData?.titleEn || initialData?.title || '',
      descriptionEs: initialData?.descriptionEs || initialData?.description || '',
      descriptionEn: initialData?.descriptionEn || initialData?.description || '',
      abstractEs: initialData?.abstractEs || '',
      abstractEn: initialData?.abstractEn || '',
      type: initialData?.type || PublicationType.REPORT,
      status: initialData?.status || PublicationStatus.DRAFT,
      featured: initialData?.featured || false,
      fileUrl: initialData?.fileUrl || '',
      fileName: initialData?.fileName || '',
      fileSize: initialData?.fileSize || 0,
      mimeType: initialData?.mimeType || '',
      coverImageUrl: initialData?.coverImageUrl || '',
      thumbnailUrl: initialData?.thumbnailUrl || '',
      tags: initialData?.tags || [],
      keywords: initialData?.keywords || [],
      relatedPrograms: initialData?.relatedPrograms || [],
      isbn: initialData?.isbn || '',
      doi: initialData?.doi || '',
      citationFormat: initialData?.citationFormat || '',
      downloadCount: initialData?.downloadCount || 0,
      viewCount: initialData?.viewCount || 0,
      publishDate: initialData?.publishDate || undefined,
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const watchedValues = watch();

  const onSubmit = async (data: DigitalLibraryFormData) => {
    try {
      setLoading(true);
      const formData = {
        ...data,
        tags,
        keywords,
        relatedPrograms,
      };
      await onSave?.(formData);
      toast({
        title: 'Éxito',
        description: publicationId ? 'Publicación actualizada correctamente' : 'Publicación creada correctamente',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al guardar la publicación',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!publicationId || !onDelete) return;

    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta publicación?');
    if (!confirmed) return;

    try {
      setLoading(true);
      await onDelete();
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
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'GENERAL');
      formData.append('folder', 'digital-library/documents');
      formData.append('isPublic', 'true');
      formData.append('altTextEs', `Documento: ${file.name}`);
      formData.append('altTextEn', `Document: ${file.name}`);

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir el documento');
      }

      const result = await response.json();
      
      setValue('fileUrl', result.asset.url);
      setValue('fileName', file.name);
      setValue('fileSize', file.size);
      setValue('mimeType', file.type);
      
      toast({
        title: 'Éxito',
        description: 'Documento subido correctamente',
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al subir el documento',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'LIBRARY_COVER');
      formData.append('folder', 'digital-library/covers');
      formData.append('isPublic', 'true');
      formData.append('altTextEs', 'Imagen de portada');
      formData.append('altTextEn', 'Cover image');

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      const result = await response.json();
      
      setValue('coverImageUrl', result.asset.url);
      
      toast({
        title: 'Éxito',
        description: 'Imagen de portada subida correctamente',
      });
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al subir la imagen',
        variant: 'destructive',
      });
    } finally {
      setUploadingCover(false);
      event.target.value = '';
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    setValue('tags', updatedTags);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      const updatedKeywords = [...keywords, newKeyword.trim()];
      setKeywords(updatedKeywords);
      setValue('keywords', updatedKeywords);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(updatedKeywords);
    setValue('keywords', updatedKeywords);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {publicationId ? 'Editar Publicación' : 'Nueva Publicación'}
        </h1>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.open('/preview/publication/' + publicationId, '_blank')}
            disabled={!publicationId}
          >
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          
          {publicationId && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          )}
          
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {publicationId ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Título de la publicación"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <Label>Descripción *</Label>
                <RichTextEditor
                  content={watchedValues.description}
                  onChange={(content) => setValue('description', content)}
                  placeholder="Descripción detallada de la publicación..."
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="abstract">Resumen/Abstract</Label>
                <Textarea
                  id="abstract"
                  {...register('abstract')}
                  placeholder="Resumen académico de la publicación"
                  rows={4}
                />
                {errors.abstract && (
                  <p className="text-sm text-destructive mt-1">{errors.abstract.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* File Information */}
          <Card>
            <CardHeader>
              <CardTitle>Archivo de la Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fileUrl">URL del archivo *</Label>
                <Input
                  id="fileUrl"
                  {...register('fileUrl')}
                  placeholder="https://ejemplo.com/documento.pdf"
                />
                {errors.fileUrl && (
                  <p className="text-sm text-destructive mt-1">{errors.fileUrl.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fileName">Nombre del archivo</Label>
                  <Input
                    id="fileName"
                    {...register('fileName')}
                    placeholder="documento.pdf"
                  />
                </div>
                <div>
                  <Label htmlFor="mimeType">Tipo MIME</Label>
                  <Input
                    id="mimeType"
                    {...register('mimeType')}
                    placeholder="application/pdf"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="fileSize">Tamaño del archivo (bytes)</Label>
                <Input
                  id="fileSize"
                  type="number"
                  {...register('fileSize', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
              
              {watchedValues.fileUrl && (
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <FileText className="w-5 h-5" />
                  <a
                    href={watchedValues.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex-1"
                  >
                    {watchedValues.fileName || 'Ver archivo'}
                  </a>
                  <Download className="w-4 h-4" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadatos Académicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    {...register('isbn')}
                    placeholder="978-0-123456-78-9"
                  />
                </div>
                <div>
                  <Label htmlFor="doi">DOI</Label>
                  <Input
                    id="doi"
                    {...register('doi')}
                    placeholder="10.1000/182"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="citationFormat">Formato de Cita</Label>
                <Textarea
                  id="citationFormat"
                  {...register('citationFormat')}
                  placeholder="Apellido, N. (2024). Título de la publicación. Editorial."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>


          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Etiquetas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nueva etiqueta"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="px-2 py-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Palabras Clave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Nueva palabra clave"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button
                    type="button"
                    onClick={addKeyword}
                    disabled={!newKeyword.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge key={index} className="px-2 py-1">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(index)}
                          className="ml-2 text-white hover:text-gray-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publication Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={watchedValues.status}
                  onValueChange={(value) => setValue('status', value as PublicationStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PublicationStatus.DRAFT}>Borrador</SelectItem>
                    <SelectItem value={PublicationStatus.REVIEW}>En Revisión</SelectItem>
                    <SelectItem value={PublicationStatus.PUBLISHED}>Publicado</SelectItem>
                    <SelectItem value={PublicationStatus.ARCHIVED}>Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={watchedValues.type}
                  onValueChange={(value) => setValue('type', value as PublicationType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PublicationType.RESEARCH_PAPER}>Documento de Investigación</SelectItem>
                    <SelectItem value={PublicationType.REPORT}>Informe</SelectItem>
                    <SelectItem value={PublicationType.INFOGRAPHIC}>Infografía</SelectItem>
                    <SelectItem value={PublicationType.POLICY_BRIEF}>Resumen de Política</SelectItem>
                    <SelectItem value={PublicationType.GUIDE}>Guía</SelectItem>
                    <SelectItem value={PublicationType.PRESENTATION}>Presentación</SelectItem>
                    <SelectItem value={PublicationType.VIDEO}>Video</SelectItem>
                    <SelectItem value={PublicationType.PODCAST}>Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={watchedValues.featured}
                  onCheckedChange={(checked) => setValue('featured', checked as boolean)}
                />
                <Label htmlFor="featured">Publicación destacada</Label>
              </div>

              <div>
                <Label htmlFor="publishDate">Fecha de publicación</Label>
                <Input
                  id="publishDate"
                  type="datetime-local"
                  {...register('publishDate', {
                    setValueAs: (value) => value ? new Date(value) : undefined,
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen de Portada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="coverImageUrl">URL de la portada</Label>
                  <Input
                    id="coverImageUrl"
                    {...register('coverImageUrl')}
                    placeholder="https://ejemplo.com/portada.jpg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="thumbnailUrl">URL de la miniatura</Label>
                  <Input
                    id="thumbnailUrl"
                    {...register('thumbnailUrl')}
                    placeholder="https://ejemplo.com/miniatura.jpg"
                  />
                </div>
                
                {watchedValues.coverImageUrl && (
                  <div className="mt-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={watchedValues.coverImageUrl}
                      alt="Portada"
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="downloadCount">Descargas</Label>
                  <Input
                    id="downloadCount"
                    type="number"
                    {...register('downloadCount', { valueAsNumber: true })}
                    placeholder="0"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="viewCount">Visualizaciones</Label>
                  <Input
                    id="viewCount"
                    type="number"
                    {...register('viewCount', { valueAsNumber: true })}
                    placeholder="0"
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}