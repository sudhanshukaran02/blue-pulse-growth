import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ArrowLeft, Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NGORegistrationDialog } from "@/components/NGORegistrationDialog";

const FieldWorkerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showNGODialog, setShowNGODialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is a field worker
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        if (profile?.role === 'field_worker') {
          navigate("/field-worker");
        }
      }
    };
    checkUser();
  }, [navigate]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Check if user has field worker profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (profile?.role !== 'field_worker') {
          toast({
            title: "Access Denied",
            description: "This account is not authorized for field worker access",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return;
        }

        // Check if NGO details already exist
        const { data: ngoData } = await supabase
          .from('ngos')
          .select('id')
          .eq('field_worker_id', data.user.id)
          .single();

        toast({
          title: "Success",
          description: "Successfully signed in as field worker!",
        });

        if (!ngoData) {
          // Show NGO registration dialog if no NGO data exists
          setShowNGODialog(true);
        } else {
          // Navigate directly if NGO data exists
          navigate("/field-worker");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsResettingPassword(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/field-worker`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset Email Sent",
          description: "Check your email for password reset instructions",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleNGODialogClose = (open: boolean) => {
    setShowNGODialog(open);
    if (!open) {
      // Navigate to field worker page after dialog closes
      navigate("/field-worker");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-forest flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background/80 to-primary/10" />
      
      <Card className="relative w-full max-w-md shadow-secondary border-secondary/20">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Leaf className="h-6 w-6 text-secondary" />
                <CardTitle className="text-2xl font-bold text-secondary">
                  Field Worker
                </CardTitle>
              </div>
            </div>
          </div>
          <CardDescription className="text-center">
            Sign in to record blue carbon restoration data
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="fieldworker@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-describedby="email-error"
                className="focus:ring-secondary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-describedby="password-error"
                  className="focus:ring-secondary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isResettingPassword}
                className="text-sm text-secondary hover:text-secondary/80 transition-colors disabled:opacity-50"
              >
                {isResettingPassword ? (
                  <span className="flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Sending...
                  </span>
                ) : (
                  "Forgot password?"
                )}
              </button>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-forest hover:shadow-secondary transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Leaf className="mr-2 h-4 w-4" />
                  Sign In as Field Worker
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need a field worker account?{" "}
              <Link
                to="/contact"
                className="text-secondary hover:text-secondary/80 font-medium transition-colors"
              >
                Contact admin
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <NGORegistrationDialog 
        open={showNGODialog} 
        onOpenChange={handleNGODialogClose} 
      />
    </div>
    </>
  );
};

export default FieldWorkerLogin;