import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const runtimeEnv = typeof window !== 'undefined' && window.__ENV ? window.__ENV : {};
const API_URL = runtimeEnv.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const supabase = createClient(
  runtimeEnv.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL,
  runtimeEnv.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY
);

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export default api;
