import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Mail, Calendar, Shield, Edit, Camera, User } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Profile validation schema
const profileSchema = z.object({
  display_name: z.string().trim().min(1, "Name cannot be empty").max(100, "Name must be less than 100 characters"),
});

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
      } else {
        // Create profile if it doesn't exist
        await createProfile();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const defaultName = user.user_metadata?.full_name || 
                         user.user_metadata?.name || 
                         user.email?.split('@')[0] || 
                         "User";

      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          user_id: user.id,
          display_name: defaultName,
          avatar_url: user.user_metadata?.avatar_url || null
        }])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      setDisplayName(data.display_name || "");
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

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

  const handleUpdateProfile = async () => {
    if (!user || !profile) return;

    try {
      const validation = profileSchema.safeParse({ display_name: displayName });
      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);

      let avatarUrl = profile.avatar_url;

      // Upload avatar if file is selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          avatar_url: avatarUrl
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchProfile();
      setIsEditDialogOpen(false);
      setAvatarFile(null);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setAvatarFile(file);
    }
  };

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : "U";
  };

  const displayUserName = profile?.display_name || user?.user_metadata?.full_name || user?.email;
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

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

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setDisplayName(profile?.display_name || "")}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="avatar">Profile Photo</Label>
                <div className="mt-1 flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl} />
                    <AvatarFallback>
                      {getInitials(displayName || displayUserName || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('avatar')?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">Max 5MB, JPG/PNG</p>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleUpdateProfile} className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-lg">
                {getInitials(displayUserName || "")}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-xl">{displayUserName}</CardTitle>
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