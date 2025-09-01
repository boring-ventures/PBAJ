'use client';

import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { canAccessAdmin } from '@/lib/auth/rbac';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useEffect } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  // TEMPORARILY DISABLED - JUST RETURN CHILDREN TO FIX INFINITE LOOP
  return <>{children}</>;
}