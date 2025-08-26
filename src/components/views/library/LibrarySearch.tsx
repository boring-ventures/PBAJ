'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons';

export default function LibrarySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;

  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const currentSort = searchParams?.get('sort') || 'publishDate';

  const handleSearch = (term: string) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    
    if (term) {
      current.set('search', term);
    } else {
      current.delete('search');
    }
    
    // Reset to first page when searching
    current.delete('page');
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`/${locale}/library${query}`);
  };

  const handleSortChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    
    if (value && value !== 'publishDate') {
      current.set('sort', value);
    } else {
      current.delete('sort');
    }
    
    // Reset to first page when changing sort
    current.delete('page');
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`/${locale}/library${query}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    handleSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const sortOptions = [
    { value: 'publishDate', label: locale === 'es' ? 'Más recientes' : 'Most recent' },
    { value: 'title', label: locale === 'es' ? 'Título (A-Z)' : 'Title (A-Z)' },
    { value: 'downloads', label: locale === 'es' ? 'Más descargadas' : 'Most downloaded' },
    { value: 'views', label: locale === 'es' ? 'Más vistas' : 'Most viewed' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={locale === 'es' ? 'Buscar publicaciones...' : 'Search publications...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Cross2Icon className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Sort Dropdown */}
      <div className="w-full sm:w-48">
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder={locale === 'es' ? 'Ordenar por' : 'Sort by'} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}