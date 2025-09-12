-- Fix security issue: Remove overly permissive RLS policies for buyers table
-- and replace with secure, authentication-based policies

-- Drop the existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view buyers" ON public.buyers;
DROP POLICY IF EXISTS "Anyone can create buyers" ON public.buyers;
DROP POLICY IF EXISTS "Anyone can update buyers" ON public.buyers;

-- Create secure RLS policies that require authentication
-- Buyers can only view their own data
CREATE POLICY "Users can view their own buyer profile" 
ON public.buyers 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- Buyers can create their own profile
CREATE POLICY "Users can create their own buyer profile" 
ON public.buyers 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

-- Buyers can update their own profile
CREATE POLICY "Users can update their own buyer profile" 
ON public.buyers 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Add user_id column to properly link buyers to authenticated users
-- (Note: Using id as the user reference for now, but this should be a separate user_id column)
-- This migration assumes the id field will be used as the user identifier