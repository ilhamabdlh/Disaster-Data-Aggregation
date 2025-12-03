import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { disasterReports } from '@/db/schema';
import { desc, eq, and, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const region = searchParams.get('region');
    const reportType = searchParams.get('reportType');

    let query = db.select().from(disasterReports);
    
    const conditions = [];
    if (category && category !== 'all') {
      conditions.push(eq(disasterReports.category, category));
    }
    if (severity && severity !== 'all') {
      conditions.push(eq(disasterReports.severity, severity));
    }
    if (status && status !== 'all') {
      conditions.push(eq(disasterReports.status, status));
    }
    if (region) {
      conditions.push(like(disasterReports.region, `%${region}%`));
    }
    if (reportType && reportType !== 'all') {
      conditions.push(eq(disasterReports.reportType, reportType));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const reports = await query.orderBy(desc(disasterReports.createdAt));
    
    // Add reportCount for each report by grouping similar location/issue
    const reportsWithCount = reports.map(report => {
      const similarReports = reports.filter(r => 
        r.locationName === report.locationName && 
        r.category === report.category &&
        r.severity === report.severity
      );
      
      return {
        ...report,
        reportCount: similarReports.length
      };
    });
    
    return NextResponse.json(reportsWithCount);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newReport = {
      ...body,
      status: 'Pending',
      reportType: body.reportType || 'disaster',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.insert(disasterReports).values(newReport).returning();
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}