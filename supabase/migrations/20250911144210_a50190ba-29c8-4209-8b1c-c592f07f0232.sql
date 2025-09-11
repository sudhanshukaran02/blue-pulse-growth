-- Enable RLS on sites table (if not already enabled)
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sites table to allow public access for this demo
CREATE POLICY "Anyone can view sites" 
ON public.sites 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create sites" 
ON public.sites 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update sites" 
ON public.sites 
FOR UPDATE 
USING (true);