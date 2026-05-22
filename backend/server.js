require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Health check first — works even if Supabase env vars are missing
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
  });
});

const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

const frontendUrlEnv = process.env.FRONTEND_URL || 'http://localhost:3000';
let allowedOrigins = [];
let allowAllOrigins = false;

if (frontendUrlEnv.trim() === '*') {
  allowAllOrigins = true;
} else {
  allowedOrigins = frontendUrlEnv
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

console.log('CORS configuration: ', allowAllOrigins ? 'allow all origins' : allowedOrigins);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
