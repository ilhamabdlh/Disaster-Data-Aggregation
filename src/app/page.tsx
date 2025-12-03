"use client";

import { useEffect, useState } from "react";
import DisasterMap from "@/components/DisasterMap";
import StatsSidebar from "@/components/StatsSidebar";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Menu, X } from "lucide-react";
import Link from "next/link";

interface DisasterReport {
  id: number;
  category: string;
  severity: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  locationName: string;
  region: string;
  affectedResidents: number;
  status: string;
  reportType: string;
  reportCount: number;
  photoUrl?: string;
  photoUrls?: string[];
  createdAt: string;
}

export default function Home() {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<DisasterReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (filters?: {
    reportType?: string;
    severity?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.reportType) params.append("reportType", filters.reportType);
      if (filters?.severity) params.append("severity", filters.severity);

      const response = await fetch(`/api/reports?${params.toString()}`);
      const data = await response.json();
      setReports(data);
      setFilteredReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: {
    reportType?: string;
    severity?: string;
  }) => {
    fetchReports(filters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-primary mx-auto mb-4" />
          <p className="text-base sm:text-lg font-semibold text-muted-foreground">Loading disaster data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="bg-black p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-03-at-22.06.57-1764774427781.png" 
                  alt="Teorema AI Logo" 
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                  Indonesia Disaster System By Teorema AI
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                  Real Time AI Disaster Intelligence
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Link href="/report">
                <Button size="sm" className="gap-1.5 sm:gap-2 h-8 sm:h-10 text-xs sm:text-sm">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Report Disaster</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden h-8 w-8 sm:h-10 sm:w-10 p-0"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Section */}
        <div className="flex-1 p-2 sm:p-4">
          <DisasterMap reports={filteredReports} />
        </div>

        {/* Sidebar - Mobile: Slide from bottom, Desktop: Fixed right */}
        <aside
          className={`
            ${sidebarOpen ? 'translate-y-0' : 'translate-y-full'}
            lg:translate-y-0
            fixed lg:relative
            left-0 right-0 bottom-0 lg:top-0
            h-[70vh] lg:h-auto
            w-full lg:w-80 xl:w-96
            bg-white dark:bg-gray-900
            shadow-xl lg:shadow-none
            transition-transform duration-300
            z-20
            overflow-y-auto
            rounded-t-2xl lg:rounded-none
            border-t-2 lg:border-t-0 border-gray-200 dark:border-gray-800
          `}
        >
          {/* Mobile handle bar */}
          <div className="lg:hidden flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>
          
          <div className="p-3 sm:p-4">
            <StatsSidebar 
              onFilterChange={handleFilterChange}
              recentReports={reports}
            />
          </div>
        </aside>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2 sm:py-3 px-3 sm:px-4 text-center text-[10px] sm:text-xs text-muted-foreground z-10">
        <p className="hidden sm:block">
          © 2024 Indonesia Disaster Information System | Data updated in real-time | Emergency Hotline: 112
        </p>
        <p className="sm:hidden">
          © 2024 Disaster System | Hotline: 112
        </p>
      </footer>
    </div>
  );
}