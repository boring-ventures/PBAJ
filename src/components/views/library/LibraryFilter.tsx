'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { LocalizedCategory } from '@/lib/content/content-utils';

interface LibraryFilterProps {
  categories: LocalizedCategory[];
}

export default function LibraryFilter({ categories }: LibraryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;

  const currentType = searchParams?.get('type') || 'all';
  const currentCategory = searchParams?.get('category') || 'all';

  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    
    if (value && value !== 'all') {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    
    // Reset to first page when filtering
    current.delete('page');
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`/${locale}/library${query}`);
  };

  const publicationTypes = [
    { value: 'all', label: locale === 'es' ? 'Todos los tipos' : 'All types' },
    { value: 'RESEARCH', label: locale === 'es' ? 'Investigaciones' : 'Research' },
    { value: 'REPORT', label: locale === 'es' ? 'Informes' : 'Reports' },
    { value: 'GUIDE', label: locale === 'es' ? 'Guías' : 'Guides' },
    { value: 'PUBLICATION', label: locale === 'es' ? 'Publicaciones' : 'Publications' },
    { value: 'POLICY_BRIEF', label: locale === 'es' ? 'Resúmenes de Políticas' : 'Policy Briefs' },
    { value: 'CASE_STUDY', label: locale === 'es' ? 'Estudios de Caso' : 'Case Studies' },
    { value: 'MANUAL', label: locale === 'es' ? 'Manuales' : 'Manuals' },
    { value: 'TOOLKIT', label: locale === 'es' ? 'Herramientas' : 'Toolkits' }
  ];

  const topicCategories = [
    { value: 'all', label: locale === 'es' ? 'Todos los temas' : 'All topics' },
    { value: 'education', label: locale === 'es' ? 'Educación' : 'Education' },
    { value: 'health', label: locale === 'es' ? 'Salud' : 'Health' },
    { value: 'economic-development', label: locale === 'es' ? 'Desarrollo Económico' : 'Economic Development' },
    { value: 'environment', label: locale === 'es' ? 'Medio Ambiente' : 'Environment' },
    { value: 'governance', label: locale === 'es' ? 'Gobernanza' : 'Governance' },
    { value: 'social-development', label: locale === 'es' ? 'Desarrollo Social' : 'Social Development' },
    { value: 'gender', label: locale === 'es' ? 'Género' : 'Gender' },
    { value: 'youth', label: locale === 'es' ? 'Juventud' : 'Youth' },
    // Add database categories
    ...(categories || []).map(cat => ({
      value: cat.slug,
      label: cat.name
    }))
  ];

  // Remove duplicates
  const uniqueTopics = topicCategories.filter((cat, index, self) => 
    index === self.findIndex(c => c.value === cat.value)
  );

  const activeFilters = [];
  if (currentType !== 'all') {
    const typeLabel = publicationTypes.find(t => t.value === currentType)?.label;
    if (typeLabel) activeFilters.push({ key: 'type', label: typeLabel });
  }
  if (currentCategory !== 'all') {
    const categoryLabel = uniqueTopics.find(c => c.value === currentCategory)?.label;
    if (categoryLabel) activeFilters.push({ key: 'category', label: categoryLabel });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Publication Type Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {locale === 'es' ? 'Tipo de publicación' : 'Publication type'}
          </label>
          <Select value={currentType} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder={locale === 'es' ? 'Seleccionar tipo' : 'Select type'} />
            </SelectTrigger>
            <SelectContent>
              {publicationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Topic Category Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {locale === 'es' ? 'Tema' : 'Topic'}
          </label>
          <Select value={currentCategory} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder={locale === 'es' ? 'Seleccionar tema' : 'Select topic'} />
            </SelectTrigger>
            <SelectContent>
              {uniqueTopics.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            {locale === 'es' ? 'Filtros activos:' : 'Active filters:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter.key} variant="secondary" className="flex items-center gap-2">
                {filter.label}
                <button
                  onClick={() => handleFilterChange(filter.key, 'all')}
                  className="text-muted-foreground hover:text-foreground ml-1"
                >
                  ×
                </button>
              </Badge>
            ))}
            <button
              onClick={() => router.push(`/${locale}/library`)}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {locale === 'es' ? 'Limpiar todo' : 'Clear all'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Filter Buttons */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          {locale === 'es' ? 'Filtros rápidos:' : 'Quick filters:'}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'RESEARCH', label: locale === 'es' ? 'Investigaciones' : 'Research' },
            { value: 'REPORT', label: locale === 'es' ? 'Informes' : 'Reports' },
            { value: 'GUIDE', label: locale === 'es' ? 'Guías' : 'Guides' },
            { value: 'MANUAL', label: locale === 'es' ? 'Manuales' : 'Manuals' }
          ].map((quickFilter) => (
            <button
              key={quickFilter.value}
              onClick={() => handleFilterChange('type', quickFilter.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                currentType === quickFilter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {quickFilter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}