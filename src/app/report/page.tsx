"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Upload, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const categories = [
  { value: "flood", label: "🌊 Flood", emoji: "🌊" },
  { value: "earthquake", label: "🏔️ Earthquake", emoji: "🏔️" },
  { value: "fire", label: "🔥 Fire", emoji: "🔥" },
  { value: "landslide", label: "⛰️ Landslide", emoji: "⛰️" },
  { value: "tsunami", label: "🌊 Tsunami", emoji: "🌊" },
  { value: "volcano", label: "🌋 Volcano", emoji: "🌋" },
  { value: "storm", label: "🌪️ Storm", emoji: "🌪️" },
];

const severityLevels = [
  { value: "Normal", label: "Normal", color: "text-green-600", description: "Monitoring situation" },
  { value: "Alert", label: "Alert", color: "text-yellow-600", description: "Potential danger" },
  { value: "Critical", label: "Critical", color: "text-orange-600", description: "Immediate action needed" },
  { value: "Emergency", label: "Emergency", color: "text-red-600", description: "Life-threatening situation" },
];

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    severity: "",
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    locationName: "",
    region: "",
    photoUrl: "",
    reporterName: "",
    reporterContact: "",
    affectedResidents: 0,
    urgentNeeds: "",
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          setGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enter manually.");
          setGettingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.severity || !formData.title || !formData.latitude || !formData.longitude) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Report submitted successfully! It will be reviewed by our team.");
        router.push("/");
      } else {
        throw new Error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Map
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Report a Disaster</h1>
              <p className="text-muted-foreground">Help us respond quickly by providing accurate information</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-6">
            {/* Category and Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Disaster Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="severity">Severity Level *</Label>
                <Select value={formData.severity} onValueChange={(value) => handleChange("severity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <span className={level.color}>{level.label}</span> - {level.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Incident Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Major flooding in residential area"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the situation in detail..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label>Location Information *</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude" className="text-xs">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="-6.2088"
                    value={formData.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-xs">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="106.8456"
                    value={formData.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Getting location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Use My Current Location
                  </>
                )}
              </Button>

              <div>
                <Label htmlFor="locationName">Location Name *</Label>
                <Input
                  id="locationName"
                  placeholder="e.g., Jl. Sudirman No. 45, Jakarta Pusat"
                  value={formData.locationName}
                  onChange={(e) => handleChange("locationName", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="region">Region/Province *</Label>
                <Input
                  id="region"
                  placeholder="e.g., DKI Jakarta"
                  value={formData.region}
                  onChange={(e) => handleChange("region", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <Label htmlFor="photoUrl">Photo URL (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="photoUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.photoUrl}
                  onChange={(e) => handleChange("photoUrl", e.target.value)}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Upload photos to help verify the situation</p>
            </div>

            {/* Reporter Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reporterName">Your Name *</Label>
                <Input
                  id="reporterName"
                  placeholder="Full name"
                  value={formData.reporterName}
                  onChange={(e) => handleChange("reporterName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reporterContact">Contact Number *</Label>
                <Input
                  id="reporterContact"
                  type="tel"
                  placeholder="+62812345678"
                  value={formData.reporterContact}
                  onChange={(e) => handleChange("reporterContact", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="affectedResidents">Estimated Affected Residents</Label>
                <Input
                  id="affectedResidents"
                  type="number"
                  placeholder="0"
                  value={formData.affectedResidents}
                  onChange={(e) => handleChange("affectedResidents", parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="urgentNeeds">Urgent Needs</Label>
                <Input
                  id="urgentNeeds"
                  placeholder="e.g., Water, food, medical supplies"
                  value={formData.urgentNeeds}
                  onChange={(e) => handleChange("urgentNeeds", e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Submit Report
                  </>
                )}
              </Button>
              <Link href="/" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
