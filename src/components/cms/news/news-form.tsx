"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewsFormData, newsFormSchema } from "@/lib/validations/news";
import { NewsCategory, NewsStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/cms/editor/rich-text-editor";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save, Eye, Trash2, Upload, X } from "lucide-react";

interface NewsFormProps {
  initialData?: Partial<NewsFormData>;
  newsId?: string;
  onSave?: (data: NewsFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function NewsForm({
  initialData,
  newsId,
  onSave,
  onDelete,
}: NewsFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: NewsCategory.UPDATE,
      status: NewsStatus.DRAFT,
      featured: false,
      featuredImageUrl: "",
      publishDate: undefined,
      ...initialData,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const watchedValues = watch();

  const onSubmit = async (data: NewsFormData) => {
    try {
      setLoading(true);
      await onSave?.(data);
      toast({
        title: "Éxito",
        description: newsId
          ? "Noticia actualizada correctamente"
          : "Noticia creada correctamente",
      });
    } catch {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la noticia",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!newsId || !onDelete) return;

    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta noticia?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await onDelete();
      toast({
        title: "Éxito",
        description: "Noticia eliminada correctamente",
      });
    } catch {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la noticia",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturedImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFeatured(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "NEWS_MEDIA");
      formData.append("folder", "news/featured");
      formData.append("isPublic", "true");
      formData.append("altTextEs", "Imagen destacada de noticia");
      formData.append("altTextEn", "News featured image");

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir la imagen");
      }

      const result = await response.json();
      const imageUrl = result.asset.url;

      setValue("featuredImageUrl", imageUrl);
      toast({
        title: "Éxito",
        description: "Imagen destacada subida correctamente",
      });
    } catch (error) {
      console.error("Error uploading featured image:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al subir la imagen",
        variant: "destructive",
      });
    } finally {
      setUploadingFeatured(false);
      event.target.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {newsId ? "Editar Noticia" : "Nueva Noticia"}
        </h1>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.open("/preview/news/" + newsId, "_blank")}
            disabled={!newsId}
          >
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>

          {newsId && onDelete && (
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
            {newsId ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Título de la noticia"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.title.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    El contenido se traducirá automáticamente según el idioma
                    seleccionado por el usuario
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">Resumen</Label>
                  <Textarea
                    id="excerpt"
                    {...register("excerpt")}
                    placeholder="Breve resumen de la noticia"
                    rows={3}
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.excerpt.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Contenido *</Label>
                  <RichTextEditor
                    content={watchedValues.content}
                    onChange={(content) => setValue("content", content)}
                    placeholder="Escribe el contenido de la noticia..."
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.content.message}
                    </p>
                  )}
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
                  onValueChange={(value) =>
                    setValue("status", value as NewsStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NewsStatus.DRAFT}>Borrador</SelectItem>
                    <SelectItem value={NewsStatus.SCHEDULED}>
                      Programado
                    </SelectItem>
                    <SelectItem value={NewsStatus.PUBLISHED}>
                      Publicado
                    </SelectItem>
                    <SelectItem value={NewsStatus.ARCHIVED}>
                      Archivado
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={watchedValues.category}
                  onValueChange={(value) =>
                    setValue("category", value as NewsCategory)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NewsCategory.CAMPAIGN}>
                      Campaña
                    </SelectItem>
                    <SelectItem value={NewsCategory.UPDATE}>
                      Actualización
                    </SelectItem>
                    <SelectItem value={NewsCategory.EVENT}>Evento</SelectItem>
                    <SelectItem value={NewsCategory.ANNOUNCEMENT}>
                      Anuncio
                    </SelectItem>
                    <SelectItem value={NewsCategory.PRESS_RELEASE}>
                      Comunicado de Prensa
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={watchedValues.featured}
                  onCheckedChange={(checked) =>
                    setValue("featured", checked as boolean)
                  }
                />
                <Label htmlFor="featured">Artículo destacado</Label>
              </div>

              <div>
                <Label htmlFor="publishDate">Fecha de publicación</Label>
                <Input
                  id="publishDate"
                  type="datetime-local"
                  {...register("publishDate", {
                    setValueAs: (value) => {
                      if (!value || value === "") return undefined;
                      const date = new Date(value);
                      return isNaN(date.getTime()) ? undefined : date;
                    },
                  })}
                  value={
                    watchedValues.publishDate
                      ? watchedValues.publishDate instanceof Date
                        ? watchedValues.publishDate.toISOString().slice(0, 16)
                        : new Date(watchedValues.publishDate)
                            .toISOString()
                            .slice(0, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) {
                      setValue("publishDate", undefined);
                    } else {
                      const date = new Date(value);
                      setValue(
                        "publishDate",
                        isNaN(date.getTime()) ? undefined : date
                      );
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen destacada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                  id="featured-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("featured-image-upload")?.click()
                  }
                  className="w-full"
                  disabled={loading || uploadingFeatured}
                >
                  {uploadingFeatured && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {!uploadingFeatured && <Upload className="w-4 h-4 mr-2" />}
                  {uploadingFeatured ? "Subiendo..." : "Subir Imagen Destacada"}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                O ingresa una URL manualmente:
              </div>

              <div>
                <Label htmlFor="featuredImageUrl">URL de la imagen</Label>
                <Input
                  id="featuredImageUrl"
                  {...register("featuredImageUrl")}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {errors.featuredImageUrl && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.featuredImageUrl.message}
                  </p>
                )}
              </div>

              {watchedValues.featuredImageUrl && (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={watchedValues.featuredImageUrl}
                    alt="Vista previa"
                    className="w-full h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setValue("featuredImageUrl", "")}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remover Imagen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
