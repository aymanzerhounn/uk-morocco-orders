# Railway build failed — fix in 5 minutes

## Why it fails

1. **Wrong folder** — Railway builds the repo **root** by default. Your API lives in **`backend`**.
2. **Puppeteer** — downloads Chrome during install and often **times out** on Railway.

Code fixes are pushed to GitHub. Follow these steps **exactly**.

---

## Step 1 — Delete the broken service (if any)

1. Open your Railway project.
2. Click the failed service → **Settings** → scroll down → **Delete Service** (or remove and create fresh).

---

## Step 2 — New deploy with correct folder

1. **New Project** → **Deploy from GitHub repo** → `uk-morocco-orders`.
2. **Before** the first build finishes, open the service → **Settings**.
3. Set **Root Directory** to: `backend` (no slash).
4. **Save** → wait for redeploy.

If you already deployed once:

- **Settings** → **Root Directory** → `backend` → Save.

---

## Step 3 — Variables (required)

**Variables** tab:

```
SUPABASE_URL=https://xflofgfvrcsmsgzolasr.supabase.co
SUPABASE_ANON_KEY=your_eyJ_anon_key_from_supabase
NODE_ENV=production
PUPPETEER_SKIP_DOWNLOAD=true
```

---

## Step 4 — Check build logs

**Deployments** → latest → **View logs**.

**Good signs:**
- `npm install` finishes in under 2 minutes
- `Backend ready`
- `Server running on port`

**Bad signs:**
- Stuck on `puppeteer` / `chromium` → add `PUPPETEER_SKIP_DOWNLOAD=true` and redeploy
- `Missing SUPABASE_URL` → add variables
- Building from wrong path → Root Directory must be `backend`

---

## Step 5 — Public URL

**Settings** → **Networking** → **Generate Domain** → test:

`https://YOUR-URL.up.railway.app/api/health`

---

## Still failing?

Copy the **last 15 lines** of the Railway build log and send them — the exact error text matters.
