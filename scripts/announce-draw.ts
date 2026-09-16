import { createSupabaseApi } from './lib/glo.ts';

/**
 * Announces a just-verified Thai draw to LINE (broadcast) and a Facebook
 * Page, both fully automated — no one has to log in and post anything by
 * hand. Each channel is entirely optional: if its credentials aren't set,
 * this script logs that and skips it rather than failing the ingestion
 * pipeline, same convention as adService/proofService degrading gracefully
 * when Supabase isn't configured.
 *
 * Run with: npm run announce:draw (chained after npm run ingest:glo)
 */

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dateInput = process.env.DRAW_DATE || new Date().toISOString().slice(0, 10);
const siteUrl = (process.env.SITE_URL || 'https://dechaphoprre-hub.github.io/quant-lotto/').replace(/\/$/, '');

const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const fbPageId = process.env.FACEBOOK_PAGE_ID;
const fbPageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}

const api = createSupabaseApi({ supabaseUrl, serviceRoleKey });

interface DrawRow {
  draw_date: string;
  top_prize: string;
  two_digit_top: string;
  two_digit_bottom: string;
}

interface ProofRow {
  predicted_top5: string[];
  commitment_hash: string;
}

const draws = await api(
  `draws?market_code=eq.THAI&draw_date=eq.${dateInput}&verification_status=eq.VERIFIED&select=draw_date,top_prize,two_digit_top,two_digit_bottom`
) as DrawRow[];
const draw = draws?.[0];

if (!draw) {
  console.log(`[SKIP] No VERIFIED draw found for ${dateInput}; nothing to announce.`);
  process.exit(0);
}

// Best-effort: mention the next draw's pre-committed prediction if one exists yet.
const pendingProofRows = await api(
  `proof_records?market_code=eq.THAI&scored_at=is.null&select=predicted_top5,commitment_hash&order=draw_date.asc&limit=1`
) as ProofRow[];
const pendingProof = pendingProofRows?.[0];

const resultLine = `ผลหวยงวด ${draw.draw_date}: ${draw.top_prize} (2 ตัวล่าง ${draw.two_digit_bottom})`;
const proofLine = pendingProof
  ? `\n\nงวดหน้าเราล็อกเลขทำนายไว้ล่วงหน้าแล้ว (${pendingProof.predicted_top5.join(', ')}) พร้อมรหัสยืนยัน ${pendingProof.commitment_hash.slice(0, 12)}... ตรวจสอบได้ทันทีที่หวยออก`
  : '';
const message = `${resultLine}${proofLine}\n\nดูสถิติเจาะลึกที่ ${siteUrl}`;

let anyChannelConfigured = false;

if (lineToken) {
  anyChannelConfigured = true;
  const response = await fetch('https://api.line.me/v2/bot/message/broadcast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${lineToken}` },
    body: JSON.stringify({ messages: [{ type: 'text', text: message }] })
  });
  if (!response.ok) {
    throw new Error(`LINE broadcast failed: HTTP ${response.status} ${await response.text()}`);
  }
  console.log('[PASS] LINE broadcast sent.');
} else {
  console.log('[SKIP] LINE_CHANNEL_ACCESS_TOKEN not set; skipping LINE broadcast.');
}

if (fbPageId && fbPageToken) {
  anyChannelConfigured = true;
  const response = await fetch(`https://graph.facebook.com/v19.0/${fbPageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: fbPageToken })
  });
  if (!response.ok) {
    throw new Error(`Facebook Page post failed: HTTP ${response.status} ${await response.text()}`);
  }
  console.log('[PASS] Facebook Page post published.');
} else {
  console.log('[SKIP] FACEBOOK_PAGE_ID / FACEBOOK_PAGE_ACCESS_TOKEN not set; skipping Facebook post.');
}

if (!anyChannelConfigured) {
  console.log('\nNo announcement channels configured yet. Set LINE_CHANNEL_ACCESS_TOKEN and/or FACEBOOK_PAGE_ID + FACEBOOK_PAGE_ACCESS_TOKEN as GitHub Actions secrets to enable this.');
}
