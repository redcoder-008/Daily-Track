import React, { useState, useEffect } from "react";
import Greeting from "@/components/Greeting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, TrendingUp, PieChart, Edit, Trash2, Wallet, TrendingDown, Eye, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";

interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface Expense {
  id: string;
  amount: number;
  description?: string | null;
  expense_date: string;
  created_at: string;
  expense_categories: ExpenseCategory;
}

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

interface Income {
  id: string;
  amount: number;
  description?: string | null;
  income_date: string;
  created_at: string;
}

const Expenses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [viewExpense, setViewExpense] = useState<Expense | null>(null);
  const [viewBill, setViewBill] = useState<Bill | null>(null);
  const [billImageUrl, setBillImageUrl] = useState<string | null>(null);
  
  // Form state for expenses
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [expenseDate, setExpenseDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Form state for income
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeDate, setIncomeDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchExpenses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          expense_categories (
            id,
            name,
            color,
            icon
          )
        `)
        .eq('user_id', user.id)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch expenses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIncome = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id)
        .order('income_date', { ascending: false });

      if (error) throw error;
      setIncome(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch income",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
    fetchIncome();
  }, [user]);

  const resetExpenseForm = () => {
    setAmount("");
    setDescription("");
    setCategoryId("");
    setExpenseDate(format(new Date(), 'yyyy-MM-dd'));
    setEditingExpense(null);
  };

  const resetIncomeForm = () => {
    setIncomeAmount("");
    setIncomeDescription("");
    setIncomeDate(format(new Date(), 'yyyy-MM-dd'));
    setEditingIncome(null);
  };

  const handleSubmit = async () => {
    if (!user || !amount.trim() || !categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const expenseData = {
        amount: parseFloat(amount),
        description: description.trim() || null,
        category_id: categoryId,
        expense_date: expenseDate,
        user_id: user.id,
      };

      if (editingExpense) {
        const { error } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', editingExpense.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Expense updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('expenses')
          .insert([expenseData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Expense added successfully",
        });
      }

      resetExpenseForm();
      setIsExpenseDialogOpen(false);
      fetchExpenses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save expense",
        variant: "destructive",
      });
    }
  };

  const handleIncomeSubmit = async () => {
    if (!user || !incomeAmount.trim()) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const incomeData = {
        amount: parseFloat(incomeAmount),
        description: incomeDescription.trim() || null,
        income_date: incomeDate,
        user_id: user.id,
      };

      if (editingIncome) {
        const { error } = await supabase
          .from('income')
          .update(incomeData)
          .eq('id', editingIncome.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Income updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('income')
          .insert([incomeData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Income added successfully",
        });
      }

      resetIncomeForm();
      setIsIncomeDialogOpen(false);
      fetchIncome();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save income",
        variant: "destructive",
      });
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
      fetchExpenses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  const deleteIncome = async (incomeId: string) => {
    try {
      const { error } = await supabase
        .from('income')
        .delete()
        .eq('id', incomeId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Income deleted successfully",
      });
      fetchIncome();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete income",
        variant: "destructive",
      });
    }
  };

  const viewExpenseDetails = async (expense: Expense) => {
    setViewExpense(expense);
    
    // Check if this expense is from a bill
    if (expense.description?.startsWith('Bill:')) {
      const billTitle = expense.description.replace('Bill: ', '');
      try {
        // Find the associated bill
        const { data: bills, error } = await supabase
          .from('bills')
          .select('*')
          .eq('user_id', user!.id)
          .ilike('title', `%${billTitle}%`)
          .limit(1);

        if (error) throw error;

        if (bills && bills.length > 0) {
          const bill = bills[0];
          setViewBill(bill);
          
          // Get signed URL for the bill image
          const { data: signedUrlData, error: urlError } = await supabase.storage
            .from('bills')
            .createSignedUrl(bill.file_path, 60 * 60); // 1 hour expiry

          if (urlError) throw urlError;
          setBillImageUrl(signedUrlData.signedUrl);
        }
      } catch (error) {
        console.error('Error fetching bill details:', error);
      }
    }
  };

  const editExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setDescription(expense.description || "");
    setCategoryId(expense.expense_categories.id);
    setExpenseDate(expense.expense_date);
    setIsExpenseDialogOpen(true);
  };

  const editIncome = (incomeItem: Income) => {
    setEditingIncome(incomeItem);
    setIncomeAmount(incomeItem.amount.toString());
    setIncomeDescription(incomeItem.description || "");
    setIncomeDate(incomeItem.income_date);
    setIsIncomeDialogOpen(true);
  };

  // Calculate monthly total
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = parseISO(expense.expense_date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });
  
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate monthly income
  const monthlyIncome = income.filter(incomeItem => {
    const incomeDate = parseISO(incomeItem.income_date);
    return incomeDate >= monthStart && incomeDate <= monthEnd;
  });
  
  const monthlyIncomeTotal = monthlyIncome.reduce((sum, incomeItem) => sum + incomeItem.amount, 0);
  const remainingIncome = monthlyIncomeTotal - monthlyTotal;

  // Calculate category totals
  const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
    const categoryName = expense.expense_categories.name;
    acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

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
      <Greeting />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Money Manager</h1>
        <div className="flex gap-2">
          <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline" className="rounded-full" onClick={resetIncomeForm}>
                <Wallet className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingIncome ? 'Edit Income' : 'Add Income'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="income-amount">Amount (₹)</Label>
                  <Input
                    id="income-amount"
                    type="number"
                    step="0.01"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="income-description">Description (optional)</Label>
                  <Input
                    id="income-description"
                    value={incomeDescription}
                    onChange={(e) => setIncomeDescription(e.target.value)}
                    placeholder="Source of income"
                  />
                </div>
                
                <div>
                  <Label htmlFor="income-date">Date</Label>
                  <Input
                    id="income-date"
                    type="date"
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleIncomeSubmit} className="w-full">
                  {editingIncome ? 'Update Income' : 'Add Income'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full" onClick={resetExpenseForm}>
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What did you spend on?"
                  />
                </div>
                
                <div>
                  <Label htmlFor="expense-date">Date</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleSubmit} className="w-full">
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Income, Expenses, and Remaining Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="h-5 w-5 text-green-600" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">₹{monthlyIncomeTotal.toFixed(2)}</div>
            <p className="text-muted-foreground">
              {monthlyIncome.length} income entries this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">₹{monthlyTotal.toFixed(2)}</div>
            <p className="text-muted-foreground">
              {monthlyExpenses.length} expenses this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${remainingIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{remainingIncome.toFixed(2)}
            </div>
            <p className="text-muted-foreground">
              {remainingIncome >= 0 ? 'Money left' : 'Over budget'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              Top Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCategories.length === 0 ? (
              <p className="text-muted-foreground text-sm">No expenses yet</p>
            ) : (
              <div className="space-y-2">
                {topCategories.map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm">₹{amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
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
            {monthlyExpenses.length === 0 ? (
              <p className="text-muted-foreground text-sm">Add expenses to see charts</p>
            ) : (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Daily avg:</span>
                  <span className="font-medium ml-1">
                    ₹{(monthlyTotal / new Date().getDate()).toFixed(2)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Categories:</span>
                  <span className="font-medium ml-1">{Object.keys(categoryTotals).length}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {expenses.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.slice(0, 10).map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onEdit={editExpense}
                  onDelete={deleteExpense}
                  onView={viewExpenseDetails}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {income.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {income.slice(0, 10).map((incomeItem) => (
                <IncomeItem
                  key={incomeItem.id}
                  income={incomeItem}
                  onEdit={editIncome}
                  onDelete={deleteIncome}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* View Expense Dialog */}
      <Dialog open={!!viewExpense} onOpenChange={() => { 
        setViewExpense(null); 
        setViewBill(null); 
        setBillImageUrl(null); 
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Expense Details
            </DialogTitle>
          </DialogHeader>
          {viewExpense && (
            <div className="space-y-4">
              {/* Bill Image if available */}
              {viewBill && billImageUrl && (
                <div className="w-full">
                  <Label className="text-sm font-medium text-muted-foreground">Bill/Receipt</Label>
                  <img 
                    src={billImageUrl} 
                    alt={viewBill.title}
                    className="w-full max-h-96 object-contain rounded-lg border mt-2"
                  />
                </div>
              )}
              
              {/* Expense Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <p className="font-medium text-red-600">₹{viewExpense.amount.toFixed(2)}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: viewExpense.expense_categories.color }}
                    />
                    <p className="font-medium">{viewExpense.expense_categories.name}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <p className="font-medium">{format(parseISO(viewExpense.expense_date), 'PPP')}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Added</Label>
                  <p className="font-medium">{format(parseISO(viewExpense.created_at), 'PPP')}</p>
                </div>
              </div>
              
              {viewExpense.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="font-medium mt-1">{viewExpense.description}</p>
                </div>
              )}
              
              {/* Bill Details if available */}
              {viewBill && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-muted-foreground">Bill Information</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                      <p className="font-medium">{viewBill.title}</p>
                    </div>
                    
                    {viewBill.bill_date && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Bill Date</Label>
                        <p className="font-medium">{format(parseISO(viewBill.bill_date), 'PPP')}</p>
                      </div>
                    )}
                    
                    {viewBill.tags && viewBill.tags.length > 0 && (
                      <div className="col-span-2">
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
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  editExpense(viewExpense);
                  setViewExpense(null);
                  setViewBill(null);
                  setBillImageUrl(null);
                }} variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Expense
                </Button>
                <Button 
                  onClick={() => {
                    deleteExpense(viewExpense.id);
                    setViewExpense(null);
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

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
  onView: (expense: Expense) => void;
}

const ExpenseItem = ({ expense, onEdit, onDelete, onView }: ExpenseItemProps) => {
  const isBillExpense = expense.description?.startsWith('Bill:');
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-white">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${expense.expense_categories.color}20` }}
        >
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: expense.expense_categories.color }}
          />
        </div>
        <div>
          <h3 className="font-medium">
            {expense.description || expense.expense_categories.name}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {expense.expense_categories.name}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {format(parseISO(expense.expense_date), 'MMM dd')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="font-semibold">₹{expense.amount.toFixed(2)}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onView(expense)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(expense.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface IncomeItemProps {
  income: Income;
  onEdit: (income: Income) => void;
  onDelete: (incomeId: string) => void;
}

const IncomeItem = ({ income, onEdit, onDelete }: IncomeItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
          <Wallet className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-medium">
            {income.description || 'Income'}
          </h3>
          <span className="text-sm text-muted-foreground">
            {format(parseISO(income.income_date), 'MMM dd')}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="font-semibold text-green-600">+₹{income.amount.toFixed(2)}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(income)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(income.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Expenses;