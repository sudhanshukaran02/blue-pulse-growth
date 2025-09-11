-- Add RLS policies for all tables that need them

-- Field workers policies (public access for demo)
CREATE POLICY "Anyone can view field workers" ON public.field_workers FOR SELECT USING (true);
CREATE POLICY "Anyone can create field workers" ON public.field_workers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update field workers" ON public.field_workers FOR UPDATE USING (true);

-- Field data policies (public access for demo)
CREATE POLICY "Anyone can view field data" ON public.field_data FOR SELECT USING (true);
CREATE POLICY "Anyone can create field data" ON public.field_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update field data" ON public.field_data FOR UPDATE USING (true);

-- NDVI data policies (public access for demo)
CREATE POLICY "Anyone can view ndvi data" ON public.ndvi_data FOR SELECT USING (true);
CREATE POLICY "Anyone can create ndvi data" ON public.ndvi_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update ndvi data" ON public.ndvi_data FOR UPDATE USING (true);

-- Buyers policies (public access for demo)
CREATE POLICY "Anyone can view buyers" ON public.buyers FOR SELECT USING (true);
CREATE POLICY "Anyone can create buyers" ON public.buyers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update buyers" ON public.buyers FOR UPDATE USING (true);

-- Credit purchases policies (public access for demo)
CREATE POLICY "Anyone can view credit purchases" ON public.credit_purchases FOR SELECT USING (true);
CREATE POLICY "Anyone can create credit purchases" ON public.credit_purchases FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update credit purchases" ON public.credit_purchases FOR UPDATE USING (true);

-- Profiles policies (public access for demo)
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can create profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profiles" ON public.profiles FOR UPDATE USING (true);