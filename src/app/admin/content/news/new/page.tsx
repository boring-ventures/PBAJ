'use client';

import { useRouter } from 'next/navigation';
import { NewsForm } from '@/components/cms/news/news-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import type { NewsFormData } from '@/lib/validations/news';

export default function NewNewsPage() {
  const router = useRouter();

  const handleSave = async (data: NewsFormData) => {
    try {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la noticia');
      }

      await response.json();
      
      toast({
        title: 'Éxito',
        description: 'Noticia creada correctamente',
      });

      router.push('/admin/content/news');
    } catch (error) {
      console.error('Error creating news:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear la noticia',
        variant: 'destructive',
      });
      throw error;
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
          <h1 className="text-3xl font-bold tracking-tight">Nueva Noticia</h1>
          <p className="text-muted-foreground">
            Crea una nueva noticia o comunicado para el sitio web
          </p>
        </div>
      </div>

      {/* News Form */}
      <NewsForm onSave={handleSave} />
    </div>
  );
}