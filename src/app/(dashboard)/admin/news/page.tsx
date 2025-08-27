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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Edit, Trash, Eye, MoreHorizontal, Calendar } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface NewsItem {
  id: string
  titleEs: string
  titleEn: string
  contentEs: string
  contentEn: string
  excerptEs?: string
  excerptEn?: string
  category: string
  status: string
  featured: boolean
  featuredImageUrl?: string
  publishDate?: string
  author?: {
    firstName?: string
    lastName?: string
  }
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-500",
  SCHEDULED: "bg-blue-500",
  PUBLISHED: "bg-green-500",
  ARCHIVED: "bg-orange-500"
}

const categoryColors: Record<string, string> = {
  CAMPAIGN: "bg-purple-500",
  UPDATE: "bg-blue-500",
  EVENT: "bg-pink-500",
  ANNOUNCEMENT: "bg-yellow-500",
  PRESS_RELEASE: "bg-indigo-500"
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/admin/news")
      if (!response.ok) throw new Error("Failed to fetch news")
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error("Error fetching news:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las noticias",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta noticia?")) return

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Éxito",
        description: "Noticia eliminada correctamente"
      })
      
      fetchNews()
    } catch (error) {
      console.error("Error deleting news:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la noticia",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingNews) return

    try {
      const response = await fetch(`/api/admin/news/${editingNews.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingNews)
      })

      if (!response.ok) throw new Error("Failed to update")

      toast({
        title: "Éxito",
        description: "Noticia actualizada correctamente"
      })
      
      setIsEditDialogOpen(false)
      setEditingNews(null)
      fetchNews()
    } catch (error) {
      console.error("Error updating news:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la noticia",
        variant: "destructive"
      })
    }
  }

  const filteredNews = news.filter(item => {
    const matchesSearch = item.titleEs.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
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
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Noticias</CardTitle>
            <CardDescription>
              {news.length} noticias en total
            </CardDescription>
          </div>
          <Link href="/admin/content/news/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Noticia
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar noticias..."
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
                <SelectItem value="CAMPAIGN">Campañas</SelectItem>
                <SelectItem value="UPDATE">Actualizaciones</SelectItem>
                <SelectItem value="EVENT">Eventos</SelectItem>
                <SelectItem value="ANNOUNCEMENT">Anuncios</SelectItem>
                <SelectItem value="PRESS_RELEASE">Prensa</SelectItem>
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron noticias
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{item.titleEs}</p>
                          <p className="text-sm text-muted-foreground">{item.titleEn}</p>
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
                        {item.author ? `${item.author.firstName || ''} ${item.author.lastName || ''}`.trim() || 'Sin autor' : 'Sin autor'}
                      </TableCell>
                      <TableCell>
                        {item.publishDate ? 
                          format(new Date(item.publishDate), "dd MMM yyyy", { locale: es }) :
                          format(new Date(item.createdAt), "dd MMM yyyy", { locale: es })
                        }
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
                              Ver
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Noticia</DialogTitle>
            <DialogDescription>
              Actualiza la información de la noticia
            </DialogDescription>
          </DialogHeader>
          {editingNews && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título (Español)</Label>
                  <Input
                    value={editingNews.titleEs}
                    onChange={(e) => setEditingNews({...editingNews, titleEs: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Título (Inglés)</Label>
                  <Input
                    value={editingNews.titleEn}
                    onChange={(e) => setEditingNews({...editingNews, titleEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contenido (Español)</Label>
                  <Textarea
                    value={editingNews.contentEs}
                    onChange={(e) => setEditingNews({...editingNews, contentEs: e.target.value})}
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contenido (Inglés)</Label>
                  <Textarea
                    value={editingNews.contentEn}
                    onChange={(e) => setEditingNews({...editingNews, contentEn: e.target.value})}
                    rows={6}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select 
                    value={editingNews.category} 
                    onValueChange={(value) => setEditingNews({...editingNews, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAMPAIGN">Campañas</SelectItem>
                      <SelectItem value="UPDATE">Actualizaciones</SelectItem>
                      <SelectItem value="EVENT">Eventos</SelectItem>
                      <SelectItem value="ANNOUNCEMENT">Anuncios</SelectItem>
                      <SelectItem value="PRESS_RELEASE">Prensa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select 
                    value={editingNews.status} 
                    onValueChange={(value) => setEditingNews({...editingNews, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Borrador</SelectItem>
                      <SelectItem value="SCHEDULED">Programado</SelectItem>
                      <SelectItem value="PUBLISHED">Publicado</SelectItem>
                      <SelectItem value="ARCHIVED">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdate}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}