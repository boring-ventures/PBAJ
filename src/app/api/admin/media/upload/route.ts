import { NextRequest, NextResponse } from 'next/server';
import { MediaUploadService } from '@/lib/services/media-upload';
import { fileUploadSchema } from '@/lib/validations/media';
import { getCurrentUser } from '@/lib/auth/server';
import { MediaCategory } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Parse additional fields
    const category = formData.get('category') as MediaCategory || MediaCategory.GENERAL;
    const folder = formData.get('folder') as string || undefined;
    const altTextEs = formData.get('altTextEs') as string || undefined;
    const altTextEn = formData.get('altTextEn') as string || undefined;
    const captionEs = formData.get('captionEs') as string || undefined;
    const captionEn = formData.get('captionEn') as string || undefined;
    const isPublic = formData.get('isPublic') === 'true';
    const optimize = formData.get('optimize') !== 'false';
    
    // Parse tags
    const tagsString = formData.get('tags') as string;
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];

    // Validate file using Zod schema
    const validation = fileUploadSchema.safeParse({
      file,
      category,
      altText: altTextEs || altTextEn,
      caption: captionEs || captionEn,
      folder,
      tags,
      isPublic,
    });

    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: validation.error.issues 
      }, { status: 400 });
    }

    // Upload file
    const result = await MediaUploadService.uploadWithOptimization(
      file,
      user.id,
      {
        category,
        folder,
        altTextEs,
        altTextEn,
        captionEs,
        captionEn,
        tags,
        isPublic,
        optimize,
      }
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      asset: result.asset,
      optimizedUrls: result.optimizedUrls,
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get upload limits and configuration
export async function GET() {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      maxFileSizes: {
        image: 10 * 1024 * 1024,    // 10MB
        video: 100 * 1024 * 1024,   // 100MB
        audio: 50 * 1024 * 1024,    // 50MB
        document: 25 * 1024 * 1024, // 25MB
        archive: 50 * 1024 * 1024,  // 50MB
      },
      allowedTypes: {
        image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
        video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm', 'video/ogg'],
        audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/mp3'],
        document: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
          'text/csv',
        ],
        archive: ['application/zip', 'application/x-rar-compressed', 'application/x-tar', 'application/gzip'],
      },
      categories: Object.values(MediaCategory),
    });

  } catch (error) {
    console.error('Upload config API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}