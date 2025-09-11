import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Ruler, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Site {
  id: string;
  latitude: number;
  longitude: number;
  plantation_type: string;
  area: number;
  uploaded_image_url?: string;
  created_at: string;
  date_of_plantation?: string;
  carbon_estimate_tonnes?: number;
}

const Projects = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-forest text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-secondary">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Submitted Projects</h1>
              <p className="text-secondary-light">View all restoration site submissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sites.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects submitted yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                When field workers submit site data, it will appear here.
              </p>
              <Link to="/field-worker">
                <Button variant="forest">Submit First Project</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <Card key={site.id} className="shadow-soft hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{site.plantation_type}</CardTitle>
                    <Badge variant="secondary">
                      {site.area} ha
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(site.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {site.uploaded_image_url && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={site.uploaded_image_url}
                        alt="Site image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ruler className="h-4 w-4" />
                      <span>{site.area} hectares</span>
                    </div>

                    {site.carbon_estimate_tonnes && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Leaf className="h-4 w-4" />
                        <span>{site.carbon_estimate_tonnes} tonnes CO₂</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Badge variant="outline" className="text-xs">
                      ID: {site.id.slice(0, 8)}...
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;