import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Camera, Receipt, Folder, Scan, Edit, Trash2, Download, Eye, Filter } from "lucide-react";
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
  const [showAllBills, setShowAllBills] = useState(false);
  const [viewBill, setViewBill] = useState<Bill | null>(null);
  const [billImageUrl, setBillImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [billDate, setBillDate] = useState("");
  const [tags, setTags] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    setCapturedImage(null);
    setSelectedFile(null);
  };

  const createExpenseFromBill = async (billAmount: number, billTitle: string, billDate: string) => {
    try {
      // Get "Bills" category or create one if it doesn't exist
      let { data: categories, error: categoryError } = await supabase
        .from('expense_categories')
        .select('*')
        .eq('name', 'Bills')
        .single();

      if (categoryError || !categories) {
        // Create Bills category if it doesn't exist
        const { data: newCategory, error: createError } = await supabase
          .from('expense_categories')
          .insert([{ name: 'Bills', color: '#ef4444', icon: 'receipt' }])
          .select()
          .single();

        if (createError) throw createError;
        categories = newCategory;
      }

      // Create expense entry
      const { error: expenseError } = await supabase
        .from('expenses')
        .insert([{
          amount: billAmount,
          description: `Bill: ${billTitle}`,
          category_id: categories.id,
          expense_date: billDate || new Date().toISOString().split('T')[0],
          user_id: user!.id,
        }]);

      if (expenseError) throw expenseError;

      toast({
        title: "Expense Added",
        description: `₹${billAmount.toFixed(2)} expense added automatically from bill`,
      });
    } catch (error) {
      console.error('Error creating expense from bill:', error);
      // Don't show error toast as this is secondary functionality
    }
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

      // If amount is provided, create an expense entry
      if (amount && parseFloat(amount) > 0) {
        await createExpenseFromBill(
          parseFloat(amount),
          title || file.name,
          billDate
        );
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

  const handleUploadSelectedFile = () => {
    if (selectedFile) {
      uploadFile(selectedFile);
    }
  };

  const handleScanBill = () => {
    resetForm();
    setIsCameraOpen(true);
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL for the captured image
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      setSelectedFile(file);
      
      // Clear the input so same file can be selected again
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL for the selected file
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      setSelectedFile(file);
      setIsCameraOpen(true);
      
      // Clear the input so same file can be selected again
      if (event.target) {
        event.target.value = '';
      }
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

  const viewBillDetails = async (bill: Bill) => {
    try {
      const { data, error } = await supabase.storage
        .from('bills')
        .createSignedUrl(bill.file_path, 60 * 60); // 1 hour expiry

      if (error) throw error;

      setBillImageUrl(data.signedUrl);
      setViewBill(bill);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bill image",
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
              
              {/* Camera/Image Preview */}
              <div className="text-center">
                {capturedImage ? (
                  <div className="space-y-4">
                    <div className="w-full max-w-sm mx-auto">
                      <img 
                        src={capturedImage} 
                        alt="Captured bill" 
                        className="w-full h-48 object-cover rounded-lg border-2 border-primary/20"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Image captured! Fill in the details and upload.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Take a photo of your bill or receipt
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {!capturedImage ? (
                  <>
                    <Button 
                      onClick={() => cameraInputRef.current?.click()} 
                      className="w-full"
                      disabled={isUploading}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
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
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={handleUploadSelectedFile}
                      className="w-full"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Bill'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCapturedImage(null);
                        setSelectedFile(null);
                      }}
                      className="w-full"
                      disabled={isUploading}
                    >
                      Retake Photo
                    </Button>
                  </>
                )}
              </div>
              
                <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg">
              <Receipt className="h-5 w-5" />
              {showAllBills ? 'All Bills' : 'Recent Bills'}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAllBills(!showAllBills)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showAllBills ? 'Show Recent' : 'View All'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bills.length === 0 ? (
            <p className="text-muted-foreground">No bills or receipts stored yet. Start by scanning or uploading your first document!</p>
          ) : (
            <div className="space-y-3">
              {(showAllBills ? bills : bills.slice(0, 5)).map((bill) => (
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
                      {bill.tags && bill.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {bill.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => viewBillDetails(bill)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => downloadBill(bill)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteBill(bill.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!showAllBills && bills.length > 5 && (
                <div className="text-center pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAllBills(true)}
                    className="text-muted-foreground"
                  >
                    +{bills.length - 5} more bills
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Bill Dialog */}
      <Dialog open={!!viewBill} onOpenChange={() => { setViewBill(null); setBillImageUrl(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {viewBill?.title}
            </DialogTitle>
          </DialogHeader>
          {viewBill && (
            <div className="space-y-4">
              {/* Bill Image */}
              {billImageUrl && (
                <div className="w-full">
                  <img 
                    src={billImageUrl} 
                    alt={viewBill.title}
                    className="w-full max-h-96 object-contain rounded-lg border"
                  />
                </div>
              )}
              
              {/* Bill Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                  <p className="font-medium">{viewBill.title}</p>
                </div>
                
                {viewBill.amount && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                    <p className="font-medium text-green-600">₹{viewBill.amount.toFixed(2)}</p>
                  </div>
                )}
                
                {viewBill.bill_date && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Bill Date</Label>
                    <p className="font-medium">{format(parseISO(viewBill.bill_date), 'PPP')}</p>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Uploaded</Label>
                  <p className="font-medium">{format(parseISO(viewBill.created_at), 'PPP')}</p>
                </div>
                
                {viewBill.file_type && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">File Type</Label>
                    <p className="font-medium capitalize">{viewBill.file_type}</p>
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {viewBill.tags && viewBill.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewBill.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => downloadBill(viewBill)} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={() => {
                    deleteBill(viewBill.id);
                    setViewBill(null);
                    setBillImageUrl(null);
                  }} 
                  variant="destructive" 
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bills;