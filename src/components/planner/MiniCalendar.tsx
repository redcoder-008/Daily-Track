import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Globe, Maximize2, Minimize2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { adToBs, formatNepaliDate, formatNepaliDateWithMonth, getNepaliHoliday, type NepaliHoliday } from '@/lib/nepaliCalendar';
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

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-800">
              <CalendarIcon className="h-5 w-5" />
              {calendarType === 'AD' ? 'Calendar' : 'नेपाली पात्रो'}
            </div>
            <div className="flex items-center gap-1">
              <Select value={calendarType} onValueChange={(value: 'AD' | 'BS') => setCalendarType(value)}>
                <SelectTrigger className="w-16 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AD">AD</SelectItem>
                  <SelectItem value="BS">BS</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsFullView(!isFullView)}
              >
                {isFullView ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold text-blue-900">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className={`grid grid-cols-7 gap-1 ${isFullView ? 'text-sm' : 'text-xs'}`}>
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className={`text-center font-medium text-blue-700 ${isFullView ? 'p-2' : 'p-1'}`}>
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {(isFullView ? allDays : monthDays).map((day) => {
              const nepaliDate = convertToBs(day);
              const holiday = getNepaliHoliday(nepaliDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const isHighlightedDate = isHighlighted(day);

              return (
                <Tooltip key={day.toString()}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onDateSelect?.(day)}
                      className={`
                        ${isFullView ? 'p-2 h-10' : 'p-1 h-6'} 
                        text-center rounded transition-colors relative
                        ${!isCurrentMonth && isFullView ? 'text-gray-400' : ''}
                        ${isSelected ? 'bg-blue-600 text-white' : ''}
                        ${isTodayDate && !isSelected ? 'bg-blue-100 text-blue-800 font-bold' : ''}
                        ${isHighlightedDate && !isSelected && !isTodayDate ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${holiday ? 'text-red-600 font-semibold' : ''}
                        ${!isSelected && !isTodayDate && !isHighlightedDate && !holiday ? 'hover:bg-blue-50' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <span className={isFullView ? 'text-sm' : 'text-xs'}>
                          {format(day, 'd')}
                        </span>
                        {calendarType === 'BS' && isFullView && (
                          <span className="text-xs text-gray-600">
                            {nepaliDate.day}
                          </span>
                        )}
                      </div>
                      {holiday && isFullView && (
                        <div className="absolute bottom-0 left-0 right-0 text-xs text-red-600 truncate px-1">
                          {holiday.name}
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  {holiday && (
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-semibold text-red-600">{holiday.name}</p>
                        <p className="text-xs text-gray-600">{holiday.type}</p>
                        {holiday.description && (
                          <p className="text-xs mt-1">{holiday.description}</p>
                        )}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </div>

          {/* Current date info for BS calendar */}
          {calendarType === 'BS' && (
            <div className="text-center text-sm text-blue-700 bg-blue-50 rounded-lg p-2">
              <p className="font-medium">
                {format(new Date(), 'MMMM d, yyyy')} = {formatNepaliDateWithMonth(convertToBs(new Date()))}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};