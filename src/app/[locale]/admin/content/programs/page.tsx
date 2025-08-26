'use client';

import { useState, useEffect } from 'react';
import { ProgramFormData, ProgramFilterData, ProgramBulkActionData } from '@/lib/validations/programs';
import { ProgramForm } from '@/components/cms/programs/program-form';
import { ProgramsList } from '@/components/cms/programs/programs-list';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface Program {
  id: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  overviewEs?: string;
  overviewEn?: string;
  objectivesEs?: string;
  objectivesEn?: string;
  type: string;
  status: string;
  featured: boolean;
  startDate: Date | null;
  endDate: Date | null;
  featuredImageUrl?: string;
  galleryImages: string[];
  documentUrls: string[];
  targetPopulation?: string;
  region?: string;
  budget?: number;
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export default function ProgramsManagementPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [filters, setFilters] = useState<ProgramFilterData>({
    page: 1,
    limit: 10,
  });

  const fetchPrograms = async (currentFilters: ProgramFilterData) => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/admin/programs?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }

      const data = await response.json();
      setPrograms(data.programs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los programas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms(filters);
  }, [filters]);

  const handleEdit = (program: Program) => {
    if (program.id) {
      setEditingProgram(program);
    } else {
      setEditingProgram(null);
    }
    setShowForm(true);
  };

  const handleSave = async (data: ProgramFormData) => {
    const isEditing = editingProgram?.id;
    const url = isEditing ? `/api/admin/programs/${editingProgram.id}` : '/api/admin/programs';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save program');
    }

    setShowForm(false);
    setEditingProgram(null);
    fetchPrograms(filters);
  };

  const handleDelete = async (programId: string) => {
    const response = await fetch(`/api/admin/programs/${programId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete program');
    }

    fetchPrograms(filters);
  };

  const handleBulkAction = async (action: ProgramBulkActionData) => {
    const response = await fetch('/api/admin/programs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to execute bulk action');
    }

    fetchPrograms(filters);
  };

  const handleFiltersChange = (newFilters: ProgramFilterData) => {
    setFilters(newFilters);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProgram(null);
  };

  return (
    <div className="container mx-auto p-6">
      <ProgramsList
        programs={programs}
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
              {editingProgram?.id ? 'Editar Programa' : 'Nuevo Programa'}
            </DialogTitle>
          </DialogHeader>
          <ProgramForm
            initialData={editingProgram || undefined}
            programId={editingProgram?.id}
            onSave={handleSave}
            onDelete={editingProgram?.id ? () => handleDelete(editingProgram.id) : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}