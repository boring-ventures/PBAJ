import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient as createAdminClient } from "@supabase/supabase-js";
function getServerSupabase(): SupabaseClient {
  // Bind to the current request's cookies so uploads run as the authenticated user
  // Falls back to anon if no session cookie is present
  return createRouteHandlerClient({ cookies });
}

function getAdminSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !serviceKey) return null;
  return createAdminClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

async function ensureBucketExists(bucketName: string) {
  const admin = getAdminSupabase();
  if (!admin) return; // cannot ensure without service role
  const { data: existing } = await admin.storage.getBucket(bucketName);
  if (!existing) {
    await admin.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: getBucketAllowedMimeTypes(bucketName),
      fileSizeLimit: getBucketSizeLimit(bucketName),
    });
  }
}
import type { FileOptions } from "@supabase/storage-js";

// Storage bucket names
export const STORAGE_BUCKETS = {
  IMAGES: "images",
  VIDEOS: "videos",
  AUDIO: "audio",
  DOCUMENTS: "documents",
  ARCHIVES: "archives",
  AVATARS: "avatars",
} as const;

// Storage paths
export const STORAGE_PATHS = {
  NEWS: "news",
  PROGRAMS: "programs",
  LIBRARY: "library",
  GALLERY: "gallery",
  PROFILES: "profiles",
  GENERAL: "general",
} as const;

// Create storage buckets if they don't exist
export async function initializeStorageBuckets() {
  const buckets = Object.values(STORAGE_BUCKETS);

  for (const bucketName of buckets) {
    const { data: existingBucket } =
      await supabase.storage.getBucket(bucketName);

    if (!existingBucket) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: getBucketAllowedMimeTypes(bucketName),
        fileSizeLimit: getBucketSizeLimit(bucketName),
      });

      if (error) {
        console.error(`Error creating bucket ${bucketName}:`, error);
      } else {
        console.log(`Created storage bucket: ${bucketName}`);
      }
    }
  }
}

// Get allowed MIME types for a bucket
function getBucketAllowedMimeTypes(bucketName: string): string[] | undefined {
  switch (bucketName) {
    case STORAGE_BUCKETS.IMAGES:
      return [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];
    case STORAGE_BUCKETS.VIDEOS:
      return [
        "video/mp4",
        "video/mpeg",
        "video/quicktime",
        "video/webm",
        "video/ogg",
      ];
    case STORAGE_BUCKETS.AUDIO:
      return ["audio/mpeg", "audio/wav", "audio/ogg", "audio/m4a", "audio/mp3"];
    case STORAGE_BUCKETS.DOCUMENTS:
      return [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "text/csv",
      ];
    case STORAGE_BUCKETS.ARCHIVES:
      return [
        "application/zip",
        "application/x-rar-compressed",
        "application/x-tar",
        "application/gzip",
      ];
    default:
      return undefined;
  }
}

// Get file size limit for a bucket (in bytes)
function getBucketSizeLimit(bucketName: string): number {
  switch (bucketName) {
    case STORAGE_BUCKETS.IMAGES:
    case STORAGE_BUCKETS.AVATARS:
      return 10 * 1024 * 1024; // 10MB
    case STORAGE_BUCKETS.VIDEOS:
      return 100 * 1024 * 1024; // 100MB
    case STORAGE_BUCKETS.AUDIO:
    case STORAGE_BUCKETS.ARCHIVES:
      return 50 * 1024 * 1024; // 50MB
    case STORAGE_BUCKETS.DOCUMENTS:
      return 25 * 1024 * 1024; // 25MB
    default:
      return 10 * 1024 * 1024; // Default 10MB
  }
}

// Get the appropriate bucket for a MIME type
export function getBucketForMimeType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return STORAGE_BUCKETS.IMAGES;
  if (mimeType.startsWith("video/")) return STORAGE_BUCKETS.VIDEOS;
  if (mimeType.startsWith("audio/")) return STORAGE_BUCKETS.AUDIO;
  if (
    mimeType.startsWith("application/pdf") ||
    mimeType.startsWith("application/msword") ||
    mimeType.startsWith("application/vnd.ms-") ||
    mimeType.startsWith("application/vnd.openxmlformats-") ||
    mimeType.startsWith("text/")
  ) {
    return STORAGE_BUCKETS.DOCUMENTS;
  }
  if (
    mimeType.startsWith("application/zip") ||
    mimeType.startsWith("application/x-rar") ||
    mimeType.startsWith("application/x-tar") ||
    mimeType.startsWith("application/gzip")
  ) {
    return STORAGE_BUCKETS.ARCHIVES;
  }
  return STORAGE_BUCKETS.DOCUMENTS; // Default
}

// Generate a unique file path
export function generateFilePath(
  fileName: string,
  category: string
): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split(".").pop() || "";
  const nameWithoutExt = fileName.replace(`.${extension}`, "");
  const sanitizedName = nameWithoutExt
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .substring(0, 50);

  const parts = [category];
  parts.push(`${timestamp}_${randomId}_${sanitizedName}.${extension}`);

  return parts.join("/");
}

// Upload file to Supabase Storage
export async function uploadFile(
  file: File,
  bucket: string,
  path: string,
  options?: FileOptions
): Promise<{ data: any; error: any }> {
  try {
    await ensureBucketExists(bucket);
    const supabase = getServerSupabase();
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        ...options,
      });

    if (error) {
      console.error("Upload error:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Upload exception:", error);
    return { data: null, error };
  }
}

// Get public URL for a file
export function getPublicUrl(bucket: string, path: string): string {
  const supabase = getServerSupabase();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Get signed URL for a private file
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<{ data: any; error: any }> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  return { data, error };
}

// Delete file from storage
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ error: any }> {
  const supabase = getServerSupabase();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return { error };
}

// Delete multiple files
export async function deleteFiles(
  bucket: string,
  paths: string[]
): Promise<{ error: any }> {
  const supabase = getServerSupabase();
  const { error } = await supabase.storage.from(bucket).remove(paths);
  return { error };
}

// List files in a bucket
export async function listFiles(
  bucket: string,
  path?: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order: string };
    search?: string;
  }
): Promise<{ data: any; error: any }> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.storage.from(bucket).list(path, {
    limit: options?.limit || 100,
    offset: options?.offset || 0,
    sortBy: options?.sortBy,
    search: options?.search,
  });

  return { data, error };
}

// Move/rename a file
export async function moveFile(
  bucket: string,
  fromPath: string,
  toPath: string
): Promise<{ error: any }> {
  const supabase = getServerSupabase();
  const { error } = await supabase.storage.from(bucket).move(fromPath, toPath);
  return { error };
}

// Copy a file
export async function copyFile(
  bucket: string,
  fromPath: string,
  toPath: string
): Promise<{ error: any }> {
  const supabase = getServerSupabase();
  const { error } = await supabase.storage.from(bucket).copy(fromPath, toPath);
  return { error };
}

// Download file
export async function downloadFile(
  bucket: string,
  path: string
): Promise<{ data: any; error: any }> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.storage.from(bucket).download(path);
  return { data, error };
}
