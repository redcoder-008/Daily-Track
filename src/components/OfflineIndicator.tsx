import React from 'react';
import { WifiOff, Wifi, Loader2 } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Badge } from '@/components/ui/badge';

const OfflineIndicator = () => {
  const { isOnline, isSyncing } = useOfflineSync();

  if (isOnline && !isSyncing) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-2">
        {isSyncing ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Syncing...
          </>
        ) : isOnline ? (
          <>
            <Wifi className="h-3 w-3" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            Offline
          </>
        )}
      </Badge>
    </div>
  );
};

export default OfflineIndicator;