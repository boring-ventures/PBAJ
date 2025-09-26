/*
  Warnings:

  - You are about to drop the column `altText` on the `media_assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "media_assets" DROP COLUMN "altText",
ADD COLUMN     "alt_text" TEXT;

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories"("name");

-- CreateIndex
CREATE INDEX "digital_library_title_idx" ON "digital_library"("title");

-- CreateIndex
CREATE INDEX "news_title_idx" ON "news"("title");

-- CreateIndex
CREATE INDEX "programs_title_idx" ON "programs"("title");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags"("name");
