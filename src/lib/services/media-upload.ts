import { MediaType, MediaCategory } from '@prisma/client';
import prisma from '@/lib/prisma';
import { 
  uploadFile, 
  deleteFile, 
  getPublicUrl, 
  getBucketForMimeType,
  generateFilePath,
  STORAGE_PATHS 
} from '@/lib/supabase/storage';
import { validateFile, getFileType } from '@/lib/validations/media';
// import sharp from 'sharp'; // Commented out for Vercel build compatibility
// import ffmpeg from 'fluent-ffmpeg'; // Commented out for build compatibility

// Image optimization settings
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 400, height: 400 },
  medium: { width: 800, height: 800 },
  large: { width: 1200, height: 1200 },
} as const;

// Upload result interface
interface UploadResult {
  success: boolean;
  fileUrl?: string;
  thumbnailUrl?: string;
  optimizedUrls?: Record<string, string>;
  error?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    [key: string]: unknown;
  };
}

export class MediaUploadService {
  /**
   * Upload a file with optimization and compression
   */
  static async uploadWithOptimization(
    file: File,
    uploaderId: string,
    options: {
      category?: MediaCategory;
      altTextEs?: string;
      altTextEn?: string;
      captionEs?: string;
      captionEn?: string;
      tags?: string[];
      isPublic?: boolean;
      optimize?: boolean;
    } = {}
  ) {
    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Get file type and media type
      const fileType = getFileType(file.type);
      if (!fileType) {
        return { success: false, error: 'Unsupported file type' };
      }
      
      const mediaType = this.getMediaTypeFromFileType(fileType);
      const category = options.category || MediaCategory.GENERAL;
      const bucket = getBucketForMimeType(file.type);

      // Determine storage path based on category
      const storagePath = this.getStoragePath(category);
      const filePath = generateFilePath(file.name, storagePath);

      // Process file based on type
      let uploadResult: UploadResult;
      
      if (mediaType === MediaType.IMAGE && options.optimize !== false) {
        uploadResult = await this.uploadAndOptimizeImage(file, bucket, filePath);
      } else if (mediaType === MediaType.VIDEO) {
        uploadResult = await this.uploadVideoWithThumbnail(file, bucket, filePath);
      } else {
        uploadResult = await this.uploadRegularFile(file, bucket, filePath);
      }

      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }

      // Calculate dimensions string
      let dimensions: string | undefined;
      if (uploadResult.metadata?.width && uploadResult.metadata?.height) {
        dimensions = `${uploadResult.metadata.width}x${uploadResult.metadata.height}`;
      }

      // Create media asset record in database
      const mediaAsset = await prisma.mediaAsset.create({
        data: {
          fileName: filePath.split('/').pop() || file.name,
          originalName: file.name,
          url: uploadResult.fileUrl!,
          thumbnailUrl: uploadResult.thumbnailUrl,
          type: mediaType,
          category,
          mimeType: file.type,
          fileSize: file.size,
          altTextEs: options.altTextEs,
          altTextEn: options.altTextEn,
          captionEs: options.captionEs,
          captionEn: options.captionEn,
          dimensions,
          duration: uploadResult.metadata?.duration,
          tags: options.tags || [],
          metadata: uploadResult.metadata as any,
          isPublic: options.isPublic ?? true,
          uploaderId,
        },
      });

      return { 
        success: true, 
        asset: mediaAsset,
        optimizedUrls: uploadResult.optimizedUrls,
      };

    } catch (error) {
      console.error('Error in uploadWithOptimization:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Upload and optimize an image with multiple sizes
   */
  private static async uploadAndOptimizeImage(
    file: File,
    bucket: string,
    basePath: string
  ): Promise<UploadResult> {
    try {
      // For now, just upload the original file without optimization
      // TODO: Implement image optimization when sharp is properly configured for Vercel
      const { error: uploadError } = await uploadFile(file, bucket, basePath);
      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      const fileUrl = getPublicUrl(bucket, basePath);
      const optimizedUrls: Record<string, string> = {};

      // Skip image optimization for build compatibility
      /*
      const buffer = await file.arrayBuffer();
      const image = sharp(Buffer.from(buffer));
      const metadata = await image.metadata();

      // Generate and upload optimized versions
      for (const [sizeName, dimensions] of Object.entries(IMAGE_SIZES)) {
        try {
          const optimizedBuffer = await sharp(Buffer.from(buffer))
            .resize(dimensions.width, dimensions.height, { 
              fit: 'inside',
              withoutEnlargement: true 
            })
            .jpeg({ quality: 85, progressive: true })
            .toBuffer();

          const optimizedPath = basePath.replace(/\.[^.]+$/, `_${sizeName}.jpg`);
          const optimizedFile = new File([optimizedBuffer], `${sizeName}.jpg`, { 
            type: 'image/jpeg' 
          });

          const { error } = await uploadFile(optimizedFile, bucket, optimizedPath);
          if (!error) {
            optimizedUrls[sizeName] = getPublicUrl(bucket, optimizedPath);
          }
        } catch (err) {
          console.error(`Error creating ${sizeName} version:`, err);
        }
      }

      return {
        success: true,
        fileUrl,
        thumbnailUrl: optimizedUrls.thumbnail || optimizedUrls.small || fileUrl,
        optimizedUrls,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          space: metadata.space,
          channels: metadata.channels,
          density: metadata.density,
        },
      };
      */

      // For now, return basic file info without optimization
      return {
        success: true,
        fileUrl,
        thumbnailUrl: fileUrl, // Use original file as thumbnail
        optimizedUrls: {},
        metadata: {
          width: 0,
          height: 0,
          format: file.type.split('/')[1],
        },
      };
    } catch (error) {
      console.error('Error optimizing image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image optimization failed',
      };
    }
  }

  /**
   * Upload video with thumbnail generation
   */
  private static async uploadVideoWithThumbnail(
    file: File,
    bucket: string,
    basePath: string
  ): Promise<UploadResult> {
    try {
      // Upload original video
      const { error: uploadError } = await uploadFile(file, bucket, basePath);
      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      const fileUrl = getPublicUrl(bucket, basePath);

      // Generate thumbnail (this would require ffmpeg in production)
      // For now, we'll skip actual thumbnail generation
      const thumbnailPath = basePath.replace(/\.[^.]+$/, '_thumb.jpg');
      
      // In production, you would generate a real thumbnail here using ffmpeg
      // For now, we'll use a placeholder approach
      
      return {
        success: true,
        fileUrl,
        thumbnailUrl: undefined, // Would be the thumbnail URL in production
        metadata: {
          // Video metadata would be extracted here using ffmpeg
        },
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video upload failed',
      };
    }
  }

  /**
   * Upload regular file without optimization
   */
  private static async uploadRegularFile(
    file: File,
    bucket: string,
    path: string
  ): Promise<UploadResult> {
    try {
      const { error } = await uploadFile(file, bucket, path);
      if (error) {
        return { success: false, error: error.message };
      }

      const fileUrl = getPublicUrl(bucket, path);
      
      return {
        success: true,
        fileUrl,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'File upload failed',
      };
    }
  }

  /**
   * Delete a media asset and its files
   */
  static async deleteMediaAsset(assetId: string) {
    try {
      const asset = await prisma.mediaAsset.findUnique({
        where: { id: assetId },
      });

      if (!asset) {
        return { success: false, error: 'Media asset not found' };
      }

      // Extract bucket and path from URL
      const urlParts = new URL(asset.url);
      const pathParts = urlParts.pathname.split('/');
      const bucket = pathParts[pathParts.length - 2];
      const filePath = pathParts[pathParts.length - 1];

      // Delete file from storage
      const { error: deleteError } = await deleteFile(bucket, filePath);
      if (deleteError) {
        console.error('Error deleting file from storage:', deleteError);
      }

      // Delete thumbnail if exists
      if (asset.thumbnailUrl) {
        try {
          const thumbUrlParts = new URL(asset.thumbnailUrl);
          const thumbPathParts = thumbUrlParts.pathname.split('/');
          const thumbPath = thumbPathParts[thumbPathParts.length - 1];
          await deleteFile(bucket, thumbPath);
        } catch (err) {
          console.error('Error deleting thumbnail:', err);
        }
      }

      // Delete from database
      await prisma.mediaAsset.delete({
        where: { id: assetId },
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting media asset:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  }

  /**
   * Compress and optimize existing media assets
   */
  static async optimizeExistingAsset(assetId: string) {
    try {
      const asset = await prisma.mediaAsset.findUnique({
        where: { id: assetId },
      });

      if (!asset) {
        return { success: false, error: 'Media asset not found' };
      }

      // Only optimize images for now
      if (asset.type !== MediaType.IMAGE) {
        return { success: false, error: 'Only images can be optimized' };
      }

      // Download original file
      const response = await fetch(asset.url);
      const blob = await response.blob();
      const file = new File([blob], asset.originalName, { type: asset.mimeType });

      // Re-upload with optimization
      const bucket = getBucketForMimeType(asset.mimeType);
      const filePath = `optimized/${asset.fileName}`;
      
      const result = await this.uploadAndOptimizeImage(file, bucket, filePath);
      
      if (result.success) {
        // Update asset with optimized URLs
        await prisma.mediaAsset.update({
          where: { id: assetId },
          data: {
            url: result.fileUrl,
            thumbnailUrl: result.thumbnailUrl,
            metadata: result.metadata as any,
          },
        });
      }

      return result;
    } catch (error) {
      console.error('Error optimizing asset:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Optimization failed',
      };
    }
  }

  // Helper methods
  
  private static getMediaTypeFromFileType(fileType: string): MediaType {
    switch (fileType) {
      case 'image':
        return MediaType.IMAGE;
      case 'video':
        return MediaType.VIDEO;
      case 'audio':
        return MediaType.AUDIO;
      case 'document':
        return MediaType.DOCUMENT;
      case 'archive':
        return MediaType.ARCHIVE;
      default:
        return MediaType.DOCUMENT;
    }
  }

  private static getStoragePath(category: MediaCategory): string {
    switch (category) {
      case MediaCategory.NEWS_MEDIA:
        return STORAGE_PATHS.NEWS;
      case MediaCategory.PROGRAM_MEDIA:
        return STORAGE_PATHS.PROGRAMS;
      case MediaCategory.LIBRARY_COVER:
        return STORAGE_PATHS.LIBRARY;
      case MediaCategory.GALLERY:
        return STORAGE_PATHS.GALLERY;
      case MediaCategory.PROFILE_AVATAR:
        return STORAGE_PATHS.PROFILES;
      default:
        return STORAGE_PATHS.GENERAL;
    }
  }
}