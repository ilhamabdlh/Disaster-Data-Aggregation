"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { AlertTriangle, MapPin, FileText, Calendar, X, Info, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import "leaflet/dist/leaflet.css";

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

interface DisasterMapProps {
  reports: DisasterReport[];
  onMarkerClick?: (report: DisasterReport) => void;
}

const severityColors = {
  Emergency: "#DC2626",
  Critical: "#F97316",
  Alert: "#EAB308",
  Normal: "#10B981",
};

const categoryEmojis: Record<string, string> = {
  flood: "🌊",
  earthquake: "🏔️",
  fire: "🔥",
  landslide: "⛰️",
  tsunami: "🌊",
  volcano: "🌋",
  storm: "🌪️",
};

const reportTypeLabels: Record<string, string> = {
  disaster: "Bencana",
  infrastructure: "Kerusakan Infrastruktur",
  needs: "Kebutuhan Warga",
};

// Custom marker icon function
const createCustomIcon = (severity: string, category: string) => {
  const color = severityColors[severity as keyof typeof severityColors] || "#6B7280";
  const emoji = categoryEmojis[category] || "📍";
  
  return L.divIcon({
    className: "custom-disaster-marker",
    html: `
      <div style="position: relative; width: 40px; height: 40px;">
        <div style="
          position: absolute;
          width: 40px;
          height: 40px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: transform 0.2s;
        ">
          <span style="font-size: 20px;">${emoji}</span>
        </div>
        ${severity === 'Emergency' ? `
          <div style="
            position: absolute;
            width: 40px;
            height: 40px;
            border: 3px solid ${color};
            border-radius: 50%;
            animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        ` : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

export default function DisasterMap({ reports, onMarkerClick }: DisasterMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<Record<number, number>>({});

  useEffect(() => {
    setIsMounted(true);
    
    // Check if user has seen the welcome banner before
    const hasSeenBanner = localStorage.getItem("hasSeenWelcomeBanner");
    if (!hasSeenBanner) {
      setShowWelcomeBanner(true);
    }
  }, []);

  const handleCloseBanner = () => {
    setShowWelcomeBanner(false);
    localStorage.setItem("hasSeenWelcomeBanner", "true");
  };

  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  const handleImageError = (reportId: number) => {
    setImageErrors(prev => ({ ...prev, [reportId]: true }));
    setImageLoading(prev => ({ ...prev, [reportId]: false }));
  };

  const handleImageLoadStart = (reportId: number) => {
    setImageLoading(prev => ({ ...prev, [reportId]: true }));
  };

  const handleImageLoadComplete = (reportId: number) => {
    setImageLoading(prev => ({ ...prev, [reportId]: false }));
  };

  const handleNextPhoto = (reportId: number, totalPhotos: number) => {
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [reportId]: ((prev[reportId] || 0) + 1) % totalPhotos
    }));
  };

  const handlePrevPhoto = (reportId: number, totalPhotos: number) => {
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [reportId]: ((prev[reportId] || 0) - 1 + totalPhotos) % totalPhotos
    }));
  };

  const goToPhoto = (reportId: number, photoIndex: number) => {
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [reportId]: photoIndex
    }));
  };

  // Center of Sumatra
  const center: [number, number] = [0.5, 101.5];
  const zoom = 6;

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-gray-900 dark:to-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        style={{ background: "#E0F2FE" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <ZoomControl position="topright" />

        {/* Disaster Markers */}
        {reports.map((report) => {
          const lat = parseFloat(report.latitude);
          const lng = parseFloat(report.longitude);

          if (isNaN(lat) || isNaN(lng)) return null;

          // Get photos array - prioritize photoUrls, fallback to photoUrl
          const photos = report.photoUrls && Array.isArray(report.photoUrls) && report.photoUrls.length > 0
            ? report.photoUrls
            : report.photoUrl
            ? [report.photoUrl]
            : [];

          const hasPhotos = photos.length > 0 && !imageErrors[report.id];
          const currentIndex = currentPhotoIndex[report.id] || 0;
          const currentPhoto = photos[currentIndex];
          const hasMultiplePhotos = photos.length > 1;

          return (
            <Marker
              key={report.id}
              position={[lat, lng]}
              icon={createCustomIcon(report.severity, report.category)}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) onMarkerClick(report);
                },
              }}
            >
              <Popup maxWidth={400} minWidth={320}>
                <div className="bg-white dark:bg-gray-900">
                  {/* Photo Carousel Section */}
                  {hasPhotos && (
                    <div className="relative w-full h-48 mb-3 -mt-3 -mx-3 overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800 group">
                      {/* Loading skeleton */}
                      {imageLoading[report.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse z-10">
                          <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                      
                      <img
                        src={currentPhoto}
                        alt={`${report.title} - Foto ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                        onLoadStart={() => handleImageLoadStart(report.id)}
                        onLoad={() => handleImageLoadComplete(report.id)}
                        onError={() => handleImageError(report.id)}
                        loading="lazy"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Navigation Buttons - Only show if multiple photos */}
                      {hasMultiplePhotos && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrevPhoto(report.id, photos.length);
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20"
                            aria-label="Foto sebelumnya"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextPhoto(report.id, photos.length);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20"
                            aria-label="Foto berikutnya"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      
                      {/* Photo counter badge - Only show if multiple photos */}
                      {hasMultiplePhotos && (
                        <div className="absolute top-2 left-2 z-20">
                          <Badge className="bg-black/60 text-white border-white/30 backdrop-blur-sm text-xs">
                            {currentIndex + 1} / {photos.length}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Photo documentation badge */}
                      <div className="absolute bottom-2 left-2 z-20">
                        <Badge className="bg-black/60 text-white border-white/30 backdrop-blur-sm text-xs">
                          <ImageIcon className="w-3 h-3 mr-1" />
                          Foto Dokumentasi
                        </Badge>
                      </div>
                      
                      {/* Severity badge */}
                      <div className="absolute top-2 right-2 z-20">
                        <Badge
                          style={{
                            backgroundColor: severityColors[report.severity as keyof typeof severityColors],
                            color: "white",
                          }}
                          className="font-semibold shadow-lg backdrop-blur-sm"
                        >
                          {report.severity}
                        </Badge>
                      </div>

                      {/* Photo indicators dots - Only show if multiple photos */}
                      {hasMultiplePhotos && (
                        <div className="absolute bottom-2 right-2 flex gap-1.5 z-20">
                          {photos.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentPhotoIndex(prev => ({ ...prev, [report.id]: idx }));
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentIndex
                                  ? 'bg-white w-4'
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                              aria-label={`Lihat foto ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-3">
                    {/* Header */}
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-2xl flex-shrink-0">{categoryEmojis[report.category]}</span>
                      <div className="flex-1 min-w-0">
                        {!hasPhotos && (
                          <Badge
                            style={{
                              backgroundColor: severityColors[report.severity as keyof typeof severityColors],
                              color: "white",
                            }}
                            className="mb-2 font-semibold text-xs"
                          >
                            {report.severity}
                          </Badge>
                        )}
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                          {report.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed line-clamp-3">
                      {report.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                      <div className="flex items-center gap-2 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {report.locationName}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400">
                            {report.region}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs bg-orange-50 dark:bg-orange-950/50 p-2 rounded-md border border-orange-200 dark:border-orange-900">
                        <FileText className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">Jumlah Laporan:</span>
                        <span className="font-bold text-orange-700 dark:text-orange-300 ml-auto">
                          {report.reportCount || 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">Jenis:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {reportTypeLabels[report.reportType] || report.reportType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>{new Date(report.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Badge variant="outline" className="text-[10px] font-medium">
                        Status: {report.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend Overlay - Toggleable */}
      {showLegend ? (
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/95 dark:bg-gray-900/95 p-3 sm:p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm z-[1000] max-w-[200px] sm:max-w-none">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
              Tingkat Keparahan
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={toggleLegend}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {Object.entries(severityColors).map(([severity, color]) => (
              <div key={severity} className="flex items-center gap-2 sm:gap-3">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-md border-2 border-white flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {severity}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-bold mb-2 text-xs text-gray-900 dark:text-white">
              Total Laporan
            </h4>
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {reports.length}
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={toggleLegend}
          className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-xl z-[1000] bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-0"
          variant="outline"
        >
          <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
        </Button>
      )}

      {/* Welcome Banner - Show on first visit only */}
      {showWelcomeBanner && (
        <div className="absolute top-4 sm:top-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 sm:px-6 py-3 sm:py-3 rounded-lg shadow-xl z-[1000]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-sm sm:text-lg flex items-center gap-2 mb-1">
                🗺️ Peta Bencana Indonesia
              </h2>
              <p className="text-[10px] sm:text-xs opacity-90 leading-relaxed">
                Visualisasi Real-time Lokasi Bencana | Zoom & Pan untuk navigasi
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-white/20 text-white flex-shrink-0"
              onClick={handleCloseBanner}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}