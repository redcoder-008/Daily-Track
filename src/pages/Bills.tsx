import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Camera, Receipt, Folder, Scan } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Bills = () => {
  const { toast } = useToast();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleScanBill = () => {
    setIsCameraOpen(true);
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle the captured image
      console.log('Captured file:', file);
      toast({
        title: "Bill Scanned",
        description: "Your bill has been captured successfully!",
      });
      setIsCameraOpen(false);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Uploaded file:', file);
      toast({
        title: "File Uploaded",
        description: "Your document has been uploaded successfully!",
      });
    }
  };
  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bills & Receipts</h1>
        <Button size="icon" className="rounded-full">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleScanBill}>
              <Camera className="h-6 w-6" />
              <span className="text-sm">Scan Bill</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Scan Your Bill
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Take a photo of your bill or receipt
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => cameraInputRef.current?.click()} 
                  className="w-full"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full"
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Choose from Gallery
                </Button>
              </div>
              
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
            </div>
          </DialogContent>
        </Dialog>
        
        <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleFileUpload}>
          <Folder className="h-6 w-6" />
          <span className="text-sm">Upload File</span>
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

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