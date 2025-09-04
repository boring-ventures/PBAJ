'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import type { LocalizedCategory } from '@/lib/content/content-utils';

interface ProgramsFilterProps {
  categories: LocalizedCategory[];
}

export default function ProgramsFilter({ categories }: ProgramsFilterProps) {
  // Component now renders nothing since filters are removed
  return null;
}