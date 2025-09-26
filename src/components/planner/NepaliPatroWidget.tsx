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
    return (
      <Card className="bg-gradient-to-br from-orange-50 to-red-50">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-orange-200 rounded w-3/4"></div>
            <div className="h-3 bg-orange-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!patroData) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Calendar className="h-5 w-5" />
          नेपाली पात्रो
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Display */}
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-bold text-orange-900">
            {formatNepaliDateWithMonth(patroData.nepaliDate)}
          </h3>
          <p className="text-sm text-orange-700">{patroData.dayName}</p>
          <p className="text-xs text-orange-600">{patroData.englishDate}</p>
        </div>

        {/* Tithi */}
        <div className="text-center">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {patroData.tithi}
          </Badge>
        </div>

        {/* Sun/Moon Times */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-600" />
            <div>
              <p className="text-xs text-orange-600">सूर्योदय</p>
              <p className="font-medium text-orange-800">{patroData.sunrise}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-orange-600">सूर्यास्त</p>
              <p className="font-medium text-orange-800">{patroData.sunset}</p>
            </div>
          </div>
        </div>

        {/* Events */}
        {patroData.events.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-orange-800 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              आजका कार्यक्रम
            </h4>
            {patroData.events.map((event, index) => (
              <div key={index} className="bg-white/50 rounded-lg p-2">
                <p className="font-medium text-orange-900 text-sm">{event.title}</p>
                <p className="text-xs text-orange-700">{event.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Moon Phase */}
        <div className="text-center">
          <p className="text-xs text-orange-600">चन्द्र अवस्था</p>
          <p className="text-sm font-medium text-orange-800">{patroData.moonPhase}</p>
        </div>

        {/* Attribution */}
        <div className="text-center pt-2 border-t border-orange-200">
          <p className="text-xs text-orange-500">
            डाटा स्रोत: nepalipatro.com.np
          </p>
        </div>
      </CardContent>
    </Card>
  );
};