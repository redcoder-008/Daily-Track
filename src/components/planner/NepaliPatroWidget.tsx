import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Sun, Moon, Clock } from 'lucide-react';
import { NepaliPatroService, type NepaliPatroData } from '@/services/nepaliPatroService';
import { formatNepaliDateWithMonth } from '@/lib/nepaliCalendar';
export const NepaliPatroWidget = () => {
  const [patroData, setPatroData] = useState<NepaliPatroData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadPatroData = async () => {
      try {
        const data = await NepaliPatroService.getTodayData();
        setPatroData(data);
      } catch (error) {
        console.error('Error loading Nepali Patro data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPatroData();
  }, []);
  if (loading) {
    return <Card className="bg-gradient-to-br from-orange-50 to-red-50">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-orange-200 rounded w-3/4"></div>
            <div className="h-3 bg-orange-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>;
  }
  if (!patroData) {
    return null;
  }
  return <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      
      
    </Card>;
};