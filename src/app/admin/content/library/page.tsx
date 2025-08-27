"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Edit, Trash, Eye, MoreHorizontal, FileText, Download, Calendar } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { DigitalLibraryForm } from "@/components/cms/digital-library/digital-library-form"
import type { DigitalLibraryFormData } from "@/lib/validations/digital-library"

interface PublicationItem {
  id: string
  titleEs: string
  titleEn: string
  descriptionEs: string
  descriptionEn: string
  abstractEs?: string
  abstractEn?: string
  type: string
  status: string
  featured: boolean
  publishDate?: string
  fileUrl: string
  fileName: string
  fileSize?: number
  mimeType?: string
  coverImageUrl?: string
  thumbnailUrl?: string
  tags: string[]
  keywords: string[]
  relatedPrograms: string[]
  isbn?: string
  doi?: string
  citationFormat?: string
  downloadCount: number
  viewCount: number
  author: {
    firstName?: string
    lastName?: string
  }
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-500",
  REVIEW: "bg-yellow-500", 
  PUBLISHED: "bg-green-500",
  ARCHIVED: "bg-blue-500"
}

const typeColors: Record<string, string> = {
  RESEARCH_PAPER: "bg-blue-500",
  REPORT: "bg-green-500",
  INFOGRAPHIC: "bg-purple-500",
  POLICY_BRIEF: "bg-red-500",
  GUIDE: "bg-yellow-500",
  PRESENTATION: "bg-indigo-500",
  VIDEO: "bg-pink-500",
  PODCAST: "bg-orange-500"
}

export default function DigitalLibraryPage() {
  const [publications, setPublications] = useState<PublicationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [editingPublication, setEditingPublication] = useState<PublicationItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      const response = await fetch("/api/admin/digital-library")
      if (!response.ok) throw new Error("Failed to fetch publications")
      const data = await response.json()
      
      if (Array.isArray(data.publications)) {
        setPublications(data.publications)
      } else if (Array.isArray(data)) {
        setPublications(data)
      } else {
        console.error("Unexpected API response format:", data)
        setPublications([])
      }
    } catch (error) {
      console.error("Error fetching publications:", error)
      setPublications([])
      toast({
        title: "Error",
        description: "No se pudieron cargar las publicaciones",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta publicación?")) return

    try {
      const response = await fetch(`/api/admin/digital-library/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Éxito",
        description: "Publicación eliminada correctamente"
      })
      
      fetchPublications()
    } catch (error) {
      console.error("Error deleting publication:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la publicación",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (publication: PublicationItem) => {
    setEditingPublication(publication)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (data: DigitalLibraryFormData) => {
    if (!editingPublication) return

    try {
      const response = await fetch(`/api/admin/digital-library/${editingPublication.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error("Failed to update")

      toast({
        title: "Éxito",
        description: "Publicación actualizada correctamente"
      })
      
      setIsEditDialogOpen(false)
      setEditingPublication(null)
      fetchPublications()
    } catch (error) {
      console.error("Error updating publication:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la publicación",
        variant: "destructive"
      })
    }
  }

  const handleDeletePublication = async () => {
    if (!editingPublication) return
    
    if (!confirm("¿Estás seguro de eliminar esta publicación?")) return

    try {
      const response = await fetch(`/api/admin/digital-library/${editingPublication.id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Éxito",
        description: "Publicación eliminada correctamente"
      })
      
      setIsEditDialogOpen(false)
      setEditingPublication(null)
      fetchPublications()
    } catch (error) {
      console.error("Error deleting publication:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la publicación",
        variant: "destructive"
      })
    }
  }

  const filteredPublications = (Array.isArray(publications) ? publications : []).filter(item => {
    const matchesSearch = item.titleEs.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const publishedCount = (Array.isArray(publications) ? publications : []).filter(item => item.status === 'PUBLISHED').length
  const draftCount = (Array.isArray(publications) ? publications : []).filter(item => item.status === 'DRAFT').length
  const totalDownloads = (Array.isArray(publications) ? publications : []).reduce((acc, item) => acc + (item.downloadCount || 0), 0)

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 KB"
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[350px] mt-2" />
          </div>
          <Skeleton className="h-10 w-[180px]" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
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
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca Digital</h1>
          <p className="text-muted-foreground">
            {Array.isArray(publications) ? publications.length : 0} publicaciones en total
          </p>
        </div>
        <Link href="/admin/content/library/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Publicación
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Publicaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(publications) ? publications.length : 0}</div>
            <p className="text-xs text-muted-foreground">
              En la biblioteca
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-xs text-muted-foreground">
              Disponibles públicamente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">
              En desarrollo
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Descargas</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDownloads.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Descargas acumuladas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar publicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="RESEARCH_PAPER">Investigación</SelectItem>
            <SelectItem value="REPORT">Informe</SelectItem>
            <SelectItem value="INFOGRAPHIC">Infografía</SelectItem>
            <SelectItem value="POLICY_BRIEF">Resumen de Política</SelectItem>
            <SelectItem value="GUIDE">Guía</SelectItem>
            <SelectItem value="PRESENTATION">Presentación</SelectItem>
            <SelectItem value="VIDEO">Video</SelectItem>
            <SelectItem value="PODCAST">Podcast</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="DRAFT">Borrador</SelectItem>
            <SelectItem value="REVIEW">En Revisión</SelectItem>
            <SelectItem value="PUBLISHED">Publicado</SelectItem>
            <SelectItem value="ARCHIVED">Archivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Publications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Publicaciones</CardTitle>
          <CardDescription>
            Gestiona todas las publicaciones de la biblioteca digital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Publicación</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Archivo</TableHead>
                  <TableHead>Descargas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPublications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {!Array.isArray(publications) || publications.length === 0 ? "No hay publicaciones creadas" : "No se encontraron publicaciones con los filtros aplicados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPublications.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{item.titleEs}</p>
                            {item.featured && (
                              <Badge variant="secondary" className="text-xs">Destacado</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.titleEn}</p>
                          {item.publishDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Publicado: {format(new Date(item.publishDate), "dd MMM yyyy", { locale: es })}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Por: {item.author.firstName} {item.author.lastName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeColors[item.type]}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[item.status]}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{item.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(item.fileSize)} • {item.mimeType?.split('/')[1]?.toUpperCase() || 'Unknown'}
                          </p>
                          {item.fileUrl && (
                            <a 
                              href={item.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Descargar
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{item.downloadCount}</p>
                          <p className="text-xs text-muted-foreground">{item.viewCount} vistas</p>
                        </div>
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
            <DialogTitle>Editar Publicación</DialogTitle>
            <DialogDescription>
              Actualiza la información de la publicación
            </DialogDescription>
          </DialogHeader>
          {editingPublication && (
            <div className="mt-4">
              <DigitalLibraryForm
                initialData={{
                  title: editingPublication.titleEs,
                  titleEs: editingPublication.titleEs,
                  titleEn: editingPublication.titleEn,
                  description: editingPublication.descriptionEs,
                  descriptionEs: editingPublication.descriptionEs,
                  descriptionEn: editingPublication.descriptionEn,
                  abstractEs: editingPublication.abstractEs,
                  abstractEn: editingPublication.abstractEn,
                  type: editingPublication.type,
                  status: editingPublication.status,
                  featured: editingPublication.featured,
                  fileUrl: editingPublication.fileUrl,
                  fileName: editingPublication.fileName,
                  fileSize: editingPublication.fileSize,
                  mimeType: editingPublication.mimeType,
                  coverImageUrl: editingPublication.coverImageUrl,
                  thumbnailUrl: editingPublication.thumbnailUrl,
                  tags: editingPublication.tags || [],
                  keywords: editingPublication.keywords || [],
                  relatedPrograms: editingPublication.relatedPrograms || [],
                  isbn: editingPublication.isbn,
                  doi: editingPublication.doi,
                  citationFormat: editingPublication.citationFormat,
                  downloadCount: editingPublication.downloadCount,
                  viewCount: editingPublication.viewCount,
                  publishDate: editingPublication.publishDate ? new Date(editingPublication.publishDate) : undefined,
                }}
                publicationId={editingPublication.id}
                onSave={handleUpdate}
                onDelete={handleDeletePublication}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}