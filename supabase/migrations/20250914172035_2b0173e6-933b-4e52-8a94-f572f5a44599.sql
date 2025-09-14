-- Fix security vulnerability in profiles table
-- Remove overly permissive RLS policies and replace with secure ones

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can create profiles" ON public.profiles;

-- Create secure RLS policies for profiles table

-- Allow users to view only their own profile
CREATE POLICY "users_view_own_profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to create their own profile (user_id must match auth.uid())
CREATE POLICY "users_create_own_profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own profile
CREATE POLICY "users_update_own_profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Optional: Create a function to handle new user profile creation automatically
-- This ensures a profile is created when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();