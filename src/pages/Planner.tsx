import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock } from "lucide-react";

const Planner = () => {
  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daily Planner</h1>
        <Button size="icon" className="rounded-full">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No tasks scheduled for today. Tap + to add your first task!</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Upcoming
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No upcoming tasks. Start planning your week!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Planner;