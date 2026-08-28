import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function addAdminToTable() {
  try {
    // Get user ID from auth
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }

    const targetUser = users.users.find(u => u.email === 'alamrindang22@gmail.com');
    
    if (!targetUser) {
      console.error('User not found in auth');
      return;
    }

    console.log('Found user:', targetUser.id);

    // Add to admin_users table
    const { error: adminError } = await supabase
      .from('admin_users')
      .upsert({
        auth_uid: targetUser.id,
        name: 'Admin Alam',
        role: 'superadmin'
      }, { onConflict: 'auth_uid' });

    if (adminError) {
      console.error('Error adding to admin_users:', adminError);
      return;
    }

    console.log('✅ Admin added to admin_users table!');
    console.log('Email: alamrindang22@gmail.com');
    console.log('Password: menes');
    console.log('Role: superadmin');
    console.log('Login at: http://localhost:5173/admin/login');

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

addAdminToTable();