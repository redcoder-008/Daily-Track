import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const Greeting = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const getFirstName = () => {
    if (!user) return "";
    
    // Try to get name from user metadata first
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) {
      return fullName.split(' ')[0];
    }
    
    // Fallback to email username
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return "";
  };

  if (!user) return null;

  const firstName = getFirstName();
  const greeting = getGreeting();

  return (
    <div className="mb-4">
      <h2 className="text-lg font-medium text-muted-foreground">
        {greeting}{firstName && `, ${firstName}`}! 👋
      </h2>
    </div>
  );
};

export default Greeting;