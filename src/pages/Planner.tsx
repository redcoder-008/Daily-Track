import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, CheckCircle2, Circle, Edit, Trash2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import { PomodoroTimer } from "@/components/planner/PomodoroTimer";
import { DailyGoals } from "@/components/planner/DailyGoals";
import { HabitTracker } from "@/components/planner/HabitTracker";
import { QuoteOfTheDay } from "@/components/planner/QuoteOfTheDay";
import { DailySummary } from "@/components/planner/DailySummary";
import { MiniCalendar } from "@/components/planner/MiniCalendar";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  completed: boolean;
  priority: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Planner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority('medium');
    setEditingTask(null);
  };

  const handleSubmit = async () => {
    if (!user || !title.trim()) return;

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate || null,
        priority,
        user_id: user.id,
      };

      if (editingTask) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', editingTask.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([taskData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      });
    }
  };

  const toggleTaskComplete = async (task: Task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);

      if (error) throw error;
      fetchTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      fetchTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.due_date ? format(parseISO(task.due_date), 'yyyy-MM-dd') : "");
    setPriority(task.priority as 'low' | 'medium' | 'high');
    setIsDialogOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDateLabel = (dateString?: string) => {
    if (!dateString) return null;
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date)) return "Overdue";
    return format(date, 'MMM dd');
  };

  const todayTasks = tasks.filter(task => 
    task.due_date && isToday(parseISO(task.due_date))
  );
  
  const upcomingTasks = tasks.filter(task => 
    task.due_date && !isToday(parseISO(task.due_date)) && !isPast(parseISO(task.due_date))
  );
  
  const overdueTasks = tasks.filter(task => 
    task.due_date && isPast(parseISO(task.due_date)) && !task.completed
  );

  if (isLoading) {
    return (
      <div className="p-4 pb-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.completed).length;
  const taskDates = tasks.filter(task => task.due_date).map(task => parseISO(task.due_date!));

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Daily Planner
          </h1>
          <p className="text-muted-foreground">Your productivity hub for today</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg" onClick={resetForm}>
              <Plus className="h-5 w-5 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="high">🔴 High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleSubmit} className="w-full" size="lg">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quote of the Day */}
      <QuoteOfTheDay />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks and Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Goals */}
          <DailyGoals />

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-red-700">
                  <Clock className="h-5 w-5" />
                  Overdue Tasks ({overdueTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overdueTasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={toggleTaskComplete}
                    onEdit={editTask}
                    onDelete={deleteTask}
                    getPriorityColor={getPriorityColor}
                    getDateLabel={getDateLabel}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Today's Tasks */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Today's Focus ({todayTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayTasks.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Ready for a productive day!</p>
                  <p className="text-sm text-muted-foreground">Add your first task above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map((task) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTaskComplete}
                      onEdit={editTask}
                      onDelete={deleteTask}
                      getPriorityColor={getPriorityColor}
                      getDateLabel={getDateLabel}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Coming Up ({upcomingTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  All caught up! 🎉
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTaskComplete}
                      onEdit={editTask}
                      onDelete={deleteTask}
                      getPriorityColor={getPriorityColor}
                      getDateLabel={getDateLabel}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tools and Widgets */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <MiniCalendar highlightedDates={taskDates} />
          
          {/* Pomodoro Timer */}
          <PomodoroTimer />
          
          {/* Habit Tracker */}
          <HabitTracker />
          
          {/* Daily Summary */}
          <DailySummary 
            completedTasks={completedTasks}
            totalTasks={tasks.length}
            completedGoals={0}
            totalGoals={0}
            completedHabits={0}
            totalHabits={4}
          />
        </div>
      </div>
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  getPriorityColor: (priority: string) => string;
  getDateLabel: (dateString?: string) => string | null;
}

const TaskItem = ({ task, onToggle, onEdit, onDelete, getPriorityColor, getDateLabel }: TaskItemProps) => {
  const dateLabel = getDateLabel(task.due_date);
  
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'}`}>
      <button
        onClick={() => onToggle(task)}
        className="mt-0.5 text-primary hover:text-primary/80"
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
        </div>
        
        {task.description && (
          <p className={`text-sm text-gray-600 mb-2 ${task.completed ? 'line-through' : ''}`}>
            {task.description}
          </p>
        )}
        
        <div className="flex items-center gap-2">
          {dateLabel && (
            <Badge variant={dateLabel === 'Overdue' ? 'destructive' : 'secondary'} className="text-xs">
              {dateLabel}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs capitalize">
            {task.priority}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Planner;