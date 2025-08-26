# Task List: Plataforma Boliviana Institutional Website

Based on the PRD requirements and current codebase assessment, this document outlines the implementation tasks for the institutional website with CMS functionality.

## Current Codebase Assessment

**Existing Infrastructure:**
- ✅ Next.js 14 with App Router architecture
- ✅ Supabase integration with authentication
- ✅ TypeScript + TailwindCSS + Shadcn/UI components
- ✅ Prisma ORM with PostgreSQL database
- ✅ Basic profile management system
- ✅ Landing page components structure

**Leverageable Components:**
- Authentication system (login/signup flows)
- Profile management components
- UI component library (buttons, forms, dialogs, etc.)
- Theme context and providers
- Landing page structure (Header, Footer, Hero sections)

**Missing for PRD Requirements:**
- Bilingual content management system
- CMS admin dashboard 
- Content models (News, Programs, Digital Library, etc.)
- Public website sections specific to Plataforma Boliviana
- Media management system
- SEO optimization
- Social media integration

## Relevant Files

- `prisma/schema.prisma` - Extended database models for content management (News, Programs, Digital Library, etc.)
- `src/types/content.ts` - TypeScript interfaces for content models and bilingual structure
- `src/lib/i18n/config.ts` - Internationalization configuration for Spanish/English support
- `src/lib/i18n/dictionary.ts` - Translation dictionaries and utility functions
- `src/components/cms/` - Directory containing all CMS admin components
- `src/components/cms/editor/rich-text-editor.tsx` - WYSIWYG content editor component
- `src/components/cms/media/media-manager.tsx` - Media upload and management interface
- `src/components/cms/content-forms/` - Forms for creating/editing different content types
- `src/app/admin/` - Admin dashboard pages and layouts
- `src/app/admin/layout.tsx` - Protected admin layout with navigation
- `src/app/admin/content/news/page.tsx` - News management interface
- `src/app/admin/content/programs/page.tsx` - Programs management interface
- `src/app/admin/content/library/page.tsx` - Digital library management interface
- `src/app/api/admin/` - Admin-only API routes for content management
- `src/app/api/admin/news/route.ts` - API endpoints for news CRUD operations
- `src/app/api/admin/programs/route.ts` - API endpoints for programs CRUD operations
- `src/app/api/admin/media/route.ts` - API endpoints for media upload and management
- `src/app/[lang]/` - Public pages with language routing (es/en)
- `src/app/[lang]/layout.tsx` - Bilingual layout with language switcher
- `src/app/[lang]/page.tsx` - Bilingual homepage
- `src/app/[lang]/about/page.tsx` - About section with team and organization info
- `src/app/[lang]/programs/page.tsx` - Programs listing and filtering
- `src/app/[lang]/news/page.tsx` - News and campaigns section
- `src/app/[lang]/library/page.tsx` - Digital library with search and categories
- `src/app/[lang]/gallery/page.tsx` - Multimedia gallery
- `src/app/[lang]/opinion/page.tsx` - Blog/opinion section
- `src/app/[lang]/contact/page.tsx` - Contact forms and information
- `src/app/[lang]/donate/page.tsx` - Donations page with external links
- `src/components/ui/language-switcher.tsx` - Language toggle component for navbar
- `src/components/public/` - Public-facing components for institutional pages
- `src/components/public/search/global-search.tsx` - Internal search functionality
- `src/lib/content/` - Content fetching and management utilities
- `src/lib/seo/metadata.ts` - SEO utilities for dynamic meta tags
- `src/lib/analytics/google-analytics.ts` - Google Analytics integration
- `next.config.ts` - Updated with i18n routing and image optimization
- `src/middleware.ts` - Updated to handle language routing and admin protection

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `content-api.tsx` and `content-api.test.tsx` in the same directory).
- Use `pnpm test` to run tests. This project uses the existing testing setup.
- Admin routes require authentication and appropriate role validation.
- All content models support bilingual fields (Spanish/English).

## Tasks

- [ ] 1.0 Database Schema and Content Models Design
  - [ ] 1.1 Extend Prisma schema with News model (title, content, category, publishDate, featured fields)
  - [ ] 1.2 Create Programs model with bilingual support (title, description, status, images, documents)
  - [ ] 1.3 Add DigitalLibrary model for publications (title, description, fileUrl, category, tags)
  - [ ] 1.4 Implement MediaAsset model for file management (filename, url, type, alt text)
  - [ ] 1.5 Create Category and Tag models for content organization
  - [ ] 1.6 Add bilingual content support to all models (separate ES/EN fields)
  - [ ] 1.7 Generate Prisma client and push schema changes
  
- [ ] 2.0 Bilingual System Architecture Implementation  
  - [ ] 2.1 Set up Next.js internationalization with app directory routing
  - [ ] 2.2 Create language detection and routing middleware
  - [ ] 2.3 Build translation dictionary system with Spanish/English content
  - [ ] 2.4 Implement language switcher component for navigation bar
  - [ ] 2.5 Create utilities for fetching content in current language
  - [ ] 2.6 Update existing layout to support [lang] routing structure
  
- [ ] 3.0 CMS Admin Dashboard Development
  - [ ] 3.1 Create protected admin layout with role-based access control
  - [ ] 3.2 Build admin navigation sidebar with content management sections
  - [ ] 3.3 Develop rich text editor component for content creation
  - [ ] 3.4 Create news management interface (list, create, edit, delete)
  - [ ] 3.5 Build programs management system with image upload
  - [ ] 3.6 Implement digital library management with file upload
  - [ ] 3.7 Add content scheduling functionality for publication dates
  - [ ] 3.8 Create media management interface for organizing uploaded files
  
- [ ] 4.0 Public Website Pages and Sections
  - [ ] 4.1 Build bilingual homepage with news feed and key statistics
  - [ ] 4.2 Create About section with team profiles and organizational structure
  - [ ] 4.3 Develop Programs section with filtering and categorization
  - [ ] 4.4 Implement News & Campaigns section with pagination and search
  - [ ] 4.5 Build Digital Library with PDF preview and download functionality
  - [ ] 4.6 Create Multimedia Gallery with image/video organization
  - [ ] 4.7 Develop Opinion/Blog section for thought leadership content
  - [ ] 4.8 Build Contact page with forms and Google Maps integration
  - [ ] 4.9 Create Donations page with secure external bank links
  
- [ ] 5.0 Media Management and File Upload System
  - [ ] 5.1 Configure Supabase Storage buckets for different media types
  - [ ] 5.2 Implement file upload API with size validation and compression
  - [ ] 5.3 Build media browser component for CMS with search and filters
  - [ ] 5.4 Create image optimization pipeline with multiple sizes
  - [ ] 5.5 Add drag-and-drop upload interface for admin users
  - [ ] 5.6 Implement media metadata management (alt text, captions, tags)
  
- [ ] 6.0 SEO, Analytics, and Performance Optimization
  - [ ] 6.1 Integrate Google Analytics with event tracking for content engagement
  - [ ] 6.2 Implement dynamic meta tags and Open Graph data for all pages
  - [ ] 6.3 Add structured data markup for organization and content
  - [ ] 6.4 Configure sitemap generation with bilingual URLs
  - [ ] 6.5 Implement lazy loading for images and optimize Core Web Vitals
  - [ ] 6.6 Add social media sharing buttons with proper metadata
  - [ ] 6.7 Set up internal search functionality across all content types
  - [ ] 6.8 Configure caching strategy for static and dynamic content