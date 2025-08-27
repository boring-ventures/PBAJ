import { Metadata } from 'next';
import { AdminGuard } from '@/components/admin/admin-guard';
import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin - Plataforma Boliviana',
    default: 'Admin Panel - Plataforma Boliviana',
  },
  description: 'Panel de administración para gestionar contenido de Plataforma Boliviana',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <DashboardLayoutClient>
        <main className="flex-1 p-6">
          {children}
        </main>
      </DashboardLayoutClient>
    </AdminGuard>
  );
}