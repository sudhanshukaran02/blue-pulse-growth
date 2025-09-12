import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, BarChart3, Users, Leaf, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/login");
      }
      setIsLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/login');
        } else if (session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/80 to-secondary/10" />
      
      {/* Header */}
      <div className="relative border-b border-primary/20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-primary">
                Blue Carbon MRV
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-primary/20 hover:bg-primary/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor and manage your blue carbon projects, track carbon sequestration, and connect with the marketplace.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-primary/20 shadow-soft hover:shadow-primary transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-ocean rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Field Data Collection</CardTitle>
              <CardDescription>
                Start collecting field data for blue carbon monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/field-worker">
                <Button className="w-full bg-gradient-ocean">
                  Go to Field Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 shadow-soft hover:shadow-secondary transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-forest rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Carbon Credits</CardTitle>
              <CardDescription>
                Browse and purchase verified carbon credits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/buyer">
                <Button className="w-full bg-gradient-forest">
                  View Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-accent/20 shadow-soft hover:shadow-secondary transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-earth rounded-lg flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                View all submitted restoration projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/projects">
                <Button className="w-full bg-gradient-earth">
                  View Projects
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">0</CardTitle>
              <CardDescription>Projects Monitored</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center border-secondary/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-secondary">0 tCO₂</CardTitle>
              <CardDescription>Carbon Sequestered</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center border-accent/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-accent">0</CardTitle>
              <CardDescription>Credits Available</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;