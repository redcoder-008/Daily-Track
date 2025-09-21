import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, FileText, Receipt, ArrowRight, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const features = [
    {
      title: "Daily Planner",
      description: "Organize your tasks and schedule",
      icon: Calendar,
      path: "/planner",
      color: "text-blue-600",
    },
    {
      title: "Expense Tracker",
      description: "Track spending and manage budgets",
      icon: DollarSign,
      path: "/expenses",
      color: "text-green-600",
    },
    {
      title: "Quick Notes",
      description: "Capture thoughts and ideas",
      icon: FileText,
      path: "/notes",
      color: "text-purple-600",
    },
    {
      title: "Bills & Receipts",
      description: "Store and organize documents",
      icon: Receipt,
      path: "/bills",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">DailyTrack</h1>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-4">
        {features.map((feature) => (
          <Card key={feature.path} className="cursor-pointer transition-colors hover:bg-accent/50" onClick={() => navigate(feature.path)}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  <span className="text-lg">{feature.title}</span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">Get Started</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Begin organizing your life by exploring each section above
          </p>
          <Button onClick={() => navigate("/planner")} className="w-full">
            Start Planning Today
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
