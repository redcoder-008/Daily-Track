import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Play, Pause, RotateCcw, Coffee, Settings } from 'lucide-react';

export const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Custom timer settings
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          if (isBreak) {
            setMinutes(workDuration);
            setIsBreak(false);
          } else {
            setMinutes(breakDuration);
            setIsBreak(true);
          }
          // Play notification sound
          new Audio('/notification.mp3').play().catch(() => {});
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }
    
    return () => clearInterval(interval!);
  }, [isActive, minutes, seconds, isBreak]);

  const reset = () => {
    setIsActive(false);
    setMinutes(isBreak ? breakDuration : workDuration);
    setSeconds(0);
    setIsBreak(false);
  };

  const applySettings = () => {
    setMinutes(workDuration);
    setSeconds(0);
    setIsActive(false);
    setIsBreak(false);
    setIsSettingsOpen(false);
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Pomodoro Timer
          </div>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="work-duration">Work Duration (minutes)</Label>
                  <Input
                    id="work-duration"
                    type="number"
                    min="1"
                    max="60"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="break-duration">Break Duration (minutes)</Label>
                  <Input
                    id="break-duration"
                    type="number"
                    min="1"
                    max="30"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="long-break-duration">Long Break Duration (minutes)</Label>
                  <Input
                    id="long-break-duration"
                    type="number"
                    min="10"
                    max="60"
                    value={longBreakDuration}
                    onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <Button onClick={applySettings} className="w-full">
                  Apply Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-primary">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isBreak ? 'Break Time' : 'Focus Time'}
          </p>
        </div>
        
        <div className="flex justify-center gap-2">
          <Button onClick={toggle} size="sm" variant={isActive ? "secondary" : "default"}>
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button onClick={reset} size="sm" variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};