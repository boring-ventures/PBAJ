"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Edit, Trash, Eye, MoreHorizontal, FolderOpen, Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { ProgramForm } from "@/components/cms/programs/program-form"
import type { ProgramFormData } from "@/lib/validations/programs"

interface ProgramItem {
  id: string
  titleEs: string
  titleEn: string
  descriptionEs: string
  descriptionEn: string
  overviewEs?: string
  overviewEn?: string
  type: string
  status: string
  featured: boolean
  startDate?: string
  endDate?: string
  featuredImageUrl?: string
  galleryImages?: string[]
  documentUrls?: string[]
  targetPopulation?: string
  region?: string
  budget?: number
  progressPercentage?: number
  manager?: {
    firstName?: string
    lastName?: string
  }
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, string> = {
  PLANNING: "bg-blue-500",
  ACTIVE: "bg-green-500", 
  COMPLETED: "bg-gray-500",
  PAUSED: "bg-yellow-500",
  CANCELLED: "bg-red-500"
}

const typeColors: Record<string, string> = {
  ADVOCACY: "bg-purple-500",
  RESEARCH: "bg-blue-500",
  EDUCATION: "bg-pink-500",
  COMMUNITY_OUTREACH: "bg-yellow-500",
  POLICY_DEVELOPMENT: "bg-indigo-500",
  CAPACITY_BUILDING: "bg-green-500"
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/admin/programs")
      if (!response.ok) throw new Error("Failed to fetch programs")
      const data = await response.json()
      
      // Asegurarse de que data es un array
      if (Array.isArray(data)) {
        setPrograms(data)
      } else if (data && Array.isArray(data.programs)) {
        setPrograms(data.programs)
      } else {
        console.error("Unexpected API response format:", data)
        setPrograms([])
      }
    } catch (error) {
      console.error("Error fetching programs:", error)
      setPrograms([]) // Asegurar que programs siempre sea un array
      toast({
        title: "Error",
        description: "No se pudieron cargar los programas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este programa?")) return

    try {
      const response = await fetch(`/api/admin/programs/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Éxito",
        description: "Programa eliminado correctamente"
      })
      
      fetchPrograms()
    } catch (error) {
      console.error("Error deleting program:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el programa",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (programItem: ProgramItem) => {
    setEditingProgram(programItem)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (data: ProgramFormData) => {
    if (!editingProgram) return

    try {
      const response = await fetch(`/api/admin/programs/${editingProgram.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error("Failed to update")

      toast({
        title: "Éxito",
        description: "Programa actualizado correctamente"
      })
      
      setIsEditDialogOpen(false)
      setEditingProgram(null)
      fetchPrograms()
    } catch (error) {
      console.error("Error updating program:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el programa",
        variant: "destructive"
      })
    }
  }

  const handleDeleteProgram = async () => {
    if (!editingProgram) return
    
    if (!confirm("¿Estás seguro de eliminar este programa?")) return

    try {
      const response = await fetch(`/api/admin/programs/${editingProgram.id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Éxito",
        description: "Programa eliminado correctamente"
      })
      
      setIsEditDialogOpen(false)
      setEditingProgram(null)
      fetchPrograms()
    } catch (error) {
      console.error("Error deleting program:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el programa",
        variant: "destructive"
      })
    }
  }

  const filteredPrograms = (Array.isArray(programs) ? programs : []).filter(item => {
    const matchesSearch = item.titleEs.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const activeCount = (Array.isArray(programs) ? programs : []).filter(item => item.status === 'ACTIVE').length
  const completedCount = (Array.isArray(programs) ? programs : []).filter(item => item.status === 'COMPLETED').length
  const totalBudget = (Array.isArray(programs) ? programs : []).reduce((acc, item) => acc + (item.budget || 0), 0)

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
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
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
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Programas</h1>
          <p className="text-muted-foreground">
            {Array.isArray(programs) ? programs.length : 0} programas en total
          </p>
        </div>
        <Link href="/admin/content/programs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Programa
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Programas</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(programs) ? programs.length : 0}</div>
            <p className="text-xs text-muted-foreground">
              En el sistema
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">
              En ejecución
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              Finalizados exitosamente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              USD
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
              placeholder="Buscar programas..."
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
            <SelectItem value="ADVOCACY">Advocacy</SelectItem>
            <SelectItem value="RESEARCH">Investigación</SelectItem>
            <SelectItem value="EDUCATION">Educación</SelectItem>
            <SelectItem value="COMMUNITY_OUTREACH">Alcance Comunitario</SelectItem>
            <SelectItem value="POLICY_DEVELOPMENT">Desarrollo de Políticas</SelectItem>
            <SelectItem value="CAPACITY_BUILDING">Fortalecimiento de Capacidades</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PLANNING">Planificación</SelectItem>
            <SelectItem value="ACTIVE">Activo</SelectItem>
            <SelectItem value="COMPLETED">Completado</SelectItem>
            <SelectItem value="PAUSED">Pausado</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Programs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Programas</CardTitle>
          <CardDescription>
            Gestiona todos los programas y proyectos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Programa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Región</TableHead>
                  <TableHead>Presupuesto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {!Array.isArray(programs) || programs.length === 0 ? "No hay programas creados" : "No se encontraron programas con los filtros aplicados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrograms.map((item) => (
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
                          {(item.startDate || item.endDate) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.startDate ? format(new Date(item.startDate), "dd MMM yyyy", { locale: es }) : "Sin fecha"} - {item.endDate ? format(new Date(item.endDate), "dd MMM yyyy", { locale: es }) : "Sin fecha"}
                            </p>
                          )}
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
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.progressPercentage || 0}%</span>
                          </div>
                          <Progress value={item.progressPercentage || 0} className="w-[100px]" />
                        </div>
                      </TableCell>
                      <TableCell>{item.region || "Sin especificar"}</TableCell>
                      <TableCell>
                        {item.budget ? `$${item.budget.toLocaleString()}` : "Sin presupuesto"}
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
            <DialogTitle>Editar Programa</DialogTitle>
            <DialogDescription>
              Actualiza la información del programa
            </DialogDescription>
          </DialogHeader>
          {editingProgram && (
            <div className="mt-4">
              <ProgramForm
                initialData={{
                  title: editingProgram.titleEs,
                  titleEs: editingProgram.titleEs,
                  titleEn: editingProgram.titleEn,
                  description: editingProgram.descriptionEs,
                  descriptionEs: editingProgram.descriptionEs,
                  descriptionEn: editingProgram.descriptionEn,
                  overview: editingProgram.overviewEs,
                  overviewEs: editingProgram.overviewEs,
                  overviewEn: editingProgram.overviewEn,
                  objectives: '',
                  objectivesEs: '',
                  objectivesEn: '',
                  type: editingProgram.type,
                  status: editingProgram.status,
                  featured: editingProgram.featured,
                  featuredImageUrl: editingProgram.featuredImageUrl,
                  galleryImages: editingProgram.galleryImages || [],
                  documentUrls: editingProgram.documentUrls || [],
                  targetPopulation: editingProgram.targetPopulation || '',
                  region: editingProgram.region,
                  budget: editingProgram.budget,
                  progressPercentage: editingProgram.progressPercentage,
                  startDate: editingProgram.startDate ? new Date(editingProgram.startDate) : undefined,
                  endDate: editingProgram.endDate ? new Date(editingProgram.endDate) : undefined,
                }}
                programId={editingProgram.id}
                onSave={handleUpdate}
                onDelete={handleDeleteProgram}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}