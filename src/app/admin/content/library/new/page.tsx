'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DigitalLibraryForm } from '@/components/cms/digital-library/digital-library-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import type { DigitalLibraryFormData } from '@/lib/validations/digital-library';

export default function NewPublicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data: DigitalLibraryFormData) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/digital-library', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la publicación');
      }

      const result = await response.json();
      
      toast({
        title: 'Éxito',
        description: 'Publicación creada correctamente',
      });

      router.push('/admin/content/library');
    } catch (error) {
      console.error('Error creating publication:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear la publicación',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva Publicación</h1>
          <p className="text-muted-foreground">
            Agrega una nueva publicación a la biblioteca digital
          </p>
        </div>
      </div>

      {/* Digital Library Form */}
      <DigitalLibraryForm onSave={handleSave} loading={loading} />
    </div>
  );
}