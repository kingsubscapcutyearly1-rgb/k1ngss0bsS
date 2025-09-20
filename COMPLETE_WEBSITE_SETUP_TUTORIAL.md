# Complete Website Setup Tutorial
## King Subscription Website - From Scratch to Live

This tutorial will guide you through setting up the King Subscription website from scratch, including cross-browser synchronization for admin settings and product controller.

---

## 📋 Prerequisites
- Basic computer knowledge
- Internet connection
- Text editor (VS Code recommended)

---

## 🚀 Step 1: GitHub Setup

### 1.1 Create GitHub Account
1. Go to https://github.com
2. Click "Sign up"
3. Enter your email, create username, password
4. Verify your email
5. Complete profile setup

### 1.2 Create Repository
1. Click "+" icon → "New repository"
2. Repository name: `kings-subscription-website`
3. Description: `King Subscription Website with Cross-Browser Sync`
4. Make it **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### 1.3 Install Git
**Windows:**
- Download from https://git-scm.com/downloads
- Install with default settings

**macOS:**
```bash
# Using Homebrew
brew install git

# Or download from https://git-scm.com/downloads
```

**Linux:**
```bash
sudo apt update
sudo apt install git
```

### 1.4 Clone Repository
1. Copy repository URL from GitHub
2. Open terminal/command prompt
3. Run these commands:

```bash
# Navigate to desired folder
cd Desktop

# Clone repository
git clone https://github.com/YOUR_USERNAME/kings-subscription-website.git

# Enter project folder
cd kings-subscription-website
```

### 1.5 Download Project Files
Since you already have the project files, copy them to the cloned repository folder.

### 1.6 Push to GitHub
```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial commit: King Subscription Website with Cross-Browser Sync"

# Push to GitHub
git push origin main
```

---

## 🗄️ Step 2: Supabase Setup (Database)

### 2.1 Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with email or GitHub
4. Verify your email

### 2.2 Create Project
1. Click "New project"
2. Project name: `kings-subscription-db`
3. Database password: Create a strong password (save it!)
4. Region: Select closest to your location
5. Click "Create new project"
6. Wait for project to be ready (2-3 minutes)

### 2.3 Get API Credentials
1. Go to Settings → API
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`

### 2.4 Run Database Setup
1. Go to SQL Editor (left sidebar)
2. Click "New Query"
3. Copy and paste this ENTIRE SQL code:

```sql
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
```

4. Click "Run" button
5. You should see "Success. No rows returned" - this is GOOD!

---

## 🌐 Step 3: Vercel Setup (Hosting)

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended) or email
4. Authorize Vercel to access your GitHub

### 3.2 Import Project
1. Click "Import Project"
2. Connect your GitHub account
3. Search for `kings-subscription-website` repository
4. Click "Import"

### 3.3 Configure Project
1. Project name: `kings-subscription` (or your choice)
2. Framework preset: **Vite**
3. Root directory: `./` (leave default)
4. Build command: `npm run build` (leave default)
5. Output directory: `dist` (leave default)
6. Click "Deploy"

### 3.4 Add Environment Variables
1. Go to your project dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add these variables:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `YOUR_SUPABASE_PROJECT_URL` (from step 2.3)
- Environment: Production, Preview, Development

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `YOUR_SUPABASE_ANON_KEY` (from step 2.3)
- Environment: Production, Preview, Development

**Variable 3:**
- Name: `VITE_ADMIN_USERNAME`
- Value: `admin`
- Environment: Production, Preview, Development

**Variable 4:**
- Name: `VITE_ADMIN_PASSWORD`
- Value: `kingsubscription2024`
- Environment: Production, Preview, Development

**Variable 5:**
- Name: `VITE_PRODUCT_CONTROLLER_PASSWORD`
- Value: `KingSubsAdmin2025!`
- Environment: Production, Preview, Development

**Variable 6:**
- Name: `VITE_WHATSAPP_NUMBER`
- Value: `+923276847960`
- Environment: Production, Preview, Development

5. Click "Save"
6. Go to "Deployments" tab
7. Click "Redeploy" on latest deployment

---

## 🔧 Step 4: Admin Credentials Setup

### 4.1 Change Admin Panel Password
To change admin panel password:
1. Open `.env.local` file in your project
2. Change this line:
```
VITE_ADMIN_PASSWORD=your_new_password_here
```
3. Save file
4. Commit and push to GitHub:
```bash
git add .
git commit -m "Update admin password"
git push origin main
```
5. Vercel will auto-redeploy

### 4.2 Change Product Controller Password
To change product controller password:
1. Open `.env.local` file
2. Change this line:
```
VITE_PRODUCT_CONTROLLER_PASSWORD=your_new_password_here
```
3. Save, commit, push (same as above)

### 4.3 Change WhatsApp Number
To change WhatsApp number:
1. Open `.env.local` file
2. Change this line:
```
VITE_WHATSAPP_NUMBER=+your_new_number_here
```
3. Save, commit, push (same as above)

---

## 🧪 Step 5: Testing

### 5.1 Test Admin Panel
1. Go to your Vercel website URL
2. Add `/admin` to URL: `https://your-site.vercel.app/admin`
3. Login with:
   - Username: `admin`
   - Password: `kingsubscription2024` (or your custom password)

### 5.2 Test Product Controller
1. Go to: `https://your-site.vercel.app/product-controller`
2. Login with password: `KingSubsAdmin2025!` (or your custom password)

### 5.3 Test Cross-Browser Sync
1. Open admin panel in Chrome
2. Change a setting (disable purchase notifications)
3. Open same admin panel in Edge/Firefox
4. Change should appear immediately!

### 5.4 Test Product Sync
1. Open Product Controller in Chrome
2. Add a new product
3. Open Product Controller in Edge
4. New product should appear immediately!

---

## 🔄 Step 6: Making Changes

### 6.1 Code Changes
1. Make changes to files in your local repository
2. Test locally if possible
3. Commit and push:
```bash
git add .
git commit -m "Description of changes"
git push origin main
```
4. Vercel will auto-deploy

### 6.2 Database Changes
If you need to modify database structure:
1. Go to Supabase SQL Editor
2. Run your SQL commands
3. Update code if needed
4. Commit and push

### 6.3 Environment Variable Changes
1. Update `.env.local` file
2. Commit and push
3. Update Vercel environment variables
4. Redeploy

---

## 🚨 Troubleshooting

### Issue: Website not loading
- Check Vercel deployment status
- Check environment variables are set correctly
- Check Supabase project is active

### Issue: Admin login not working
- Verify environment variables in Vercel
- Check password in `.env.local` matches Vercel variables

### Issue: Cross-browser sync not working
- Verify Supabase credentials
- Check SQL migration was successful
- Check browser console for errors

### Issue: Products not syncing
- Verify products table exists in Supabase
- Check real-time is enabled for products table

---

## 📁 Project Structure

```
kings-subscription-website/
├── src/
│   ├── components/     # React components
│   ├── context/        # React contexts (Settings, Products)
│   ├── lib/           # Utilities (Supabase client)
│   ├── pages/         # Page components
│   └── data/          # Static data
├── public/            # Static assets
├── .env.local         # Environment variables (local)
├── vercel-env-import.txt  # Vercel import file
├── package.json       # Dependencies
└── vite.config.ts     # Vite configuration
```

---

## 🔐 Security Notes

1. **Never commit `.env.local` to GitHub** (it's already in .gitignore)
2. **Use strong passwords** for admin access
3. **Keep Supabase keys secure** - don't share them
4. **Regularly update passwords** for security
5. **Monitor Supabase usage** to avoid unexpected charges

---

## 💡 Tips

1. **Backup regularly**: Keep backups of your database
2. **Test locally first**: Use `npm run dev` for local testing
3. **Monitor deployments**: Check Vercel dashboard for deployment status
4. **Use Git branches**: For major changes, create feature branches
5. **Document changes**: Keep track of what you modify

---

## 🎉 Congratulations!

Your King Subscription website is now live with:
- ✅ Cross-browser synchronization
- ✅ Real-time admin settings sync
- ✅ Real-time product management sync
- ✅ Professional hosting on Vercel
- ✅ Secure database on Supabase

**Your website URL:** `https://your-project-name.vercel.app`

**Admin Panel:** `https://your-project-name.vercel.app/admin`

**Product Controller:** `https://your-project-name.vercel.app/product-controller`

---

## 📞 Support

If you encounter any issues:
1. Check this tutorial again
2. Check browser console for errors
3. Verify all environment variables are set
4. Check Supabase dashboard for database status
5. Check Vercel deployment logs

**Happy hosting! 🚀**
