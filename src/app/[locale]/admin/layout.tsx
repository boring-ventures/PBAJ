import { setRequestLocale } from 'next-intl/server';
import { AdminGuard } from '@/components/admin/admin-guard';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function AdminLayout({ 
  children, 
  params: { locale } 
}: AdminLayoutProps) {
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <AdminHeader />
          
          {/* Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}