import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart3, Leaf, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/50 to-secondary/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
              Blue Carbon <span className="text-primary">MRV</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Monitor, Report, and Verify carbon sequestration in coastal ecosystems. 
              Connecting field workers with carbon credit buyers through satellite data and AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/field-worker">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  <Camera className="mr-2 h-5 w-5" />
                  Field Worker Portal
                </Button>
              </Link>
              <Link to="/buyer">
                <Button variant="ocean" size="lg" className="w-full sm:w-auto">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Buyer Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Complete Blue Carbon Monitoring
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From field data collection to verified carbon credits, our platform streamlines the entire process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/20 shadow-soft hover:shadow-primary transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-ocean rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Field Data Collection</CardTitle>
                <CardDescription>
                  Easy mobile interface for field workers to capture site images, GPS coordinates, and restoration details.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-secondary/20 shadow-soft hover:shadow-secondary transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-forest rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Satellite Monitoring</CardTitle>
                <CardDescription>
                  Automated NDVI analysis using Sentinel-2 data to track vegetation health and biomass growth over time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-accent/20 shadow-soft hover:shadow-secondary transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-earth rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Carbon Credits</CardTitle>
                <CardDescription>
                  Verified carbon sequestration calculations converted to tradeable credits with transparent reporting.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-ocean">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Monitoring Blue Carbon?
          </h2>
          <p className="text-xl text-primary-light mb-8">
            Join the fight against climate change through verified coastal ecosystem restoration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/field-worker">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Start Field Work
              </Button>
            </Link>
            <Link to="/buyer">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                View Available Credits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;