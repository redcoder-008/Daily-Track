import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Camera, Receipt, Folder, Scan, Edit, Trash2, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO } from "date-fns";

interface Bill {
  id: string;
  title: string;
  file_path: string;
  file_type: string | null;
  amount: number | null;
  bill_date: string | null;
  tags: string[] | null;
  created_at: string;
}

const Bills = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [billDate, setBillDate] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    fetchBills();
  }, [user]);

  const fetchBills = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBills(data || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bills",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setBillDate("");
    setTags("");
  };

  const uploadFile = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);
      formData.append('amount', amount);
      formData.append('billDate', billDate);
      formData.append('tags', tags);

      const response = await supabase.functions.invoke('upload-bill', {
        body: formData,
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Success",
        description: "Bill uploaded successfully!",
      });
      
      resetForm();
      setIsCameraOpen(false);
      fetchBills();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload bill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleScanBill = () => {
    resetForm();
    setIsCameraOpen(true);
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const deleteBill = async (billId: string) => {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', billId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Bill deleted successfully",
      });
      fetchBills();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bill",
        variant: "destructive",
      });
    }
  };

  const downloadBill = async (bill: Bill) => {
    try {
      const { data, error } = await supabase.storage
        .from('bills')
        .download(bill.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = bill.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download bill",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="space-y-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Bill description"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billDate">Date (optional)</Label>
                <Input
                  id="billDate"
                  type="date"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="grocery, utilities, etc."
                />
              </div>
              
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
                  disabled={isUploading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Take Photo'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full"
                  disabled={isUploading}
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
        
        <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleFileUpload} disabled={isUploading}>
          <Folder className="h-6 w-6" />
          <span className="text-sm">{isUploading ? 'Uploading...' : 'Upload File'}</span>
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
          {bills.length === 0 ? (
            <p className="text-muted-foreground">No bills or receipts stored yet. Start by scanning or uploading your first document!</p>
          ) : (
            <div className="space-y-3">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                      <Receipt className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{bill.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {bill.amount && <span>₹{bill.amount.toFixed(2)}</span>}
                        {bill.bill_date && <span>{format(parseISO(bill.bill_date), 'MMM dd, yyyy')}</span>}
                        <span>{format(parseISO(bill.created_at), 'MMM dd')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => downloadBill(bill)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteBill(bill.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Bills;