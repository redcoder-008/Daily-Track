import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Globe, Maximize2, Minimize2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { adToBs, formatNepaliDate, getNepaliHoliday, type NepaliHoliday } from '@/lib/nepaliCalendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  highlightedDates?: Date[];
}

// Use accurate Nepali Patro conversion
const convertToBs = (adDate: Date) => {
  return adToBs(adDate);
};
export const MiniCalendar = ({
  selectedDate,
  onDateSelect,
  highlightedDates = []
}: MiniCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarType, setCalendarType] = useState<'AD' | 'BS'>('AD');
  const [isFullView, setIsFullView] = useState(false);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Get all days to display (including days from previous/next month)
  const allDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });
  const monthDays = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  const isHighlighted = (date: Date) => {
    return highlightedDates.some(highlightedDate => isSameDay(date, highlightedDate));
  };
  return;
};