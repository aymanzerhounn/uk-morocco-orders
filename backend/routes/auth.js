const express = require('express');
const router = express.Router();
const getSupabase = () => require('../config/supabase').supabaseAdmin;

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await getSupabase().auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.json({
      user: data.user,
      session: data.session,
      token: data.session.access_token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ error: error.message });
  }
});

router.post('/logout', async (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data, error } = await getSupabase().auth.getUser(token);

    if (error) throw error;

    res.json({ user: data.user });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
