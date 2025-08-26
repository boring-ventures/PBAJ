import { UserRole } from '@prisma/client';

// Role-based access control utilities
export const ROLES = {
  USER: 'USER' as const,
  SUPERADMIN: 'SUPERADMIN' as const,
} satisfies Record<string, UserRole>;

// Permission definitions
export const PERMISSIONS = {
  // Content Management
  MANAGE_NEWS: 'manage_news',
  CREATE_NEWS: 'create_news',
  EDIT_NEWS: 'edit_news',
  DELETE_NEWS: 'delete_news',
  PUBLISH_NEWS: 'publish_news',
  
  // Program Management
  MANAGE_PROGRAMS: 'manage_programs',
  CREATE_PROGRAMS: 'create_programs',
  EDIT_PROGRAMS: 'edit_programs',
  DELETE_PROGRAMS: 'delete_programs',
  
  // Digital Library
  MANAGE_LIBRARY: 'manage_library',
  CREATE_PUBLICATIONS: 'create_publications',
  EDIT_PUBLICATIONS: 'edit_publications',
  DELETE_PUBLICATIONS: 'delete_publications',
  
  // Media Management
  MANAGE_MEDIA: 'manage_media',
  UPLOAD_MEDIA: 'upload_media',
  DELETE_MEDIA: 'delete_media',
  
  // Categories and Tags
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_TAGS: 'manage_tags',
  
  // System Administration
  MANAGE_USERS: 'manage_users',
  VIEW_ANALYTICS: 'view_analytics',
  SYSTEM_SETTINGS: 'system_settings',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role-permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.USER]: [
    // Basic content creation permissions for regular users
    PERMISSIONS.CREATE_NEWS,
    PERMISSIONS.EDIT_NEWS,
    PERMISSIONS.CREATE_PROGRAMS,
    PERMISSIONS.EDIT_PROGRAMS,
    PERMISSIONS.CREATE_PUBLICATIONS,
    PERMISSIONS.EDIT_PUBLICATIONS,
    PERMISSIONS.UPLOAD_MEDIA,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.SUPERADMIN]: [
    // All permissions for superadmin
    ...Object.values(PERMISSIONS),
  ],
};

// Check if a role has a specific permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// Check if a role has any of the specified permissions
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

// Check if a role has all of the specified permissions
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Check if user can access admin area
export function canAccessAdmin(role: UserRole): boolean {
  return hasAnyPermission(role, [
    PERMISSIONS.MANAGE_NEWS,
    PERMISSIONS.MANAGE_PROGRAMS,
    PERMISSIONS.MANAGE_LIBRARY,
    PERMISSIONS.MANAGE_MEDIA,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_TAGS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_ANALYTICS,
  ]);
}

// Content ownership checks
export interface ContentOwnership {
  authorId?: string;
  managerId?: string;
  uploaderId?: string;
  createdById?: string;
}

export function canEditContent(
  role: UserRole, 
  userId: string, 
  content: ContentOwnership,
  requiredPermission: Permission
): boolean {
  // Superadmin can edit everything
  if (role === ROLES.SUPERADMIN && hasPermission(role, requiredPermission)) {
    return true;
  }
  
  // Users can edit their own content if they have the permission
  if (hasPermission(role, requiredPermission)) {
    const isOwner = content.authorId === userId || 
                   content.managerId === userId || 
                   content.uploaderId === userId ||
                   content.createdById === userId;
    return isOwner;
  }
  
  return false;
}

export function canDeleteContent(
  role: UserRole, 
  userId: string, 
  content: ContentOwnership,
  requiredPermission: Permission
): boolean {
  // Only superadmin can delete content for now
  return role === ROLES.SUPERADMIN && hasPermission(role, requiredPermission);
}

// Admin navigation items with permission checks
export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  permission: Permission;
  children?: AdminNavItem[];
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: 'dashboard',
    permission: PERMISSIONS.VIEW_ANALYTICS,
  },
  {
    label: 'Content Management',
    href: '/admin/content',
    icon: 'content',
    permission: PERMISSIONS.MANAGE_NEWS,
    children: [
      {
        label: 'News & Campaigns',
        href: '/admin/content/news',
        icon: 'news',
        permission: PERMISSIONS.MANAGE_NEWS,
      },
      {
        label: 'Programs',
        href: '/admin/content/programs',
        icon: 'programs',
        permission: PERMISSIONS.MANAGE_PROGRAMS,
      },
      {
        label: 'Digital Library',
        href: '/admin/content/library',
        icon: 'library',
        permission: PERMISSIONS.MANAGE_LIBRARY,
      },
    ],
  },
  {
    label: 'Media Manager',
    href: '/admin/media',
    icon: 'media',
    permission: PERMISSIONS.MANAGE_MEDIA,
  },
  {
    label: 'Categories & Tags',
    href: '/admin/taxonomy',
    icon: 'tags',
    permission: PERMISSIONS.MANAGE_CATEGORIES,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: 'analytics',
    permission: PERMISSIONS.VIEW_ANALYTICS,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: 'settings',
    permission: PERMISSIONS.SYSTEM_SETTINGS,
  },
];

// Filter navigation items based on user permissions
export function filterNavItemsByPermissions(
  items: AdminNavItem[],
  role: UserRole
): AdminNavItem[] {
  return items.filter(item => {
    if (!hasPermission(role, item.permission)) {
      return false;
    }
    
    if (item.children) {
      item.children = filterNavItemsByPermissions(item.children, role);
      return item.children.length > 0;
    }
    
    return true;
  });
}