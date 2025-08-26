import { NextRequest, NextResponse } from 'next/server';
import { MediaService } from '@/lib/services/media';
import { mediaAssetFormSchema } from '@/lib/validations/media';
import { getCurrentUser } from '@/lib/auth/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await MediaService.getMediaAssetById(params.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Media asset not found' ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      asset: result.asset,
    });

  } catch (error) {
    console.error('Error in GET /api/admin/media/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate the update data
    const validatedData = mediaAssetFormSchema.partial().safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validatedData.error.errors },
        { status: 400 }
      );
    }

    const result = await MediaService.updateMediaAsset(
      params.id,
      validatedData.data,
      user.id
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Media asset not found' ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      asset: result.asset,
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/media/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await MediaService.deleteMediaAsset(params.id, user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Media asset not found' ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/media/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}