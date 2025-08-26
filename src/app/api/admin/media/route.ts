import { NextRequest, NextResponse } from 'next/server';
import { MediaService } from '@/lib/services/media';
import { mediaFilterSchema } from '@/lib/validations/media';
import { getCurrentUser } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Convert strings to appropriate types
    const parsedParams = {
      ...queryParams,
      page: queryParams.page ? parseInt(queryParams.page) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit) : 20,
      tags: queryParams.tags ? queryParams.tags.split(',') : undefined,
      isPublic: queryParams.isPublic ? queryParams.isPublic === 'true' : undefined,
    };

    // Validate filters
    const validatedFilters = mediaFilterSchema.safeParse(parsedParams);
    if (!validatedFilters.success) {
      return NextResponse.json(
        { error: 'Invalid filters', details: validatedFilters.error.errors },
        { status: 400 }
      );
    }

    const result = await MediaService.getMediaAssets(validatedFilters.data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      assets: result.assets,
      pagination: result.pagination,
    });

  } catch (error) {
    console.error('Error in GET /api/admin/media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Extract additional data
    const category = formData.get('category') as string;
    const folder = formData.get('folder') as string;
    const altText = formData.get('altText') as string;
    const caption = formData.get('caption') as string;
    const tagsString = formData.get('tags') as string;
    const isPublicString = formData.get('isPublic') as string;

    let tags: string[] = [];
    try {
      tags = tagsString ? JSON.parse(tagsString) : [];
    } catch {
      tags = [];
    }

    const options = {
      category: category || undefined,
      folder: folder || undefined,
      altText: altText || undefined,
      caption: caption || undefined,
      tags: tags || [],
      isPublic: isPublicString === 'true',
    };

    const result = await MediaService.uploadFile(file, user.id, options);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      asset: result.asset,
    });

  } catch (error) {
    console.error('Error in POST /api/admin/media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}