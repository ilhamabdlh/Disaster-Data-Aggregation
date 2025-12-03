"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  MapPin,
  Users,
  Home,
  AlertTriangle,
  MessageSquare,
  Building,
  Phone,
  Calendar,
  TrendingUp,
  Send,
  Loader2,
} from "lucide-react";
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
  photoUrl: string;
  reporterName: string;
  reporterContact: string;
  status: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  affectedResidents: number;
  urgentNeeds: string;
  createdAt: string;
  updatedAt: string;
}

interface EvacuationCenter {
  id: number;
  name: string;
  address: string;
  capacity: number;
  currentOccupancy: number;
  contact: string;
  latitude: string;
  longitude: string;
}

interface InfrastructureStatus {
  id: number;
  infrastructureType: string;
  status: string;
  description: string;
  createdAt: string;
}

interface CommunitySentiment {
  id: number;
  sentiment: string;
  comment: string;
  submittedBy: string;
  createdAt: string;
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

const severityColors = {
  Emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300",
  Critical: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300",
  Alert: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300",
  Normal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300",
};

const infrastructureIcons: Record<string, string> = {
  Road: "🛣️",
  Bridge: "🌉",
  Hospital: "🏥",
  School: "🏫",
  Power: "⚡",
  Water: "💧",
};

const sentimentColors: Record<string, string> = {
  Urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Concerned: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Stable: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Recovering: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export default function LocationPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<DisasterReport | null>(null);
  const [evacuationCenters, setEvacuationCenters] = useState<EvacuationCenter[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureStatus[]>([]);
  const [sentiments, setSentiments] = useState<CommunitySentiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingSentiment, setSubmittingSentiment] = useState(false);
  
  const [newSentiment, setNewSentiment] = useState({
    sentiment: "",
    comment: "",
    submittedBy: "",
  });

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [reportRes, centersRes, infraRes, sentimentsRes] = await Promise.all([
        fetch(`/api/reports/${params.id}`),
        fetch(`/api/evacuation-centers?disasterReportId=${params.id}`),
        fetch(`/api/infrastructure?disasterReportId=${params.id}`),
        fetch(`/api/sentiments?disasterReportId=${params.id}`),
      ]);

      const reportData = await reportRes.json();
      const centersData = await centersRes.json();
      const infraData = await infraRes.json();
      const sentimentsData = await sentimentsRes.json();

      setReport(reportData);
      setEvacuationCenters(centersData);
      setInfrastructure(infraData);
      setSentiments(sentimentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSentiment = async () => {
    if (!newSentiment.sentiment || !newSentiment.comment || !newSentiment.submittedBy) {
      alert("Please fill in all fields");
      return;
    }

    setSubmittingSentiment(true);
    try {
      const response = await fetch("/api/sentiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSentiment,
          disasterReportId: parseInt(params.id as string),
        }),
      });

      if (response.ok) {
        alert("Thank you for sharing your feedback!");
        setNewSentiment({ sentiment: "", comment: "", submittedBy: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error submitting sentiment:", error);
      alert("Failed to submit feedback");
    } finally {
      setSubmittingSentiment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">Loading location details...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-4">The disaster report you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Back to Map</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{categoryEmojis[report.category]}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{report.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={severityColors[report.severity as keyof typeof severityColors]}>
                    {report.severity}
                  </Badge>
                  <Badge variant="outline">{report.status}</Badge>
                  <span className="text-xs text-muted-foreground">Report #{report.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Situation Overview
              </h2>
              <p className="text-muted-foreground mb-4">{report.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                  <Users className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Affected Residents</p>
                    <p className="text-xl font-bold">{report.affectedResidents.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                  <Home className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Evacuation Centers</p>
                    <p className="text-xl font-bold">{evacuationCenters.length}</p>
                  </div>
                </div>
              </div>

              {report.urgentNeeds && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                    🚨 Urgent Needs
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-300">{report.urgentNeeds}</p>
                </div>
              )}
            </Card>

            {/* Tabs for detailed info */}
            <Card className="p-6">
              <Tabs defaultValue="evacuation">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="evacuation">Evacuation Centers</TabsTrigger>
                  <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                  <TabsTrigger value="sentiments">Community Voice</TabsTrigger>
                </TabsList>

                <TabsContent value="evacuation" className="space-y-4 mt-4">
                  {evacuationCenters.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No evacuation centers reported yet
                    </div>
                  ) : (
                    evacuationCenters.map((center) => (
                      <Card key={center.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{center.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{center.address}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>
                                  {center.currentOccupancy} / {center.capacity} capacity
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{center.contact}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {Math.round((center.currentOccupancy / center.capacity) * 100)}%
                            </div>
                            <div className="text-xs text-muted-foreground">occupied</div>
                          </div>
                        </div>
                        <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              center.currentOccupancy / center.capacity > 0.8
                                ? "bg-red-500"
                                : center.currentOccupancy / center.capacity > 0.5
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${(center.currentOccupancy / center.capacity) * 100}%` }}
                          />
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="infrastructure" className="space-y-3 mt-4">
                  {infrastructure.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No infrastructure reports available
                    </div>
                  ) : (
                    infrastructure.map((infra) => (
                      <Card key={infra.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{infrastructureIcons[infra.infrastructureType] || "🏗️"}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{infra.infrastructureType}</h3>
                              <Badge
                                variant={
                                  infra.status === "Operational"
                                    ? "default"
                                    : infra.status === "Damaged"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {infra.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{infra.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {formatDate(infra.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="sentiments" className="space-y-4 mt-4">
                  {/* Add Sentiment Form */}
                  <Card className="p-4 bg-accent">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Share Your Experience
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Your Name</Label>
                        <Input
                          placeholder="Enter your name"
                          value={newSentiment.submittedBy}
                          onChange={(e) => setNewSentiment({ ...newSentiment, submittedBy: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Status</Label>
                        <Select
                          value={newSentiment.sentiment}
                          onValueChange={(value) => setNewSentiment({ ...newSentiment, sentiment: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Urgent">🚨 Urgent - Need immediate help</SelectItem>
                            <SelectItem value="Concerned">😟 Concerned - Situation is worrying</SelectItem>
                            <SelectItem value="Stable">😌 Stable - Managing well</SelectItem>
                            <SelectItem value="Recovering">💪 Recovering - Getting better</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Your Message</Label>
                        <Textarea
                          placeholder="Share what's happening in your area..."
                          rows={3}
                          value={newSentiment.comment}
                          onChange={(e) => setNewSentiment({ ...newSentiment, comment: e.target.value })}
                        />
                      </div>
                      <Button
                        onClick={handleSubmitSentiment}
                        disabled={submittingSentiment}
                        className="w-full gap-2"
                      >
                        {submittingSentiment ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>

                  {/* Sentiments List */}
                  <div className="space-y-3">
                    {sentiments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No community feedback yet. Be the first to share!
                      </div>
                    ) : (
                      sentiments.map((sentiment) => (
                        <Card key={sentiment.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                              {sentiment.submittedBy.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{sentiment.submittedBy}</span>
                                <Badge className={sentimentColors[sentiment.sentiment]}>
                                  {sentiment.sentiment}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(sentiment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{sentiment.comment}</p>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">{report.locationName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Region</p>
                  <p className="font-medium">{report.region}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Coordinates</p>
                  <p className="font-mono text-xs">
                    {report.latitude}, {report.longitude}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="font-medium capitalize">{report.category}</p>
                </div>
              </div>
            </Card>

            {/* Reporter Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reported By</p>
                  <p className="font-medium">{report.reporterName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Contact</p>
                  <p className="font-medium">{report.reporterContact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                  <p>{formatDate(report.createdAt)}</p>
                </div>
                {report.verifiedBy && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Verified By</p>
                    <p className="font-medium">{report.verifiedBy}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(report.verifiedAt!)}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Infrastructure Reports</span>
                  <span className="font-bold">{infrastructure.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Community Feedback</span>
                  <span className="font-bold">{sentiments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Evacuation Capacity</span>
                  <span className="font-bold">
                    {evacuationCenters.reduce((sum, c) => sum + c.capacity, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Currently Sheltered</span>
                  <span className="font-bold">
                    {evacuationCenters.reduce((sum, c) => sum + c.currentOccupancy, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
