/**
 * Creates the default admin login. Run from project root:
 *   node scripts/create-admin-user.js
 */
const path = require('path');

require(path.join(__dirname, '../backend/node_modules/dotenv')).config({
  path: path.join(__dirname, '../backend/.env')
});

const { createClient } = require(path.join(__dirname, '../backend/node_modules/@supabase/supabase-js'));

const email = process.env.ADMIN_EMAIL || 'manager@ukmorocco.local';
const password = process.env.ADMIN_PASSWORD || 'UkMorocco2026!';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function main() {
  console.log('Checking admin user:', email);

  const { data: signIn } = await supabase.auth.signInWithPassword({ email, password });

  if (signIn?.user) {
    console.log('Admin user already exists.');
    printCredentials();
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error('Sign-up failed:', error.message);
    console.log('\nCreate manually: Supabase Dashboard → Authentication → Users');
    console.log('  Enable "Auto Confirm User"');
    printCredentials();
    process.exit(1);
  }

  if (data.user && !data.session) {
    console.log('User created — confirm email in dashboard if login fails.');
  } else {
    console.log('Admin user created.');
  }

  printCredentials();
}

function printCredentials() {
  console.log('\nOpen http://localhost:3000');
  console.log('  Email:', email);
  console.log('  Password:', password);
}

main();
