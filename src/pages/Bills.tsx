import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Camera, Receipt, Folder } from "lucide-react";

const Bills = () => {
  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bills & Receipts</h1>
        <Button size="icon" className="rounded-full">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Camera className="h-6 w-6" />
          <span className="text-sm">Scan Bill</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Folder className="h-6 w-6" />
          <span className="text-sm">Upload File</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="h-5 w-5" />
            Recent Bills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No bills or receipts stored yet. Start by scanning or uploading your first document!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bills;