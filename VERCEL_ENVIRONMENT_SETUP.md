# Vercel Environment Variables Setup Guide

## 🌐 VERCEL ENVIRONMENT VARIABLES CONFIGURATION

Complete guide to set up all required environment variables in Vercel.

---

## 🔧 STEP 1: ACCESS VERCEL DASHBOARD

1. Go to [vercel.com](https://vercel.com) and login
2. Select your project: `king-subscription`
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar

---

## 📋 STEP 2: ADD REQUIRED VARIABLES

### **2.1 Supabase Configuration (REQUIRED)**
Add these **3 variables** - get values from Supabase dashboard:

```
# Supabase URL
VITE_SUPABASE_URL=https://xxxxx.supabase.co

# Supabase Anonymous Key (Public)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Username (Choose your own)
VITE_ADMIN_USERNAME=admin

# Admin Password (Choose strong password)
VITE_ADMIN_PASSWORD=YourStrongPassword123!
```

### **2.2 Optional Analytics Variables**
Add these if you want analytics:

```
# Google Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Hotjar Analytics (Optional)
VITE_HOTJAR_ID=xxxxxxxx

# Facebook Pixel (Optional)
VITE_FACEBOOK_PIXEL_ID=xxxxxxxxxx
```

---

## 🔍 STEP 3: GET SUPABASE VALUES

### **How to get Supabase credentials:**

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **"Settings"** → **"API"**
4. Copy these values:

#### **Required Values:**
- **Project URL**: `https://xxxxx.supabase.co`
- **anon/public key**: Long JWT token starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **Keep Secure (Don't share):**
- **service_role key**: Only for server-side operations

---

## ⚙️ STEP 4: CONFIGURE ENVIRONMENT SCOPES

### **For Each Variable, Set:**
- **Environment**: `Production`, `Preview`, `Development`
- **Value**: Your actual value
- **Type**: `Plaintext` (for all variables)

### **Recommended Settings:**

| Variable | Environment | Type | Example Value |
|----------|-------------|------|---------------|
| `VITE_SUPABASE_URL` | All | Plaintext | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | All | Plaintext | `eyJhbGciOiJIUzI1NiIs...` |
| `VITE_ADMIN_USERNAME` | All | Plaintext | `admin` |
| `VITE_ADMIN_PASSWORD` | All | Plaintext | `YourStrongPassword123!` |
| `VITE_GOOGLE_ANALYTICS_ID` | All | Plaintext | `G-XXXXXXXXXX` |

---

## 🔐 STEP 5: ADMIN CREDENTIALS SECURITY

### **Choose Strong Admin Password:**
- ✅ Minimum 12 characters
- ✅ Mix of uppercase & lowercase letters
- ✅ Include numbers
- ✅ Include special characters (!@#$%^&*)
- ❌ Don't use common words
- ❌ Don't use personal information

### **Examples of Strong Passwords:**
```
MySecurePass123!
Admin@2025#Secure
King$ubscription$2025
P@ssw0rd!S3cure#2025
```

---

## 📊 STEP 6: ANALYTICS SETUP (OPTIONAL)

### **Google Analytics:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Create new property
3. Get **Measurement ID**: `G-XXXXXXXXXX`
4. Add as: `VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX`

### **Hotjar:**
1. Go to [Hotjar](https://www.hotjar.com)
2. Create new site
3. Get **Site ID**: `xxxxxxxx`
4. Add as: `VITE_HOTJAR_ID=xxxxxxxx`

---

## ✅ STEP 7: VERIFY CONFIGURATION

### **Check Your Variables:**
1. In Vercel dashboard, go to **"Environment Variables"**
2. You should see all variables listed
3. Each should have:
   - ✅ Green checkmark (valid)
   - ✅ Correct environment scopes
   - ✅ No error messages

### **Test Variables:**
1. Deploy your project
2. Check browser console for errors
3. Try accessing admin panel: `/admin`
4. Verify Supabase connection works

---

## 🚀 STEP 8: DEPLOY WITH NEW VARIABLES

### **Trigger New Deployment:**
1. Go to **"Deployments"** tab in Vercel
2. Click **"Redeploy"** button
3. Or push new commit to GitHub
4. Wait for deployment to complete

### **Verify Deployment:**
1. Check deployment status: **"Ready"**
2. Click on deployment URL
3. Test admin login
4. Verify cross-browser sync

---

## ⚠️ TROUBLESHOOTING

### **Common Issues:**

#### **Issue: Variables not working**
**Solution:**
1. Check variable names (case-sensitive)
2. Ensure `VITE_` prefix for client-side variables
3. Redeploy after adding variables
4. Clear browser cache

#### **Issue: Admin login not working**
**Solution:**
1. Verify `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD`
2. Check for typos in password
3. Ensure variables are in correct environment
4. Try redeploying

#### **Issue: Supabase connection failed**
**Solution:**
1. Verify `VITE_SUPABASE_URL` format
2. Check `VITE_SUPABASE_ANON_KEY` is correct
3. Ensure Supabase project is active
4. Check Supabase dashboard for any issues

---

## 🔒 SECURITY BEST PRACTICES

### **Environment Variable Security:**
- ✅ Never commit secrets to GitHub
- ✅ Use different values for production/preview
- ✅ Rotate passwords regularly
- ✅ Monitor variable access logs
- ✅ Use strong, unique passwords

### **Admin Access Security:**
- ✅ Use HTTPS only
- ✅ Enable 2FA if available
- ✅ Monitor admin login attempts
- ✅ Change default credentials
- ✅ Use strong passwords

---

## 📋 ENVIRONMENT VARIABLES REFERENCE

### **Required Variables:**
```bash
# Supabase (Required)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Admin (Required)
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=YourStrongPassword123!
```

### **Optional Variables:**
```bash
# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_HOTJAR_ID=xxxxxxxx
VITE_FACEBOOK_PIXEL_ID=xxxxxxxxxx

# Social Media
VITE_TWITTER_HANDLE=@kingsubscription
VITE_LINKEDIN_URL=https://linkedin.com/company/king-subscription

# Business
VITE_COMPANY_NAME=King Subscription
VITE_SUPPORT_EMAIL=support@kingsubscription.com
```

---

## 🎯 NEXT STEPS

### **After Environment Setup:**
1. ✅ **Complete**: Environment variables configured
2. ⏭️ **Next**: Test admin panel functionality
3. ⏭️ **Then**: Configure domain (optional)
4. ⏭️ **Finally**: Launch website!

### **Quick Verification:**
```bash
# Test admin access
curl https://your-domain.com/admin

# Check environment variables
# Go to Vercel dashboard → Settings → Environment Variables
```

---

## 📞 SUPPORT

### **Need Help?**
- Check Vercel deployment logs
- Verify variable names match exactly
- Ensure no extra spaces in values
- Test with simple values first
- Contact Vercel support if needed

### **Debug Commands:**
```bash
# Check Vercel environment
vercel env ls

# Pull environment variables
vercel env pull

# Check deployment status
vercel deployments ls
```

---

## ✅ SUCCESS CHECKLIST

After setup, verify:

- [ ] ✅ All required variables added
- [ ] ✅ Supabase connection working
- [ ] ✅ Admin login functional
- [ ] ✅ Cross-browser sync working
- [ ] ✅ No console errors
- [ ] ✅ Deployment successful

---

## 🚀 READY FOR LAUNCH!

Your King Subscription website is now fully configured with:

- ✅ **Secure Environment Variables**
- ✅ **Supabase Database Connected**
- ✅ **Admin Panel Functional**
- ✅ **Cross-browser Synchronization**
- ✅ **Production Ready**

**Time to launch your successful business!** 🎉

---

*Last Updated: January 20, 2025*
*Version: 1.0 - Environment Setup Guide*
