import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import NepaliDate from 'nepali-date-converter';

export const TodayNepaliDate = () => {
  const [nepaliDate, setNepaliDate] = useState<string>('');

  useEffect(() => {
    const loadNepaliDate = () => {
      try {
        const today = new Date();
        const nd = new NepaliDate(today);
        const formattedDate = `आजको मिति: ${nd.getYear()}/${String(nd.getMonth() + 1).padStart(2, '0')}/${String(nd.getDate()).padStart(2, '0')}`;
        setNepaliDate(formattedDate);
      } catch (error) {
        console.error('Error loading Nepali date:', error);
      }
    };

    loadNepaliDate();
  }, []);

  if (!nepaliDate) {
    return (
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
        <Calendar className="h-3 w-3 mr-1" />
        Loading...
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className="bg-orange-50 text-orange-700 border-orange-200"
      id="nepali-date"
    >
      <Calendar className="h-3 w-3 mr-1" />
      {nepaliDate}
    </Badge>
  );
};