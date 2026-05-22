# UK to Morocco Order Management System

A full-stack web application for managing orders from UK stores (Shein, Temu, Primark, and other brands) to customers in Morocco.

## Tech Stack

- **Frontend**: React.js with TailwindCSS
- **Backend**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **Web Scraping**: Puppeteer
- **Hosting**: Railway (Backend) & Vercel (Frontend)

## Features

- 📊 Dashboard with statistics and charts
- 🛍️ Manage orders by platform (Shein, Temu, Primark, Other)
- 🔍 Search and filter orders
- 📤 Export orders to CSV
- 🔐 Password-protected with Supabase Auth
- 🤖 Automatic product details fetch from URLs using Puppeteer
- 🎨 Modern dark-themed UI with platform-specific colors

## Quick start

| Goal | Guide |
|------|--------|
| Run on your PC (localhost) | **[SETUP.md](./SETUP.md)** |
| Put online (Vercel + Railway) | **[GO-LIVE.md](./GO-LIVE.md)** |

**Supabase is already wired up.** Login (local or live): `manager@ukmorocco.local` / `UkMorocco2026!`

| | |
|--|--|
| **Login** | `manager@ukmorocco.local` / `UkMorocco2026!` |
| **App** | http://localhost:3000 |
| **API** | http://localhost:5000 |

---

## Setup Instructions (manual / reference)

### Step 1: Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once your project is ready, go to the SQL Editor
3. Open the file `database/supabase-setup.sql`
4. Copy the entire SQL script and paste it into the Supabase SQL Editor
5. Click "Run" to execute the script
6. Go to Project Settings → API to get your credentials:
   - Project URL
   - anon/public key
   - service_role key (for backend only)

7. Create a user account in Supabase Auth:
   - Go to Authentication → Users
   - Click "Add User" → "Create New User"
   - Enter your email and password
   - Click "Auto Confirm User" to skip email verification

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory with your Supabase credentials:
```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Step 4: Login

1. Open `http://localhost:3000` in your browser
2. You'll be redirected to the login page
3. Enter the email and password you created in Supabase Auth
4. You'll be logged in and redirected to the Dashboard

## Project Structure

```
shein uk project/
├── backend/
│   ├── config/
│   │   └── supabase.js          # Supabase client configuration
│   ├── routes/
│   │   ├── orders.js            # Order CRUD routes
│   │   ├── products.js          # Product scraping route
│   │   └── auth.js              # Authentication routes
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env                     # Backend environment variables
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js        # Main layout with sidebar
│   │   │   ├── OrderModal.js    # Add/Edit order modal
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.js   # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Dashboard.js     # Dashboard with stats
│   │   │   ├── Shein.js         # Shein orders page
│   │   │   ├── Temu.js          # Temu orders page
│   │   │   ├── Primark.js       # Primark orders page
│   │   │   ├── OtherBrands.js   # Other brands page
│   │   │   └── AllOrders.js     # All orders page
│   │   ├── App.js               # Main app component
│   │   ├── index.js             # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env                     # Frontend environment variables
├── database/
│   └── supabase-setup.sql       # Database setup script
└── README.md
```

## API Endpoints

### Orders
- `GET /api/orders` - Get all orders (supports query params: platform, status, search)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `GET /api/orders/stats/dashboard` - Get dashboard statistics

### Products
- `POST /api/products/fetch-product` - Fetch product details from URL

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify authentication token

## Platform Colors

- **Shein**: Pink (#FF6B9D)
- **Temu**: Orange (#FF8C42)
- **Primark**: Green (#4ADE80)
- **Other**: Blue (#60A5FA)

## Status Colors

- **Pending**: Yellow (#FBBF24)
- **Ordered**: Blue (#60A5FA)
- **Shipped**: Orange (#FB923C)
- **Delivered**: Green (#4ADE80)
- **Cancelled**: Red (#F87171)

## Deployment

### Backend Deployment (Railway)

1. Create a Railway account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub repository
4. Select the backend directory
5. Add environment variables in Railway settings:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PORT` (default: 5000)
   - `FRONTEND_URL` (your deployed frontend URL)
6. Deploy

### Frontend Deployment (Vercel)

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Click "New Project" → Import your GitHub repository
3. Set the root directory to `frontend`
4. Add environment variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_API_URL` (your deployed Railway backend URL)
5. Deploy

## Troubleshooting

### Puppeteer Issues
If Puppeteer fails to scrape product details:
- Ensure the backend has enough resources
- Some websites may block scraping - you may need to adjust the scraping logic in `backend/routes/products.js`

### CORS Errors
If you encounter CORS errors:
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that CORS is properly configured in `backend/server.js`

### Database Connection Issues
- Verify your Supabase credentials are correct
- Ensure your Supabase project is active
- Check that the database tables were created successfully

## License

This project is for personal use.
