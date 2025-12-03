"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  AlertTriangle, 
  FileText, 
  Clock,
  Filter,
  TrendingUp
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Stats {
  totalReports: number;
  totalAffected: number;
  bySeverity: {
    Emergency: number;
    Critical: number;
    Alert: number;
    Normal: number;
  };
  byReportType: {
    disaster: number;
    infrastructure: number;
    needs: number;
  };
  byStatus: {
    Verified: number;
    Pending: number;
    Rejected: number;
  };
}

interface DisasterReport {
  id: number;
  category: string;
  severity: string;
  title: string;
  locationName: string;
  region: string;
  affectedResidents: number;
  status: string;
  reportType: string;
  reportCount: number;
  createdAt: string;
}

interface StatsSidebarProps {
  onFilterChange?: (filters: {
    reportType?: string;
    severity?: string;
  }) => void;
  recentReports?: DisasterReport[];
}

const categoryEmojis: Record<string, string> = {
  flood: "🌊",
  earthquake: "🏔️",
  fire: "🔥",
  landslide: "⛰️",
  tsunami: "🌊",
  volcano: "🌋",
  storm: "🌪️",
};

const reportTypeEmojis: Record<string, string> = {
  disaster: "⚠️",
  infrastructure: "🏗️",
  needs: "🆘",
};

const reportTypeLabels: Record<string, string> = {
  disaster: "Bencana",
  infrastructure: "Kerusakan Infrastruktur",
  needs: "Kebutuhan Warga",
};

const severityColors = {
  Emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Critical: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Alert: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Normal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export default function StatsSidebar({ onFilterChange, recentReports = [] }: StatsSidebarProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    reportType: "all",
    severity: "all",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange({
        reportType: newFilters.reportType !== "all" ? newFilters.reportType : undefined,
        severity: newFilters.severity !== "all" ? newFilters.severity : undefined,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">Total Laporan</span>
          </div>
          <p className="text-2xl font-bold">{stats?.totalReports || 0}</p>
        </Card>
      </div>

      {/* Severity Breakdown */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <h3 className="font-semibold text-sm">Tingkat Keparahan</h3>
        </div>
        <div className="space-y-2">
          {stats?.bySeverity && Object.entries(stats.bySeverity).map(([severity, count]) => (
            <div key={severity} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  severity === "Emergency" ? "bg-red-600" :
                  severity === "Critical" ? "bg-orange-500" :
                  severity === "Alert" ? "bg-yellow-500" : "bg-green-500"
                }`} />
                <span className="text-xs">{severity}</span>
              </div>
              <Badge variant="secondary" className="text-xs">{count}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Report Type Breakdown */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm">Jenis Laporan</h3>
        </div>
        <div className="space-y-2">
          {stats?.byReportType && Object.entries(stats.byReportType).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{reportTypeEmojis[type] || "📍"}</span>
                <span className="text-xs">{reportTypeLabels[type] || type}</span>
              </div>
              <Badge variant="secondary" className="text-xs">{count}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Filter</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Jenis Laporan</label>
            <Select value={filters.reportType} onValueChange={(value) => handleFilterChange("reportType", value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="disaster">⚠️ Bencana</SelectItem>
                <SelectItem value="infrastructure">🏗️ Kerusakan Infrastruktur</SelectItem>
                <SelectItem value="needs">🆘 Kebutuhan Warga</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Tingkat Keparahan</label>
            <Select value={filters.severity} onValueChange={(value) => handleFilterChange("severity", value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Alert">Alert</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Recent Reports */}
      <Card className="p-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Laporan Terbaru</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {recentReports.slice(0, 10).map((report) => (
              <a
                key={report.id}
                href={`/location/${report.id}`}
                className="block p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{categoryEmojis[report.category] || "📍"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1">{report.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{report.locationName}</p>
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      <Badge className={`text-xs h-4 px-1 ${severityColors[report.severity as keyof typeof severityColors]}`}>
                        {report.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs h-4 px-1">
                        {reportTypeLabels[report.reportType]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}