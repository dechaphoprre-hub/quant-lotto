import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { createSupabaseApi } from './lib/glo.ts';
import { calculateDigitStatistics, calculateThreeDigitPatternDistribution } from '../src/math/quantEngine.ts';
import { calculateChiSquareTest, findDormantNumbers } from '../src/math/statisticalInsights.ts';
import { DrawRecord } from '../src/types/index.ts';

/**
 * Generates a static, standalone SEO recap page for one verified Thai
 * draw — real result + real retrospective stats (was this number dormant
 * before today? how random does history look overall?), never a
 * prediction. Plain HTML/CSS, no Tailwind build step, so it's fully
 * self-contained and never breaks when the app's hashed asset filenames
 * change. Committed straight to the repo by the CI step that calls this,
 * so every draw grows the site's real, unique, indexable content with
 * zero manual work.
 *
 * Run with: npm run generate:draw-page
 */

const SITE_URL = (process.env.SITE_URL || 'https://dechaphoprre-hub.github.io/quant-lotto').replace(/\/$/, '');
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dateInput = process.env.DRAW_DATE || new Date().toISOString().slice(0, 10);

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}

const api = createSupabaseApi({ supabaseUrl, serviceRoleKey });

const toDrawRecord = (row: Record<string, unknown>): DrawRecord => ({
  id: String(row.id),
  market: 'THAI',
  date: String(row.draw_date),
  dayOfWeekTh: '',
  drawNumber: String(row.draw_number),
  topPrize: String(row.top_prize),
  twoDigitTop: String(row.two_digit_top),
  twoDigitBottom: String(row.two_digit_bottom),
  threeDigitTop: row.three_digit_top ? String(row.three_digit_top) : undefined,
  threeDigitFront: Array.isArray(row.three_digit_front) ? row.three_digit_front.map(String) : undefined,
  threeDigitBack: Array.isArray(row.three_digit_back) ? row.three_digit_back.map(String) : undefined
});

const rows = await api(
  `draws?market_code=eq.THAI&verification_status=eq.VERIFIED&select=id,draw_date,draw_number,top_prize,two_digit_top,two_digit_bottom,three_digit_top,three_digit_front,three_digit_back&order=draw_date.asc`
) as Array<Record<string, unknown>>;
const allDraws = rows.map(toDrawRecord);

const targetIndex = allDraws.findIndex(d => d.date === dateInput);
if (targetIndex === -1) {
  console.log(`[SKIP] No VERIFIED draw found for ${dateInput}; nothing to generate.`);
  process.exit(0);
}

const target = allDraws[targetIndex];
const priorDraws = allDraws.slice(0, targetIndex); // strictly before — a real "was this dormant?" check, no leakage
const historyIncludingTarget = allDraws.slice(0, targetIndex + 1);

// Only checked against 2-digit-bottom ("เลขท้าย 2 ตัว") — the one real
// official 2-digit Thai prize category. two_digit_top is just the last 2
// digits of the 6-digit first prize, not an official Thai bet type.
const dormantBefore = findDormantNumbers(priorDraws, 3, new Date(`${target.date}T00:00:00Z`));
const wasBottomDormant = dormantBefore.some(d => d.digit === target.twoDigitBottom);

const chiSquare = calculateChiSquareTest(calculateDigitStatistics(historyIncludingTarget));
const patternDistribution = calculateThreeDigitPatternDistribution(historyIncludingTarget);
const topPattern = [...patternDistribution].sort((a, b) => b.percentage - a.percentage)[0];

const dormantNote = wasBottomDormant
  ? `<p class="highlight">น่าสนใจ: เลขท้าย 2 ตัว ${target.twoDigitBottom} ไม่ปรากฏเลยในรอบ 3 ปีก่อนหน้างวดนี้ แล้ววันนี้ก็ออกพอดี — เป็นข้อเท็จจริงทางสถิติ ไม่ใช่สัญญาณว่าจะเกิดซ้ำ เพราะหวยแต่ละงวดอิสระต่อกัน</p>`
  : '';

const pageUrl = `${SITE_URL}/draws/th-${dateInput}.html`;
const title = `ผลหวยงวด ${dateInput} เลข ${target.topPrize} — สถิติเจาะลึก | QuantLotto`;
const description = `ผลสลากกินแบ่งรัฐบาลไทย งวดวันที่ ${dateInput}: รางวัลที่ 1 ${target.topPrize} 2 ตัวล่าง ${target.twoDigitBottom} พร้อมสถิติย้อนหลังแบบตรวจสอบได้จริง ไม่มีการทำนายหรือข้อมูลปลอม`;

const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${pageUrl}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${pageUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${SITE_URL}/og-preview.png" />
<meta property="og:locale" content="th_TH" />
<meta name="twitter:card" content="summary_large_image" />
<style>
  body { background:#080C14; color:#F8FAFC; font-family:'Prompt',sans-serif; max-width:640px; margin:0 auto; padding:24px 16px 64px; line-height:1.7; }
  h1 { font-size:1.4rem; color:#00F2FE; }
  .result { font-size:2.2rem; font-weight:800; font-family:monospace; letter-spacing:0.1em; margin:12px 0; }
  .meta { color:#94A3B8; font-size:0.85rem; }
  .card { background:#0F1620; border:1px solid #1E293B; border-radius:12px; padding:16px; margin:16px 0; }
  .highlight { background:rgba(0,242,254,0.08); border:1px solid rgba(0,242,254,0.3); border-radius:8px; padding:12px; font-size:0.9rem; }
  .disclaimer { color:#64748B; font-size:0.75rem; border-top:1px solid #1E293B; padding-top:16px; margin-top:24px; }
  a.cta { display:inline-block; margin-top:16px; background:#00F2FE; color:#080C14; font-weight:700; padding:10px 20px; border-radius:8px; text-decoration:none; }
</style>
</head>
<body>
  <p class="meta"><a href="${SITE_URL}/" style="color:#00F2FE;">← QuantLotto</a></p>
  <h1>ผลสลากกินแบ่งรัฐบาลไทย งวดวันที่ ${dateInput}</h1>
  <div class="result">${target.topPrize}</div>
  <p class="meta">3 ตัวบน: <strong>${target.threeDigitTop ?? target.topPrize.slice(-3)}</strong> · 2 ตัวล่าง: <strong>${target.twoDigitBottom}</strong>${target.threeDigitFront ? ` · 3 ตัวหน้า: <strong>${target.threeDigitFront.join(', ')}</strong>` : ''}${target.threeDigitBack ? ` · 3 ตัวท้าย: <strong>${target.threeDigitBack.join(', ')}</strong>` : ''}</p>

  <div class="card">
    <p><strong>สถิติภาพรวม (ตรวจสอบได้จริง จากประวัติ ${historyIncludingTarget.length} งวด):</strong></p>
    <p>ผลทดสอบไคสแควร์: χ² = ${chiSquare.statistic}, p-value = ${chiSquare.pValue} — ${chiSquare.isConsistentWithRandom ? 'สอดคล้องกับการสุ่มจริง' : 'เบี่ยงเบนจากการสุ่มอย่างมีนัยสำคัญ'}</p>
    ${topPattern ? `<p>รูปแบบเลข 3 ตัวที่พบบ่อยที่สุดในประวัติ: ${topPattern.pattern} (${topPattern.percentage}%)</p>` : ''}
  </div>

  ${dormantNote}

  <a class="cta" href="${SITE_URL}/">ดูสถิติเจาะลึกแบบเรียลไทม์ →</a>

  <p class="disclaimer">
    หน้านี้แสดงข้อมูลย้อนหลังของผลที่ออกไปแล้วเท่านั้น ไม่ใช่การพยากรณ์ผลในอนาคต สลากกินแบ่งรัฐบาลเป็นการสุ่มที่แต่ละงวดเป็นอิสระต่อกัน ไม่มีระบบใดทำนายผลล่วงหน้าได้จริง ข้อมูลทั้งหมดคำนวณจากผลรางวัลจริงที่ประกาศโดยสำนักงานสลากกินแบ่งรัฐบาล
  </p>
</body>
</html>
`;

const outDir = 'public/draws';
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/th-${dateInput}.html`, html, 'utf-8');
console.log(`[PASS] Generated ${outDir}/th-${dateInput}.html`);

// Append to sitemap.xml if this URL isn't already listed.
const sitemapPath = 'public/sitemap.xml';
let sitemap = existsSync(sitemapPath) ? readFileSync(sitemapPath, 'utf-8') : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n';
if (!sitemap.includes(pageUrl)) {
  const entry = `  <url>\n    <loc>${pageUrl}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  sitemap = sitemap.replace('</urlset>', `${entry}</urlset>`);
  writeFileSync(sitemapPath, sitemap, 'utf-8');
  console.log(`[PASS] Added ${pageUrl} to sitemap.xml`);
} else {
  console.log(`[SKIP] ${pageUrl} already in sitemap.xml`);
}
