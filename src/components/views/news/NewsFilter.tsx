'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import type { LocalizedCategory } from "@/lib/content/content-utils";

interface NewsFilterProps {
  categories?: LocalizedCategory[];
}

export default function NewsFilter({ categories = [] }: NewsFilterProps) {
  // Component now renders nothing since filters are removed
  return null;
}
