"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramFormData, programFormSchema } from "@/lib/validations/programs";
import { ProgramStatus, ProgramType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Loader2,
  Save,
  Eye,
  Trash2,
  Plus,
  X,
  FileText,
  Upload,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ProgramFormProps {
  initialData?: Partial<ProgramFormData>;
  programId?: string;
  onSave?: (data: ProgramFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function ProgramForm({
  initialData,
  programId,
  onSave,
  onDelete,
}: ProgramFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialData?.galleryImages || []
  );
  const [documentUrls, setDocumentUrls] = useState<string[]>(
    initialData?.documentUrls || []
  );

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      titleEs: initialData?.titleEs || "",
      titleEn: initialData?.titleEn || "",
      descriptionEs: initialData?.descriptionEs || "",
      descriptionEn: initialData?.descriptionEn || "",
      overviewEs: initialData?.overviewEs || "",
      overviewEn: initialData?.overviewEn || "",
      objectivesEs: initialData?.objectivesEs || "",
      objectivesEn: initialData?.objectivesEn || "",
      type: initialData?.type || ProgramType.CAPACITY_BUILDING,
      status: initialData?.status || ProgramStatus.PLANNING,
      featured: initialData?.featured || false,
      featuredImageUrl: initialData?.featuredImageUrl || "",
      galleryImages: initialData?.galleryImages || [],
      documentUrls: initialData?.documentUrls || [],
      targetPopulation: initialData?.targetPopulation || "",
      region: initialData?.region || "",
      budget: initialData?.budget || 0,
      progressPercentage: initialData?.progressPercentage || 0,
      startDate: initialData?.startDate
        ? initialData.startDate instanceof Date
          ? initialData.startDate
          : new Date(initialData.startDate)
        : undefined,
      endDate: initialData?.endDate
        ? initialData.endDate instanceof Date
          ? initialData.endDate
          : new Date(initialData.endDate)
        : undefined,
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
        title: "Éxito",
        description: programId
          ? "Programa actualizado correctamente"
          : "Programa creado correctamente",
      });
    } catch {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el programa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!programId || !onDelete) return;

    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este programa?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await onDelete();
      toast({
        title: "Éxito",
        description: "Programa eliminado correctamente",
      });
    } catch {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el programa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "PROGRAM_MEDIA");
        formData.append("folder", "programs/gallery");
        formData.append("isPublic", "true");
        formData.append("altTextEs", `Imagen de galería del programa`);
        formData.append("altTextEn", `Program gallery image`);

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

        if (!galleryImages.includes(imageUrl)) {
          const newImages = [...galleryImages, imageUrl];
          setGalleryImages(newImages);
          setValue("galleryImages", newImages);
        }
      } catch (error) {
        console.error("Error uploading gallery image:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Error al subir la imagen",
          variant: "destructive",
        });
      }
    }

    setUploading(false);
    // Reset input
    event.target.value = "";
  };

  const removeGalleryImage = (index: number) => {
    const newImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newImages);
    setValue("galleryImages", newImages);
  };

  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "GENERAL");
        formData.append("folder", "programs/documents");
        formData.append("isPublic", "true");
        formData.append("altTextEs", `Documento del programa: ${file.name}`);
        formData.append("altTextEn", `Program document: ${file.name}`);

        const response = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al subir el documento");
        }

        const result = await response.json();
        const documentUrl = result.asset.url;

        if (!documentUrls.includes(documentUrl)) {
          const newDocs = [...documentUrls, documentUrl];
          setDocumentUrls(newDocs);
          setValue("documentUrls", newDocs);
        }
      } catch (error) {
        console.error("Error uploading document:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Error al subir el documento",
          variant: "destructive",
        });
      }
    }

    setUploading(false);
    // Reset input
    event.target.value = "";
  };

  const removeDocument = (index: number) => {
    const newDocs = documentUrls.filter((_, i) => i !== index);
    setDocumentUrls(newDocs);
    setValue("documentUrls", newDocs);
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
      formData.append("category", "PROGRAM_MEDIA");
      formData.append("folder", "programs/featured");
      formData.append("isPublic", "true");
      formData.append("altTextEs", "Imagen destacada del programa");
      formData.append("altTextEn", "Program featured image");

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al subir la imagen destacada"
        );
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
          error instanceof Error
            ? error.message
            : "Error al subir la imagen destacada",
        variant: "destructive",
      });
    } finally {
      setUploadingFeatured(false);
      // Reset input
      event.target.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {programId ? "Editar Programa" : "Nuevo Programa"}
        </h1>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              window.open("/preview/program/" + programId, "_blank")
            }
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
            {programId ? "Actualizar" : "Crear"}
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
                <Label htmlFor="titleEs">Título (Español) *</Label>
                <Input
                  id="titleEs"
                  {...register("titleEs")}
                  placeholder="Título del programa en español"
                />
                {errors.titleEs && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.titleEs.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="titleEn">Título (English) *</Label>
                <Input
                  id="titleEn"
                  {...register("titleEn")}
                  placeholder="Program title in English"
                />
                {errors.titleEn && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.titleEn.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="overviewEs">Resumen General (Español)</Label>
                <Textarea
                  id="overviewEs"
                  {...register("overviewEs")}
                  placeholder="Breve resumen del programa en español"
                  rows={3}
                />
                {errors.overviewEs && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.overviewEs.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="overviewEn">General Overview (English)</Label>
                <Textarea
                  id="overviewEn"
                  {...register("overviewEn")}
                  placeholder="Brief program overview in English"
                  rows={3}
                />
                {errors.overviewEn && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.overviewEn.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Descripción (Español) *</Label>
                <RichTextEditor
                  content={watchedValues.descriptionEs}
                  onChange={(content) => setValue("descriptionEs", content)}
                  placeholder="Descripción detallada del programa en español..."
                />
                {errors.descriptionEs && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.descriptionEs.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Description (English) *</Label>
                <RichTextEditor
                  content={watchedValues.descriptionEn}
                  onChange={(content) => setValue("descriptionEn", content)}
                  placeholder="Detailed program description in English..."
                />
                {errors.descriptionEn && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.descriptionEn.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Objetivos (Español)</Label>
                <RichTextEditor
                  content={watchedValues.objectivesEs}
                  onChange={(content) => setValue("objectivesEs", content)}
                  placeholder="Objetivos específicos del programa en español..."
                />
                {errors.objectivesEs && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.objectivesEs.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Objectives (English)</Label>
                <RichTextEditor
                  content={watchedValues.objectivesEn}
                  onChange={(content) => setValue("objectivesEn", content)}
                  placeholder="Specific program objectives in English..."
                />
                {errors.objectivesEn && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.objectivesEn.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetPopulation">Población Objetivo</Label>
                  <Input
                    id="targetPopulation"
                    {...register("targetPopulation")}
                    placeholder="Ej: Jóvenes de 18-25 años"
                  />
                </div>
                <div>
                  <Label htmlFor="region">Región</Label>
                  <Input
                    id="region"
                    {...register("region")}
                    placeholder="Ej: La Paz, Cochabamba"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Presupuesto (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    {...register("budget", { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="progressPercentage">Progreso (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[watchedValues.progressPercentage || 0]}
                      onValueChange={(value) =>
                        setValue("progressPercentage", value[0])
                      }
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-sm text-muted-foreground">
                      {watchedValues.progressPercentage || 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={
                      watchedValues.startDate
                        ? watchedValues.startDate instanceof Date
                          ? watchedValues.startDate.toISOString().split("T")[0]
                          : watchedValues.startDate
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue(
                        "startDate",
                        value ? new Date(value) : undefined
                      );
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fecha de Finalización</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={
                      watchedValues.endDate
                        ? watchedValues.endDate instanceof Date
                          ? watchedValues.endDate.toISOString().split("T")[0]
                          : watchedValues.endDate
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue("endDate", value ? new Date(value) : undefined);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Images */}
          <Card>
            <CardHeader>
              <CardTitle>Galería de Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("gallery-upload")?.click()
                    }
                    className="w-full"
                    disabled={loading || uploading}
                  >
                    {uploading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {!uploading && <Plus className="w-4 h-4 mr-2" />}
                    {uploading ? "Subiendo..." : "Subir Imágenes"}
                  </Button>
                </div>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    multiple
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("document-upload")?.click()
                    }
                    className="w-full"
                    disabled={loading || uploading}
                  >
                    {uploading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {!uploading && <Plus className="w-4 h-4 mr-2" />}
                    {uploading ? "Subiendo..." : "Subir Documentos"}
                  </Button>
                </div>

                {documentUrls.length > 0 && (
                  <div className="space-y-2">
                    {documentUrls.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline truncate"
                          >
                            {doc}
                          </a>
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
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
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
                    setValue("status", value as ProgramStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProgramStatus.PLANNING}>
                      Planificación
                    </SelectItem>
                    <SelectItem value={ProgramStatus.ACTIVE}>Activo</SelectItem>
                    <SelectItem value={ProgramStatus.COMPLETED}>
                      Completado
                    </SelectItem>
                    <SelectItem value={ProgramStatus.PAUSED}>
                      Pausado
                    </SelectItem>
                    <SelectItem value={ProgramStatus.CANCELLED}>
                      Cancelado
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={watchedValues.type}
                  onValueChange={(value) =>
                    setValue("type", value as ProgramType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProgramType.ADVOCACY}>
                      Incidencia
                    </SelectItem>
                    <SelectItem value={ProgramType.RESEARCH}>
                      Investigación
                    </SelectItem>
                    <SelectItem value={ProgramType.EDUCATION}>
                      Educación
                    </SelectItem>
                    <SelectItem value={ProgramType.COMMUNITY_OUTREACH}>
                      Alcance Comunitario
                    </SelectItem>
                    <SelectItem value={ProgramType.POLICY_DEVELOPMENT}>
                      Desarrollo de Políticas
                    </SelectItem>
                    <SelectItem value={ProgramType.CAPACITY_BUILDING}>
                      Fortalecimiento de Capacidades
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
                <Label htmlFor="featured">Programa destacado</Label>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen Destacada</CardTitle>
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

              {watchedValues.featuredImageUrl && (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={watchedValues.featuredImageUrl}
                    alt="Vista previa"
                    className="w-full h-40 object-cover rounded-lg border"
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
