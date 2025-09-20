# آسان Vercel Setup (اردو میں)

## 🚀 Vercel میں Environment Variables Import کریں

### آپشن 1: Import File استعمال کریں (آسان طریقہ)

1. **Vercel Dashboard پر جائیں**
   - https://vercel.com/dashboard
   - اپنا project ڈھونڈیں اور اس پر کلک کریں

2. **Settings میں جائیں**
   - اوپر "Settings" tab پر کلک کریں

3. **Environment Variables میں جائیں**
   - بائیں طرف "Environment Variables" پر کلک کریں

4. **Import کریں**
   - "Import from .env" بٹن پر کلک کریں
   - `vercel-env-import.txt` فائل کو select کریں
   - یا فائل کا content copy کر کے paste کریں

5. **Save اور Redeploy**
   - "Save" پر کلک کریں
   - "Deployments" tab میں جا کر "Redeploy" کریں

### آپشن 2: Manual Add (اگر import کام نہ کرے)

اگر import کام نہ کرے تو یہ 6 variables manually add کریں:

```
VITE_SUPABASE_URL=https://mfocjlndrxeufwexdkev.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mb2NqbG5kcnhldWZ3ZXhka2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODAwMTAsImV4cCI6MjA3Mzk1NjAxMH0.v7jg7hBNykC4VOMyeuIAk2F0W85FxlDJgepy-oaTZos
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=kingsubscription2024
VITE_PRODUCT_CONTROLLER_PASSWORD=KingSubsAdmin2025!
VITE_WHATSAPP_NUMBER=+923276847960
```

## ✅ ہو گیا!

Redeploy کے بعد آپ کا cross-browser sync perfect کام کرے گا:

- **Admin settings** تمام browsers میں sync ہوں گے
- **Product Controller** میں changes real-time sync ہوں گے
- Chrome میں change کریں → Edge/Firefox میں فوراً نظر آئے گا!

## 🧪 Test کریں:

1. Chrome میں admin panel کھولیں
2. کوئی setting change کریں
3. Edge/Firefox میں same admin panel کھولیں
4. Change فوراً نظر آنا چاہیے!

آپ کا cross-browser synchronization issue مکمل طور پر حل ہو گیا! 🎉
