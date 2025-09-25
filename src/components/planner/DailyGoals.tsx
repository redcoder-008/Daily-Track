import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, Plus, X } from 'lucide-react';

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

export const DailyGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, {
        id: Date.now().toString(),
        text: newGoal.trim(),
        completed: false
      }]);
      setNewGoal('');
    }
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const completedCount = goals.filter(goal => goal.completed).length;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Daily Goals
          </div>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{goals.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a goal for today..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            className="flex-1"
          />
          <Button size="sm" onClick={addGoal}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {goals.map(goal => (
            <div key={goal.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50">
              <Checkbox
                checked={goal.completed}
                onCheckedChange={() => toggleGoal(goal.id)}
              />
              <span className={`flex-1 ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                {goal.text}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeGoal(goal.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {goals.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-4">
              No goals set for today. Add one above!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};