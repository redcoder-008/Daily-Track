import { useEffect, useState } from 'react';
import { db, offlineUtils } from '@/lib/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useOfflineSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user } = useAuth();
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (user) {
        syncData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "You're now offline. Data will be saved locally.",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  const syncData = async () => {
    if (!user || !isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      // Sync tasks
      const unsyncedTasks = await offlineUtils.getUnsyncedItems(db.tasks);
      for (const task of unsyncedTasks) {
        try {
          const { data, error } = await supabase
            .from('tasks')
            .insert({
              title: task.title,
              description: task.description,
              completed: task.completed,
              priority: task.priority,
              due_date: task.due_date,
              user_id: user.id
            });

          if (!error && task.id) {
            await offlineUtils.markAsSynced(db.tasks, task.id);
          }
        } catch (error) {
          console.error('Failed to sync task:', error);
        }
      }

      // Sync expenses
      const unsyncedExpenses = await offlineUtils.getUnsyncedItems(db.expenses);
      for (const expense of unsyncedExpenses) {
        try {
          const { error } = await supabase
            .from('expenses')
            .insert({
              amount: expense.amount,
              category_id: expense.category,
              description: expense.title,
              expense_date: expense.expense_date,
              user_id: user.id
            });

          if (!error && expense.id) {
            await offlineUtils.markAsSynced(db.expenses, expense.id);
          }
        } catch (error) {
          console.error('Failed to sync expense:', error);
        }
      }

      // Sync income
      const unsyncedIncome = await offlineUtils.getUnsyncedItems(db.income);
      for (const income of unsyncedIncome) {
        try {
          const { error } = await supabase
            .from('income')
            .insert({
              amount: income.amount,
              source_id: income.source,
              description: income.title,
              income_date: income.income_date,
              user_id: user.id
            });

          if (!error && income.id) {
            await offlineUtils.markAsSynced(db.income, income.id);
          }
        } catch (error) {
          console.error('Failed to sync income:', error);
        }
      }

      // Sync notes
      const unsyncedNotes = await offlineUtils.getUnsyncedItems(db.notes);
      for (const note of unsyncedNotes) {
        try {
          const { error } = await supabase
            .from('notes')
            .insert({
              title: note.title,
              content: note.content,
              user_id: user.id
            });

          if (!error && note.id) {
            await offlineUtils.markAsSynced(db.notes, note.id);
          }
        } catch (error) {
          console.error('Failed to sync note:', error);
        }
      }

      if (unsyncedTasks.length > 0 || unsyncedExpenses.length > 0 || unsyncedIncome.length > 0 || unsyncedNotes.length > 0) {
        toast({
          title: "Sync Complete",
          description: "Your offline data has been synchronized.",
        });
      }

    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Some data couldn't be synchronized. Will retry later.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    isSyncing,
    syncData
  };
};