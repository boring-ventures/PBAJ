import { NextRequest, NextResponse } from 'next/server';
import { MediaService } from '@/lib/services/media';
import { mediaBulkActionSchema } from '@/lib/validations/media';
import { getCurrentUser } from '@/lib/auth/server';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate the bulk action data
    const validatedData = mediaBulkActionSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validatedData.error.errors },
        { status: 400 }
      );
    }

    const { action, mediaIds, targetFolder, tags } = validatedData.data;

    const result = await MediaService.bulkOperation(
      action,
      mediaIds,
      user.id,
      {
        targetFolder,
        tags,
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      affected: result.affected,
    });

  } catch (error) {
    console.error('Error in POST /api/admin/media/bulk:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}