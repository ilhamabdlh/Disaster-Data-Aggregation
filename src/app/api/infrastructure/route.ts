import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { infrastructureStatus } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const disasterReportId = searchParams.get('disasterReportId');

    if (disasterReportId) {
      const infrastructure = await db
        .select()
        .from(infrastructureStatus)
        .where(eq(infrastructureStatus.disasterReportId, parseInt(disasterReportId)));
      return NextResponse.json(infrastructure);
    }

    const infrastructure = await db.select().from(infrastructureStatus);
    return NextResponse.json(infrastructure);
  } catch (error) {
    console.error('Error fetching infrastructure status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch infrastructure status' },
      { status: 500 }
    );
  }
}
