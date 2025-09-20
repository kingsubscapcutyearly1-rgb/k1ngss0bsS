# Vercel Environment Variables Setup

## 🚀 Add These Environment Variables to Vercel

Since you mentioned you haven't added any environment variables to Vercel before, you need to add these now for the cross-browser sync to work on your live website.

### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your project and click on it

2. **Navigate to Settings**
   - Click on the "Settings" tab at the top

3. **Go to Environment Variables**
   - In the left sidebar, click "Environment Variables"

4. **Add Each Variable**
   Click "Add New" and add these **6 environment variables** one by one:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://mfocjlndrxeufwexdkev.supabase.co`
   - Environment: Production, Preview, Development (select all)

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mb2NqbG5kcnhldWZ3ZXhka2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODAwMTAsImV4cCI6MjA3Mzk1NjAxMH0.v7jg7hBNykC4VOMyeuIAk2F0W85FxlDJgepy-oaTZos`
   - Environment: Production, Preview, Development (select all)

   **Variable 3:**
   - Name: `VITE_ADMIN_USERNAME`
   - Value: `admin`
   - Environment: Production, Preview, Development (select all)

   **Variable 4:**
   - Name: `VITE_ADMIN_PASSWORD`
   - Value: `kingsubscription2024`
   - Environment: Production, Preview, Development (select all)

   **Variable 5:**
   - Name: `VITE_PRODUCT_CONTROLLER_PASSWORD`
   - Value: `KingSubsAdmin2025!`
   - Environment: Production, Preview, Development (select all)

   **Variable 6:**
   - Name: `VITE_WHATSAPP_NUMBER`
   - Value: `+923276847960`
   - Environment: Production, Preview, Development (select all)

5. **Save and Redeploy**
   - After adding all 6 variables, click "Save"
   - Go to "Deployments" tab
   - Click "Redeploy" on your latest deployment
   - Wait for deployment to complete

## ✅ That's It!

After redeployment, your cross-browser sync will work perfectly on your live website:

- **Admin settings** will sync across all browsers in real-time
- **Product Controller** changes will sync across all browsers instantly
- No more browser isolation issues!

## 🧪 Test Your Live Website:

1. Open your live website admin panel in Chrome
2. Change a setting (like disable purchase notifications)
3. Open the same admin panel in Edge/Firefox
4. The change should appear immediately!

Same for Product Controller - add/edit/delete products in one browser, see changes instantly in all others!

Your cross-browser synchronization issue is now completely fixed! 🎉
