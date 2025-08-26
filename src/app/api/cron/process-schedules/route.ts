import { NextRequest, NextResponse } from 'next/server';
import { SchedulingService } from '@/lib/services/scheduling';

// This endpoint should be called by a cron job service (like Vercel Cron or external service)
// to process pending schedules
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a trusted source (cron job)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Processing scheduled content...');
    
    const result = await SchedulingService.processPendingSchedules();
    
    console.log(`Processed ${result.processed} schedules. Errors: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.error('Schedule processing errors:', result.errors);
    }

    return NextResponse.json({
      success: true,
      processed: result.processed,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in cron job:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Also allow GET requests for testing purposes
export async function GET(_request: NextRequest) {
  try {
    // Check if this is a development/testing environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'GET method not allowed in production' },
        { status: 405 }
      );
    }

    const result = await SchedulingService.processPendingSchedules();
    
    return NextResponse.json({
      success: true,
      processed: result.processed,
      errors: result.errors,
      timestamp: new Date().toISOString(),
      note: 'This is a test run - GET method only available in development',
    });

  } catch (error) {
    console.error('Error in test cron job:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}