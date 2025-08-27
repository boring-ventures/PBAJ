'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Save, Trash2, Tag, Plus, X } from 'lucide-react';

// Schema para categorías
const categoryFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  type: z.enum(['NEWS', 'PROGRAM', 'PUBLICATION']),
});

// Schema para etiquetas
const tagFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50),
  description: z.string().optional(),
  color: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;
type TagFormData = z.infer<typeof tagFormSchema>;

interface TaxonomyFormProps {
  type: 'category' | 'tag';
  initialData?: Partial<CategoryFormData | TagFormData>;
  itemId?: string;
  onSave?: (data: CategoryFormData | TagFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const PREDEFINED_COLORS = [
  { name: 'Rojo', value: '#ef4444' },
  { name: 'Naranja', value: '#f97316' },
  { name: 'Amarillo', value: '#eab308' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Púrpura', value: '#a855f7' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Gris', value: '#6b7280' },
];

const CATEGORY_TYPES = [
  { value: 'NEWS', label: 'Noticias' },
  { value: 'PROGRAM', label: 'Programas' },
  { value: 'PUBLICATION', label: 'Publicaciones' },
];

export function TaxonomyForm({ type, initialData, itemId, onSave, onDelete }: TaxonomyFormProps) {
  const [loading, setLoading] = useState(false);
  
  const schema = type === 'category' ? categoryFormSchema : tagFormSchema;
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: type === 'category' 
      ? {
          name: '',
          description: '',
          color: '#3b82f6',
          icon: '',
          type: 'NEWS' as const,
          ...initialData,
        }
      : {
          name: '',
          description: '',
          color: '#3b82f6',
          ...initialData,
        },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const watchedValues = watch();

  const onSubmit = async (data: CategoryFormData | TagFormData) => {
    try {
      setLoading(true);
      await onSave?.(data);
      toast({
        title: 'Éxito',
        description: `${type === 'category' ? 'Categoría' : 'Etiqueta'} ${itemId ? 'actualizada' : 'creada'} correctamente`,
      });
    } catch {
      toast({
        title: 'Error',
        description: `Ocurrió un error al guardar la ${type === 'category' ? 'categoría' : 'etiqueta'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemId || !onDelete) return;

    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar esta ${type === 'category' ? 'categoría' : 'etiqueta'}?`);
    if (!confirmed) return;

    try {
      setLoading(true);
      await onDelete();
      toast({
        title: 'Éxito',
        description: `${type === 'category' ? 'Categoría' : 'Etiqueta'} eliminada correctamente`,
      });
    } catch {
      toast({
        title: 'Error',
        description: `Ocurrió un error al eliminar la ${type === 'category' ? 'categoría' : 'etiqueta'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const title = type === 'category' 
    ? (itemId ? 'Editar Categoría' : 'Nueva Categoría')
    : (itemId ? 'Editar Etiqueta' : 'Nueva Etiqueta');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        
        <div className="flex items-center gap-2">
          {itemId && onDelete && (
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
            {itemId ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder={`Nombre de la ${type === 'category' ? 'categoría' : 'etiqueta'}`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder={`Descripción de la ${type === 'category' ? 'categoría' : 'etiqueta'}`}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>

              {type === 'category' && (
                <>
                  <div>
                    <Label htmlFor="type">Tipo de Contenido</Label>
                    <Select
                      value={watchedValues.type}
                      onValueChange={(value) => setValue('type', value as 'NEWS' | 'PROGRAM' | 'PUBLICATION')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_TYPES.map((categoryType) => (
                          <SelectItem key={categoryType.value} value={categoryType.value}>
                            {categoryType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="icon">Icono (opcional)</Label>
                    <Input
                      id="icon"
                      {...register('icon')}
                      placeholder="📚 (emoji o nombre de icono)"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Color Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Personalización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Color</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-full h-8 rounded-md border-2 flex items-center justify-center text-xs font-medium text-white ${
                        watchedValues.color === color.value 
                          ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setValue('color', color.value)}
                      title={color.name}
                    >
                      {watchedValues.color === color.value && '✓'}
                    </button>
                  ))}
                </div>
                
                <div className="mt-2">
                  <Label htmlFor="customColor">Color personalizado</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="customColor"
                      value={watchedValues.color || '#3b82f6'}
                      onChange={(e) => setValue('color', e.target.value)}
                      className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={watchedValues.color || '#3b82f6'}
                      onChange={(e) => setValue('color', e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              {watchedValues.name && (
                <div className="flex items-center justify-center p-4">
                  <Badge 
                    style={{ 
                      backgroundColor: watchedValues.color,
                      color: 'white'
                    }}
                    className="px-3 py-1"
                  >
                    {type === 'category' && watchedValues.icon && (
                      <span className="mr-2">{watchedValues.icon}</span>
                    )}
                    {watchedValues.name}
                  </Badge>
                </div>
              )}
              {!watchedValues.name && (
                <p className="text-center text-muted-foreground py-4">
                  Escribe un nombre para ver la vista previa
                </p>
              )}
            </CardContent>
          </Card>

          {/* Usage Stats (if editing) */}
          {itemId && (
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Elementos:</span>
                    <Badge variant="secondary">0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Última vez usado:</span>
                    <span className="text-sm text-muted-foreground">Nunca</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Las estadísticas se actualizarán cuando el {type === 'category' ? 'categoría' : 'etiqueta'} sea utilizada.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}