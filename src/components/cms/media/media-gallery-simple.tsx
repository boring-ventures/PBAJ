"use client";

import { useState, useEffect } from "react";
import { MediaType, MediaCategory } from "@prisma/client";
import { formatFileSize } from "@/lib/validations/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Search,
  Grid3X3,
  List,
  Download,
  Edit3,
  Copy,
  Image,
  Video,
  Music,
  FileText,
  Archive,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const FILE_TYPE_ICONS = {
  [MediaType.IMAGE]: Image,
  [MediaType.VIDEO]: Video,
  [MediaType.AUDIO]: Music,
  [MediaType.DOCUMENT]: FileText,
  [MediaType.ARCHIVE]: Archive,
};

interface MediaGallerySimpleProps {
  onEdit?: (asset: MediaAsset) => void;
  className?: string;
}

export function MediaGallerySimple({ onEdit, className }: MediaGallerySimpleProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: "1",
        limit: "50",
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(`/api/admin/media?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setAssets(data.assets || []);
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err instanceof Error ? err.message : "Error al cargar archivos");
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAssets();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "URL copiada al portapapeles",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando archivos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4 text-2xl">⚠️</div>
          <p className="text-lg font-medium text-red-600">Error al cargar archivos</p>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchAssets} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar archivos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      {assets.length === 0 ? (
        <div className="text-center py-12">
          <File className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No se encontraron archivos</p>
          <p className="text-muted-foreground">
            {search ? "Intenta con una búsqueda diferente" : "Sube algunos archivos para comenzar"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {assets.map((asset) => {
            const FileIcon = FILE_TYPE_ICONS[asset.type];
            return (
              <Card key={asset.id} className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted">
                    {asset.thumbnailUrl || asset.type === MediaType.IMAGE ? (
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.altTextEs || asset.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <FileIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          onClick={() => copyToClipboard(asset.url)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        {onEdit && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                            onClick={() => onEdit(asset)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Badge de tipo */}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {asset.type}
                      </Badge>
                    </div>

                    {/* Indicador público */}
                    {asset.isPublic && (
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="outline" className="text-xs bg-white/80">
                          Público
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Información del archivo */}
                  <div className="p-3">
                    <p className="text-sm font-medium truncate" title={asset.originalName}>
                      {asset.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(asset.fileSize)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((asset) => {
            const FileIcon = FILE_TYPE_ICONS[asset.type];
            return (
              <Card key={asset.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Miniatura */}
                    <div className="w-12 h-12 flex-shrink-0">
                      {asset.thumbnailUrl || asset.type === MediaType.IMAGE ? (
                        <img
                          src={asset.thumbnailUrl || asset.url}
                          alt={asset.altTextEs || asset.originalName}
                          className="w-full h-full object-cover rounded border"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center border rounded bg-muted">
                          <FileIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{asset.originalName}</p>
                        {asset.isPublic && (
                          <Badge variant="outline" className="text-xs">
                            Público
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{formatFileSize(asset.fileSize)}</span>
                        <span>{asset.type}</span>
                        <span>{formatDate(asset.createdAt)}</span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(asset.url)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(asset)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      )}
                      <a
                        href={asset.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Información de resultados */}
      {assets.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Mostrando {assets.length} archivo{assets.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}