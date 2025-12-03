import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { disasterReports } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { status, verifiedBy } = await request.json();
    
    const result = await db
      .update(disasterReports)
      .set({
        status,
        verifiedBy,
        verifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(disasterReports.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error verifying report:', error);
    return NextResponse.json(
      { error: 'Failed to verify report' },
      { status: 500 }
    );
  }
}
