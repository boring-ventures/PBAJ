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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('spanish');
  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTag, setNewTag] = useState('');

  const form = useForm<DigitalLibraryFormData>({
    resolver: zodResolver(digitalLibraryFormSchema),
    defaultValues: {
      title: '',
      description: '',
      titleEs: '',
      titleEn: '',
      descriptionEs: '',
      descriptionEn: '',
      abstractEs: '',
      abstractEn: '',
      type: PublicationType.REPORT,
      status: PublicationStatus.DRAFT,
      featured: false,
      fileUrl: '',
      fileName: '',
      fileSize: 0,
      mimeType: '',
      coverImageUrl: '',
      thumbnailUrl: '',
      tags: [],
      keywords: [],
      relatedPrograms: [],
      downloadCount: 0,
      viewCount: 0,
      publishDate: undefined,
      ...initialData,
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const watchedValues = watch();

  const onSubmit = async (data: DigitalLibraryFormData) => {
    try {
      setLoading(true);
      
      const formData = {
        ...data,
        authors,
        tags,
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

  const addAuthor = () => {
    if (newAuthor.trim() && !authors.includes(newAuthor.trim())) {
      const updatedAuthors = [...authors, newAuthor.trim()];
      setAuthors(updatedAuthors);
      setNewAuthor('');
    }
  };

  const removeAuthor = (authorToRemove: string) => {
    const updatedAuthors = authors.filter(author => author !== authorToRemove);
    setAuthors(updatedAuthors);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            onClick={() => window.open('/preview/library/' + publicationId, '_blank')}
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
          {/* Language Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Publicación</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="spanish">Español</TabsTrigger>
                  <TabsTrigger value="english">English</TabsTrigger>
                </TabsList>
                
                <TabsContent value="spanish" className="space-y-4">
                  <div>
                    <Label htmlFor="titleEs">Título *</Label>
                    <Input
                      id="titleEs"
                      {...register('titleEs')}
                      placeholder="Título de la publicación en español"
                    />
                    {errors.titleEs && (
                      <p className="text-sm text-destructive mt-1">{errors.titleEs.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="summaryEs">Resumen</Label>
                    <Textarea
                      id="summaryEs"
                      {...register('abstractEs')}
                      placeholder="Breve resumen de la publicación"
                      rows={3}
                    />
                    {errors.abstractEs && (
                      <p className="text-sm text-destructive mt-1">{errors.abstractEs.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Descripción *</Label>
                    <RichTextEditor
                      content={watchedValues.descriptionEs}
                      onChange={(content) => setValue('descriptionEs', content)}
                      placeholder="Descripción detallada de la publicación en español..."
                    />
                    {errors.descriptionEs && (
                      <p className="text-sm text-destructive mt-1">{errors.descriptionEs.message}</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="english" className="space-y-4">
                  <div>
                    <Label htmlFor="titleEn">Title *</Label>
                    <Input
                      id="titleEn"
                      {...register('titleEn')}
                      placeholder="Publication title in English"
                    />
                    {errors.titleEn && (
                      <p className="text-sm text-destructive mt-1">{errors.titleEn.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="summaryEn">Summary</Label>
                    <Textarea
                      id="summaryEn"
                      {...register('abstractEn')}
                      placeholder="Brief publication summary"
                      rows={3}
                    />
                    {errors.abstractEn && (
                      <p className="text-sm text-destructive mt-1">{errors.abstractEn.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Description *</Label>
                    <RichTextEditor
                      content={watchedValues.descriptionEn}
                      onChange={(content) => setValue('descriptionEn', content)}
                      placeholder="Detailed publication description in English..."
                    />
                    {errors.descriptionEn && (
                      <p className="text-sm text-destructive mt-1">{errors.descriptionEn.message}</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* File Information */}
          <Card>
            <CardHeader>
              <CardTitle>Archivo de la Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fileUrl">URL del Archivo *</Label>
                <div className="flex gap-2">
                  <Input
                    id="fileUrl"
                    {...register('fileUrl')}
                    placeholder="https://ejemplo.com/documento.pdf"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Subir
                  </Button>
                </div>
                {errors.fileUrl && (
                  <p className="text-sm text-destructive mt-1">{errors.fileUrl.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fileType">Tipo de Archivo</Label>
                  <Input
                    id="fileType"
                    {...register('mimeType')}
                    placeholder="application/pdf"
                  />
                </div>
                <div>
                  <Label htmlFor="fileSize">Tamaño del Archivo (bytes)</Label>
                  <Input
                    id="fileSize"
                    type="number"
                    {...register('fileSize', {
                      setValueAs: (value) => value ? Number(value) : undefined,
                    })}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Page Count field removed - not in schema
              <div>
                <Label htmlFor="pageCount">Número de Páginas</Label>
                <Input
                  id="pageCount"
                  type="number"
                  {...register('pageCount', {
                    setValueAs: (value) => value ? Number(value) : undefined,
                  })}
                  placeholder="0"
                />
              </div>
              */}

              {watchedValues.fileUrl && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium truncate">{watchedValues.fileUrl}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {watchedValues.fileSize && watchedValues.fileSize > 0 && (
                          <span>{formatFileSize(watchedValues.fileSize)}</span>
                        )}
                        {watchedValues.mimeType && (
                          <span>{watchedValues.mimeType}</span>
                        )}
                      </div>
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Authors and Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Autores y Etiquetas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Authors */}
              <div>
                <Label>Autores</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Nombre del autor"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
                  />
                  <Button type="button" onClick={addAuthor} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {authors.map((author, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {author}
                      <button
                        type="button"
                        onClick={() => removeAuthor(author)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Etiquetas</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Etiqueta"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
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
                    <SelectItem value={PublicationStatus.PUBLISHED}>Publicado</SelectItem>
                    <SelectItem value={PublicationStatus.ARCHIVED}>Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={watchedValues.type}
                  onValueChange={(value) => setValue('type', value as PublicationType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PublicationType.RESEARCH_PAPER}>Artículo de Investigación</SelectItem>
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

              {/* Language field removed - not in schema
              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={watchedValues.language}
                  onValueChange={(value) => setValue('language', value as 'es' | 'en' | 'both')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Bilingüe</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              */}

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
              <div>
                <Label htmlFor="coverImageUrl">URL de la imagen</Label>
                <Input
                  id="coverImageUrl"
                  {...register('coverImageUrl')}
                  placeholder="https://ejemplo.com/portada.jpg"
                />
                {errors.coverImageUrl && (
                  <p className="text-sm text-destructive mt-1">{errors.coverImageUrl.message}</p>
                )}
              </div>
              
              {watchedValues.coverImageUrl && (
                <div className="mt-4">
                  <img
                    src={watchedValues.coverImageUrl}
                    alt="Vista previa"
                    className="w-full h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ISBN and DOI fields removed - not in schema
              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  {...register('isbn')}
                  placeholder="978-3-16-148410-0"
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
              */}

              {publicationId && (
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Descargas:</span>
                    <span className="font-medium">{watchedValues.downloadCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Visualizaciones:</span>
                    <span className="font-medium">{watchedValues.viewCount}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}