import { useEffect, useState } from "react";
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
    }, 1000);

    return () => {
      clearInterval(iconInterval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  const CurrentIcon = icons[currentIcon];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-splash-primary via-splash-secondary to-splash-accent animate-fade-in">
      <div className="text-center space-y-8">
        {/* App Logo/Icon */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
            <CurrentIcon className="h-16 w-16 text-white animate-scale-in" />
          </div>
          <div className="absolute -top-2 -right-2">
            <CheckCircle className="h-8 w-8 text-green-300 animate-pulse" />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white tracking-tight drop-shadow-lg">
            DailyTrack
          </h1>
          <p className="text-xl text-white/90 font-light drop-shadow-md">
            Your Personal Organizer
          </p>
        </div>

        {/* Features */}
        <div className="flex justify-center space-x-8 text-white">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Plan</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Track</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Note</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Receipt className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Store</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div className="h-full bg-gradient-to-r from-white to-white/70 rounded-full animate-pulse shadow-lg"></div>
        </div>
      </div>

      {/* Credit */}
      <div className="absolute bottom-8 text-center space-y-1">
        <p className="text-white/80 text-base font-medium drop-shadow-md">
          Managed by <a href="https://karankamat.com.np" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:underline">Karan</a>
        </p>
        <p className="text-white/70 text-sm drop-shadow-md">
          Developed by <a href="https://redcoderlabs.vercel.app" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:underline">redcoder labs</a>
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;