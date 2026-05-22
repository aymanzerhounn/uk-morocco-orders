# Put your app online (not localhost)

Same app, hosted on the web. **Local setup stays as-is** — use `SETUP.md` only when developing on your PC.

## Overview

| Part | Host | URL example |
|------|------|-------------|
| Frontend (React) | [Vercel](https://vercel.com) | `https://your-app.vercel.app` |
| Backend (API) | [Railway](https://railway.app) | `https://your-api.up.railway.app` |
| Database + login | Supabase (already done) | unchanged |

---

## 1. Push code to GitHub

```powershell
cd "C:\Users\PC\Desktop\shein uk project"
git init
git add .
git commit -m "UK Morocco orders app"
```

Create a repo on GitHub, then:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 2. Deploy backend (Railway)

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your repo → set **Root Directory** to `backend`
3. **Variables** tab — add:

| Variable | Value |
|----------|--------|
| `SUPABASE_URL` | `https://xflofgfvrcsmsgzolasr.supabase.co` |
| `SUPABASE_ANON_KEY` | from [Supabase API settings](https://supabase.com/dashboard/project/xflofgfvrcsmsgzolasr/settings/api) (anon key) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | *(add after step 3 — your Vercel URL)* |

4. **Settings → Networking → Generate domain** → copy the URL (e.g. `https://uk-morocco-api.up.railway.app`)

---

## 3. Deploy frontend (Vercel)

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → import your GitHub repo
2. **Root Directory**: `frontend`
3. **Environment variables**:

| Variable | Value |
|----------|--------|
| `REACT_APP_SUPABASE_URL` | `https://xflofgfvrcsmsgzolasr.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | `sb_publishable_RljQAcj1nvKVHLJ6fxY2gQ_bZsf0z-C` |
| `REACT_APP_API_URL` | your Railway URL from step 2 |

4. Deploy → copy your Vercel URL (e.g. `https://uk-morocco-orders.vercel.app`)

---

## 4. Link frontend ↔ backend

1. **Railway** → backend service → **Variables** → set  
   `FRONTEND_URL` = your Vercel URL (exact, no trailing slash)  
   Redeploy if needed.

2. **Supabase** → [Authentication → URL configuration](https://supabase.com/dashboard/project/xflofgfvrcsmsgzolasr/auth/url-configuration):
   - **Site URL**: your Vercel URL  
   - **Redirect URLs**: add your Vercel URL and `https://your-app.vercel.app/**`

---

## 5. Log in on the live site

Use the same account as local:

- **Email:** `manager@ukmorocco.local`
- **Password:** `UkMorocco2026!`

Open your **Vercel URL** in the browser (not localhost).

---

## Optional: custom domain

- **Vercel:** Project → Settings → Domains  
- **Railway:** Service → Settings → Networking → Custom domain  
- Update `FRONTEND_URL` and Supabase Site URL to match.

---

## Note on product “Fetch” (Puppeteer)

Scraping may fail on Railway’s free tier (memory/Chrome limits). Orders still work if you enter product details manually.
