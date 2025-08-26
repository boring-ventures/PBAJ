import { NextRequest, NextResponse } from 'next/server';
import { MediaService } from '@/lib/services/media';
import { getCurrentUser } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const result = await MediaService.getMediaStatistics(userId || undefined);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      statistics: result.statistics,
    });

  } catch (error) {
    console.error('Error in GET /api/admin/media/stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}