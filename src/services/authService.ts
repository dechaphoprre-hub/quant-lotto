import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseConfig';

export interface AdminSession {
  accessToken: string;
  userId: string;
  email: string;
}

export type AdminRole = 'ADMIN' | 'EDITOR';

/**
 * Signs in against Supabase's own Auth service (GoTrue). There is no
 * local PIN or client-side authorization check — every admin action
 * downstream is enforced by Postgres row-level security using this
 * user's real JWT, not by anything the frontend decides.
 */
export const signIn = async (email: string, password: string): Promise<{ session: AdminSession } | { error: string }> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'Backend not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).' };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json();
    if (!response.ok) {
      return { error: payload.error_description || payload.msg || 'Sign-in failed.' };
    }
    return { session: { accessToken: payload.access_token, userId: payload.user.id, email: payload.user.email } };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error during sign-in.' };
  }
};

export const signOut = async (session: AdminSession): Promise<void> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.accessToken}` }
    });
  } catch {
    // Best-effort; the in-memory session is discarded by the caller regardless.
  }
};

/**
 * Reads this user's own row in admin_roles under RLS ("users can read
 * their own role"). null means the account is real but has not been
 * granted a role by an operator — there is no way for a signed-in user
 * to grant themselves one.
 */
export const fetchAdminRole = async (session: AdminSession): Promise<AdminRole | null> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_roles?user_id=eq.${session.userId}&select=role`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.accessToken}` }
    });
    if (!response.ok) return null;
    const rows = await response.json() as Array<{ role: AdminRole }>;
    return rows[0]?.role ?? null;
  } catch {
    return null;
  }
};
