import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { NepaliPatroService, type NepaliPatroData } from '@/services/nepaliPatroService';
import { formatNepaliDateWithMonth } from '@/lib/nepaliCalendar';

export const TodayNepaliDate = () => {
  const [patroData, setPatroData] = useState<NepaliPatroData | null>(null);

  useEffect(() => {
    const loadPatroData = async () => {
      try {
        const data = await NepaliPatroService.getTodayData();
        setPatroData(data);
      } catch (error) {
        console.error('Error loading Nepali Patro data:', error);
      }
    };

    loadPatroData();
  }, []);

  if (!patroData) {
    return (
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
        <Calendar className="h-3 w-3 mr-1" />
        Loading...
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
      <Calendar className="h-3 w-3 mr-1" />
      {formatNepaliDateWithMonth(patroData.nepaliDate)}
    </Badge>
  );
};