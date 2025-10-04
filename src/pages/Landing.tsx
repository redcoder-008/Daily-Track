import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, FileText, Receipt, CheckCircle, Star } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Daily Planner",
      description: "Organize your tasks and schedule efficiently",
      icon: Calendar,
    },
    {
      title: "Expense Tracker",
      description: "Track spending and manage budgets with ease",
      icon: DollarSign,
    },
    {
      title: "Quick Notes",
      description: "Capture thoughts and ideas instantly",
      icon: FileText,
    },
    {
      title: "Bills & Receipts",
      description: "Store and organize important documents",
      icon: Receipt,
    },
  ];

  const benefits = [
    "All-in-one personal organizer",
    "Simple and intuitive interface",
    "Real-time sync across devices",
    "Secure cloud storage",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground px-2">
                DailyTrack
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4">
                Your all-in-one personal organizer for daily planning, expense tracking, quick notes, and document storage
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="px-8 py-3 text-lg"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/auth")}
                className="px-8 py-3 text-lg"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground px-2">
              Everything you need in one place
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Manage your daily life efficiently with our comprehensive set of tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  Why choose DailyTrack?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Simplify your life with our powerful yet easy-to-use personal organizer
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-foreground text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="px-8 py-3 text-lg"
              >
                Start Your Journey
              </Button>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <Star className="h-16 w-16 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">
                    Ready to get organized?
                  </h3>
                  <p className="text-muted-foreground">
                    Join thousands of users who have transformed their daily routine with DailyTrack
                  </p>
                </div>
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={() => navigate("/auth")}
                  >
                    Create Free Account
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/auth")}
                  >
                    Already have an account? Sign In
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">DailyTrack</h3>
            <p className="text-muted-foreground">
              Your personal organizer for a more productive life
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;