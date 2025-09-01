'use client';

import { useTranslations } from '@/hooks/use-translations';
import { useCurrentUser } from '@/hooks/use-current-user';
import { filterNavItemsByPermissions, ADMIN_NAV_ITEMS } from '@/lib/auth/rbac';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Image, 
  Tags, 
  BarChart3, 
  Settings,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Icon mapping
const iconMap = {
  dashboard: LayoutDashboard,
  content: FileText,
  news: FileText,
  programs: FolderOpen,
  library: FileText,
  media: Image,
  tags: Tags,
  analytics: BarChart3,
  settings: Settings,
};

interface AdminSidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ className, isOpen = true }: AdminSidebarProps) {
  const t = useTranslations('admin');
  const pathname = usePathname();
  // const { user } = useCurrentUser(); // DISABLED TO FIX INFINITE LOOP
  const user = null;
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  if (!user) return <div>Admin sidebar disabled</div>;

  // This code is unreachable but kept for reference
  const navItems = filterNavItemsByPermissions(ADMIN_NAV_ITEMS, (user as any).role);

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isItemActive = (href: string) => {
    return pathname.includes(href);
  };

  const isItemExpanded = (href: string) => {
    return expandedItems.includes(href);
  };

  return (
    <aside className={cn(
      "flex flex-col w-64 bg-card border-r transition-all duration-300",
      !isOpen && "w-0 overflow-hidden lg:w-16",
      className
    )}>
      {/* Sidebar Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">PB</span>
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <h2 className="font-semibold text-lg">Plataforma Boliviana</h2>
              <p className="text-sm text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || FileText;
            const hasChildren = item.children && item.children.length > 0;
            const isActive = isItemActive(item.href);
            const isExpanded = isItemExpanded(item.href);

            return (
              <div key={item.href}>
                {hasChildren ? (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-3",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => toggleExpanded(item.href)}
                  >
                    <Icon className="h-4 w-4" />
                    {isOpen && (
                      <>
                        <span className="ml-3 flex-1 text-left">{t(item.label.toLowerCase().replace(/\s+/g, ''))}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-3",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {isOpen && <span className="ml-3">{t(item.label.toLowerCase().replace(/\s+/g, ''))}</span>}
                    </Link>
                  </Button>
                )}

                {/* Children */}
                {hasChildren && isExpanded && isOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children?.map((child) => {
                      const ChildIcon = iconMap[child.icon as keyof typeof iconMap] || FileText;
                      const isChildActive = isItemActive(child.href);

                      return (
                        <Button
                          key={child.href}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start h-9 px-3",
                            isChildActive && "bg-accent text-accent-foreground"
                          )}
                          asChild
                        >
                          <Link href={child.href}>
                            <ChildIcon className="h-3 w-3" />
                            <span className="ml-3 text-sm">{t(child.label.toLowerCase().replace(/\s+/g, ''))}</span>
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <Separator className="my-4" />

        {/* User Info */}
        {isOpen && (
          <div className="px-3 py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">
                  {(user as any).firstName?.[0] || (user as any).email?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {`${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() || (user as any).email || 'User'}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {(user as any).role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}