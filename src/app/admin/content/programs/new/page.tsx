'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProgramForm } from '@/components/cms/programs/program-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import type { ProgramFormData } from '@/lib/validations/programs';

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data: ProgramFormData) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el programa');
      }

      const result = await response.json();
      
      toast({
        title: 'Éxito',
        description: 'Programa creado correctamente',
      });

      router.push('/admin/content/programs');
    } catch (error) {
      console.error('Error creating program:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear el programa',
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
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Programa</h1>
          <p className="text-muted-foreground">
            Crea un nuevo programa o proyecto para la organización
          </p>
        </div>
      </div>

      {/* Program Form */}
      <ProgramForm onSave={handleSave} loading={loading} />
    </div>
  );
}