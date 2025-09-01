import { z } from "zod";
import { MediaType, MediaCategory } from "@prisma/client";

// File type validation mappings
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/webm",
  "video/ogg",
] as const;

export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/m4a",
  "audio/mp3",
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
] as const;

export const ALLOWED_ARCHIVE_TYPES = [
  "application/zip",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/gzip",
] as const;

// File size limits (in bytes)
export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 50 * 1024 * 1024, // 50MB
  document: 25 * 1024 * 1024, // 25MB
  archive: 50 * 1024 * 1024, // 50MB
} as const;

// Schema for media asset creation/update
export const mediaAssetFormSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  originalName: z.string().min(1, "Original name is required"),
  fileUrl: z.string().url("Must be a valid URL"),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),

  type: z.nativeEnum(MediaType),
  category: z.nativeEnum(MediaCategory),
  mimeType: z.string().min(1, "MIME type is required"),
  fileSize: z.number().min(0, "File size must be positive"),

  // Metadata
  altText: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),

  // Dimensions for images/videos
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  duration: z.number().min(0).optional(), // For audio/video in seconds

  // Organization
  tags: z.array(z.string()).default([]),

  // SEO
  title: z.string().optional(),

  // Usage tracking
  downloadCount: z.number().min(0).default(0),
  usageCount: z.number().min(0).default(0),

  // Status
  isPublic: z.boolean().default(false),
  isOptimized: z.boolean().default(false),
});

export type MediaAssetFormData = z.infer<typeof mediaAssetFormSchema>;

// Schema for file upload validation
export const fileUploadSchema = z
  .object({
    // In Node/Edge, the File instance may differ; validate shape instead of instanceof
    file: z.custom<File>(
      (val) => {
        const f = val as any;
        return (
          f &&
          typeof f === "object" &&
          typeof f.arrayBuffer === "function" &&
          typeof f.size === "number" &&
          typeof f.type === "string" &&
          typeof f.name === "string"
        );
      },
      { message: "Invalid file" }
    ),
    category: z.nativeEnum(MediaCategory).optional(),
    altText: z.string().optional(),
    caption: z.string().optional(),
    tags: z.array(z.string()).default([]),
    isPublic: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Validate file type and size based on detected type
      const file = data.file;
      const fileType = getFileType(file.type);

      if (!fileType) return false;

      const maxSize = MAX_FILE_SIZES[fileType];
      return file.size <= maxSize;
    },
    {
      message: "File size exceeds maximum allowed size",
    }
  )
  .refine(
    (data) => {
      // Validate MIME type is allowed
      const mimeType = data.file.type;
      const allowedTypes = [
        ...ALLOWED_IMAGE_TYPES,
        ...ALLOWED_VIDEO_TYPES,
        ...ALLOWED_AUDIO_TYPES,
        ...ALLOWED_DOCUMENT_TYPES,
        ...ALLOWED_ARCHIVE_TYPES,
      ];
      return allowedTypes.includes(mimeType as (typeof allowedTypes)[number]);
    },
    {
      message: "File type not allowed",
    }
  );

export type FileUploadData = z.infer<typeof fileUploadSchema>;

// Schema for media filters
export const mediaFilterSchema = z.object({
  type: z.nativeEnum(MediaType).optional(),
  category: z.nativeEnum(MediaCategory).optional(),
  mimeType: z.string().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  uploadedAfter: z.date().optional(),
  uploadedBefore: z.date().optional(),
  minFileSize: z.number().min(0).optional(),
  maxFileSize: z.number().min(0).optional(),
  minWidth: z.number().min(0).optional(),
  maxWidth: z.number().min(0).optional(),
  minHeight: z.number().min(0).optional(),
  maxHeight: z.number().min(0).optional(),
  isPublic: z.boolean().optional(),
  uploaderId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z
    .enum(["createdAt", "fileName", "fileSize", "downloadCount"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type MediaFilterData = z.infer<typeof mediaFilterSchema>;

// Schema for bulk operations
export const mediaBulkActionSchema = z.object({
  action: z.enum([
    "delete",
    "move",
    "tag",
    "untag",
    "public",
    "private",
  ]),
  mediaIds: z.array(z.string()).min(1, "Select at least one media item"),
  // Additional data for specific actions
  targetFolder: z.string().optional(), // for move action
  tags: z.array(z.string()).optional(), // for tag/untag actions
});

export type MediaBulkActionData = z.infer<typeof mediaBulkActionSchema>;

// Schema for folder operations
export const mediaFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(100),
  description: z.string().optional(),
  parentFolder: z.string().optional(),
  color: z.string().optional(),
});

export type MediaFolderData = z.infer<typeof mediaFolderSchema>;

// Utility function to determine file type from MIME type
export function getFileType(
  mimeType: string
): keyof typeof MAX_FILE_SIZES | null {
  if (
    ALLOWED_IMAGE_TYPES.includes(
      mimeType as (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  )
    return "image";
  if (
    ALLOWED_VIDEO_TYPES.includes(
      mimeType as (typeof ALLOWED_VIDEO_TYPES)[number]
    )
  )
    return "video";
  if (
    ALLOWED_AUDIO_TYPES.includes(
      mimeType as (typeof ALLOWED_AUDIO_TYPES)[number]
    )
  )
    return "audio";
  if (
    ALLOWED_DOCUMENT_TYPES.includes(
      mimeType as (typeof ALLOWED_DOCUMENT_TYPES)[number]
    )
  )
    return "document";
  if (
    ALLOWED_ARCHIVE_TYPES.includes(
      mimeType as (typeof ALLOWED_ARCHIVE_TYPES)[number]
    )
  )
    return "archive";
  return null;
}

// Utility function to get file extension from filename
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

// Utility function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Utility function to validate file before upload
export function validateFile(file: File): { valid: boolean; error?: string } {
  const fileType = getFileType(file.type);

  if (!fileType) {
    return { valid: false, error: "File type not supported" };
  }

  const maxSize = MAX_FILE_SIZES[fileType];
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`,
    };
  }

  return { valid: true };
}

// Predefined media categories for UI
export const MEDIA_CATEGORY_OPTIONS = [
  { value: MediaCategory.NEWS_MEDIA, label: "Medios de Noticias" },
  { value: MediaCategory.PROGRAM_MEDIA, label: "Medios de Programas" },
  { value: MediaCategory.GALLERY, label: "Galería" },
  { value: MediaCategory.LIBRARY_COVER, label: "Portadas de Biblioteca" },
  { value: MediaCategory.PROFILE_AVATAR, label: "Avatares de Perfil" },
  { value: MediaCategory.GENERAL, label: "General" },
] as const;

// Predefined media types for UI
export const MEDIA_TYPE_OPTIONS = [
  { value: MediaType.IMAGE, label: "Imagen", icon: "🖼️" },
  { value: MediaType.VIDEO, label: "Video", icon: "🎥" },
  { value: MediaType.AUDIO, label: "Audio", icon: "🎵" },
  { value: MediaType.DOCUMENT, label: "Documento", icon: "📄" },
  { value: MediaType.ARCHIVE, label: "Archivo", icon: "📦" },
] as const;
