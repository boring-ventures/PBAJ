-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('CAMPAIGN', 'UPDATE', 'EVENT', 'ANNOUNCEMENT', 'PRESS_RELEASE');

-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('PLANNING', 'ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('ADVOCACY', 'RESEARCH', 'EDUCATION', 'COMMUNITY_OUTREACH', 'POLICY_DEVELOPMENT', 'CAPACITY_BUILDING');

-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('RESEARCH_PAPER', 'REPORT', 'INFOGRAPHIC', 'POLICY_BRIEF', 'GUIDE', 'PRESENTATION', 'VIDEO', 'PODCAST');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "MediaCategory" AS ENUM ('NEWS_MEDIA', 'PROGRAM_MEDIA', 'GALLERY', 'LIBRARY_COVER', 'PROFILE_AVATAR', 'GENERAL');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('NEWS', 'PROGRAM', 'PUBLICATION', 'GENERAL');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'EXECUTED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScheduleAction" AS ENUM ('PUBLISH', 'UNPUBLISH', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "ScheduledContentType" AS ENUM ('NEWS', 'PROGRAM', 'PUBLICATION');

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" "NewsCategory" NOT NULL DEFAULT 'UPDATE',
    "status" "NewsStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "featured_image_url" TEXT,
    "publish_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "overview" TEXT,
    "objectives" TEXT,
    "type" "ProgramType" NOT NULL DEFAULT 'ADVOCACY',
    "status" "ProgramStatus" NOT NULL DEFAULT 'PLANNING',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "featured_image_url" TEXT,
    "gallery_images" TEXT[],
    "document_urls" TEXT[],
    "target_population" TEXT,
    "region" TEXT,
    "budget" DOUBLE PRECISION,
    "progress_percentage" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "manager_id" TEXT NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_library" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "abstract" TEXT,
    "type" "PublicationType" NOT NULL DEFAULT 'REPORT',
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "cover_image_url" TEXT,
    "thumbnail_url" TEXT,
    "tags" TEXT[],
    "keywords" TEXT[],
    "publish_date" TIMESTAMP(3),
    "isbn" TEXT,
    "doi" TEXT,
    "citation_format" TEXT,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "author_id" TEXT NOT NULL,
    "related_programs" TEXT[],

    CONSTRAINT "digital_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "type" "MediaType" NOT NULL,
    "category" "MediaCategory" NOT NULL DEFAULT 'GENERAL',
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "dimensions" TEXT,
    "duration" INTEGER,
    "tags" TEXT[],
    "metadata" JSONB,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uploader_id" TEXT NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL DEFAULT 'GENERAL',
    "color" TEXT,
    "icon_name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL DEFAULT 'GENERAL',
    "color" TEXT,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_schedules" (
    "id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "content_type" "ScheduledContentType" NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/La_Paz',
    "action" "ScheduleAction" NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "executed_at" TIMESTAMP(3),
    "failure_reason" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "content_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "news_status_idx" ON "news"("status");

-- CreateIndex
CREATE INDEX "news_category_idx" ON "news"("category");

-- CreateIndex
CREATE INDEX "news_publish_date_idx" ON "news"("publish_date");

-- CreateIndex
CREATE INDEX "news_featured_idx" ON "news"("featured");

-- CreateIndex
CREATE INDEX "news_author_id_idx" ON "news"("author_id");

-- CreateIndex
CREATE INDEX "programs_status_idx" ON "programs"("status");

-- CreateIndex
CREATE INDEX "programs_type_idx" ON "programs"("type");

-- CreateIndex
CREATE INDEX "programs_featured_idx" ON "programs"("featured");

-- CreateIndex
CREATE INDEX "programs_start_date_idx" ON "programs"("start_date");

-- CreateIndex
CREATE INDEX "programs_end_date_idx" ON "programs"("end_date");

-- CreateIndex
CREATE INDEX "programs_manager_id_idx" ON "programs"("manager_id");

-- CreateIndex
CREATE INDEX "digital_library_status_idx" ON "digital_library"("status");

-- CreateIndex
CREATE INDEX "digital_library_type_idx" ON "digital_library"("type");

-- CreateIndex
CREATE INDEX "digital_library_featured_idx" ON "digital_library"("featured");

-- CreateIndex
CREATE INDEX "digital_library_publish_date_idx" ON "digital_library"("publish_date");

-- CreateIndex
CREATE INDEX "digital_library_author_id_idx" ON "digital_library"("author_id");

-- CreateIndex
CREATE INDEX "digital_library_tags_idx" ON "digital_library"("tags");

-- CreateIndex
CREATE INDEX "media_assets_type_idx" ON "media_assets"("type");

-- CreateIndex
CREATE INDEX "media_assets_category_idx" ON "media_assets"("category");

-- CreateIndex
CREATE INDEX "media_assets_uploader_id_idx" ON "media_assets"("uploader_id");

-- CreateIndex
CREATE INDEX "media_assets_tags_idx" ON "media_assets"("tags");

-- CreateIndex
CREATE INDEX "media_assets_created_at_idx" ON "media_assets"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_contentType_idx" ON "categories"("contentType");

-- CreateIndex
CREATE INDEX "categories_is_active_idx" ON "categories"("is_active");

-- CreateIndex
CREATE INDEX "categories_sort_order_idx" ON "categories"("sort_order");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_contentType_idx" ON "tags"("contentType");

-- CreateIndex
CREATE INDEX "tags_is_active_idx" ON "tags"("is_active");

-- CreateIndex
CREATE INDEX "tags_usage_count_idx" ON "tags"("usage_count");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "content_schedules_status_idx" ON "content_schedules"("status");

-- CreateIndex
CREATE INDEX "content_schedules_content_type_idx" ON "content_schedules"("content_type");

-- CreateIndex
CREATE INDEX "content_schedules_scheduled_date_idx" ON "content_schedules"("scheduled_date");

-- CreateIndex
CREATE INDEX "content_schedules_created_by_id_idx" ON "content_schedules"("created_by_id");

-- CreateIndex
CREATE INDEX "content_schedules_content_id_idx" ON "content_schedules"("content_id");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_library" ADD CONSTRAINT "digital_library_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_schedules" ADD CONSTRAINT "content_schedules_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
