'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DigitalLibraryFormData, digitalLibraryFormSchema } from '@/lib/validations/digital-library';
import { PublicationCategory, PublicationType, PublicationStatus } from '@prisma/client';
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
  const [authors, setAuthors] = useState<string[]>(initialData?.authors || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [keywords, setKeywords] = useState<string[]>(initialData?.keywords || []);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const form = useForm<DigitalLibraryFormData>({
    resolver: zodResolver(digitalLibraryFormSchema),
    defaultValues: {
      title: '',
      description: '',
      abstract: '',
      type: PublicationType.RESEARCH_PAPER,
      category: PublicationCategory.RESEARCH,
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
      authors: [],
      isbn: '',
      doi: '',
      citationFormat: '',
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
        keywords,
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
      setValue('authors', updatedAuthors);
      setNewAuthor('');
    }
  };

  const removeAuthor = (index: number) => {
    const updatedAuthors = authors.filter((_, i) => i !== index);
    setAuthors(updatedAuthors);
    setValue('authors', updatedAuthors);
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

          {/* Authors */}
          <Card>
            <CardHeader>
              <CardTitle>Autores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Nombre del autor"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
                  />
                  <Button
                    type="button"
                    onClick={addAuthor}
                    disabled={!newAuthor.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {authors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {authors.map((author, index) => (
                      <Badge key={index} variant="secondary" className="px-2 py-1">
                        {author}
                        <button
                          type="button"
                          onClick={() => removeAuthor(index)}
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

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={watchedValues.category}
                  onValueChange={(value) => setValue('category', value as PublicationCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PublicationCategory.RESEARCH}>Investigación</SelectItem>
                    <SelectItem value={PublicationCategory.POLICY}>Política</SelectItem>
                    <SelectItem value={PublicationCategory.EDUCATION}>Educación</SelectItem>
                    <SelectItem value={PublicationCategory.ADVOCACY}>Incidencia</SelectItem>
                    <SelectItem value={PublicationCategory.REPORTS}>Informes</SelectItem>
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