# 🚨 Vercel Deployment Fix for Supabase Authentication

The "Failed to fetch" error you're seeing is a common deployment issue. Here's how to fix it:

## ✅ Step 1: Update Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Find your `tough-turtle` project
3. Go to **Settings** → **Environment Variables**
4. Make sure these variables are set for **Production**:

```
NEXT_PUBLIC_SUPABASE_URL=https://qbwcsygmhstqrkmlskgk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFid2NzeWdtaHN0cXJrbWxza2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMjU0MjQsImV4cCI6MjA2NjgwMTQyNH0.Ik4zVtBrk6Ku-rOfOTDKQv1Tcge93o4yoACsWXgakiw
STRAVA_CLIENT_ID=your_client_id_here
STRAVA_CLIENT_SECRET=b88ba2dc6e55b558fee2e5e54bd0db108457c65a
```

## ✅ Step 2: Configure Supabase for Production

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `qbwcsygmhstqrkmlskgk`
3. Go to **Authentication** → **URL Configuration**
4. Add your Vercel domain to **Site URL**:
   ```
   https://tough-turtle-dehxy60wv-temiloluwaadeniyis-projects.vercel.app
   ```
5. Add to **Redirect URLs**:
   ```
   https://tough-turtle-dehxy60wv-temiloluwaadeniyis-projects.vercel.app/**
   https://tough-turtle-dehxy60wv-temiloluwaadeniyis-projects.vercel.app/api/strava/auth
   ```

## ✅ Step 3: Update CORS Settings

In Supabase **Settings** → **API**:
1. Scroll to **CORS settings**
2. Add your Vercel domain:
   ```
   https://tough-turtle-dehxy60wv-temiloluwaadeniyis-projects.vercel.app
   ```

## ✅ Step 4: Check RLS Policies

Make sure your database has the correct Row Level Security policies:

1. Go to **Table Editor** → **users** table
2. Click **RLS** tab
3. Ensure policies allow:
   - `INSERT` for authenticated users
   - `SELECT` for users to read their own data

## ✅ Step 5: Re-deploy

After making these changes:
1. Go back to Vercel
2. Go to **Deployments**
3. Click **Redeploy** on your latest deployment
4. Or push a new commit to trigger a fresh deployment

## 🔧 Quick Test

After deployment, test the connection by:
1. Going to your Vercel URL
2. Using the debug panel at the bottom of the dashboard
3. Click "Test Connection" and "Test Signup"

## 🚨 Common Issues & Solutions

**If still getting errors:**

1. **Environment Variables**: Double-check they're set for Production (not just Preview)
2. **CORS**: Make sure the exact Vercel URL is in Supabase CORS settings
3. **Cache**: Clear browser cache or try incognito mode
4. **URL Format**: Ensure no trailing slashes in Supabase URLs

**Quick Environment Variable Check:**
Add this to see what Vercel is using:
```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
```

Let me know if you need help with any of these steps!