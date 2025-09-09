import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, TrendingUp, ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for demonstration
const siteData = [
  {
    id: 1,
    name: "Mangrove Restoration Site A",
    location: "Sundarbans, Bangladesh",
    coordinates: { lat: 22.4954, lng: 89.5403 },
    plantationType: "Mangrove",
    areaCovered: 15.5,
    dateRecorded: "2024-01-15",
    ndviAverage: 0.72,
    ndviTrend: "increasing",
    biomass: 87.3,
    carbonSequestered: 32.1,
    creditsAvailable: 25,
    pricePerCredit: 12.50,
    status: "verified"
  },
  {
    id: 2,
    name: "Seagrass Meadow Project",
    location: "Great Barrier Reef, Australia",
    coordinates: { lat: -16.2839, lng: 145.7781 },
    plantationType: "Seagrass",
    areaCovered: 8.2,
    dateRecorded: "2024-02-03",
    ndviAverage: 0.65,
    ndviTrend: "stable",
    biomass: 52.8,
    carbonSequestered: 19.4,
    creditsAvailable: 15,
    pricePerCredit: 15.00,
    status: "verified"
  },
  {
    id: 3,
    name: "Salt Marsh Conservation",
    location: "Chesapeake Bay, USA",
    coordinates: { lat: 38.8026, lng: -76.4951 },
    plantationType: "Salt Marsh",
    areaCovered: 12.1,
    dateRecorded: "2024-01-28",
    ndviAverage: 0.58,
    ndviTrend: "increasing",
    biomass: 68.9,
    carbonSequestered: 25.3,
    creditsAvailable: 20,
    pricePerCredit: 10.75,
    status: "pending"
  }
];

const Buyer = () => {
  const [selectedSite, setSelectedSite] = useState<number | null>(null);

  const getTrendIcon = (trend: string) => {
    return trend === "increasing" ? "📈" : trend === "stable" ? "📊" : "📉";
  };

  const getStatusColor = (status: string) => {
    return status === "verified" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground";
  };

  const totalCreditsAvailable = siteData.reduce((sum, site) => sum + site.creditsAvailable, 0);
  const totalCarbonSequestered = siteData.reduce((sum, site) => sum + site.carbonSequestered, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-ocean text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-primary">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Carbon Credit Dashboard</h1>
                <p className="text-primary-light">Monitor and purchase verified blue carbon credits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sites</p>
                  <p className="text-2xl font-bold text-foreground">{siteData.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-forest rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Carbon Sequestered</p>
                  <p className="text-2xl font-bold text-foreground">{totalCarbonSequestered.toFixed(1)} tonnes</p>
                </div>
                <div className="w-12 h-12 bg-gradient-earth rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credits Available</p>
                  <p className="text-2xl font-bold text-foreground">{totalCreditsAvailable}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-ocean rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sites Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {siteData.map((site) => (
            <Card key={site.id} className="shadow-soft hover:shadow-primary transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {site.location}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(site.status)}>
                    {site.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{site.plantationType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Area</p>
                    <p className="font-medium">{site.areaCovered} ha</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">NDVI Average</p>
                    <p className="font-medium flex items-center gap-1">
                      {site.ndviAverage} {getTrendIcon(site.ndviTrend)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Carbon</p>
                    <p className="font-medium">{site.carbonSequestered} tonnes</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vegetation Health</span>
                    <span className="font-medium">{Math.round(site.ndviAverage * 100)}%</span>
                  </div>
                  <Progress value={site.ndviAverage * 100} className="h-2" />
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Credits Available: {site.creditsAvailable}</span>
                    <span className="text-lg font-bold text-primary">${site.pricePerCredit}/credit</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="ocean" size="sm" className="flex-1">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Credits
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buyer;