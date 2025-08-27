'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Tag, 
  Folder,
  Filter
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  type: 'NEWS' | 'PROGRAM' | 'PUBLICATION';
  itemCount: number;
  createdAt: Date;
}

interface TagItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
  itemCount: number;
  createdAt: Date;
}

interface TaxonomyListProps {
  categories: Category[];
  tags: TagItem[];
  onCreateCategory?: () => void;
  onCreateTag?: () => void;
  onEditCategory?: (category: Category) => void;
  onEditTag?: (tag: TagItem) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onDeleteTag?: (tagId: string) => void;
}

// Mock data - En producción esto vendría de la API
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Educación',
    description: 'Contenido relacionado con programas educativos',
    color: '#3b82f6',
    icon: '📚',
    type: 'NEWS',
    itemCount: 12,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Investigación',
    description: 'Documentos y artículos de investigación',
    color: '#10b981',
    icon: '🔬',
    type: 'PUBLICATION',
    itemCount: 8,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Desarrollo Comunitario',
    description: 'Programas de desarrollo comunitario',
    color: '#f59e0b',
    icon: '🏘️',
    type: 'PROGRAM',
    itemCount: 5,
    createdAt: new Date('2024-02-01'),
  },
];

const mockTags: TagItem[] = [
  {
    id: '1',
    name: 'juventud',
    description: 'Contenido dirigido a jóvenes',
    color: '#8b5cf6',
    itemCount: 15,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'política pública',
    description: 'Relacionado con políticas públicas',
    color: '#ef4444',
    itemCount: 7,
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'participación ciudadana',
    color: '#06b6d4',
    itemCount: 9,
    createdAt: new Date('2024-01-25'),
  },
];

export function TaxonomyList({ 
  categories = mockCategories, 
  tags = mockTags,
  onCreateCategory,
  onCreateTag,
  onEditCategory,
  onEditTag,
  onDeleteCategory,
  onDeleteTag 
}: TaxonomyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'NEWS' | 'PROGRAM' | 'PUBLICATION'>('ALL');

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || category.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const filteredTags = tags.filter(tag => {
    return tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDeleteCategory = (category: Category) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.name}"?`)) {
      onDeleteCategory?.(category.id);
    }
  };

  const handleDeleteTag = (tag: TagItem) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la etiqueta "${tag.name}"?`)) {
      onDeleteTag?.(tag.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Taxonomía</h1>
          <p className="text-muted-foreground">
            Gestiona categorías y etiquetas para organizar el contenido
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categorías</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Etiquetas</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Elementos Categorizados</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.itemCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Elementos Etiquetados</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tags.reduce((sum, tag) => sum + tag.itemCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="categories" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="tags">Etiquetas</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
        </div>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="ALL">Todos los tipos</option>
                <option value="NEWS">Noticias</option>
                <option value="PROGRAM">Programas</option>
                <option value="PUBLICATION">Publicaciones</option>
              </select>
            </div>
            
            <Button onClick={onCreateCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoría
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Elementos</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No se encontraron categorías
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Badge 
                              style={{ 
                                backgroundColor: category.color,
                                color: 'white'
                              }}
                              className="px-2 py-1"
                            >
                              {category.icon && <span className="mr-1">{category.icon}</span>}
                              {category.name}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {category.type === 'NEWS' ? 'Noticias' :
                             category.type === 'PROGRAM' ? 'Programas' : 'Publicaciones'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {category.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{category.itemCount}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(category.createdAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => onEditCategory?.(category)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteCategory(category)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={onCreateTag}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Etiqueta
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Elementos</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No se encontraron etiquetas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell>
                          <Badge 
                            style={{ 
                              backgroundColor: tag.color,
                              color: 'white'
                            }}
                            className="px-2 py-1"
                          >
                            {tag.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {tag.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{tag.itemCount}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(tag.createdAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => onEditTag?.(tag)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTag(tag)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}