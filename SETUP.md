# Quick start — UK Morocco Orders

Your Supabase project is already configured. Follow these steps to run the app locally.

## 1. Install dependencies

```powershell
cd "C:\Users\PC\Desktop\shein uk project\backend"
npm install

cd "..\frontend"
npm install
```

## 2. Create your login (first time only)

```powershell
cd "C:\Users\PC\Desktop\shein uk project"
node scripts/create-admin-user.js
```

If sign-up requires email confirmation, open [Supabase Dashboard → Authentication → Users](https://supabase.com/dashboard/project/xflofgfvrcsmsgzolasr/auth/users), add the user, and enable **Auto Confirm User**.

**Default credentials**

| Field | Value |
|--------|--------|
| Email | `manager@ukmorocco.local` |
| Password | `UkMorocco2026!` |

## 3. Start backend and frontend

**Terminal 1 — API (port 5000)**

```powershell
cd backend
npm start
```

**Terminal 2 — React app (port 3000)**

```powershell
cd frontend
npm start
```

## 4. Open the app

Go to [http://localhost:3000](http://localhost:3000) and sign in with the credentials above.

---

## What’s configured

| Item | Status |
|------|--------|
| Supabase project | `xflofgfvrcsmsgzolasr` (eu-west-1) |
| `orders` table + RLS | Ready |
| `frontend/.env` | URL + publishable key |
| `backend/.env` | URL + anon key |
| API auth | JWT from login sent on every request |
| DB trigger security fix | Applied |

## Optional: service role key

Only needed for advanced admin scripts. Add to `backend/.env`:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get it from **Dashboard → Project Settings → API → service_role** (never expose in the frontend).

## Supabase dashboard

- [Project](https://supabase.com/dashboard/project/xflofgfvrcsmsgzolasr)
- [Table editor](https://supabase.com/dashboard/project/xflofgfvrcsmsgzolasr/editor)
- [Auth users](https://supabase.com/dashboard/project/xflofgfvrcsmsgzolasr/auth/users)
