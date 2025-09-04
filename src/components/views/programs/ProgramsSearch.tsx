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
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
          <MagnifyingGlassIcon 
            className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5" 
            style={{ color: "#744C7A" }}
          />
          <input
            type="text"
            placeholder={locale === 'es' ? 'Buscar programas...' : 'Search programs...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-16 py-4 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-opacity-50 text-gray-700 placeholder-gray-400 text-base"
            style={{}}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-all duration-200 p-1 rounded-full hover:bg-gray-100"
              style={{ color: "#D93069" }}
            >
              <Cross2Icon className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}