# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Database operations
pnpm prisma generate    # Generate Prisma client
pnpm prisma db push     # Push schema changes to database
pnpm prisma db reset    # Reset database
pnpm prisma studio      # Open Prisma Studio
```

## Architecture Overview

This is a Next.js 15 application with the App Router pattern, built for full-stack authentication and profile management.

### Core Stack
- **Next.js 15** with App Router and Turbopack
- **Supabase** for authentication, database, and file storage
- **Prisma ORM** with PostgreSQL for type-safe database queries
- **TypeScript** throughout the entire codebase
- **Tailwind CSS** + **shadcn/ui** for styling and components

### Authentication Architecture
- Uses Supabase Auth with middleware-based route protection (src/middleware.ts:5-42)
- Client-side password encryption implemented (docs/client-side-password-encryption.md)
- Mock auth fallback exists in src/lib/auth.ts but real auth uses Supabase
- Profile management with role-based access (USER, SUPERADMIN roles in prisma/schema.prisma:17-20)

### Route Structure
```
app/
├── (auth)/           # Unauthenticated routes (sign-in, sign-up, etc.)
├── (dashboard)/      # Protected dashboard routes
├── api/             # API routes for auth, profiles, user management
└── auth/callback    # Supabase auth callback handler
```

### Key Components Architecture
- **Settings System**: Comprehensive user settings with password management and profile updates (src/app/(dashboard)/settings/)
- **Sidebar Navigation**: Full sidebar with team switching, user profiles, and theme toggle (src/components/sidebar/)
- **Authentication Flow**: Complete auth forms with magic links, password reset, and email verification
- **File Upload System**: Avatar upload with Supabase Storage integration

### Database Schema
Single Profile model with user roles, avatar support, and soft delete functionality via `active` field.

### Environment Requirements
Requires Supabase project setup with:
- Database URL (pooled and direct connections)
- Supabase project URL and anonymous key
- Storage bucket named "avatars" for file uploads

### Development Notes
- Uses pnpm as package manager
- Turbopack enabled for faster development builds
- Client-side password encryption for enhanced security
- Middleware handles authentication redirects automatically
- Type-safe database queries with Prisma throughout