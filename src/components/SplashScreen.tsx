import React, { useEffect, useState } from "react";
import { CheckCircle, Wallet, Calendar, FileText, Receipt } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const icons = [Calendar, Wallet, FileText, Receipt];
  
  useEffect(() => {
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 600);

    const timer = setTimeout(() => {
      clearInterval(iconInterval);
      onFinish();
    }, 3000);

    return () => {
      clearInterval(iconInterval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  const CurrentIcon = icons[currentIcon];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary via-primary-foreground to-secondary animate-fade-in">
      <div className="text-center space-y-8">
        {/* App Logo/Icon */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
            <CurrentIcon className="h-16 w-16 text-white animate-scale-in" />
          </div>
          <div className="absolute -top-2 -right-2">
            <CheckCircle className="h-8 w-8 text-green-400 animate-pulse" />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            DailyTrack
          </h1>
          <p className="text-xl text-white/80 font-light">
            Your Personal Organizer
          </p>
        </div>

        {/* Features */}
        <div className="flex justify-center space-x-6 text-white/60">
          <div className="flex flex-col items-center space-y-1">
            <Calendar className="h-6 w-6" />
            <span className="text-xs">Plan</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Wallet className="h-6 w-6" />
            <span className="text-xs">Track</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <FileText className="h-6 w-6" />
            <span className="text-xs">Note</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Receipt className="h-6 w-6" />
            <span className="text-xs">Store</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Credit */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/60 text-sm font-light">
          Made with ❤️ by <span className="font-medium text-white">Karan</span>
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;