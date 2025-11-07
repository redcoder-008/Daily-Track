import { useNavigate } from "react-router-dom";
import { Calendar, DollarSign, FileText, Receipt, CheckCircle, Star, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Promo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Smart Daily Planning",
      description: "Organize your day with intelligent task management, reminders, and a beautiful calendar view.",
    },
    {
      icon: DollarSign,
      title: "Expense Tracking",
      description: "Track every penny with categorized expenses and insightful charts that help you save more.",
    },
    {
      icon: FileText,
      title: "Quick Notes",
      description: "Capture thoughts instantly with our lightning-fast note-taking feature.",
    },
    {
      icon: Receipt,
      title: "Bill Management",
      description: "Scan and store all your bills and receipts in one secure place.",
    },
  ];

  const benefits = [
    "Save 2+ hours daily with streamlined organization",
    "Reduce expenses by up to 30% with smart tracking",
    "Never miss important tasks or deadlines",
    "All your data secure and accessible anywhere",
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Student",
      comment: "DailyTrack changed how I manage my studies and budget. It's a game-changer!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Professional",
      comment: "The best productivity app I've used. Simple, powerful, and essential for my daily routine.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Freelancer",
      comment: "Tracking expenses and managing tasks has never been easier. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Transform Your Daily Life
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Join thousands who've taken control of their time, money, and productivity with DailyTrack
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
            Start Free Today
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/landing")} className="text-lg px-8">
            Learn More
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">No credit card required • Free forever</p>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-4xl font-bold">10K+</CardTitle>
              <CardDescription>Active Users</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Star className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-4xl font-bold">4.9/5</CardTitle>
              <CardDescription>User Rating</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-4xl font-bold">100%</CardTitle>
              <CardDescription>Secure & Private</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Everything You Need in One App</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose DailyTrack?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Loved by Users Worldwide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="text-base italic">"{testimonial.comment}"</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join DailyTrack today and experience the difference. It's free, simple, and powerful.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-12">
            Create Your Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            © 2025 DailyTrack. All rights reserved.
          </p>
          <div className="flex gap-4 justify-center mb-4">
            <button onClick={() => navigate("/privacy-policy")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </button>
            <span className="text-muted-foreground">•</span>
            <button onClick={() => navigate("/landing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Managed by </span>
              <a 
                href="https://karankamat.com.np" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:underline"
              >
                Karan
              </a>
            </p>
            <p className="text-xs">
              <span className="text-muted-foreground">Developed by </span>
              <a 
                href="https://redcoderlabs.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent hover:underline"
              >
                redcoder labs
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Promo;
