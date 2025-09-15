-- Fix security vulnerability in credit_purchases table
-- First check and drop ALL existing policies, then create secure ones

-- Drop ALL existing policies on credit_purchases table
DROP POLICY IF EXISTS "Anyone can view credit purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Anyone can create credit purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Anyone can update credit purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Buyers can view their own credit purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Users can create their own credit purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Buyers can update their own credit purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Field workers can view purchases for their sites" ON public.credit_purchases;

-- Create secure RLS policies for credit_purchases table

-- Allow buyers to view only their own credit purchases
CREATE POLICY "Buyers can view own purchases" 
ON public.credit_purchases 
FOR SELECT 
USING (auth.uid()::text = buyer_id::text);

-- Allow authenticated users to create credit purchases (buyer_id must match auth.uid())
CREATE POLICY "Users can create own purchases" 
ON public.credit_purchases 
FOR INSERT 
WITH CHECK (auth.uid()::text = buyer_id::text);

-- Allow buyers to update only their own credit purchases (limited cases)
CREATE POLICY "Buyers can update own purchases" 
ON public.credit_purchases 
FOR UPDATE 
USING (auth.uid()::text = buyer_id::text);

-- Allow field workers to view credit purchases for their sites
CREATE POLICY "Field workers can view site purchases" 
ON public.credit_purchases 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.sites 
    WHERE sites.id::text = credit_purchases.site_id::text 
    AND sites.field_worker_id = auth.uid()
  )
);