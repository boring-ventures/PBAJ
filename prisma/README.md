# Database Seeding

This directory contains database seeding utilities to populate your development environment with sample data.

## Files

- `seed.ts` - Main seed script that populates the database with sample data
- `README.md` - This documentation file

## Usage

### Populate Database with Sample Data

```bash
# Run the seed script to populate the database with sample data
npm run db:seed

# Alternative command
npm run db:populate
```

### Reset Database and Re-seed

```bash
# Reset the entire database and run the seed script
npm run db:reset
```

⚠️ **Warning**: This will delete all data and recreate the database schema.

## What the Seed Script Creates

The seed script populates the database with the following data:

### 👤 **Profiles & Authentication**

- Uses your existing admin profile (must exist first)
- No new users are created (uses existing auth system)

### 📂 **Categories**

- **Defensa y Justicia** - For defense and justice programs
- **Investigación e Información** - For research and information content
- **Educación y Capacitación** - For education and training programs

### 🏷️ **Tags**

- Democracia
- Derechos Humanos
- Corrupción
- Gobernanza

### 📰 **News Articles (3)**

1. **"Nueva Ley de Transparencia en Bolivia"** - Featured announcement
2. **"Plan Estratégico 2024"** - Strategy plan update
3. **"Seminario Internacional"** - Event announcement

### 🎯 **Programs (2)**

1. **"Iniciativa de Participación Ciudadana Digital"** - Capacity building program
2. **"Observatorio de Corrupción"** - Research program

### 📚 **Digital Library Publications (2)**

1. **"Estado de la Democracia en Bolivia 2024"** - Formal report
2. **"Guía de Acceso a la Información Pública"** - Citizen guide

### 🖼️ **Media Assets (2)**

1. Workshop transparency photo
2. Democracy reform document PDF

### ⏰ **Content Schedules (1)**

1. Scheduled publication of the transparency law news

## Prerequisites

### Required Before Seeding

1. **Active Admin Profile**: Ensure you have at least one admin profile in the database
2. **Database Migrations**: Run `npx prisma db push` to ensure schema is up to date
3. **Environment Variables**: Ensure DATABASE_URL is correctly configured

### Environment Setup

Make sure your `.env` file has:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

## Structure of Seeded Data

All seeded content is designed to work with your platform's features:

### 🌐 **Multilingual Content**

Seed content is primarily in Spanish (for Bolivia) and leverages your existing translation system.

### 🔗 **Interconnected Data**

- News articles reference programs
- Media assets link to published content
- Programs include relevant documentation and gallery images

### 📊 **Realistic Metrics**

- View and download counts reflect realistic usage
- Content scheduling is set for future dates
- Budget and progress tracking for programs

### 🎨 **UI-Ready Data**

- Categories include color codes and icons for proper display
- Media assets have thumbnails and proper metadata
- Content follows your platform's publishing workflow

## Development Workflow

### 1. Fresh Installation

```bash
# Set up database
npx prisma db push
npm run db:seed
```

### 2. Reset Development Environment

```bash
# When you need to start fresh
npm run db:reset
```

### 3. Add Sample Data

```bash
# If you just want to add more sample data without resetting
npm run db:seed
```

## Troubleshooting

### Error: "No admin profile found"

This means you need to create a user profile first through the normal authentication flow.

### Error: Database connection issues

Verify your environment variables and database connectivity.

### Data Conflicts

If you run `npm run db:seed` multiple times, it will clean existing data first and then reseed.

## Customizing Seed Data

You can modify `seed.ts` to:

- Add more sample content
- Change content in different languages
- Modify the type/variety of seeded data
- Adjust publication dates and scheduling

The seed script is non-destructive - it cleans its own data first, so it won't affect existing user accounts or other independent data.
