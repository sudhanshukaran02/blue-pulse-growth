-- Create NGO table for field worker organizations
CREATE TABLE public.ngos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  field_worker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ngo_name TEXT NOT NULL,
  ngo_type TEXT NOT NULL CHECK (ngo_type IN ('Trust', 'Society', 'Section 8 Company', 'Other')),
  registration_number TEXT NOT NULL,
  date_of_registration DATE,
  act_of_registration TEXT,
  ngo_pan_number TEXT,
  has_12a_80g_registration BOOLEAN DEFAULT FALSE,
  certificate_12a_80g_url TEXT,
  has_fcra_registration BOOLEAN DEFAULT FALSE,
  fcra_certificate_url TEXT,
  registration_certificate_url TEXT,
  registered_office_address TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  key_person_name TEXT NOT NULL,
  key_person_designation TEXT,
  key_person_contact TEXT,
  website_social_links TEXT,
  areas_of_work TEXT[], -- Array for multi-select
  geographic_focus TEXT,
  past_current_projects TEXT,
  annual_report_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(field_worker_id) -- Each field worker can have only one NGO
);

-- Enable RLS
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;

-- Create policies for NGO data
CREATE POLICY "Field workers can view their own NGO data" 
ON public.ngos 
FOR SELECT 
TO authenticated
USING (auth.uid() = field_worker_id);

CREATE POLICY "Field workers can create their own NGO data" 
ON public.ngos 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = field_worker_id);

CREATE POLICY "Field workers can update their own NGO data" 
ON public.ngos 
FOR UPDATE 
TO authenticated
USING (auth.uid() = field_worker_id);

-- Create storage bucket for NGO uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('ngo-uploads', 'ngo-uploads', false);

-- Create storage policies for NGO uploads
CREATE POLICY "Field workers can view their own NGO uploads" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'ngo-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Field workers can upload their own NGO documents" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'ngo-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Field workers can update their own NGO uploads" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'ngo-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ngos_updated_at
BEFORE UPDATE ON public.ngos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();