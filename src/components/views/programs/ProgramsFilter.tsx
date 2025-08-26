'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { LocalizedCategory } from '@/lib/content/content-utils';

interface ProgramsFilterProps {
  categories: LocalizedCategory[];
}

export default function ProgramsFilter({ categories }: ProgramsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;

  const currentType = searchParams?.get('type') || 'all';
  const currentStatus = searchParams?.get('status') || 'all';

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
    
    router.push(`/${locale}/programs${query}`);
  };

  const programTypes = [
    { value: 'all', label: locale === 'es' ? 'Todos los tipos' : 'All types' },
    { value: 'EDUCATION', label: locale === 'es' ? 'Educación' : 'Education' },
    { value: 'HEALTH', label: locale === 'es' ? 'Salud' : 'Health' },
    { value: 'ECONOMIC', label: locale === 'es' ? 'Desarrollo Económico' : 'Economic Development' },
    { value: 'ENVIRONMENT', label: locale === 'es' ? 'Medio Ambiente' : 'Environment' },
    { value: 'GOVERNANCE', label: locale === 'es' ? 'Gobernanza' : 'Governance' },
    { value: 'SOCIAL', label: locale === 'es' ? 'Desarrollo Social' : 'Social Development' },
    { value: 'INFRASTRUCTURE', label: locale === 'es' ? 'Infraestructura' : 'Infrastructure' }
  ];

  const programStatus = [
    { value: 'all', label: locale === 'es' ? 'Todos los estados' : 'All statuses' },
    { value: 'ACTIVE', label: locale === 'es' ? 'Activo' : 'Active' },
    { value: 'COMPLETED', label: locale === 'es' ? 'Completado' : 'Completed' },
    { value: 'PLANNING', label: locale === 'es' ? 'En Planificación' : 'Planning' },
    { value: 'PAUSED', label: locale === 'es' ? 'Pausado' : 'Paused' }
  ];

  const activeFilters = [];
  if (currentType !== 'all') {
    const typeLabel = programTypes.find(t => t.value === currentType)?.label;
    if (typeLabel) activeFilters.push({ key: 'type', label: typeLabel });
  }
  if (currentStatus !== 'all') {
    const statusLabel = programStatus.find(s => s.value === currentStatus)?.label;
    if (statusLabel) activeFilters.push({ key: 'status', label: statusLabel });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Program Type Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {locale === 'es' ? 'Tipo de programa' : 'Program type'}
          </label>
          <Select value={currentType} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder={locale === 'es' ? 'Seleccionar tipo' : 'Select type'} />
            </SelectTrigger>
            <SelectContent>
              {programTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Program Status Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {locale === 'es' ? 'Estado' : 'Status'}
          </label>
          <Select value={currentStatus} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder={locale === 'es' ? 'Seleccionar estado' : 'Select status'} />
            </SelectTrigger>
            <SelectContent>
              {programStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
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
              onClick={() => router.push(`/${locale}/programs`)}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {locale === 'es' ? 'Limpiar todo' : 'Clear all'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}