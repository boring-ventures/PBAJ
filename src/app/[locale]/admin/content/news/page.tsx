import { setRequestLocale } from 'next-intl/server';
import { NewsForm } from '@/components/cms/news/news-form';

interface Props {
  params: { locale: string };
  searchParams: { id?: string };
}

export default function NewsManagementPage({ 
  params: { locale },
  searchParams: { id }
}: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  // If no ID, show create form. If ID exists, show edit form
  const isEdit = Boolean(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Editar Noticia' : 'Nueva Noticia'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit 
              ? 'Modifica los detalles de la noticia existente'
              : 'Crea una nueva noticia para publicar en el sitio web'
            }
          </p>
        </div>
      </div>

      <NewsForm 
        newsId={id}
        onSave={async (data) => {
          // TODO: Implement save logic
          console.log('Save news:', data);
        }}
        onDelete={async () => {
          // TODO: Implement delete logic
          console.log('Delete news:', id);
        }}
      />
    </div>
  );
}