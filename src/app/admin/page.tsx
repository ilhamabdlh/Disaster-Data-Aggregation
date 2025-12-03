"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  ArrowLeft,
  Loader2,
  Plus,
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
  Emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Critical: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Alert: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Normal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export default function AdminPage() {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DisasterReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [adminName, setAdminName] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newReport, setNewReport] = useState<Partial<DisasterReport>>({});

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      const status = activeTab === "pending" ? "Pending" : activeTab === "verified" ? "Verified" : "Rejected";
      const response = await fetch(`/api/reports?status=${status}`);
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reportId: number, newStatus: string) => {
    if (!adminName) {
      alert("Please enter your name as admin");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch(`/api/reports/${reportId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, verifiedBy: adminName }),
      });

      if (response.ok) {
        alert(`Report ${newStatus.toLowerCase()} successfully`);
        fetchReports();
        setSelectedReport(null);
      }
    } catch (error) {
      console.error("Error verifying report:", error);
      alert("Failed to verify report");
    } finally {
      setVerifying(false);
    }
  };

  const handleAddReport = async () => {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newReport,
          status: "Verified",
          verifiedBy: adminName || "Admin",
          verifiedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert("Report added successfully");
        setShowAddDialog(false);
        setNewReport({});
        fetchReports();
      }
    } catch (error) {
      console.error("Error adding report:", error);
      alert("Failed to add report");
    }
  };

  const handleCSVImport = () => {
    alert("CSV import functionality coming soon! For now, use the manual data entry form.");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Verify reports and manage data</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Admin name..."
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Disaster Report</DialogTitle>
                <DialogDescription>Enter disaster information manually</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select onValueChange={(value) => setNewReport({ ...newReport, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flood">🌊 Flood</SelectItem>
                        <SelectItem value="earthquake">🏔️ Earthquake</SelectItem>
                        <SelectItem value="fire">🔥 Fire</SelectItem>
                        <SelectItem value="landslide">⛰️ Landslide</SelectItem>
                        <SelectItem value="tsunami">🌊 Tsunami</SelectItem>
                        <SelectItem value="volcano">🌋 Volcano</SelectItem>
                        <SelectItem value="storm">🌪️ Storm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Severity</Label>
                    <Select onValueChange={(value) => setNewReport({ ...newReport, severity: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="Alert">Alert</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Incident title"
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Detailed description"
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      onChange={(e) => setNewReport({ ...newReport, latitude: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      onChange={(e) => setNewReport({ ...newReport, longitude: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Location Name</Label>
                  <Input
                    placeholder="Full address"
                    onChange={(e) => setNewReport({ ...newReport, locationName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <Input
                    placeholder="Province/City"
                    onChange={(e) => setNewReport({ ...newReport, region: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reporter Name</Label>
                    <Input
                      placeholder="Name"
                      onChange={(e) => setNewReport({ ...newReport, reporterName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Contact</Label>
                    <Input
                      placeholder="+62..."
                      onChange={(e) => setNewReport({ ...newReport, reporterContact: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Affected Residents</Label>
                  <Input
                    type="number"
                    onChange={(e) =>
                      setNewReport({ ...newReport, affectedResidents: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <Button onClick={handleAddReport} className="w-full">
                  Add Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="gap-2" onClick={handleCSVImport}>
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>
        </div>

        {/* Reports Table */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending Verification</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No reports found</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Affected</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-mono text-xs">{report.id}</TableCell>
                          <TableCell>
                            <span className="text-xl">{categoryEmojis[report.category]}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={severityColors[report.severity as keyof typeof severityColors]}>
                              {report.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{report.title}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {report.locationName}
                          </TableCell>
                          <TableCell>{report.affectedResidents.toLocaleString()}</TableCell>
                          <TableCell className="text-xs">{formatDate(report.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedReport(report)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Report Details</DialogTitle>
                                  </DialogHeader>
                                  {selectedReport && (
                                    <div className="space-y-4">
                                      <div className="flex items-start gap-3">
                                        <span className="text-3xl">{categoryEmojis[selectedReport.category]}</span>
                                        <div>
                                          <h3 className="font-semibold text-lg">{selectedReport.title}</h3>
                                          <div className="flex gap-2 mt-1">
                                            <Badge
                                              className={
                                                severityColors[selectedReport.severity as keyof typeof severityColors]
                                              }
                                            >
                                              {selectedReport.severity}
                                            </Badge>
                                            <Badge variant="outline">{selectedReport.status}</Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Description</Label>
                                        <p className="text-sm mt-1">{selectedReport.description}</p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Location</Label>
                                          <p className="text-sm">{selectedReport.locationName}</p>
                                          <p className="text-xs text-muted-foreground">{selectedReport.region}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Coordinates</Label>
                                          <p className="text-sm font-mono">
                                            {selectedReport.latitude}, {selectedReport.longitude}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Reporter</Label>
                                          <p className="text-sm">{selectedReport.reporterName}</p>
                                          <p className="text-xs">{selectedReport.reporterContact}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Affected Residents</Label>
                                          <p className="text-sm font-semibold">
                                            {selectedReport.affectedResidents.toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                      {selectedReport.urgentNeeds && (
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Urgent Needs</Label>
                                          <p className="text-sm">{selectedReport.urgentNeeds}</p>
                                        </div>
                                      )}
                                      {selectedReport.status === "Pending" && (
                                        <div className="flex gap-2 pt-4 border-t">
                                          <Button
                                            className="flex-1 gap-2"
                                            onClick={() => handleVerify(selectedReport.id, "Verified")}
                                            disabled={verifying}
                                          >
                                            {verifying ? (
                                              <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                              <CheckCircle className="w-4 h-4" />
                                            )}
                                            Verify
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            className="flex-1 gap-2"
                                            onClick={() => handleVerify(selectedReport.id, "Rejected")}
                                            disabled={verifying}
                                          >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              {report.status === "Pending" && (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleVerify(report.id, "Verified")}
                                    disabled={verifying}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleVerify(report.id, "Rejected")}
                                    disabled={verifying}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
