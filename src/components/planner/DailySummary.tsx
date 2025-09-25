import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Heart, Brain, Star } from 'lucide-react';

interface DailySummaryProps {
  completedTasks: number;
  totalTasks: number;
  completedGoals: number;
  totalGoals: number;
  completedHabits: number;
  totalHabits: number;
}

export const DailySummary = ({ 
  completedTasks, 
  totalTasks, 
  completedGoals, 
  totalGoals,
  completedHabits,
  totalHabits 
}: DailySummaryProps) => {
  const [mood, setMood] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');

  const moods = [
    { emoji: '😊', label: 'Great', value: 'great' },
    { emoji: '🙂', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Tired', value: 'tired' },
    { emoji: '😤', label: 'Stressed', value: 'stressed' }
  ];

  const taskCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const goalCompletion = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const habitCompletion = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5" />
          Daily Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-background/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{taskCompletion}%</div>
            <div className="text-xs text-muted-foreground">Tasks</div>
            <div className="text-xs">{completedTasks}/{totalTasks}</div>
          </div>
          <div className="text-center p-3 bg-background/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{goalCompletion}%</div>
            <div className="text-xs text-muted-foreground">Goals</div>
            <div className="text-xs">{completedGoals}/{totalGoals}</div>
          </div>
          <div className="text-center p-3 bg-background/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{habitCompletion}%</div>
            <div className="text-xs text-muted-foreground">Habits</div>
            <div className="text-xs">{completedHabits}/{totalHabits}</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">How are you feeling?</span>
          </div>
          <div className="flex gap-2">
            {moods.map(moodOption => (
              <Button
                key={moodOption.value}
                variant={mood === moodOption.value ? "default" : "outline"}
                size="sm"
                onClick={() => setMood(moodOption.value)}
                className="flex flex-col h-auto p-2"
              >
                <span className="text-lg">{moodOption.emoji}</span>
                <span className="text-xs">{moodOption.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">Daily Reflection</span>
          </div>
          <Textarea
            placeholder="What went well today? What could be improved tomorrow?"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={3}
          />
        </div>

        {(taskCompletion > 80 || goalCompletion > 80 || habitCompletion > 80) && (
          <div className="p-3 bg-green-100 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 font-medium">
              🎉 Great job today! You're crushing your goals!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};