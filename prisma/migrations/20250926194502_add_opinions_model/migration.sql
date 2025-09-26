-- CreateEnum
CREATE TYPE "OpinionCategory" AS ENUM ('ANALYSIS', 'COMMENTARY', 'EDITORIAL', 'PERSPECTIVE', 'REVIEW', 'OPINION_PIECE');

-- CreateEnum
CREATE TYPE "OpinionStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- AlterEnum
ALTER TYPE "ScheduledContentType" ADD VALUE 'OPINION';

-- CreateTable
CREATE TABLE "opinions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" "OpinionCategory" NOT NULL DEFAULT 'ANALYSIS',
    "status" "OpinionStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "featured_image_url" TEXT,
    "publish_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "opinions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "opinions_status_idx" ON "opinions"("status");

-- CreateIndex
CREATE INDEX "opinions_category_idx" ON "opinions"("category");

-- CreateIndex
CREATE INDEX "opinions_publish_date_idx" ON "opinions"("publish_date");

-- CreateIndex
CREATE INDEX "opinions_featured_idx" ON "opinions"("featured");

-- CreateIndex
CREATE INDEX "opinions_author_id_idx" ON "opinions"("author_id");

-- CreateIndex
CREATE INDEX "opinions_title_idx" ON "opinions"("title");

-- AddForeignKey
ALTER TABLE "opinions" ADD CONSTRAINT "opinions_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
