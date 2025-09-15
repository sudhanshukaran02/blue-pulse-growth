-- Fix security vulnerability: Restrict access to field_workers table
-- Replace overly permissive policies with authentication-based policies

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can create field workers" ON public.field_workers;
DROP POLICY IF EXISTS "Anyone can update field workers" ON public.field_workers;
DROP POLICY IF EXISTS "Anyone can view field workers" ON public.field_workers;

-- Create secure policies that require authentication
-- Field workers can only access their own records
CREATE POLICY "Field workers can view their own profile" 
ON public.field_workers 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Field workers can update their own profile" 
ON public.field_workers 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Field workers can create their own profile" 
ON public.field_workers 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Note: DELETE policy intentionally omitted to prevent accidental data loss
-- Field worker profiles should be deactivated rather than deleted