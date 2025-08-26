'use client';

import { useState, useEffect } from 'react';
import { DigitalLibraryFormData, DigitalLibraryFilterData, DigitalLibraryBulkActionData } from '@/lib/validations/digital-library';
import { DigitalLibraryForm } from '@/components/cms/digital-library/digital-library-form';
import { DigitalLibraryList } from '@/components/cms/digital-library/digital-library-list';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface DigitalLibraryItem {
  id: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  summaryEs?: string;
  summaryEn?: string;
  category: string;
  status: string;
  featured: boolean;
  publishDate: Date | null;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  pageCount?: number;
  coverImageUrl?: string;
  authors: string[];
  tags: string[];
  isbn?: string;
  doi?: string;
  language: 'es' | 'en' | 'both';
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export default function DigitalLibraryManagementPage() {
  const [publications, setPublications] = useState<DigitalLibraryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPublication, setEditingPublication] = useState<DigitalLibraryItem | null>(null);
  const [filters, setFilters] = useState<DigitalLibraryFilterData>({
    page: 1,
    limit: 10,
  });

  const fetchPublications = async (currentFilters: DigitalLibraryFilterData) => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (value instanceof Date) {
            searchParams.append(key, value.toISOString());
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/admin/digital-library?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch publications');
      }

      const data = await response.json();
      setPublications(data.publications);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las publicaciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications(filters);
  }, [filters]);

  const handleEdit = (publication: DigitalLibraryItem) => {
    if (publication.id) {
      setEditingPublication(publication);
    } else {
      setEditingPublication(null);
    }
    setShowForm(true);
  };

  const handleSave = async (data: DigitalLibraryFormData) => {
    const isEditing = editingPublication?.id;
    const url = isEditing ? `/api/admin/digital-library/${editingPublication.id}` : '/api/admin/digital-library';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save publication');
    }

    setShowForm(false);
    setEditingPublication(null);
    fetchPublications(filters);
  };

  const handleDelete = async (publicationId: string) => {
    const response = await fetch(`/api/admin/digital-library/${publicationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete publication');
    }

    fetchPublications(filters);
  };

  const handleBulkAction = async (action: DigitalLibraryBulkActionData) => {
    const response = await fetch('/api/admin/digital-library', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to execute bulk action');
    }

    fetchPublications(filters);
  };

  const handleFiltersChange = (newFilters: DigitalLibraryFilterData) => {
    setFilters(newFilters);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPublication(null);
  };

  return (
    <div className="container mx-auto p-6">
      <DigitalLibraryList
        publications={publications}
        totalCount={pagination.totalCount}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkAction={handleBulkAction}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPublication?.id ? 'Editar Publicación' : 'Nueva Publicación'}
            </DialogTitle>
          </DialogHeader>
          <DigitalLibraryForm
            initialData={editingPublication || undefined}
            publicationId={editingPublication?.id}
            onSave={handleSave}
            onDelete={editingPublication?.id ? () => handleDelete(editingPublication.id) : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}