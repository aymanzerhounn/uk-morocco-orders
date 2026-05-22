# Deployment Guide

This guide will help you deploy your UK to Morocco Order Management System to production.

## Prerequisites

Before deploying, ensure you have:
- A Supabase project with the database set up (see README.md)
- GitHub account with your code pushed to a repository
- Railway account (for backend)
- Vercel account (for frontend)

---

## Step 1: Push Code to GitHub

1. Initialize a git repository in your project root:
```bash
git init
```

2. Add all files:
```bash
git add .
```

3. Commit your changes:
```bash
git commit -m "Initial commit"
```

4. Create a new repository on GitHub
5. Add the remote:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

6. Push to GitHub:
```bash
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" in the top right
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your repository

### 2.2 Configure Backend Deployment

1. Railway will detect your project. Click "Add Service" → "GitHub Repo"
2. Select the backend directory by setting the root directory to `backend`
3. Click "Deploy"

### 2.3 Add Environment Variables

1. After deployment starts, click on your backend service
2. Go to the "Variables" tab
3. Add the following environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `SUPABASE_URL` | Your Supabase project URL | From Supabase Settings → API |
| `SUPABASE_ANON_KEY` | Your Supabase anon key | From Supabase Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | From Supabase Settings → API |
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `production` | Environment |
| `FRONTEND_URL` | Your Vercel URL | Will add after frontend deployment |

4. Click "Save Changes"
5. Railway will automatically redeploy with the new variables

### 2.4 Get Backend URL

1. Go to your backend service in Railway
2. Copy the "Public URL" (e.g., `https://your-backend.railway.app`)
3. Save this URL for the frontend deployment

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New" → "Project"
3. Import your GitHub repository

### 3.2 Configure Frontend Deployment

1. Set the "Root Directory" to `frontend`
2. Click "Create"

### 3.3 Add Environment Variables

1. During setup or after deployment, go to Project Settings → Environment Variables
2. Add the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | From Supabase Settings → API |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anon key | From Supabase Settings → API |
| `REACT_APP_API_URL` | Your Railway backend URL | From Step 2.4 |

3. Save the variables
4. Vercel will automatically redeploy

### 3.4 Get Frontend URL

1. After deployment, Vercel will provide a URL (e.g., `https://your-app.vercel.app`)
2. Copy this URL

---

## Step 4: Update Backend CORS

1. Go back to Railway
2. Open your backend service
3. Go to "Variables" tab
4. Update `FRONTEND_URL` to your Vercel URL
5. Save changes
6. Railway will redeploy

---

## Step 5: Update Supabase RLS (Optional)

If you want to restrict database access, update the Row Level Security policy:

1. Go to Supabase Dashboard → SQL Editor
2. Run this to allow only authenticated users:

```sql
-- Drop existing policy
DROP POLICY IF EXISTS "Enable all for users" ON orders;

-- Create restricted policy
CREATE POLICY "Users can manage orders" ON orders
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

---

## Step 6: Test Your Deployment

1. Open your Vercel URL in a browser
2. You should see the login page
3. Login with your Supabase credentials
4. Verify the dashboard loads correctly
5. Try adding a new order
6. Test the product URL fetch feature

---

## Troubleshooting

### Backend Deployment Issues

**Issue**: Build fails
- Check that all dependencies are in `backend/package.json`
- Ensure Node.js version is compatible (Railway uses latest by default)

**Issue**: Database connection error
- Verify Supabase credentials are correct
- Check that Supabase project is active
- Ensure the database was set up with the SQL script

### Frontend Deployment Issues

**Issue**: Build fails
- Check that all dependencies are in `frontend/package.json`
- Ensure environment variables are set correctly

**Issue**: API calls fail
- Verify `REACT_APP_API_URL` is correct
- Check that backend is deployed and accessible
- Verify CORS settings in backend

### Puppeteer Issues

**Issue**: Product scraping fails in production
- Railway may have resource limitations for Puppeteer
- Consider using a dedicated scraping service or API
- You can disable scraping and have users enter product details manually

### CORS Issues

**Issue**: CORS errors in browser console
- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check that CORS middleware is configured correctly in `backend/server.js`

---

## Custom Domain (Optional)

### Vercel Custom Domain

1. Go to your Vercel project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS instructions

### Railway Custom Domain

1. Go to your Railway service → Settings → Networking
2. Add your custom domain
3. Follow Railway's DNS instructions

---

## Monitoring

### Railway Monitoring

- Railway provides built-in logs and metrics
- Access logs from your service dashboard
- Set up alerts for errors or high resource usage

### Vercel Monitoring

- Vercel provides analytics and logs
- Access from your project dashboard
- Set up deployments notifications

---

## Backup Strategy

### Database Backup

- Supabase automatically backs up your database
- You can also manually export data from Supabase Dashboard

### Code Backup

- Your code is stored on GitHub
- Railway and Vercel deploy from your repository

---

## Cost Estimate

### Railway (Backend)
- Free tier: $5/month credit (good for testing)
- Paid: Starts at $5/month for production

### Vercel (Frontend)
- Free tier: Generous limits for hobby projects
- Paid: Starts at $20/month for production

### Supabase
- Free tier: 500MB database, 1GB bandwidth
- Paid: Starts at $25/month for production

---

## Security Checklist

- [ ] Use strong passwords for Supabase Auth
- [ ] Never commit `.env` files to GitHub
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS (automatic on Railway and Vercel)
- [ ] Implement rate limiting on API endpoints (optional)
- [ ] Regularly update dependencies
- [ ] Monitor logs for suspicious activity

---

## Support

If you encounter issues:
1. Check Railway and Vercel logs
2. Verify environment variables are correct
3. Test locally with production environment variables
4. Consult platform documentation:
   - Railway: https://docs.railway.app
   - Vercel: https://vercel.com/docs
   - Supabase: https://supabase.com/docs
