import { createSupabaseApi, ingestThaiGloDraw } from './lib/glo.ts';

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dateInput = process.env.DRAW_DATE || new Date().toISOString().slice(0, 10);

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}

const api = createSupabaseApi({ supabaseUrl, serviceRoleKey });
const result = await ingestThaiGloDraw(dateInput, api);

if (result.status === 'FAILED') {
  throw new Error(`GLO ${dateInput}: ${result.message}`);
}

console.log(`[PASS] GLO ${dateInput}: ${result.message}`);
