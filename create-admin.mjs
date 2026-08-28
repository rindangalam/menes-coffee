import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  try {
    // Create user via admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'alamrindang22@gmail.com',
      password: 'menes',
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user:', error);
      return;
    }

    console.log('User created:', data.user.id);

    // Add to admin_users table
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        auth_uid: data.user.id,
        name: 'Admin Alam',
        role: 'superadmin'
      });

    if (adminError) {
      console.error('Error adding to admin_users:', adminError);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('Email: alamrindang22@gmail.com');
    console.log('Password: menes');
    console.log('Role: superadmin');
    console.log('Login at: http://localhost:5173/admin/login');

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createAdminUser();