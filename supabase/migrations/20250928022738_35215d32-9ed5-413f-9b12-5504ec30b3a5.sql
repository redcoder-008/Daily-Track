-- Insert Bills category if it doesn't exist
INSERT INTO public.expense_categories (name, color, icon)
SELECT 'Bills', '#ef4444', 'receipt'
WHERE NOT EXISTS (
  SELECT 1 FROM public.expense_categories WHERE name = 'Bills'
);