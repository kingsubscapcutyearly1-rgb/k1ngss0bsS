# SQL Migration Steps - Supabase Setup

## 📋 STEP-BY-STEP SQL MIGRATION GUIDE

Follow these exact steps to set up your Supabase database.

---

## 🔧 STEP 1: ACCESS SUPABASE SQL EDITOR

1. Go to [supabase.com](https://supabase.com) and login
2. Select your project: `king-subscription`
3. In the left sidebar, click **"SQL Editor"**
4. Click **"New Query"** button

---

## 📄 STEP 2: COPY & PASTE SQL MIGRATION

### **Important Notes:**
- ✅ Copy the **ENTIRE** content from `supabase-migration.sql`
- ✅ Paste it **ALL AT ONCE** into the SQL Editor
- ✅ Do **NOT** run it in parts
- ✅ Click **"Run"** button once

### **Expected Output:**
```
-- Creating tables...
-- ✅ admin_settings table created
-- ✅ products table created
-- ✅ seo_settings table created
-- ✅ blog_posts table created
-- ✅ popup_settings table created

-- Setting up RLS policies...
-- ✅ RLS policies applied

-- Inserting initial data...
-- ✅ Initial data inserted

-- Migration completed successfully!
```

---

## 🔍 STEP 3: VERIFY MIGRATION SUCCESS

### **Check Tables Created:**
1. Go to **"Table Editor"** in Supabase dashboard
2. You should see these 5 tables:
   - ✅ `admin_settings`
   - ✅ `products`
   - ✅ `seo_settings`
   - ✅ `blog_posts`
   - ✅ `popup_settings`

### **Check Initial Data:**
1. Click on each table to verify data is inserted
2. `admin_settings` should have 1 row
3. `products` should have sample products
4. Other tables should have initial configurations

---

## ⚠️ TROUBLESHOOTING

### **If Migration Fails:**

#### **Error: Table already exists**
**Solution:**
```sql
-- Drop existing tables first
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS seo_settings CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS popup_settings CASCADE;

-- Then run the full migration again
```

#### **Error: Permission denied**
**Solution:**
- Make sure you're logged in as project owner
- Check if you have proper permissions
- Try creating a new query and running again

#### **Error: Syntax error**
**Solution:**
- Ensure you copied the entire file content
- Check for any missing semicolons
- Remove any extra characters at beginning/end

---

## 🔐 STEP 4: SETUP ROW LEVEL SECURITY

### **Verify RLS Policies:**
1. Go to **"Authentication"** → **"Policies"**
2. You should see policies for each table:
   - ✅ `admin_settings` policies
   - ✅ `products` policies
   - ✅ `seo_settings` policies
   - ✅ `blog_posts` policies
   - ✅ `popup_settings` policies

### **Test RLS:**
1. Go to **"Table Editor"**
2. Try inserting/updating data
3. Policies should control access properly

---

## 🌐 STEP 5: GET API CREDENTIALS

### **Get Required Keys:**
1. Go to **"Settings"** → **"API"**
2. Copy these values:

#### **Required for Vercel:**
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Keep Secure (Service Role):**
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ VERIFICATION CHECKLIST

After running migration, verify:

- [ ] ✅ 5 tables created successfully
- [ ] ✅ RLS policies applied
- [ ] ✅ Initial data inserted
- [ ] ✅ API keys accessible
- [ ] ✅ No errors in SQL editor

---

## 🚀 NEXT STEPS

### **After SQL Migration:**
1. ✅ **Complete**: Database setup
2. ⏭️ **Next**: Vercel deployment
3. ⏭️ **Then**: Environment variables
4. ⏭️ **Finally**: Test admin panel

---

## 📞 SUPPORT

### **If You Need Help:**
- Check the full migration file: `supabase-migration.sql`
- Review error messages in SQL Editor
- Ensure you're using the correct Supabase project
- Try running smaller parts if full migration fails

### **Quick Test:**
```sql
-- Test query to verify setup
SELECT COUNT(*) as admin_settings_count FROM admin_settings;
SELECT COUNT(*) as products_count FROM products;
SELECT COUNT(*) as seo_settings_count FROM seo_settings;
```

**Expected Results:**
- admin_settings_count: 1
- products_count: 5+ (sample products)
- seo_settings_count: 10+ (page configurations)

---

*This completes your Supabase database setup!*
*Ready for Vercel deployment next!* 🎉
