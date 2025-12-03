import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { evacuationCenters } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const disasterReportId = searchParams.get('disasterReportId');

    if (disasterReportId) {
      const centers = await db
        .select()
        .from(evacuationCenters)
        .where(eq(evacuationCenters.disasterReportId, parseInt(disasterReportId)));
      return NextResponse.json(centers);
    }

    const centers = await db.select().from(evacuationCenters);
    return NextResponse.json(centers);
  } catch (error) {
    console.error('Error fetching evacuation centers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evacuation centers' },
      { status: 500 }
    );
  }
}
