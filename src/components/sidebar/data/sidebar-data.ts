import {
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  FolderOpen,
  Globe,
  Image,
  LayoutDashboard,
  Newspaper,
  Settings,
  Tags,
  Target,
  Users,
} from "lucide-react";
import type { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "Admin",
    email: "admin@plataformaboliviana.org",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Plataforma Boliviana",
      logo: Globe,
      plan: "CMS Admin",
    },
  ],
  navGroups: [
    {
      title: "Principal",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Analíticas",
          url: "/admin/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Gestión de Contenido",
      items: [
        {
          title: "Noticias",
          url: "/admin/content/news",
          icon: Newspaper,
        },
        {
          title: "Programas",
          url: "/admin/content/programs",
          icon: Target,
        },
        {
          title: "Biblioteca Digital",
          url: "/admin/content/library",
          icon: BookOpen,
        },
      ],
    },
    {
      title: "Medios y Recursos",
      items: [
        {
          title: "Galería de Medios",
          url: "/admin/media",
          icon: Image,
        },
        {
          title: "Taxonomía",
          url: "/admin/taxonomy",
          icon: Tags,
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        {
          title: "Configuración",
          url: "/admin/settings",
          icon: Settings,
        },
        {
          title: "Usuarios",
          url: "/admin/users",
          icon: Users,
        },
      ],
    },
  ],
};
