import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';
interface Habit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  streak: number;
}
export const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([{
    id: '1',
    name: 'Drink 8 glasses of water',
    icon: '💧',
    completed: false,
    streak: 3
  }, {
    id: '2',
    name: 'Exercise for 30 minutes',
    icon: '🏃',
    completed: false,
    streak: 1
  }, {
    id: '3',
    name: 'Read for 20 minutes',
    icon: '📚',
    completed: false,
    streak: 7
  }, {
    id: '4',
    name: 'Meditate',
    icon: '🧘',
    completed: false,
    streak: 2
  }]);
  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completed;
        return {
          ...habit,
          completed: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };
  const completedCount = habits.filter(habit => habit.completed).length;
  return <Card className="bg-gradient-to-br from-purple-50 to-violet-50">
      
      <CardContent className="space-y-3">
        {habits.map(habit => <div key={habit.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
            <Button variant="ghost" size="sm" onClick={() => toggleHabit(habit.id)} className="h-8 w-8 p-0">
              {habit.completed ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{habit.icon}</span>
                <span className={`font-medium ${habit.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {habit.name}
                </span>
              </div>
            </div>

            <Badge variant="secondary" className="text-xs">
              {habit.streak} day{habit.streak !== 1 ? 's' : ''}
            </Badge>
          </div>)}
      </CardContent>
    </Card>;
};