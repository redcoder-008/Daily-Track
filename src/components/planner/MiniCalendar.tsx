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

export const MiniCalendar = ({ selectedDate, onDateSelect, highlightedDates = [] }: MiniCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarType, setCalendarType] = useState<'AD' | 'BS'>('AD');
  const [isFullView, setIsFullView] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  // Get all days to display (including days from previous/next month)
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isHighlighted = (date: Date) => {
    return highlightedDates.some(highlightedDate => isSameDay(date, highlightedDate));
  };

  return (
    <Card className={`bg-gradient-to-br from-slate-50 to-gray-50 transition-all duration-300 ${isFullView ? 'lg:col-span-2' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullView(!isFullView)}
              className="h-8 w-8 p-0"
            >
              {isFullView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Select value={calendarType} onValueChange={(value: 'AD' | 'BS') => setCalendarType(value)}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AD">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    AD
                  </div>
                </SelectItem>
                <SelectItem value="BS">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">🕉️</span>
                    BS
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={previousMonth} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {calendarType === 'AD' 
              ? format(currentDate, 'MMM yyyy') 
              : `${convertToBs(currentDate).monthName} ${convertToBs(currentDate).year}`
            }
          </span>
          <Button variant="ghost" size="sm" onClick={nextMonth} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className={isFullView ? 'px-2' : ''}>
        {/* Day headers */}
        <div className={`grid grid-cols-7 gap-1 mb-2`}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={day} className={`text-center font-medium text-muted-foreground p-1 ${isFullView ? 'text-sm py-2' : 'text-xs'}`}>
              {isFullView ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index] : day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* For mini view, add empty cells for days before month start */}
          {!isFullView && Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="p-1" />
          ))}
          
          {/* Render days - use allDays for full view, monthDays for mini view */}
          {(isFullView ? allDays : monthDays).map(date => {
            const isSelectedDate = selectedDate && isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);
            const isHighlightedDate = isHighlighted(date);
            const nepaliDate = convertToBs(date);
            const holiday = calendarType === 'BS' ? getNepaliHoliday(nepaliDate) : null;
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isHoliday = !!holiday;
            
            const dateButton = (
              <Button
                key={date.toISOString()}
                variant="ghost"
                size={isFullView ? "default" : "sm"}
                onClick={() => onDateSelect?.(date)}
                className={`
                  ${isFullView ? 'h-12 w-full' : 'h-8 w-8'} p-0 text-xs relative
                  ${isSelectedDate ? 'bg-primary text-primary-foreground' : ''}
                  ${isTodayDate && !isSelectedDate ? 'bg-accent text-accent-foreground font-semibold' : ''}
                  ${isHighlightedDate ? 'bg-blue-100 text-blue-800' : ''}
                  ${isHoliday ? 'text-red-600 font-semibold' : ''}
                  ${!isCurrentMonth ? 'text-muted-foreground/50' : ''}
                  ${isFullView ? 'flex-col justify-start items-start' : ''}
                `}
              >
                <div className={`flex ${isFullView ? 'flex-col items-start w-full' : 'flex-col items-center'}`}>
                  <span className={isFullView ? 'text-sm font-medium' : ''}>{format(date, 'd')}</span>
                  {calendarType === 'BS' && (
                    <span className={`${isFullView ? 'text-xs mt-1' : 'text-[8px] absolute -bottom-1'} ${isHoliday ? 'text-red-500' : 'text-orange-600'}`}>
                      {convertToBs(date).day}
                    </span>
                  )}
                  {isFullView && isHoliday && holiday && (
                    <span className="text-[10px] text-red-600 mt-1 leading-tight">
                      {holiday.name}
                    </span>
                  )}
                </div>
              </Button>
            );

            // Show tooltip only in mini view or for non-holiday dates in full view
            if (isHoliday && holiday && !isFullView) {
              return (
                <TooltipProvider key={date.toISOString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {dateButton}
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-semibold">{holiday.name}</p>
                        <p className="text-xs text-muted-foreground">{holiday.description}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            return dateButton;
          })}
        </div>
      </CardContent>
    </Card>
  );
};