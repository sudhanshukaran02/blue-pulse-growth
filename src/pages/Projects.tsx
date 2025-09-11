import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, TreePine } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Site {
  id: string;
  latitude: number;
  longitude: number;
  plantation_type: string;
  area: number;
  uploaded_image_url: string | null;
  date_of_plantation: string | null;
  created_at: string;
  carbon_estimate_tonnes: number | null;
  ndvi_avg: number | null;
}

const Projects = () => {
  const { toast } = useToast();
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

      if (error) {
        throw error;
      }

      setSites(data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive"
      });
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

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        ) : sites.length === 0 ? (
          <div className="text-center py-12">
            <TreePine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No projects submitted yet</h2>
            <p className="text-muted-foreground mb-4">Field workers haven't submitted any restoration projects.</p>
            <Link to="/field-worker">
              <Button>Submit First Project</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <Card key={site.id} className="shadow-soft hover:shadow-lg transition-shadow">
                {site.uploaded_image_url && (
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={site.uploaded_image_url}
                      alt="Site image"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TreePine className="h-5 w-5 text-secondary" />
                    {site.plantation_type}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted {formatDate(site.created_at)}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {site.area} hectares
                    </Badge>
                    
                    {site.carbon_estimate_tonnes && (
                      <Badge variant="outline">
                        {site.carbon_estimate_tonnes} tonnes CO₂
                      </Badge>
                    )}
                    
                    {site.ndvi_avg && (
                      <Badge variant="outline">
                        NDVI: {site.ndvi_avg.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
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