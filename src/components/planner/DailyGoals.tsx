import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/database';
import { format } from 'date-fns';

interface Goal {
  id: string;
  text: string;
  completed: boolean;
  goal_date: string;
}

export const DailyGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    try {
      if (user) {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('goal_date', today)
          .order('created_at', { ascending: true });

        if (!error && data) {
          setGoals(data);
        } else {
          const localGoals = await db.goals
            .where({ goal_date: today, user_id: user.id })
            .toArray();
          setGoals(localGoals.map(g => ({
            id: g.id?.toString() || Date.now().toString(),
            text: g.text,
            completed: g.completed,
            goal_date: g.goal_date
          })));
        }
      } else {
        const localGoals = await db.goals.where({ goal_date: today }).toArray();
        setGoals(localGoals.map(g => ({
          id: g.id?.toString() || Date.now().toString(),
          text: g.text,
          completed: g.completed,
          goal_date: g.goal_date
        })));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const addGoal = async () => {
    if (!newGoal.trim() || !user) return;

    try {
      const goalData = {
        text: newGoal.trim(),
        completed: false,
        goal_date: today,
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      await db.goals.add({ ...goalData, synced: false });

      if (navigator.onLine) {
        const { error } = await supabase.from('goals').insert([goalData]);
        if (!error) {
          const addedGoal = await db.goals
            .where({ text: goalData.text, created_at: goalData.created_at })
            .first();
          if (addedGoal?.id) {
            await db.goals.update(addedGoal.id, { synced: true });
          }
        }
      }

      setNewGoal('');
      fetchGoals();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add goal",
        variant: "destructive",
      });
    }
  };

  const toggleGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    try {
      if (user && navigator.onLine) {
        const { error } = await supabase
          .from('goals')
          .update({ completed: !goal.completed })
          .eq('id', id);

        if (error) throw error;
      }

      const localGoals = await db.goals.toArray();
      const localGoal = localGoals.find(g => g.text === goal.text && g.goal_date === goal.goal_date);
      if (localGoal?.id) {
        await db.goals.update(localGoal.id, { completed: !goal.completed });
      }

      fetchGoals();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      });
    }
  };

  const removeGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    try {
      if (user && navigator.onLine) {
        const { error } = await supabase.from('goals').delete().eq('id', id);
        if (error) throw error;
      }

      const localGoals = await db.goals.toArray();
      const localGoal = localGoals.find(g => g.text === goal.text && g.goal_date === goal.goal_date);
      if (localGoal?.id) {
        await db.goals.delete(localGoal.id);
      }

      fetchGoals();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    }
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