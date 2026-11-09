import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { serverClient } from '@/lib/supabase/server';

export function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error('Supabase admin environment variables are not configured');
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function requireUser() {
  const supabase = await serverClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('SIGN_IN_REQUIRED');
  return data.user;
}
