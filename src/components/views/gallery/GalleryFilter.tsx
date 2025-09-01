'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function GalleryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Default to Spanish locale
  const locale = 'es';

  const currentType = searchParams?.get('type') || 'all';
  const currentCategory = searchParams?.get('category') || 'all';
  const currentYear = searchParams?.get('year') || 'all';

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
    
    router.push(`/resources/multimedia${query}`);
  };

  const mediaTypes = [
    { value: 'all', label: locale === 'es' ? 'Todos los tipos' : 'All types' },
    { value: 'IMAGE', label: locale === 'es' ? 'Imágenes' : 'Images' },
    { value: 'VIDEO', label: locale === 'es' ? 'Videos' : 'Videos' },
  ];

  const categories = [
    { value: 'all', label: locale === 'es' ? 'Todas las categorías' : 'All categories' },
    { value: 'EVENTS', label: locale === 'es' ? 'Eventos' : 'Events' },
    { value: 'PROGRAMS', label: locale === 'es' ? 'Programas' : 'Programs' },
    { value: 'COMMUNITIES', label: locale === 'es' ? 'Comunidades' : 'Communities' },
    { value: 'TEAM', label: locale === 'es' ? 'Equipo' : 'Team' },
    { value: 'FACILITIES', label: locale === 'es' ? 'Instalaciones' : 'Facilities' },
    { value: 'PARTNERSHIPS', label: locale === 'es' ? 'Alianzas' : 'Partnerships' },
    { value: 'ACHIEVEMENTS', label: locale === 'es' ? 'Logros' : 'Achievements' },
  ];

  const years = [
    { value: 'all', label: locale === 'es' ? 'Todos los años' : 'All years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
  ];

  const activeFilters = [];
  if (currentType !== 'all') {
    const typeLabel = mediaTypes.find(t => t.value === currentType)?.label;
    if (typeLabel) activeFilters.push({ key: 'type', label: typeLabel });
  }
  if (currentCategory !== 'all') {
    const categoryLabel = categories.find(c => c.value === currentCategory)?.label;
    if (categoryLabel) activeFilters.push({ key: 'category', label: categoryLabel });
  }
  if (currentYear !== 'all') {
    activeFilters.push({ key: 'year', label: currentYear });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Media Type Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {locale === 'es' ? 'Tipo' : 'Type'}
          </label>
          <Select value={currentType} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder={locale === 'es' ? 'Tipo' : 'Type'} />
            </SelectTrigger>
            <SelectContent>
              {mediaTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {locale === 'es' ? 'Categoría' : 'Category'}
          </label>
          <Select value={currentCategory} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder={locale === 'es' ? 'Categoría' : 'Category'} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {locale === 'es' ? 'Año' : 'Year'}
          </label>
          <Select value={currentYear} onValueChange={(value) => handleFilterChange('year', value)}>
            <SelectTrigger>
              <SelectValue placeholder={locale === 'es' ? 'Año' : 'Year'} />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
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
              onClick={() => router.push('/resources/multimedia')}
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
            { value: 'IMAGE', label: locale === 'es' ? 'Fotos' : 'Photos' },
            { value: 'VIDEO', label: locale === 'es' ? 'Videos' : 'Videos' },
            { value: 'EVENTS', key: 'category', label: locale === 'es' ? 'Eventos' : 'Events' },
            { value: 'PROGRAMS', key: 'category', label: locale === 'es' ? 'Programas' : 'Programs' }
          ].map((quickFilter) => {
            const isActive = (quickFilter.key === 'category' ? currentCategory : currentType) === quickFilter.value;
            return (
              <button
                key={quickFilter.value}
                onClick={() => handleFilterChange(quickFilter.key || 'type', quickFilter.value)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {quickFilter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}