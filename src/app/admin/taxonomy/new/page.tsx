'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TaxonomyForm } from '@/components/cms/taxonomy/taxonomy-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function NewTaxonomyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as 'category' | 'tag' || 'category';
  const [loading, setLoading] = useState(false);

  const handleSave = async (data: any) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/taxonomy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error al crear la ${type === 'category' ? 'categoría' : 'etiqueta'}`);
      }

      const result = await response.json();
      
      toast({
        title: 'Éxito',
        description: `${type === 'category' ? 'Categoría' : 'Etiqueta'} creada correctamente`,
      });

      router.push('/admin/taxonomy');
    } catch (error) {
      console.error('Error creating taxonomy item:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Error al crear la ${type === 'category' ? 'categoría' : 'etiqueta'}`,
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
          <h1 className="text-3xl font-bold tracking-tight">
            {type === 'category' ? 'Nueva Categoría' : 'Nueva Etiqueta'}
          </h1>
          <p className="text-muted-foreground">
            Crea una nueva {type === 'category' ? 'categoría' : 'etiqueta'} para organizar el contenido
          </p>
        </div>
      </div>

      {/* Taxonomy Form */}
      <TaxonomyForm type={type} onSave={handleSave} />
    </div>
  );
}