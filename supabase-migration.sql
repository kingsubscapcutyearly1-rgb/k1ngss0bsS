-- Create admin_settings table for cross-browser synchronization
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id SERIAL PRIMARY KEY,
    whatsapp_number TEXT DEFAULT '+923276847960',
    whatsapp_direct_order BOOLEAN DEFAULT false,
    enable_purchase_notifications BOOLEAN DEFAULT true,
    enable_floating_cart BOOLEAN DEFAULT true,
    show_discount_badges BOOLEAN DEFAULT true,
    show_breadcrumbs BOOLEAN DEFAULT true,
    popup_settings JSONB DEFAULT '{
        "enabled": true,
        "title": "Limited Time Offer",
        "message": "Get 10% off when you order on WhatsApp within the next 10 minutes.",
        "buttonText": "Order on WhatsApp",
        "buttonHref": "https://wa.me/923276847960?text=I%20want%20to%20claim%20the%20limited%20time%20offer",
        "showTimer": true,
        "timerDuration": 10,
        "trigger": "delay",
        "delaySeconds": 6,
        "frequency": "once-per-session",
        "theme": "dark",
        "pages": ["/", "/tools", "/product/:id"]
    }'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings if table is empty
INSERT INTO public.admin_settings (
    whatsapp_number,
    whatsapp_direct_order,
    enable_purchase_notifications,
    enable_floating_cart,
    show_discount_badges,
    show_breadcrumbs
) 
SELECT 
    '+923276847960',
    false,
    true,
    true,
    true,
    true
WHERE NOT EXISTS (SELECT 1 FROM public.admin_settings);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can make this more restrictive based on your needs)
CREATE POLICY "Allow all operations on admin_settings" ON public.admin_settings
    FOR ALL USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON public.admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the table (for cross-browser sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_settings;

-- Create products table for cross-browser synchronization
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    features TEXT DEFAULT '[]', -- JSON array as text
    image TEXT,
    popular BOOLEAN DEFAULT false,
    badge TEXT,
    price TEXT DEFAULT '{}', -- JSON object as text
    stock TEXT DEFAULT 'false', -- JSON value as text (can be boolean, number, or string)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations on products (you can make this more restrictive based on your needs)
CREATE POLICY "Allow all operations on products" ON public.products
    FOR ALL USING (true);

-- Create trigger to automatically update updated_at for products
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the products table (for cross-browser sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
