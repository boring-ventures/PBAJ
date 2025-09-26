"use client";

import { useRouter } from "next/navigation";
import { OpinionForm } from "@/components/cms/opinions/opinion-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import type { OpinionFormData } from "@/lib/validations/opinions";

export default function NewOpinionPage() {
  const router = useRouter();

  const handleSave = async (data: OpinionFormData) => {
    try {
      const response = await fetch("/api/admin/opinions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear la opinión");
      }

      await response.json();

      toast({
        title: "Éxito",
        description: "Opinión creada correctamente",
      });

      router.push("/admin/content/opinions");
    } catch (error) {
      console.error("Error creating opinion:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al crear la opinión",
        variant: "destructive",
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
          <h1 className="text-3xl font-bold tracking-tight">Nueva Opinión</h1>
          <p className="text-muted-foreground">
            Crea una nueva opinión o artículo de análisis para el sitio web
          </p>
        </div>
      </div>

      {/* Opinion Form */}
      <OpinionForm onSave={handleSave} />
    </div>
  );
}
