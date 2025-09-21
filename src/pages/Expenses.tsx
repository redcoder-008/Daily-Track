import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, TrendingUp, PieChart } from "lucide-react";

const Expenses = () => {
  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <Button size="icon" className="rounded-full">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$0.00</div>
          <p className="text-muted-foreground">Total expenses this month</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No expenses yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <PieChart className="h-4 w-4" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Add expenses to see charts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;