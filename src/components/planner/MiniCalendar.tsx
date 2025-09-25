import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';

interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  highlightedDates?: Date[];
}

export const MiniCalendar = ({ selectedDate, onDateSelect, highlightedDates = [] }: MiniCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
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
    <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={previousMonth} className="h-6 w-6 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              {format(currentDate, 'MMM yyyy')}
            </span>
            <Button variant="ghost" size="sm" onClick={nextMonth} className="h-6 w-6 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month start */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="p-1" />
          ))}
          
          {monthDays.map(date => {
            const isSelectedDate = selectedDate && isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);
            const isHighlightedDate = isHighlighted(date);
            
            return (
              <Button
                key={date.toISOString()}
                variant="ghost"
                size="sm"
                onClick={() => onDateSelect?.(date)}
                className={`
                  h-8 w-8 p-0 text-xs
                  ${isSelectedDate ? 'bg-primary text-primary-foreground' : ''}
                  ${isTodayDate && !isSelectedDate ? 'bg-accent text-accent-foreground font-semibold' : ''}
                  ${isHighlightedDate ? 'bg-blue-100 text-blue-800' : ''}
                  ${!isSameMonth(date, currentDate) ? 'text-muted-foreground/50' : ''}
                `}
              >
                {format(date, 'd')}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};