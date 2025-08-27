"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  validateFile,
  formatFileSize,
  getFileType,
  MEDIA_CATEGORY_OPTIONS,
} from "@/lib/validations/media";
import { MediaCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import {
  Upload,
  X,
  File,
  Image,
  Video,
  Music,
  FileText,
  Archive,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileWithMetadata extends File {
  id: string;
  preview?: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  altText?: string;
  caption?: string;
  tags: string[];
}

interface MediaUploaderProps {
  category?: MediaCategory;
  folder?: string;
  maxFiles?: number;
  onUploadComplete?: (uploadedFiles: unknown[]) => void;
  onUploadStart?: () => void;
  className?: string;
}

const FILE_TYPE_ICONS = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
  archive: Archive,
  default: File,
};

export function MediaUploader({
  category = MediaCategory.GENERAL,
  folder,
  maxFiles = 10,
  onUploadComplete,
  onUploadStart,
  className,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [uploadCategory, setUploadCategory] = useState(category);
  const [uploadFolder, setUploadFolder] = useState(folder || "");
  const [globalTags, setGlobalTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [newFolder, setNewFolder] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: FileWithMetadata[] = acceptedFiles.map((file, index) => {
        const fileWithMetadata: FileWithMetadata = Object.assign(file, {
          id: `${Date.now()}-${index}`,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
          progress: 0,
          status: "pending" as const,
          altText: "",
          caption: "",
          tags: [...globalTags],
        });

        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          fileWithMetadata.status = "error";
          fileWithMetadata.error = validation.error;
        }

        return fileWithMetadata;
      });

      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
    },
    [globalTags, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    disabled: isUploading || files.length >= maxFiles,
  });

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const updateFileMetadata = (
    fileId: string,
    updates: Partial<FileWithMetadata>
  ) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f))
    );
  };

  const addGlobalTag = () => {
    if (newTag.trim() && !globalTags.includes(newTag.trim())) {
      const tag = newTag.trim();
      setGlobalTags((prev) => [...prev, tag]);

      // Add to all pending files
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          tags: f.tags.includes(tag) ? f.tags : [...f.tags, tag],
        }))
      );

      setNewTag("");
    }
  };

  const removeGlobalTag = (tagToRemove: string) => {
    setGlobalTags((prev) => prev.filter((tag) => tag !== tagToRemove));

    // Remove from all files
    setFiles((prev) =>
      prev.map((f) => ({
        ...f,
        tags: f.tags.filter((tag) => tag !== tagToRemove),
      }))
    );
  };

  const removeFileTag = (fileId: string, tagToRemove: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      updateFileMetadata(fileId, {
        tags: file.tags.filter((tag) => tag !== tagToRemove),
      });
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0 || isUploading) return;

    setIsUploading(true);
    onUploadStart?.();

    const validFiles = files.filter((f) => f.status !== "error");
    const uploadResults = [];

    for (const file of validFiles) {
      try {
        updateFileMetadata(file.id, { status: "uploading", progress: 0 });

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          updateFileMetadata(file.id, { progress });
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", uploadCategory);
        if (uploadFolder) formData.append("folder", uploadFolder);
        if (file.altText) formData.append("altText", file.altText);
        if (file.caption) formData.append("caption", file.caption);
        formData.append("tags", JSON.stringify(file.tags));

        // Upload to API
        const response = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          // Try to read server error message
          let serverMessage = "Upload failed";
          try {
            const data = await response.json();
            if (data?.error) serverMessage = data.error;
          } catch {}
          throw new Error(serverMessage);
        }

        const result = await response.json();
        updateFileMetadata(file.id, { status: "success", progress: 100 });
        uploadResults.push(result);
      } catch (error) {
        console.error("Upload error:", error);
        updateFileMetadata(file.id, {
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }

    setIsUploading(false);

    if (uploadResults.length > 0) {
      toast({
        title: "Subida Completada",
        description: `${uploadResults.length} archivo${uploadResults.length > 1 ? "s" : ""} subido${uploadResults.length > 1 ? "s" : ""} exitosamente`,
      });

      onUploadComplete?.(uploadResults);

      // Clear successful uploads
      setFiles((prev) => prev.filter((f) => f.status !== "success"));
    }
  };

  const getFileTypeIcon = (file: File) => {
    const fileType = getFileType(file.type);
    const IconComponent = FILE_TYPE_ICONS[fileType || "default"];
    return IconComponent;
  };

  const pendingFiles = files.filter((f) => f.status === "pending").length;
  const uploadingFiles = files.filter((f) => f.status === "uploading").length;
  const successfulFiles = files.filter((f) => f.status === "success").length;
  const failedFiles = files.filter((f) => f.status === "error").length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Configuración de Subida
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={uploadCategory}
                onValueChange={(value) =>
                  setUploadCategory(value as MediaCategory)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="folder">Carpeta</Label>
              <div className="flex gap-2">
                <Input
                  id="folder"
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  placeholder="Carpeta de destino (opcional)"
                />
                {newFolder && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setUploadFolder(newFolder);
                      setNewFolder("");
                    }}
                  >
                    Crear
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Global Tags */}
          <div>
            <Label>Etiquetas Globales</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Agregar etiqueta a todos los archivos"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addGlobalTag())
                }
              />
              <Button type="button" onClick={addGlobalTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {globalTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeGlobalTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Drop Zone */}
      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
              isUploading || files.length >= maxFiles
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-primary"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Suelta los archivos aquí...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-muted-foreground">
                  {maxFiles - files.length} archivo
                  {maxFiles - files.length !== 1 ? "s" : ""} restante
                  {maxFiles - files.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Archivos ({files.length})</span>
              <div className="flex items-center gap-2 text-sm">
                {pendingFiles > 0 && (
                  <Badge variant="secondary">{pendingFiles} pendientes</Badge>
                )}
                {uploadingFiles > 0 && (
                  <Badge variant="default">{uploadingFiles} subiendo</Badge>
                )}
                {successfulFiles > 0 && (
                  <Badge variant="outline" className="text-green-600">
                    {successfulFiles} exitosos
                  </Badge>
                )}
                {failedFiles > 0 && (
                  <Badge variant="destructive">{failedFiles} fallidos</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => {
                const FileIcon = getFileTypeIcon(file);

                return (
                  <div key={file.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {/* File Preview/Icon */}
                      <div className="flex-shrink-0">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg border"
                            onError={() =>
                              updateFileMetadata(file.id, {
                                preview: undefined,
                              })
                            }
                          />
                        ) : (
                          <div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-muted">
                            <FileIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)} • {file.type}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {file.status === "success" && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            {file.status === "error" && (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            {file.status === "uploading" && (
                              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              disabled={isUploading}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {file.status === "uploading" && (
                          <Progress value={file.progress} className="w-full" />
                        )}

                        {/* Error Message */}
                        {file.status === "error" && file.error && (
                          <p className="text-sm text-red-600">{file.error}</p>
                        )}

                        {/* Metadata Fields */}
                        {file.status === "pending" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Texto Alt</Label>
                              <Input
                                value={file.altText || ""}
                                onChange={(e) =>
                                  updateFileMetadata(file.id, {
                                    altText: e.target.value,
                                  })
                                }
                                placeholder="Descripción de la imagen"
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Leyenda</Label>
                              <Input
                                value={file.caption || ""}
                                onChange={(e) =>
                                  updateFileMetadata(file.id, {
                                    caption: e.target.value,
                                  })
                                }
                                placeholder="Leyenda del archivo"
                                className="h-8"
                              />
                            </div>
                          </div>
                        )}

                        {/* File Tags */}
                        <div className="flex flex-wrap gap-1">
                          {file.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs flex items-center gap-1"
                            >
                              {tag}
                              {file.status === "pending" && (
                                <button
                                  type="button"
                                  onClick={() => removeFileTag(file.id, tag)}
                                  className="hover:text-destructive"
                                >
                                  <X className="w-2 w-2" />
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Upload Button */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                Limpiar Todo
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={
                  files.filter((f) => f.status === "pending").length === 0 ||
                  isUploading
                }
              >
                {isUploading && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Subir Archivos (
                {files.filter((f) => f.status === "pending").length})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
