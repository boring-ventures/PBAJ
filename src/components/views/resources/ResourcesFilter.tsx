'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';

interface ResourcesFilterProps {
  categories?: any[];
}

export default function ResourcesFilter({ categories = [] }: ResourcesFilterProps) {
  // Component now renders nothing since filters are removed
  return null;
}