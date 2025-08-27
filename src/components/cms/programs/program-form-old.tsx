'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProgramFormData, programFormSchema } from '@/lib/validations/programs';
import { ProgramStatus, ProgramType } from '@prisma/client';
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
import { Loader2, Save, Eye, Trash2, Plus, X, FileText } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ProgramFormProps {
  initialData?: Partial<ProgramFormData>;
  programId?: string;
  onSave?: (data: ProgramFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function ProgramForm({ initialData, programId, onSave, onDelete }: ProgramFormProps) {
  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>(initialData?.galleryImages || []);
  const [documentUrls, setDocumentUrls] = useState<string[]>(initialData?.documentUrls || []);

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      title: '',
      description: '',
      overview: '',
      objectives: '',
      type: ProgramType.CAPACITY_BUILDING,
      status: ProgramStatus.PLANNING,
      featured: false,
      featuredImageUrl: '',
      galleryImages: [],
      documentUrls: [],
      targetPopulation: '',
      region: '',
      budget: 0,
      progressPercentage: 0,
      ...initialData,
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const watchedValues = watch();

  const onSubmit = async (data: ProgramFormData) => {
    try {
      setLoading(true);
      
      const formData = {
        ...data,
        galleryImages,
        documentUrls,
      };
      
      await onSave?.(formData);
      toast({
        title: 'Éxito',
        description: programId ? 'Programa actualizado correctamente' : 'Programa creado correctamente',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al guardar el programa',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!programId || !onDelete) return;

    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este programa?');
    if (!confirmed) return;

    try {
      setLoading(true);
      await onDelete();
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
    } finally {
      setLoading(false);
    }
  };

  const addGalleryImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url && !galleryImages.includes(url)) {
      const newGallery = [...galleryImages, url];
      setGalleryImages(newGallery);
      setValue('galleryImages', newGallery);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newGallery);
    setValue('galleryImages', newGallery);
  };

  const addDocument = () => {
    const url = prompt('Ingresa la URL del documento:');
    if (url && !documentUrls.includes(url)) {
      const newDocs = [...documentUrls, url];
      setDocumentUrls(newDocs);
      setValue('documentUrls', newDocs);
    }
  };

  const removeDocument = (index: number) => {
    const newDocs = documentUrls.filter((_, i) => i !== index);
    setDocumentUrls(newDocs);
    setValue('documentUrls', newDocs);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {programId ? 'Editar Programa' : 'Nuevo Programa'}
        </h1>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.open('/preview/program/' + programId, '_blank')}
            disabled={!programId}
          >
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          
          {programId && onDelete && (
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
            {programId ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Language Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Programa</CardTitle>
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
                      placeholder="Título del programa en español"
                    />
                    {errors.titleEs && (
                      <p className="text-sm text-destructive mt-1">{errors.titleEs.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="descriptionEs">Descripción *</Label>
                    <RichTextEditor
                      content={watchedValues.descriptionEs}
                      onChange={(content) => setValue('descriptionEs', content)}
                      placeholder="Descripción del programa en español..."
                    />
                    {errors.descriptionEs && (
                      <p className="text-sm text-destructive mt-1">{errors.descriptionEs.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="overviewEs">Resumen General</Label>
                    <Textarea
                      id="overviewEs"
                      {...register('overviewEs')}
                      placeholder="Resumen general del programa"
                      rows={3}
                    />
                    {errors.overviewEs && (
                      <p className="text-sm text-destructive mt-1">{errors.overviewEs.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="objectivesEs">Objetivos</Label>
                    <RichTextEditor
                      content={watchedValues.objectivesEs}
                      onChange={(content) => setValue('objectivesEs', content)}
                      placeholder="Objetivos específicos del programa..."
                    />
                    {errors.objectivesEs && (
                      <p className="text-sm text-destructive mt-1">{errors.objectivesEs.message}</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="english" className="space-y-4">
                  <div>
                    <Label htmlFor="titleEn">Title *</Label>
                    <Input
                      id="titleEn"
                      {...register('titleEn')}
                      placeholder="Program title in English"
                    />
                    {errors.titleEn && (
                      <p className="text-sm text-destructive mt-1">{errors.titleEn.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="descriptionEn">Description *</Label>
                    <RichTextEditor
                      content={watchedValues.descriptionEn}
                      onChange={(content) => setValue('descriptionEn', content)}
                      placeholder="Program description in English..."
                    />
                    {errors.descriptionEn && (
                      <p className="text-sm text-destructive mt-1">{errors.descriptionEn.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="overviewEn">Overview</Label>
                    <Textarea
                      id="overviewEn"
                      {...register('overviewEn')}
                      placeholder="Program overview"
                      rows={3}
                    />
                    {errors.overviewEn && (
                      <p className="text-sm text-destructive mt-1">{errors.overviewEn.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="objectivesEn">Objectives</Label>
                    <RichTextEditor
                      content={watchedValues.objectivesEn}
                      onChange={(content) => setValue('objectivesEn', content)}
                      placeholder="Program specific objectives..."
                    />
                    {errors.objectivesEn && (
                      <p className="text-sm text-destructive mt-1">{errors.objectivesEn.message}</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Gallery Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Galería de Imágenes
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGalleryImage}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeGalleryImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              {galleryImages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay imágenes agregadas. Haz clic en &quot;Agregar&quot; para incluir imágenes.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Documentos
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDocument}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documentUrls.map((docUrl, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[300px]">{docUrl}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {documentUrls.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay documentos agregados. Haz clic en &quot;Agregar&quot; para incluir documentos.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Programa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={watchedValues.status}
                  onValueChange={(value) => setValue('status', value as ProgramStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProgramStatus.PLANNING}>Planificación</SelectItem>
                    <SelectItem value={ProgramStatus.ACTIVE}>Activo</SelectItem>
                    <SelectItem value={ProgramStatus.ON_HOLD}>En Pausa</SelectItem>
                    <SelectItem value={ProgramStatus.COMPLETED}>Completado</SelectItem>
                    <SelectItem value={ProgramStatus.CANCELLED}>Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Tipo de Programa</Label>
                <Select
                  value={watchedValues.type}
                  onValueChange={(value) => setValue('type', value as ProgramType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProgramType.ADVOCACY}>Incidencia</SelectItem>
                    <SelectItem value={ProgramType.CAPACITY_BUILDING}>Fortalecimiento</SelectItem>
                    <SelectItem value={ProgramType.RESEARCH}>Investigación</SelectItem>
                    <SelectItem value={ProgramType.EDUCATION}>Educación</SelectItem>
                    <SelectItem value={ProgramType.COMMUNITY}>Comunitario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={watchedValues.featured}
                  onCheckedChange={(checked) => setValue('featured', checked as boolean)}
                />
                <Label htmlFor="featured">Programa destacado</Label>
              </div>

              <div>
                <Label>Progreso ({watchedValues.progressPercentage}%)</Label>
                <Slider
                  value={[watchedValues.progressPercentage]}
                  onValueChange={(value) => setValue('progressPercentage', value[0])}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="startDate">Fecha de Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate', {
                    setValueAs: (value) => value ? new Date(value) : undefined,
                  })}
                />
              </div>

              <div>
                <Label htmlFor="endDate">Fecha de Finalización</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate', {
                    setValueAs: (value) => value ? new Date(value) : undefined,
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="featuredImageUrl">URL de la imagen</Label>
                <Input
                  id="featuredImageUrl"
                  {...register('featuredImageUrl')}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {errors.featuredImageUrl && (
                  <p className="text-sm text-destructive mt-1">{errors.featuredImageUrl.message}</p>
                )}
              </div>
              
              {watchedValues.featuredImageUrl && (
                <div className="mt-4">
                  <img
                    src={watchedValues.featuredImageUrl}
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

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="targetPopulation">Población Objetivo</Label>
                <Textarea
                  id="targetPopulation"
                  {...register('targetPopulation')}
                  placeholder="Describe la población objetivo del programa"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="region">Región/Área</Label>
                <Input
                  id="region"
                  {...register('region')}
                  placeholder="Área geográfica de implementación"
                />
              </div>

              <div>
                <Label htmlFor="budget">Presupuesto (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  {...register('budget', {
                    setValueAs: (value) => value ? Number(value) : undefined,
                  })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}