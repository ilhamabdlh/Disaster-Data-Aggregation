import { NextResponse } from 'next/server';
import { db } from '@/db';
import { disasterReports } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const reports = await db.select().from(disasterReports);
    
    const totalReports = reports.length;
    const totalAffected = reports.reduce((sum, r) => sum + (r.affectedResidents || 0), 0);
    
    const bySeverity = {
      Emergency: reports.filter(r => r.severity === 'Emergency').length,
      Critical: reports.filter(r => r.severity === 'Critical').length,
      Alert: reports.filter(r => r.severity === 'Alert').length,
      Normal: reports.filter(r => r.severity === 'Normal').length,
    };
    
    const byCategory = reports.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byReportType = {
      disaster: reports.filter(r => r.reportType === 'disaster').length,
      infrastructure: reports.filter(r => r.reportType === 'infrastructure').length,
      needs: reports.filter(r => r.reportType === 'needs').length,
    };
    
    const byStatus = {
      Verified: reports.filter(r => r.status === 'Verified').length,
      Pending: reports.filter(r => r.status === 'Pending').length,
      Rejected: reports.filter(r => r.status === 'Rejected').length,
    };

    return NextResponse.json({
      totalReports,
      totalAffected,
      bySeverity,
      byCategory,
      byReportType,
      byStatus,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}