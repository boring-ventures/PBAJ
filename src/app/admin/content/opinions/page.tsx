"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Trash,
  Eye,
  MoreHorizontal,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { OpinionForm } from "@/components/cms/opinions/opinion-form";
import type { OpinionFormData } from "@/lib/validations/opinions";

interface OpinionItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  status: string;
  featured: boolean;
  featuredImageUrl?: string;
  publishDate?: string;
  author?: {
    firstName?: string;
    lastName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-500",
  SCHEDULED: "bg-blue-500",
  PUBLISHED: "bg-green-500",
  ARCHIVED: "bg-red-500",
};

const categoryColors: Record<string, string> = {
  ANALYSIS: "bg-blue-500",
  COMMENTARY: "bg-green-500",
  EDITORIAL: "bg-red-500",
  PERSPECTIVE: "bg-purple-500",
  REVIEW: "bg-orange-500",
  OPINION_PIECE: "bg-indigo-500",
};

export default function OpinionsPage() {
  const [opinions, setOpinions] = useState<OpinionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingOpinion, setEditingOpinion] = useState<OpinionItem | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOpinions();
  }, []);

  const fetchOpinions = async () => {
    try {
      const response = await fetch("/api/admin/opinions");
      if (!response.ok) throw new Error("Failed to fetch opinions");
      const data = await response.json();

      // Asegurarse de que data es un array
      if (Array.isArray(data)) {
        setOpinions(data);
      } else if (data && Array.isArray(data.data)) {
        setOpinions(data.data);
      } else {
        console.error("Unexpected API response format:", data);
        setOpinions([]);
      }
    } catch (error) {
      console.error("Error fetching opinions:", error);
      setOpinions([]); // Asegurar que opinions siempre sea un array
      toast({
        title: "Error",
        description: "No se pudieron cargar las opiniones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta opinión?")) return;

    try {
      const response = await fetch(`/api/admin/opinions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "Éxito",
        description: "Opinión eliminada correctamente",
      });

      fetchOpinions();
    } catch (error) {
      console.error("Error deleting opinion:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la opinión",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (opinionItem: OpinionItem) => {
    setEditingOpinion(opinionItem);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: OpinionFormData) => {
    if (!editingOpinion) return;

    try {
      const response = await fetch(`/api/admin/opinions/${editingOpinion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast({
        title: "Éxito",
        description: "Opinión actualizada correctamente",
      });

      setIsEditDialogOpen(false);
      setEditingOpinion(null);
      fetchOpinions();
    } catch (error) {
      console.error("Error updating opinion:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la opinión",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOpinion = async () => {
    if (!editingOpinion) return;

    if (!confirm("¿Estás seguro de eliminar esta opinión?")) return;

    try {
      const response = await fetch(`/api/admin/opinions/${editingOpinion.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "Éxito",
        description: "Opinión eliminada correctamente",
      });

      setIsEditDialogOpen(false);
      setEditingOpinion(null);
      fetchOpinions();
    } catch (error) {
      console.error("Error deleting opinion:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la opinión",
        variant: "destructive",
      });
    }
  };

  const filteredOpinions = (Array.isArray(opinions) ? opinions : []).filter(
    (item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    }
  );

  const publishedCount = (Array.isArray(opinions) ? opinions : []).filter(
    (item) => item.status === "PUBLISHED"
  ).length;
  const draftCount = (Array.isArray(opinions) ? opinions : []).filter(
    (item) => item.status === "DRAFT"
  ).length;
  const featuredCount = (Array.isArray(opinions) ? opinions : []).filter(
    (item) => item.featured
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>
          <Skeleton className="h-10 w-[150px]" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[60px]" />
                  <Skeleton className="h-3 w-[120px] mt-2" />
                </CardContent>
              </Card>
            ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Opiniones
          </h1>
          <p className="text-muted-foreground">
            {Array.isArray(opinions) ? opinions.length : 0} opiniones en total
          </p>
        </div>
        <Link href="/admin/content/opinions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Opinión
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Opiniones
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(opinions) ? opinions.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">En el sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-xs text-muted-foreground">Visibles al público</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">En preparación</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destacadas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredCount}</div>
            <p className="text-xs text-muted-foreground">En portada</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar opiniones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="ANALYSIS">Análisis</SelectItem>
            <SelectItem value="COMMENTARY">Comentario</SelectItem>
            <SelectItem value="EDITORIAL">Editorial</SelectItem>
            <SelectItem value="PERSPECTIVE">Perspectiva</SelectItem>
            <SelectItem value="REVIEW">Reseña</SelectItem>
            <SelectItem value="OPINION_PIECE">Artículo de Opinión</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="DRAFT">Borrador</SelectItem>
            <SelectItem value="SCHEDULED">Programado</SelectItem>
            <SelectItem value="PUBLISHED">Publicado</SelectItem>
            <SelectItem value="ARCHIVED">Archivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Opinions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Opiniones</CardTitle>
          <CardDescription>
            Gestiona todas las opiniones y artículos de análisis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opinión</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpinions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {!Array.isArray(opinions) || opinions.length === 0
                        ? "No hay opiniones creadas"
                        : "No se encontraron opiniones con los filtros aplicados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOpinions.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{item.title}</p>
                            {item.featured && (
                              <Badge variant="secondary" className="text-xs">
                                Destacado
                              </Badge>
                            )}
                          </div>
                          {item.excerpt && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {item.excerpt}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={categoryColors[item.category]}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[item.status]}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.author
                          ? `${item.author.firstName || ""} ${item.author.lastName || ""}`.trim()
                          : "Sin autor"}
                      </TableCell>
                      <TableCell>
                        {item.publishDate
                          ? format(new Date(item.publishDate), "dd MMM yyyy", {
                              locale: es,
                            })
                          : "Sin fecha"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Opinión</DialogTitle>
            <DialogDescription>
              Actualiza la información de la opinión
            </DialogDescription>
          </DialogHeader>
          {editingOpinion && (
            <div className="mt-4">
              <OpinionForm
                initialData={{
                  title: editingOpinion.title,
                  content: editingOpinion.content,
                  excerpt: editingOpinion.excerpt || "",
                  category: editingOpinion.category as any,
                  status: editingOpinion.status as any,
                  featured: editingOpinion.featured,
                  featuredImageUrl: editingOpinion.featuredImageUrl,
                  publishDate: editingOpinion.publishDate
                    ? new Date(editingOpinion.publishDate)
                    : undefined,
                }}
                opinionId={editingOpinion.id}
                onSave={handleUpdate}
                onDelete={handleDeleteOpinion}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
