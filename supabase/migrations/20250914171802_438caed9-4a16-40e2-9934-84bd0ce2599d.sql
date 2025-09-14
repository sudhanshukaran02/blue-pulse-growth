-- Fix security vulnerability in credit_purchases table
-- Remove overly permissive RLS policies and replace with secure ones

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Anyone can view credit purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Anyone can create credit purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Anyone can update credit purchases" ON public.credit_purchases;

-- Create secure RLS policies for credit_purchases table

-- Allow buyers to view only their own credit purchases
CREATE POLICY "Buyers can view their own credit purchases" 
ON public.credit_purchases 
FOR SELECT 
USING (auth.uid()::text = buyer_id::text);

-- Allow authenticated users to create credit purchases (buyer_id must match auth.uid())
CREATE POLICY "Users can create their own credit purchases" 
ON public.credit_purchases 
FOR INSERT 
WITH CHECK (auth.uid()::text = buyer_id::text);

-- Allow buyers to update only their own credit purchases (in case of corrections needed)
CREATE POLICY "Buyers can update their own credit purchases" 
ON public.credit_purchases 
FOR UPDATE 
USING (auth.uid()::text = buyer_id::text);

-- Optional: Allow field workers to view credit purchases for their sites
-- This enables site owners to see who bought credits from their restoration sites
CREATE POLICY "Field workers can view purchases for their sites" 
ON public.credit_purchases 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.sites 
    WHERE sites.id::text = credit_purchases.site_id::text 
    AND sites.field_worker_id = auth.uid()
  )
);