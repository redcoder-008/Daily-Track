import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Mail, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">You are not signed in</p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg">
                {getInitials(user.email || "")}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-xl">
            {user.user_metadata?.full_name || user.email}
          </CardTitle>
          <Badge variant="secondary" className="w-fit mx-auto">
            {user.app_metadata?.provider || "email"} account
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(user.created_at), 'PPP')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Account Status</p>
              <div className="flex items-center gap-2">
                <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                  {user.email_confirmed_at ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;