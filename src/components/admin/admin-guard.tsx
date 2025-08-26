'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
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
  const locale = useLocale();

  useEffect(() => {
    if (!loading && (!user || !canAccessAdmin(user.role))) {
      router.push(`/${locale}/sign-in?redirectTo=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, loading, router, locale]);

  if (loading) {
    return fallback || <LoadingScreen />;
  }

  if (!user || !canAccessAdmin(user.role)) {
    return fallback || <LoadingScreen />;
  }

  return <>{children}</>;
}