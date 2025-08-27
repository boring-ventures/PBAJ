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
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !canAccessAdmin(user.role))) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  if (loading) {
    return fallback || <LoadingScreen />;
  }

  if (!user || !canAccessAdmin(user.role)) {
    return fallback || <LoadingScreen />;
  }

  return <>{children}</>;
}