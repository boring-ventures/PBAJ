'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons';

export default function ProgramsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;

  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');

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
    
    router.push(`/${locale}/programs${query}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    handleSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={locale === 'es' ? 'Buscar programas...' : 'Search programs...'}
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
  );
}