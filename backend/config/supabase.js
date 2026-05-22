const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdminClient = null;

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY. Add them in Railway Variables.');
  }
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      supabaseUrl,
      supabaseServiceKey || supabaseAnonKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return supabaseAdminClient;
}

function createUserClient(accessToken) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY. Add them in Railway Variables.');
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

module.exports = {
  get supabaseAdmin() {
    return getSupabaseAdmin();
  },
  createUserClient
};
