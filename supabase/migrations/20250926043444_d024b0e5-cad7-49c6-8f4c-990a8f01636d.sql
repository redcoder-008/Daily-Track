-- Fix security warning: Enable RLS on expense_categories table
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for expense_categories (public read access since these are shared categories)
CREATE POLICY "Anyone can view expense categories" 
ON public.expense_categories 
FOR SELECT 
USING (true);