import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, MapPin, Upload, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const FieldWorker = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    images: [] as File[],
    latitude: "",
    longitude: "",
    plantationType: "",
    areaCovered: "",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast({
            title: "Location captured",
            description: "GPS coordinates have been automatically filled."
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get current location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedImageUrls: string[] = [];

      // Upload images to storage if any
      if (formData.images.length > 0) {
        for (const image of formData.images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('site-images')
            .upload(fileName, image);

          if (uploadError) {
            throw uploadError;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('site-images')
            .getPublicUrl(fileName);
          
          uploadedImageUrls.push(publicUrl);
        }
      }

      // Save to database
      const { error: insertError } = await supabase
        .from('sites')
        .insert({
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          plantation_type: formData.plantationType,
          area: parseFloat(formData.areaCovered),
          uploaded_image_url: uploadedImageUrls[0] || null, // Store first image URL
          field_worker_id: '00000000-0000-0000-0000-000000000000', // Placeholder for now
          date_of_plantation: new Date().toISOString()
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Site data submitted!",
        description: "Your restoration site data has been successfully recorded."
      });

      // Reset form
      setFormData({
        images: [],
        latitude: "",
        longitude: "",
        plantationType: "",
        areaCovered: "",
        notes: ""
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      toast({
        title: "Error",
        description: "Failed to submit site data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-forest text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-secondary">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Field Worker Portal</h1>
              <p className="text-secondary-light">Record restoration site data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-secondary" />
              New Site Recording
            </CardTitle>
            <CardDescription>
              Upload images and record details for a restoration/plantation site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="images">Site Images</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Drag and drop images here, or click to select
                    </p>
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => document.getElementById('images')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Images
                    </Button>
                  </div>
                </div>
                {formData.images.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      {formData.images.length} image(s) selected
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/80"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* GPS Coordinates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 40.7128"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., -74.0060"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                onClick={getCurrentLocation}
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>

              {/* Site Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plantationType">Plantation Type</Label>
                  <Input
                    id="plantationType"
                    placeholder="e.g., Mangrove, Seagrass, Salt Marsh"
                    value={formData.plantationType}
                    onChange={(e) => setFormData(prev => ({ ...prev, plantationType: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="areaCovered">Area Covered (hectares)</Label>
                  <Input
                    id="areaCovered"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 2.5"
                    value={formData.areaCovered}
                    onChange={(e) => setFormData(prev => ({ ...prev, areaCovered: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional observations or details about the site..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <Button 
                type="submit" 
                variant="forest" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Site Data"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FieldWorker;