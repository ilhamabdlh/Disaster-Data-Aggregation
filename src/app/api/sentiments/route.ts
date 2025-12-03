import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { communitySentiments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const disasterReportId = searchParams.get('disasterReportId');

    if (disasterReportId) {
      const sentiments = await db
        .select()
        .from(communitySentiments)
        .where(eq(communitySentiments.disasterReportId, parseInt(disasterReportId)))
        .orderBy(desc(communitySentiments.createdAt));
      return NextResponse.json(sentiments);
    }

    const sentiments = await db.select().from(communitySentiments).orderBy(desc(communitySentiments.createdAt));
    return NextResponse.json(sentiments);
  } catch (error) {
    console.error('Error fetching community sentiments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community sentiments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newSentiment = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    const result = await db.insert(communitySentiments).values(newSentiment).returning();
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating sentiment:', error);
    return NextResponse.json(
      { error: 'Failed to create sentiment' },
      { status: 500 }
    );
  }
}
