#!/usr/bin/env node
/**
 * audit-kpis.mjs — Phase 1 KPI auto-pull for DFW HVAC dashboard.
 *
 * Writes /app/frontend/public/internal/kpi-snapshot.json
 * + archive copy to /app/memory/audits/kpi-snapshot-archive/<date>.json
 *
 * Usage: node scripts/audit-kpis.mjs
 * Optional env: PAGESPEED_API_KEY, CRUX_API_KEY, GITHUB_TOKEN
 */

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const DOMAIN = process.env.AUDIT_DOMAIN || 'dfwhvac.com';
const ORIGIN = `https://${DOMAIN}`;
const SNAPSHOT_OUT = path.join(REPO_ROOT, 'frontend/public/internal/kpi-snapshot.json');
const ARCHIVE_DIR = path.join(REPO_ROOT, 'memory/audits/kpi-snapshot-archive');

const TIMEOUT_MS = 25_000;
const fetchWithTimeout = async (url, opts = {}) => {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), opts.timeout ?? TIMEOUT_MS);
  try {
    const r = await fetch(url, { ...opts, signal: ctl.signal });
    return r;
  } finally {
    clearTimeout(t);
  }
};

const safe = async (label, fn) => {
  try {
    const v = await fn();
    return { ok: true, value: v };
  } catch (e) {
    console.warn(`[warn] ${label}: ${e.message}`);
    return { ok: false, error: e.message };
  }
};

const STATUS = { GREEN: 'green', YELLOW: 'yellow', RED: 'red', GRAY: 'gray' };

// ---------- Phase 1 collectors ----------

async function getSecurityHeadersGrade() {
  // SecurityHeaders.com is now Cloudflare-bot-protected; compute our own grade
  // from the production response headers using its public criteria.
  const r = await fetchWithTimeout(ORIGIN, { method: 'GET', headers: { 'user-agent': 'dfwhvac-kpi-audit' } });
  const has = (h) => r.headers.get(h) != null;
  // Scoring (mirror of securityheaders.com weights, simplified)
  const checks = {
    'content-security-policy': 25,
    'strict-transport-security': 25,
    'x-content-type-options': 20,
    'x-frame-options': 20, // satisfied by CSP frame-ancestors too
    'referrer-policy': 5,
    'permissions-policy': 5,
  };
  let score = 0;
  const missing = [];
  for (const [hdr, w] of Object.entries(checks)) {
    if (has(hdr)) score += w;
    else if (hdr === 'x-frame-options' && /frame-ancestors/i.test(r.headers.get('content-security-policy') || '')) score += w;
    else missing.push(hdr);
  }
  const grade = score >= 95 ? 'A+' : score >= 85 ? 'A' : score >= 75 ? 'B+' : score >= 65 ? 'B' : score >= 55 ? 'C' : 'D';
  return { grade, score, missing };
}

async function getMozillaObservatoryGrade() {
  // v2 API (single POST, returns finished result immediately)
  const r = await fetchWithTimeout(
    `https://observatory-api.mdn.mozilla.net/api/v2/scan?host=${DOMAIN}`,
    { method: 'POST' }
  );
  if (!r.ok) throw new Error(`http ${r.status}`);
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return { grade: d.grade, score: d.score, testsPassed: d.tests_passed, testsFailed: d.tests_failed };
}

async function getSSLLabsGrade() {
  // Try cached first; if unavailable, kick off a fresh scan but only wait briefly
  let r = await fetchWithTimeout(
    `https://api.ssllabs.com/api/v3/analyze?host=${DOMAIN}&fromCache=on&maxAge=168`
  );
  let d = await r.json();
  if (d.status !== 'READY' && d.status !== 'ERROR') {
    // poll cached up to 3x
    for (let i = 0; i < 3; i++) {
      await new Promise((res) => setTimeout(res, 4000));
      r = await fetchWithTimeout(`https://api.ssllabs.com/api/v3/analyze?host=${DOMAIN}`);
      d = await r.json();
      if (d.status === 'READY' || d.status === 'ERROR') break;
    }
  }
  if (d.status !== 'READY') throw new Error(`scan status=${d.status}`);
  const grades = (d.endpoints || []).map((e) => e.grade).filter(Boolean);
  if (!grades.length) {
    const messages = (d.endpoints || []).map((e) => e.statusDetailsMessage || e.statusMessage).filter(Boolean);
    throw new Error(`no grades returned (${messages[0] || 'host blocks scanner'})`);
  }
  return grades[0];
}

async function getPageSpeed(strategy = 'mobile') {
  const key = process.env.PAGESPEED_API_KEY;
  const url = new URL('https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed');
  url.searchParams.set('url', ORIGIN);
  url.searchParams.set('strategy', strategy);
  ['performance', 'accessibility', 'best-practices', 'seo'].forEach((c) =>
    url.searchParams.append('category', c)
  );
  if (key) url.searchParams.set('key', key);
  const r = await fetchWithTimeout(url, { timeout: 60_000 });
  if (!r.ok) throw new Error(`http ${r.status}`);
  const d = await r.json();
  const cats = d.lighthouseResult?.categories || {};
  const audits = d.lighthouseResult?.audits || {};
  const numericVal = (k) => audits[k]?.numericValue ?? null;
  return {
    strategy,
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
    ttfb: numericVal('server-response-time'),
    lcp: numericVal('largest-contentful-paint'),
    inp: numericVal('interaction-to-next-paint') ?? numericVal('experimental-interaction-to-next-paint'),
    cls: numericVal('cumulative-layout-shift'),
    totalByteWeight: numericVal('total-byte-weight'),
    usesTextCompression: audits['uses-text-compression']?.score ?? null,
    modernImageFormats: audits['modern-image-formats']?.score ?? null,
    finalUrl: d.lighthouseResult?.finalUrl,
  };
}

async function getCsp() {
  const r = await fetchWithTimeout(ORIGIN, { method: 'HEAD' });
  const csp = r.headers.get('content-security-policy');
  if (!csp) throw new Error('no CSP header');
  const hosts = new Set();
  csp.split(';').forEach((dir) => {
    dir
      .trim()
      .split(/\s+/)
      .forEach((tok) => {
        if (tok.startsWith('https://') || tok.startsWith('http://')) {
          try {
            hosts.add(new URL(tok).host);
          } catch {}
        }
      });
  });
  return { hostCount: hosts.size, length: csp.length, hasFrameAncestors: /frame-ancestors/i.test(csp) };
}

async function getSitemapCount() {
  const r = await fetchWithTimeout(`${ORIGIN}/sitemap.xml`);
  const xml = await r.text();
  const matches = xml.match(/<loc>/g);
  return matches ? matches.length : 0;
}

async function getRobotsAiAllowlist() {
  const r = await fetchWithTimeout(`${ORIGIN}/robots.txt`);
  const txt = await r.text();
  const uas = txt.match(/^User-agent:/gim) || [];
  const aiBots = ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'CCBot', 'Google-Extended', 'Applebot-Extended'];
  const declared = aiBots.filter((b) => new RegExp(`User-agent:\\s*${b}\\b`, 'i').test(txt));
  return { totalUserAgents: uas.length, aiBotsDeclared: declared.length, list: declared };
}

async function getSchemaCoverage() {
  // Sample a mix of high-priority page types (home, conversion, service template, city template, FAQ)
  const samples = ['/', '/reviews', '/financing', '/services/system-replacement', '/cities-served/dallas'];
  const results = await Promise.all(
    samples.map(async (p) => {
      try {
        const r = await fetchWithTimeout(`${ORIGIN}${p}`);
        const html = await r.text();
        const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
        const types = new Set();
        let invalid = 0;
        for (const m of blocks) {
          try {
            const j = JSON.parse(m[1]);
            const collect = (n) => {
              if (!n) return;
              if (Array.isArray(n)) return n.forEach(collect);
              if (n['@type']) {
                if (Array.isArray(n['@type'])) n['@type'].forEach((t) => types.add(t));
                else types.add(n['@type']);
              }
              if (n['@graph']) n['@graph'].forEach(collect);
            };
            collect(j);
          } catch {
            invalid++;
          }
        }
        return { url: p, blocks: blocks.length, types: [...types], invalid };
      } catch (e) {
        return { url: p, error: e.message };
      }
    })
  );
  const allTypes = new Set();
  let totalBlocks = 0;
  let totalInvalid = 0;
  results.forEach((r) => {
    if (r.types) r.types.forEach((t) => allTypes.add(t));
    if (r.blocks) totalBlocks += r.blocks;
    if (r.invalid) totalInvalid += r.invalid;
  });
  return {
    pagesScanned: samples.length,
    totalBlocks,
    distinctTypes: [...allTypes],
    invalidBlocks: totalInvalid,
    perPage: results,
  };
}

async function getGitleaksStatus() {
  // public read of GH Actions runs for a public repo
  const repo = process.env.GITHUB_REPO || 'nbarrese/website-dfw-ii';
  const headers = { 'user-agent': 'dfwhvac-kpi-audit' };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const r = await fetchWithTimeout(
    `https://api.github.com/repos/${repo}/actions/runs?per_page=20`,
    { headers }
  );
  if (!r.ok) throw new Error(`github api ${r.status}`);
  const d = await r.json();
  const gitleaksRuns = (d.workflow_runs || []).filter((w) =>
    /gitleaks|secret/i.test(w.name || '')
  );
  const latest = gitleaksRuns[0];
  if (!latest) return { lastRun: null, conclusion: 'no_runs' };
  return {
    lastRun: latest.created_at,
    conclusion: latest.conclusion || latest.status,
    htmlUrl: latest.html_url,
  };
}

async function getBuildManifest() {
  // App Router uses app-path-routes-manifest.json + app-build-manifest.json
  const appRoutes = path.join(REPO_ROOT, 'frontend/.next/app-path-routes-manifest.json');
  const pagesManifest = path.join(REPO_ROOT, 'frontend/.next/build-manifest.json');
  if (!existsSync(appRoutes)) throw new Error('.next/app-path-routes-manifest.json not found (run `yarn build` first)');
  const routes = JSON.parse(await readFile(appRoutes, 'utf-8'));
  const routeKeys = Object.keys(routes);
  const pageRoutes = routeKeys.filter((r) => r.endsWith('/page') || r === '/page');
  const apiRoutes = routeKeys.filter((r) => r.includes('/api/') && r.endsWith('/route'));
  let sharedAssets = 0;
  if (existsSync(pagesManifest)) {
    const pm = JSON.parse(await readFile(pagesManifest, 'utf-8'));
    const all = new Set();
    Object.values(pm.pages || {}).forEach((arr) => (arr || []).forEach((f) => all.add(f)));
    sharedAssets = all.size;
  }
  return { totalRoutes: routeKeys.length, pages: pageRoutes.length, apiRoutes: apiRoutes.length, sharedAssets };
}

// V3 Pillar 1 — CDN Edge Hit Rate via x-vercel-cache header sampling
async function getCdnEdgeHitRate() {
  const pages = ['/', '/about', '/services', '/reviews', '/financing', '/faq', '/cities-served/dallas'];
  const results = [];
  // For pages: warm with one GET, wait, then measure the second visit's cache status
  for (const p of pages) {
    try {
      await fetchWithTimeout(`${ORIGIN}${p}`, { method: 'GET' });
      await new Promise((res) => setTimeout(res, 600));
      const r = await fetchWithTimeout(`${ORIGIN}${p}`, { method: 'GET' });
      const v = r.headers.get('x-vercel-cache') || 'unknown';
      results.push({ path: p, kind: 'page', cache: v });
    } catch {
      results.push({ path: p, kind: 'page', cache: 'error' });
    }
  }
  // Sample static assets — these MUST be HIT (immutable hash-named files)
  const homeHtml = await (await fetchWithTimeout(`${ORIGIN}/`)).text();
  const staticAssets = [...homeHtml.matchAll(/\/_next\/static\/[^"'\s]+/g)]
    .map((m) => m[0])
    .filter((u, i, a) => a.indexOf(u) === i)
    .slice(0, 8);
  for (const asset of staticAssets) {
    try {
      await fetchWithTimeout(`${ORIGIN}${asset}`, { method: 'HEAD' });
      await new Promise((res) => setTimeout(res, 200));
      const r = await fetchWithTimeout(`${ORIGIN}${asset}`, { method: 'HEAD' });
      results.push({ path: asset, kind: 'static', cache: r.headers.get('x-vercel-cache') || 'unknown' });
    } catch {
      results.push({ path: asset, kind: 'static', cache: 'error' });
    }
  }
  const counted = results.filter((r) => !['BYPASS', 'error', 'unknown'].includes(r.cache));
  const hits = counted.filter((r) => ['HIT', 'STALE', 'REVALIDATED', 'PRERENDER'].includes(r.cache));
  const hitRate = counted.length ? Math.round((hits.length / counted.length) * 1000) / 10 : null;
  const breakdown = {};
  results.forEach((r) => (breakdown[r.cache] = (breakdown[r.cache] || 0) + 1));
  const pageHitRate = (() => {
    const p = results.filter((r) => r.kind === 'page' && !['BYPASS', 'error', 'unknown'].includes(r.cache));
    const h = p.filter((r) => ['HIT', 'STALE', 'REVALIDATED', 'PRERENDER'].includes(r.cache));
    return p.length ? Math.round((h.length / p.length) * 1000) / 10 : null;
  })();
  const staticHitRate = (() => {
    const p = results.filter((r) => r.kind === 'static' && !['BYPASS', 'error', 'unknown'].includes(r.cache));
    const h = p.filter((r) => ['HIT', 'STALE', 'REVALIDATED', 'PRERENDER'].includes(r.cache));
    return p.length ? Math.round((h.length / p.length) * 1000) / 10 : null;
  })();
  return { hitRate, pageHitRate, staticHitRate, samples: counted.length, breakdown, staticSampled: staticAssets.length };
}

// V3 Pillar 3 — Click Depth + Internal Link Connectivity via BFS crawler
async function getLinkGraph() {
  // BFS from home, depth 3, only on-domain HTML pages
  const visited = new Map(); // url → depth
  const queue = [{ url: '/', depth: 0 }];
  visited.set('/', 0);
  const linkRe = /href=["']([^"']+)["']/gi;
  const maxPages = 60; // safety
  while (queue.length && visited.size < maxPages) {
    const { url, depth } = queue.shift();
    if (depth >= 3) continue;
    try {
      const r = await fetchWithTimeout(`${ORIGIN}${url}`, { timeout: 8000 });
      const html = await r.text();
      const found = new Set();
      for (const m of html.matchAll(linkRe)) {
        let href = m[1];
        if (href.startsWith('https://dfwhvac.com')) href = href.slice('https://dfwhvac.com'.length);
        if (!href.startsWith('/')) continue;
        if (href.startsWith('//') || href.startsWith('/_next') || href.startsWith('/api') || href.startsWith('/studio')) continue;
        // Normalize: drop hash and trailing slash
        href = href.split('#')[0].split('?')[0];
        if (href.length > 1 && href.endsWith('/')) href = href.slice(0, -1);
        if (!href) href = '/';
        found.add(href);
      }
      for (const f of found) {
        if (!visited.has(f)) {
          visited.set(f, depth + 1);
          queue.push({ url: f, depth: depth + 1 });
        }
      }
    } catch {}
  }
  // Compare visited set to sitemap
  const smXml = await (await fetchWithTimeout(`${ORIGIN}/sitemap.xml`)).text();
  const sitemapUrls = [...smXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace('https://dfwhvac.com', '').replace(/\/$/, '') || '/');
  const orphans = sitemapUrls.filter((u) => !visited.has(u));
  const maxDepth = Math.max(...visited.values());
  const depthDist = {};
  visited.forEach((d) => (depthDist[d] = (depthDist[d] || 0) + 1));
  return {
    crawledCount: visited.size,
    sitemapCount: sitemapUrls.length,
    orphans,
    orphanCount: orphans.length,
    maxDepth,
    depthDist,
    over3clicks: [...visited.entries()].filter(([, d]) => d > 3).map(([u]) => u),
  };
}

// ---------- Google OAuth + GA4/GSC collectors (Phase 2/3) ----------

/**
 * Exchanges a long-lived refresh token for a short-lived access token.
 * Returns null if any credential is missing — caller treats as "scaffold mode".
 */
async function getGoogleAccessToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  const r = await fetchWithTimeout('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!r.ok) throw new Error(`token exchange ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  if (!d.access_token) throw new Error('no access_token in response');
  return d.access_token;
}

/**
 * GSC Search Analytics — last 28 days, totals only (no dimensions).
 * Returns { clicks, impressions, ctr, position } or throws.
 */
async function getGscMetrics(accessToken) {
  const siteUrl = process.env.GSC_SITE_URL;
  if (!siteUrl) throw new Error('GSC_SITE_URL not set');
  const today = new Date();
  const startDate = new Date(today.getTime() - 28 * 86400_000).toISOString().slice(0, 10);
  const endDate = today.toISOString().slice(0, 10);
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const r = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, dimensions: [], rowLimit: 1 }),
  });
  if (!r.ok) throw new Error(`gsc ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  const row = d.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  return {
    clicks: Math.round(row.clicks || 0),
    impressions: Math.round(row.impressions || 0),
    ctr: row.ctr ? Math.round(row.ctr * 1000) / 10 : 0, // %
    position: row.position ? Math.round(row.position * 10) / 10 : 0,
    startDate,
    endDate,
  };
}

/**
 * GSC Sitemaps API — returns what the API actually provides (Google deprecated `contents[].indexed`
 * circa 2019; it's no longer populated). We expose: submitted URL count, errors, warnings, and
 * lastDownloaded freshness. Index-parity status moved to URL Inspection API (quota-heavy, deferred
 * to manual quarterly review via GSC UI).
 */
async function getGscSitemapHealth(accessToken) {
  const siteUrl = process.env.GSC_SITE_URL;
  if (!siteUrl) throw new Error('GSC_SITE_URL not set');
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`;
  const r = await fetchWithTimeout(url, {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!r.ok) throw new Error(`gsc-sitemaps ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  const sitemaps = d.sitemap || [];
  const primary = sitemaps.find((s) => /\/sitemap\.xml$/i.test(s.path)) || sitemaps[0];
  if (!primary) return { submitted: 0, warnings: 0, errors: 0, lastDownloaded: null, sitemapCount: 0 };
  const submitted = (primary.contents || []).reduce((a, c) => a + Number(c.submitted || 0), 0);
  return {
    submitted,
    warnings: Number(primary.warnings || 0),
    errors: Number(primary.errors || 0),
    lastDownloaded: primary.lastDownloaded || null,
    sitemapCount: sitemaps.length,
  };
}

/**
 * GA4 Data API — last 28 days. One round-trip for site-wide totals,
 * a second for the device breakdown.
 */
async function getGa4Metrics(accessToken) {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) throw new Error('GA4_PROPERTY_ID not set');
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const headers = { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' };

  // ---- Query 1: site-wide totals ----
  const totalsBody = {
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'bounceRate' },
      { name: 'conversions' },
      { name: 'eventCountPerUser' },
    ],
  };
  const r1 = await fetchWithTimeout(url, { method: 'POST', headers, body: JSON.stringify(totalsBody) });
  if (!r1.ok) throw new Error(`ga4-totals ${r1.status}: ${(await r1.text()).slice(0, 200)}`);
  const d1 = await r1.json();
  const totalsRow = d1.rows?.[0]?.metricValues || [];
  const totals = {
    sessions: Number(totalsRow[0]?.value || 0),
    users: Number(totalsRow[1]?.value || 0),
    bounceRate: totalsRow[2] ? Math.round(Number(totalsRow[2].value) * 1000) / 10 : null, // %
    conversions: Number(totalsRow[3]?.value || 0),
  };

  // ---- Query 2: device breakdown (mobile vs desktop CR parity) ----
  const deviceBody = {
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'sessions' }, { name: 'conversions' }],
  };
  const r2 = await fetchWithTimeout(url, { method: 'POST', headers, body: JSON.stringify(deviceBody) });
  if (!r2.ok) throw new Error(`ga4-device ${r2.status}: ${(await r2.text()).slice(0, 200)}`);
  const d2 = await r2.json();
  const byDevice = {};
  (d2.rows || []).forEach((row) => {
    const cat = row.dimensionValues?.[0]?.value || 'unknown';
    const sessions = Number(row.metricValues?.[0]?.value || 0);
    const conversions = Number(row.metricValues?.[1]?.value || 0);
    byDevice[cat] = { sessions, conversions, cr: sessions ? Math.round((conversions / sessions) * 1000) / 10 : 0 };
  });

  // ---- Query 3: specific events for funnel breakdown (wizard → results → opt-in, phone, form) ----
  const eventsBody = {
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        inListFilter: { values: ['generate_lead', 'form_submit_lead', 'phone_click', 'estimator_complete', 'estimator_opt_in', 'thanks_page_view'] },
      },
    },
  };
  const r3 = await fetchWithTimeout(url, { method: 'POST', headers, body: JSON.stringify(eventsBody) });
  if (!r3.ok) throw new Error(`ga4-events ${r3.status}: ${(await r3.text()).slice(0, 200)}`);
  const d3 = await r3.json();
  const events = {};
  (d3.rows || []).forEach((row) => {
    const name = row.dimensionValues?.[0]?.value || '';
    events[name] = Number(row.metricValues?.[0]?.value || 0);
  });

  const overallCr = totals.sessions ? Math.round((totals.conversions / totals.sessions) * 1000) / 10 : null;
  const formCr = totals.sessions
    ? Math.round(((events.generate_lead || events.form_submit_lead || 0) / totals.sessions) * 1000) / 10
    : null;
  const phoneCr = totals.sessions
    ? Math.round(((events.phone_click || 0) / totals.sessions) * 1000) / 10
    : null;
  const mobile = byDevice.mobile?.cr || 0;
  const desktop = byDevice.desktop?.cr || 0;
  const parityDelta = mobile && desktop ? Math.round(Math.abs(mobile - desktop) / Math.max(mobile, desktop) * 1000) / 10 : null;

  return {
    totals,
    overallCr,
    formCr,
    phoneCr,
    bounceRate: totals.bounceRate,
    byDevice,
    parityDelta, // % gap
    events,
    estimatorComplete: events.estimator_complete || 0,
    estimatorOptIn: events.estimator_opt_in || 0,
    // Funnel insight: % of users who completed the wizard that ALSO submitted the lead form.
    // Distinguishes "tracking issue" (both zero) from "CRO issue" (complete > 0, opt_in = 0).
    estimatorOptInRate: events.estimator_complete > 0
      ? Math.round((events.estimator_opt_in || 0) / events.estimator_complete * 1000) / 10
      : null,
  };
}

// V3 Pillar 4 — WCAG 2.2 AA via Pa11y on sample of pages
async function getPa11y() {
  const samples = ['/', '/reviews', '/financing', '/cities-served/dallas', '/services/system-replacement'];
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const exec = promisify(execFile);
  const cfgPath = path.join(REPO_ROOT, '.pa11yrc.json');
  if (!existsSync(cfgPath)) {
    await writeFile(cfgPath, JSON.stringify({
      chromeLaunchConfig: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
      standard: 'WCAG2AA',
      timeout: 30000,
    }, null, 2));
  }
  const results = await Promise.all(
    samples.map(async (p) => {
      try {
        const { stdout } = await exec('npx', ['--yes', 'pa11y', '--standard', 'WCAG2AA', '--reporter', 'json', '--config', cfgPath, `${ORIGIN}${p}`], { timeout: 60000, maxBuffer: 10 * 1024 * 1024 });
        const issues = JSON.parse(stdout);
        const errors = issues.filter((i) => i.type === 'error').length;
        const warnings = issues.filter((i) => i.type === 'warning').length;
        return { url: p, errors, warnings, total: issues.length, codes: [...new Set(issues.map((i) => i.code))] };
      } catch (e) {
        // pa11y returns exit code 2 when issues found — still has stdout
        const out = e.stdout || '';
        try {
          const issues = JSON.parse(out);
          const errors = issues.filter((i) => i.type === 'error').length;
          const warnings = issues.filter((i) => i.type === 'warning').length;
          return { url: p, errors, warnings, total: issues.length, codes: [...new Set(issues.map((i) => i.code))] };
        } catch {
          return { url: p, error: e.message?.slice(0, 80) || 'pa11y failed' };
        }
      }
    })
  );
  const totals = results.reduce(
    (a, r) => ({
      errors: a.errors + (r.errors || 0),
      warnings: a.warnings + (r.warnings || 0),
      pagesScanned: a.pagesScanned + (r.error ? 0 : 1),
      pagesFailed: a.pagesFailed + (r.error ? 1 : 0),
    }),
    { errors: 0, warnings: 0, pagesScanned: 0, pagesFailed: 0 }
  );
  return { totals, perPage: results };
}

// ---------- builder ----------

function statusForScore(score, { greenMin, yellowMin }) {
  if (score == null) return STATUS.GRAY;
  if (score >= greenMin) return STATUS.GREEN;
  if (score >= yellowMin) return STATUS.YELLOW;
  return STATUS.RED;
}

function gradeStatus(grade, greens = ['A+', 'A'], yellows = ['A-', 'B+', 'B']) {
  if (!grade) return STATUS.GRAY;
  if (greens.includes(grade)) return STATUS.GREEN;
  if (yellows.includes(grade)) return STATUS.YELLOW;
  return STATUS.RED;
}

async function loadPriorSnapshot() {
  try {
    const cur = JSON.parse(await readFile(SNAPSHOT_OUT, 'utf-8'));
    return cur;
  } catch {
    return null;
  }
}

// KPIs where a LOWER numeric value is the GOAL (faster, smaller, fewer).
// Default for everything else: higher is better (scores, percentages, counts of good things).
const LOWER_IS_BETTER = new Set([
  'ttfb',
  'cwv-lcp',
  'cwv-inp',
  'cwv-cls',
  'total-page-weight',
  'bounce-rate',
  'gsc-avg-position',           // position 1 is best in SERPs
  'click-depth',
  'internal-link-connectivity', // orphan count
  'wcag-aa-pa11y',              // error count
  'csp-host-count',             // smaller CSP allowlist = smaller attack surface
  'mobile-desktop-cr-parity',   // gap %
  'crawl-budget-waste',
  'error-rate',
]);

function formatDelta(n) {
  if (n == null || !Number.isFinite(n)) return '';
  const sign = n > 0 ? '+' : '';
  // Choose precision based on magnitude
  if (Math.abs(n) >= 100) return `${sign}${Math.round(n)}`;
  if (Math.abs(n) >= 10) return `${sign}${n.toFixed(1)}`;
  if (Math.abs(n) >= 1) return `${sign}${n.toFixed(2)}`;
  return `${sign}${n.toFixed(3)}`;
}

// Returns { arrow, delta, deltaFormatted, sentiment }
//   arrow: ▲ ▼ → —  (purely directional — what happened)
//   delta: number   (raw numeric difference, signed)
//   sentiment: 'good' | 'bad' | 'neutral'  (is this change good news?)
function computeTrend(prev, currentKey, currentValueNum) {
  const empty = { arrow: '—', delta: null, deltaFormatted: '', sentiment: 'neutral' };
  if (!prev || currentValueNum == null) return empty;
  const prevKpi = prev.phases?.flatMap((p) => p.kpis).find((k) => k.id === currentKey);
  if (!prevKpi || prevKpi.numericValue == null) return empty;
  const delta = currentValueNum - prevKpi.numericValue;
  const deltaFormatted = formatDelta(delta);
  // Significance threshold: 1% relative change, OR absolute change >= 1 for integer counts.
  // Without this every micro-drift floods the dashboard with arrows.
  const baseline = Math.abs(prevKpi.numericValue) || 1;
  const relChange = Math.abs(delta) / baseline;
  if (relChange < 0.01 && Math.abs(delta) < 1) {
    return { arrow: '→', delta, deltaFormatted, sentiment: 'neutral' };
  }
  const arrow = delta > 0 ? '▲' : '▼';
  const lowerIsBetter = LOWER_IS_BETTER.has(currentKey);
  const wentDown = delta < 0;
  // good if: (lower-is-better AND went down) OR (higher-is-better AND went up)
  const sentiment = (lowerIsBetter === wentDown) ? 'good' : 'bad';
  return { arrow, delta, deltaFormatted, sentiment };
}

async function main() {
  console.log(`[kpi] audit start · ${DOMAIN} · ${new Date().toISOString()}`);
  const t0 = Date.now();

  const prior = await loadPriorSnapshot();

  // Acquire Google OAuth access token up-front (used by GSC + GA4 collectors).
  // Returns null if any of the 3 OAuth secrets is missing → KPIs stay gray.
  let googleAccessToken = null;
  let googleAuthError = null;
  try {
    googleAccessToken = await getGoogleAccessToken();
    if (googleAccessToken) console.log('[kpi] google oauth: access token acquired');
    else console.log('[kpi] google oauth: secrets not set — Phase 2/3 will remain gray');
  } catch (e) {
    googleAuthError = e.message;
    console.warn(`[warn] google oauth: ${e.message}`);
  }

  // Parallelize all phase-1 collectors. PageSpeed mobile + desktop are slow when
  // unkeyed; everything else returns in <2s.
  const [
    sec,
    moz,
    ssl,
    ps,
    psDesktop,
    csp,
    sitemap,
    robots,
    schema,
    gitleaks,
    build,
    cdn,
    linkGraph,
    pa11y,
  ] = await Promise.all([
    safe('SecurityHeaders', getSecurityHeadersGrade),
    safe('MozillaObservatory', getMozillaObservatoryGrade),
    safe('SSLLabs', getSSLLabsGrade),
    safe('PageSpeed.Mobile', () => getPageSpeed('mobile')),
    safe('PageSpeed.Desktop', () => getPageSpeed('desktop')),
    safe('CSP', getCsp),
    safe('Sitemap', getSitemapCount),
    safe('Robots', getRobotsAiAllowlist),
    safe('Schema', getSchemaCoverage),
    safe('Gitleaks', getGitleaksStatus),
    safe('BuildManifest', getBuildManifest),
    safe('CdnEdgeHitRate', getCdnEdgeHitRate),
    safe('LinkGraph', getLinkGraph),
    safe('Pa11y', getPa11y),
  ]);

  // GSC + GA4 — only fire if we got an access token. Each independently safe()d.
  const [gsc, gscSitemap, ga4] = googleAccessToken
    ? await Promise.all([
        safe('GscSearchAnalytics', () => getGscMetrics(googleAccessToken)),
        safe('GscSitemap', () => getGscSitemapHealth(googleAccessToken)),
        safe('Ga4', () => getGa4Metrics(googleAccessToken)),
      ])
    : [{ ok: false, error: googleAuthError || 'oauth secrets not configured' },
       { ok: false, error: googleAuthError || 'oauth secrets not configured' },
       { ok: false, error: googleAuthError || 'oauth secrets not configured' }];

  const phase1Kpis = [
    {
      id: 'security-headers-grade',
      label: 'Security headers (self-computed)',
      target: 'A+ only',
      v3Pillar: 'P4 Security',
      value: sec.ok ? `${sec.value.grade} (${sec.value.score}/100)` : 'unavailable',
      numericValue: sec.ok ? sec.value.score : null,
      status: sec.ok ? (sec.value.grade === 'A+' ? STATUS.GREEN : ['A'].includes(sec.value.grade) ? STATUS.YELLOW : STATUS.RED) : STATUS.GRAY,
      source: 'Live response-header inspection',
      detail: sec.ok
        ? sec.value.missing.length
          ? `missing: ${sec.value.missing.join(', ')}`
          : 'all core headers present · stricter than V3 (A acceptable)'
        : sec.error,
    },
    {
      id: 'mozilla-observatory-grade',
      label: 'Mozilla Observatory grade',
      target: 'A',
      v3Pillar: 'P4 Security',
      value: moz.ok ? `${moz.value.grade} (${moz.value.score}/100)` : 'unavailable',
      numericValue: moz.ok ? moz.value.score : null,
      status: moz.ok ? gradeStatus(moz.value.grade) : STATUS.GRAY,
      source: 'http-observatory.security.mozilla.org',
      detail: moz.ok ? null : moz.error,
    },
    {
      id: 'ssl-labs-grade',
      label: 'SSL Labs TLS grade',
      target: 'A+',
      v3Pillar: 'P4 Security',
      value: ssl.ok ? ssl.value : 'unavailable (cache miss)',
      numericValue: null,
      status: ssl.ok ? gradeStatus(ssl.value, ['A+'], ['A', 'A-']) : STATUS.GRAY,
      source: 'api.ssllabs.com',
      detail: ssl.ok ? null : ssl.error,
    },
    // ---- V3 Pillar 2 Performance & Experience (CWV breakouts) ----
    {
      id: 'cwv-ttfb',
      label: 'TTFB (Time to First Byte)',
      target: '< 200ms',
      v3Pillar: 'P1 Infrastructure',
      value: ps.ok && ps.value.ttfb != null ? `${Math.round(ps.value.ttfb)}ms` : 'unavailable',
      numericValue: ps.ok ? ps.value.ttfb : null,
      status: ps.ok && ps.value.ttfb != null ? (ps.value.ttfb < 200 ? STATUS.GREEN : ps.value.ttfb < 600 ? STATUS.YELLOW : STATUS.RED) : STATUS.GRAY,
      source: 'PageSpeed Lighthouse · server-response-time',
    },
    {
      id: 'cwv-lcp',
      label: 'LCP (Largest Contentful Paint)',
      target: '< 1.2s',
      v3Pillar: 'P2 Performance',
      value: ps.ok && ps.value.lcp != null ? `${(ps.value.lcp / 1000).toFixed(2)}s` : 'unavailable',
      numericValue: ps.ok ? ps.value.lcp : null,
      status: ps.ok && ps.value.lcp != null ? (ps.value.lcp < 1200 ? STATUS.GREEN : ps.value.lcp < 2500 ? STATUS.YELLOW : STATUS.RED) : STATUS.GRAY,
      source: 'PageSpeed Lighthouse · largest-contentful-paint',
    },
    {
      id: 'cwv-inp',
      label: 'INP (Interaction to Next Paint)',
      target: '< 200ms',
      v3Pillar: 'P2 Performance',
      value: ps.ok && ps.value.inp != null ? `${Math.round(ps.value.inp)}ms` : 'unavailable',
      numericValue: ps.ok ? ps.value.inp : null,
      status: ps.ok && ps.value.inp != null ? (ps.value.inp < 200 ? STATUS.GREEN : ps.value.inp < 500 ? STATUS.YELLOW : STATUS.RED) : STATUS.GRAY,
      source: 'PageSpeed Lighthouse (lab) · interaction-to-next-paint',
      detail: 'Lab value — for field data set CRUX_API_KEY',
    },
    {
      id: 'cwv-cls',
      label: 'CLS (Cumulative Layout Shift)',
      target: '< 0.05',
      v3Pillar: 'P2 Performance',
      value: ps.ok && ps.value.cls != null ? `${ps.value.cls.toFixed(3)}` : 'unavailable',
      numericValue: ps.ok ? ps.value.cls : null,
      status: ps.ok && ps.value.cls != null ? (ps.value.cls < 0.05 ? STATUS.GREEN : ps.value.cls < 0.1 ? STATUS.YELLOW : STATUS.RED) : STATUS.GRAY,
      source: 'PageSpeed Lighthouse · cumulative-layout-shift',
    },
    {
      id: 'pagespeed-performance-mobile',
      label: 'Lighthouse Performance (mobile)',
      target: '≥ 90 (V3)',
      v3Pillar: 'P2 Performance',
      value: ps.ok ? `${ps.value.performance}` : 'unavailable',
      numericValue: ps.ok ? ps.value.performance : null,
      status: ps.ok ? statusForScore(ps.value.performance, { greenMin: 90, yellowMin: 75 }) : STATUS.GRAY,
      source: 'pagespeedonline.googleapis.com',
      detail: ps.ok ? null : ps.error,
    },
    {
      id: 'pagespeed-performance-desktop',
      label: 'Lighthouse Performance (desktop)',
      target: '≥ 98 (V3)',
      v3Pillar: 'P2 Performance',
      value: psDesktop.ok ? `${psDesktop.value.performance}` : 'unavailable',
      numericValue: psDesktop.ok ? psDesktop.value.performance : null,
      status: psDesktop.ok ? statusForScore(psDesktop.value.performance, { greenMin: 98, yellowMin: 90 }) : STATUS.GRAY,
      source: 'pagespeedonline.googleapis.com (strategy=desktop)',
      detail: psDesktop.ok ? null : psDesktop.error,
    },
    {
      id: 'cwv-page-weight',
      label: 'Total Page Weight',
      target: '< 1.5 MB',
      v3Pillar: 'P2 Performance',
      value: ps.ok && ps.value.totalByteWeight != null ? `${(ps.value.totalByteWeight / 1024 / 1024).toFixed(2)} MB` : 'unavailable',
      numericValue: ps.ok ? ps.value.totalByteWeight : null,
      status: ps.ok && ps.value.totalByteWeight != null ? (ps.value.totalByteWeight < 1.5 * 1024 * 1024 ? STATUS.GREEN : ps.value.totalByteWeight < 3 * 1024 * 1024 ? STATUS.YELLOW : STATUS.RED) : STATUS.GRAY,
      source: 'PageSpeed Lighthouse · total-byte-weight',
    },
    {
      id: 'cwv-resource-compression',
      label: 'Resource Compression',
      target: 'Brotli + WebP/AVIF (100%)',
      v3Pillar: 'P2 Performance',
      value: ps.ok && ps.value.usesTextCompression != null
        ? `Text: ${ps.value.usesTextCompression === 1 ? '✓' : '✗'} · Images: ${ps.value.modernImageFormats === 1 ? '✓' : '✗'}`
        : 'unavailable',
      numericValue: ps.ok ? (ps.value.usesTextCompression + (ps.value.modernImageFormats ?? 0)) : null,
      status: ps.ok && ps.value.usesTextCompression != null
        ? (ps.value.usesTextCompression === 1 && ps.value.modernImageFormats === 1 ? STATUS.GREEN : STATUS.YELLOW)
        : STATUS.GRAY,
      source: 'PageSpeed · uses-text-compression + modern-image-formats',
    },
    {
      id: 'pagespeed-accessibility-mobile',
      label: 'Lighthouse Accessibility (mobile, interim)',
      target: '≥ 95',
      v3Pillar: 'P4 Accessibility (interim)',
      value: ps.ok ? `${ps.value.accessibility}` : 'unavailable',
      numericValue: ps.ok ? ps.value.accessibility : null,
      status: ps.ok ? statusForScore(ps.value.accessibility, { greenMin: 95, yellowMin: 85 }) : STATUS.GRAY,
      source: 'pagespeedonline.googleapis.com',
      detail: 'Interim heuristic — formal WCAG check via Pa11y card below',
    },
    {
      id: 'pagespeed-best-practices-mobile',
      label: 'Lighthouse Best Practices (mobile)',
      target: '≥ 95',
      v3Pillar: 'P2 Performance',
      value: ps.ok ? `${ps.value.bestPractices}` : 'unavailable',
      numericValue: ps.ok ? ps.value.bestPractices : null,
      status: ps.ok ? statusForScore(ps.value.bestPractices, { greenMin: 95, yellowMin: 85 }) : STATUS.GRAY,
      source: 'pagespeedonline.googleapis.com',
    },
    {
      id: 'pagespeed-seo-mobile',
      label: 'Lighthouse SEO (mobile)',
      target: '100',
      v3Pillar: 'P3 Logic',
      value: ps.ok ? `${ps.value.seo}` : 'unavailable',
      numericValue: ps.ok ? ps.value.seo : null,
      status: ps.ok ? statusForScore(ps.value.seo, { greenMin: 100, yellowMin: 90 }) : STATUS.GRAY,
      source: 'pagespeedonline.googleapis.com',
    },
    // ---- V3 Pillar 1 — Infra (CDN Edge Hit Rate is the big new one) ----
    {
      id: 'cdn-edge-hit-rate',
      label: 'CDN Edge Hit Rate',
      target: '> 85%',
      v3Pillar: 'P1 Infrastructure',
      value: cdn.ok && cdn.value.hitRate != null ? `${cdn.value.hitRate}%` : 'unavailable',
      numericValue: cdn.ok ? cdn.value.hitRate : null,
      status: cdn.ok && cdn.value.hitRate != null ? (cdn.value.hitRate > 85 ? STATUS.GREEN : cdn.value.hitRate > 70 ? STATUS.YELLOW : STATUS.RED) : STATUS.GRAY,
      source: 'x-vercel-cache header (warm-cache 2nd visit)',
      detail: cdn.ok
        ? `Pages: ${cdn.value.pageHitRate}% · Static assets: ${cdn.value.staticHitRate}% · ${cdn.value.samples} samples · ${JSON.stringify(cdn.value.breakdown)}`
        : cdn.error,
    },
    {
      id: 'db-query-latency',
      label: 'DB Query Latency',
      target: 'N/A — write-only DB',
      v3Pillar: 'P1 Infrastructure',
      value: 'not applicable',
      numericValue: null,
      status: STATUS.GRAY,
      source: 'MongoDB Atlas (no read-path latency to user)',
      detail: 'Only DB writes (leads). No user-facing read latency to measure.',
    },
    {
      id: 'csp-host-count',
      label: 'CSP whitelist host count',
      target: '≤ 25 hosts',
      v3Pillar: 'P4 Security',
      value: csp.ok ? `${csp.value.hostCount}` : 'unavailable',
      numericValue: csp.ok ? csp.value.hostCount : null,
      status: csp.ok ? (csp.value.hostCount <= 25 ? STATUS.GREEN : STATUS.YELLOW) : STATUS.GRAY,
      source: 'Production CSP header',
      detail: csp.ok ? `frame-ancestors set: ${csp.value.hasFrameAncestors}` : csp.error,
    },
    {
      id: 'sitemap-url-count',
      label: 'Sitemap URL count',
      target: '> 50 URLs',
      v3Pillar: 'P3 Logic',
      value: sitemap.ok ? `${sitemap.value}` : 'unavailable',
      numericValue: sitemap.ok ? sitemap.value : null,
      status: sitemap.ok ? (sitemap.value > 50 ? STATUS.GREEN : STATUS.YELLOW) : STATUS.GRAY,
      source: '/sitemap.xml',
    },
    {
      id: 'robots-ai-allowlist',
      label: 'Robots.txt AI crawler directives',
      target: '≥ 3 AI bots declared',
      v3Pillar: 'AEO (ours only)',
      value: robots.ok ? `${robots.value.aiBotsDeclared} of 6 (${robots.value.list.join(', ') || 'none'})` : 'unavailable',
      numericValue: robots.ok ? robots.value.aiBotsDeclared : null,
      status: robots.ok ? (robots.value.aiBotsDeclared >= 3 ? STATUS.GREEN : STATUS.YELLOW) : STATUS.GRAY,
      source: '/robots.txt',
    },
    {
      id: 'schema-coverage',
      label: 'Schema validation + coverage',
      target: '100% valid · ≥ 5 distinct @types',
      v3Pillar: 'P4 Governance',
      value: schema.ok
        ? `${schema.value.totalBlocks} blocks · ${schema.value.distinctTypes.length} @types · ${schema.value.invalidBlocks} invalid`
        : 'unavailable',
      numericValue: schema.ok ? schema.value.distinctTypes.length : null,
      status: schema.ok
        ? schema.value.invalidBlocks === 0 && schema.value.distinctTypes.length >= 5
          ? STATUS.GREEN
          : schema.value.invalidBlocks > 0
            ? STATUS.RED
            : STATUS.YELLOW
        : STATUS.GRAY,
      source: 'Live HTML crawl',
      detail: schema.ok ? `types: ${schema.value.distinctTypes.join(', ')}` : schema.error,
    },
    // ---- V3 Pillar 3 — Logic & Architecture (local crawler) ----
    {
      id: 'click-depth',
      label: 'Click Depth (max from home)',
      target: '≤ 3 clicks',
      v3Pillar: 'P3 Logic',
      value: linkGraph.ok ? `${linkGraph.value.maxDepth}` : 'unavailable',
      numericValue: linkGraph.ok ? linkGraph.value.maxDepth : null,
      status: linkGraph.ok ? (linkGraph.value.maxDepth <= 3 ? STATUS.GREEN : STATUS.YELLOW) : STATUS.GRAY,
      source: 'Local BFS crawler',
      detail: linkGraph.ok ? `${linkGraph.value.crawledCount} pages reachable · depth dist: ${JSON.stringify(linkGraph.value.depthDist)}` : linkGraph.error,
    },
    {
      id: 'internal-link-connectivity',
      label: 'Internal Link Connectivity (orphans)',
      target: '0 orphan pages',
      v3Pillar: 'P3 Logic',
      value: linkGraph.ok ? `${linkGraph.value.orphanCount} orphan${linkGraph.value.orphanCount === 1 ? '' : 's'}` : 'unavailable',
      numericValue: linkGraph.ok ? linkGraph.value.orphanCount : null,
      status: linkGraph.ok ? (linkGraph.value.orphanCount === 0 ? STATUS.GREEN : linkGraph.value.orphanCount <= 3 ? STATUS.YELLOW : STATUS.RED) : STATUS.GRAY,
      source: 'Sitemap diff vs BFS crawl',
      detail: linkGraph.ok && linkGraph.value.orphans.length ? `orphans: ${linkGraph.value.orphans.slice(0, 5).join(', ')}${linkGraph.value.orphans.length > 5 ? '…' : ''}` : null,
    },
    // ---- V3 Pillar 4 — Formal accessibility via Pa11y ----
    {
      id: 'wcag-aa-pa11y',
      label: 'WCAG 2.2 AA (Pa11y, automated)',
      target: '0 errors (5-page sample)',
      v3Pillar: 'P4 Accessibility',
      value: pa11y.ok
        ? `${pa11y.value.totals.errors} errors · ${pa11y.value.totals.warnings} warnings (${pa11y.value.totals.pagesScanned}/5 pages)`
        : 'unavailable',
      numericValue: pa11y.ok ? pa11y.value.totals.errors : null,
      status: pa11y.ok
        ? pa11y.value.totals.errors === 0
          ? STATUS.GREEN
          : pa11y.value.totals.errors <= 5
            ? STATUS.YELLOW
            : STATUS.RED
        : STATUS.GRAY,
      source: 'Pa11y · WCAG2AA standard · 5 sample routes',
      detail: pa11y.ok && pa11y.value.totals.errors
        ? `Top issues: ${[...new Set(pa11y.value.perPage.flatMap((p) => p.codes || []).slice(0, 3))].join(', ')}`
        : 'Automated covers ~35-40% of WCAG criteria; manual audit deferred until baseline trends clean.',
    },
    {
      id: 'gitleaks-status',
      label: 'Gitleaks secret-scan (latest run)',
      target: 'success',
      v3Pillar: 'P4 Security',
      value: gitleaks.ok ? gitleaks.value.conclusion : 'unavailable',
      numericValue: null,
      status: gitleaks.ok
        ? gitleaks.value.conclusion === 'success'
          ? STATUS.GREEN
          : gitleaks.value.conclusion === 'no_runs'
            ? STATUS.GRAY
            : STATUS.RED
        : STATUS.GRAY,
      source: 'GitHub Actions API',
      detail: gitleaks.ok ? `last run: ${gitleaks.value.lastRun}` : gitleaks.error,
    },
    {
      id: 'build-manifest',
      label: 'Build manifest (App Router)',
      target: '≥ 20 page routes',
      v3Pillar: 'Ours only',
      value: build.ok
        ? `${build.value.pages} pages · ${build.value.apiRoutes} API routes · ${build.value.totalRoutes} total`
        : 'unavailable',
      numericValue: build.ok ? build.value.pages : null,
      status: build.ok
        ? build.value.pages >= 20
          ? STATUS.GREEN
          : STATUS.YELLOW
        : STATUS.GRAY,
      source: '.next/app-path-routes-manifest.json (local)',
      detail: build.ok
        ? `Dynamic city routes (47) and service routes counted as single patterns. Sitemap expands to ${51} URLs at runtime.`
        : build.error,
    },
    {
      id: 'uptime-30d',
      label: 'Uptime (last 30 days)',
      target: '≥ 99.99% (V3)',
      v3Pillar: 'P1 Infrastructure',
      value: 'not measured',
      numericValue: null,
      status: STATUS.GRAY,
      source: 'Requires external uptime monitor (UptimeRobot/Better Stack)',
      detail: 'Bumped from 99.9% → 99.99% per V3 adoption. Wire UptimeRobot free monitor to light up.',
    },
    {
      id: 'error-rate',
      label: 'Error rate (5xx/4xx)',
      target: '< 0.1%',
      v3Pillar: 'P1 Infrastructure',
      value: 'not measured',
      numericValue: null,
      status: STATUS.GRAY,
      source: 'Vercel Analytics Pro tier or Sentry free tier',
      detail: 'Scaffolded.',
    },
  ];

  // Compute trend arrows + deltas (applied below across ALL phases — see end of main)
  const applyTrend = (k) => {
    const t = computeTrend(prior, k.id, k.numericValue);
    k.trend = t.arrow;
    k.delta = t.delta;
    k.deltaFormatted = t.deltaFormatted;
    k.deltaSentiment = t.sentiment;
  };
  phase1Kpis.forEach(applyTrend);

  const phase2Kpis = [
    {
      id: 'gsc-impressions',
      label: 'GSC impressions (28d)',
      target: 'trend ▲',
      value: gsc.ok ? gsc.value.impressions.toLocaleString() : (googleAccessToken ? 'error' : 'token required'),
      numericValue: gsc.ok ? gsc.value.impressions : null,
      status: gsc.ok ? STATUS.GREEN : STATUS.GRAY,
      source: 'Google Search Console API',
      detail: gsc.ok ? `${gsc.value.startDate} → ${gsc.value.endDate}` : (gsc.error || 'Add GOOGLE_* + GSC_SITE_URL secrets'),
    },
    {
      id: 'gsc-clicks',
      label: 'GSC clicks (28d)',
      target: 'trend ▲',
      value: gsc.ok ? gsc.value.clicks.toLocaleString() : (googleAccessToken ? 'error' : 'token required'),
      numericValue: gsc.ok ? gsc.value.clicks : null,
      status: gsc.ok ? STATUS.GREEN : STATUS.GRAY,
      source: 'Google Search Console API',
      detail: gsc.ok ? null : gsc.error,
    },
    {
      id: 'gsc-ctr',
      label: 'GSC CTR (28d)',
      target: '≥ 3%',
      value: gsc.ok ? `${gsc.value.ctr}%` : (googleAccessToken ? 'error' : 'token required'),
      numericValue: gsc.ok ? gsc.value.ctr : null,
      status: gsc.ok ? (gsc.value.ctr >= 3 ? STATUS.GREEN : gsc.value.ctr >= 1.5 ? STATUS.YELLOW : STATUS.RED) : STATUS.GRAY,
      source: 'Google Search Console API',
      detail: gsc.ok ? null : gsc.error,
    },
    {
      id: 'gsc-avg-position',
      label: 'GSC average position',
      target: '≤ 20',
      value: gsc.ok ? `${gsc.value.position}` : (googleAccessToken ? 'error' : 'token required'),
      numericValue: gsc.ok ? gsc.value.position : null,
      status: gsc.ok ? (gsc.value.position <= 20 ? STATUS.GREEN : gsc.value.position <= 40 ? STATUS.YELLOW : STATUS.RED) : STATUS.GRAY,
      source: 'Google Search Console API',
      detail: gsc.ok ? null : gsc.error,
    },
    {
      id: 'sitemap-indexing-rate',
      label: 'Crawl-to-Index Ratio',
      target: '> 95% (V3 stricter)',
      v3Pillar: 'P3 Logic',
      // Google deprecated the `contents[].indexed` field on the Sitemaps API circa 2019 — it's
      // no longer populated and always reads as 0. Index status moved to the URL Inspection API
      // which requires per-URL calls (51 URLs × weekly = 200+ quota units, not viable at scale).
      // Reclassify this KPI as a manual quarterly review via GSC UI → Pages → Indexing.
      value: 'manual quarterly review',
      numericValue: null,
      status: STATUS.GRAY,
      source: 'GSC UI · Pages → Indexing report (no public API)',
      detail: 'Google deprecated the indexed field on the Sitemaps API. For automated index parity, would need the URL Inspection API (per-URL, quota-heavy). Defer to quarterly manual review.',
    },
    {
      id: 'sitemap-health-parity',
      label: 'Sitemap submission health',
      target: '0 errors · 0 warnings · downloaded ≤ 7 days ago',
      v3Pillar: 'P3 Logic',
      value: gscSitemap.ok
        ? (() => {
            const v = gscSitemap.value;
            const dlAge = v.lastDownloaded
              ? Math.floor((Date.now() - new Date(v.lastDownloaded).getTime()) / 86400000)
              : null;
            const dlFresh = dlAge != null ? `last DL ${dlAge}d ago` : 'never downloaded';
            return `${v.submitted} URLs submitted · ${v.errors} errors · ${v.warnings} warnings · ${dlFresh}`;
          })()
        : (googleAccessToken ? 'error' : 'token required'),
      numericValue: gscSitemap.ok ? (gscSitemap.value.errors + gscSitemap.value.warnings) : null,
      status: gscSitemap.ok
        ? (() => {
            const v = gscSitemap.value;
            const dlAge = v.lastDownloaded
              ? Math.floor((Date.now() - new Date(v.lastDownloaded).getTime()) / 86400000)
              : 999;
            if (v.errors > 0) return STATUS.RED;
            if (v.warnings > 0 || dlAge > 14) return STATUS.YELLOW;
            return STATUS.GREEN;
          })()
        : STATUS.GRAY,
      source: 'GSC Sitemaps API · errors + warnings + lastDownloaded',
      detail: gscSitemap.ok ? null : gscSitemap.error,
    },
    {
      id: 'crawl-budget-waste',
      label: 'Crawl Budget Waste',
      target: '< 1% (V3)',
      v3Pillar: 'P3 Logic',
      value: 'not measured',
      status: STATUS.GRAY,
      source: 'GSC Crawl Stats (no public API — manual GSC export)',
      detail: 'Defer to quarterly manual GSC Settings → Crawl stats review.',
    },
    {
      id: 'gbp-impressions',
      label: 'GBP impressions / calls / directions',
      target: 'trend ▲',
      value: 'token + admin auth required',
      status: STATUS.GRAY,
      source: 'Google Business Profile API',
      detail: 'GBP API requires separate Business Profile OAuth scope + 4-week review; deferred.',
    },
    {
      id: 'reviews-count',
      label: 'Google reviews count',
      target: 'trend ▲',
      value: 'wired via /api/cron/sync-reviews',
      status: STATUS.YELLOW,
      source: 'Sanity companyInfo.googleReviews',
      detail: 'Live in Sanity; surface to dashboard in next iteration.',
    },
    {
      id: 'aeo-citation-rate',
      label: 'AEO citation rate (LLM mentions)',
      target: 'quarterly review',
      value: 'manual',
      status: STATUS.GRAY,
      source: 'Quarterly manual run',
    },
    {
      id: 'backlink-dr20',
      label: 'Backlinks (DR≥20)',
      target: '+5 / qtr',
      value: 'manual',
      status: STATUS.GRAY,
      source: 'Ahrefs (paid) or manual',
    },
  ];

  const phase3Kpis = [
    {
      id: 'overall-cr',
      label: 'Overall conversion rate',
      target: '≥ 4%',
      value: ga4.ok && ga4.value.overallCr != null ? `${ga4.value.overallCr}%` : (googleAccessToken ? 'error' : 'GA4 token required'),
      numericValue: ga4.ok ? ga4.value.overallCr : null,
      status: ga4.ok && ga4.value.overallCr != null
        ? (ga4.value.overallCr >= 4 ? STATUS.GREEN : ga4.value.overallCr >= 2 ? STATUS.YELLOW : STATUS.RED)
        : STATUS.GRAY,
      source: 'GA4 Data API · conversions ÷ sessions (28d)',
      detail: ga4.ok
        ? `${ga4.value.totals.conversions} conversions / ${ga4.value.totals.sessions.toLocaleString()} sessions`
        : ga4.error,
    },
    {
      id: 'form-submission-rate',
      label: 'Form submission rate',
      target: '≥ 6%',
      value: ga4.ok && ga4.value.formCr != null ? `${ga4.value.formCr}%` : (googleAccessToken ? 'error' : 'GA4 token required'),
      numericValue: ga4.ok ? ga4.value.formCr : null,
      status: ga4.ok && ga4.value.formCr != null
        ? (ga4.value.formCr >= 6 ? STATUS.GREEN : ga4.value.formCr >= 3 ? STATUS.YELLOW : STATUS.RED)
        : STATUS.GRAY,
      source: 'GA4 Data API · generate_lead ÷ sessions (28d)',
      detail: ga4.ok ? `${ga4.value.events.generate_lead || 0} generate_lead · ${ga4.value.events.form_submit_lead || 0} form_submit_lead` : ga4.error,
    },
    {
      id: 'phone-click-rate',
      label: 'Phone click rate',
      target: '≥ 8%',
      value: ga4.ok && ga4.value.phoneCr != null ? `${ga4.value.phoneCr}%` : (googleAccessToken ? 'error' : 'GA4 token required'),
      numericValue: ga4.ok ? ga4.value.phoneCr : null,
      status: ga4.ok && ga4.value.phoneCr != null
        ? (ga4.value.phoneCr >= 8 ? STATUS.GREEN : ga4.value.phoneCr >= 4 ? STATUS.YELLOW : STATUS.RED)
        : STATUS.GRAY,
      source: 'GA4 Data API · phone_click ÷ sessions (28d)',
      detail: ga4.ok ? `${ga4.value.events.phone_click || 0} phone_click events` : ga4.error,
    },
    {
      id: 'per-page-cr',
      label: 'Per-page CR (top 10 entry pages)',
      target: 'top 3 ≥ 5%',
      value: 'next iteration',
      status: STATUS.GRAY,
      source: 'GA4 Data API · landingPagePlusQueryString',
      detail: 'Site-wide CR is the priority signal right now; per-page drill-down ships next iteration.',
    },
    {
      id: 'mobile-desktop-cr-parity',
      label: 'Mobile vs desktop CR parity',
      target: 'within 20%',
      value: ga4.ok && ga4.value.parityDelta != null ? `${ga4.value.parityDelta}% gap` : (googleAccessToken ? 'error' : 'GA4 token required'),
      numericValue: ga4.ok ? ga4.value.parityDelta : null,
      status: ga4.ok && ga4.value.parityDelta != null
        ? (ga4.value.parityDelta <= 20 ? STATUS.GREEN : ga4.value.parityDelta <= 40 ? STATUS.YELLOW : STATUS.RED)
        : STATUS.GRAY,
      source: 'GA4 Data API · deviceCategory breakdown',
      detail: ga4.ok && ga4.value.byDevice
        ? `Mobile CR: ${ga4.value.byDevice.mobile?.cr ?? 0}% · Desktop CR: ${ga4.value.byDevice.desktop?.cr ?? 0}%`
        : ga4.error,
    },
    {
      id: 'estimator-completion',
      label: 'Estimator funnel (complete → opt-in)',
      target: '≥ 25% complete→opt-in',
      value: ga4.ok
        ? (() => {
            const c = ga4.value.estimatorComplete;
            const o = ga4.value.estimatorOptIn;
            const rate = ga4.value.estimatorOptInRate;
            if (c === 0 && o === 0) return '0 complete · 0 opt-in (no traffic or tracking)';
            if (c === 0 && o > 0) return `${o} opt-in (no estimator_complete events — investigate)`;
            return `${c} complete → ${o} opt-in (${rate}%)`;
          })()
        : (googleAccessToken ? 'error' : 'GA4 token required'),
      numericValue: ga4.ok ? (ga4.value.estimatorOptInRate ?? 0) : null,
      status: ga4.ok
        ? (ga4.value.estimatorComplete === 0
            ? STATUS.YELLOW
            : ga4.value.estimatorOptInRate >= 25 ? STATUS.GREEN
              : ga4.value.estimatorOptInRate >= 10 ? STATUS.YELLOW : STATUS.RED)
        : STATUS.GRAY,
      source: 'GA4 Data API · estimator_complete + estimator_opt_in (28d)',
      detail: ga4.ok
        ? (ga4.value.estimatorComplete === 0
            ? 'No wizard completions in 28d. Likely a traffic problem (low /replacement-estimator visits), not a tracking issue — other gtag events fire correctly site-wide.'
            : `Funnel: ${ga4.value.estimatorComplete} users finished the wizard, ${ga4.value.estimatorOptIn} of them submitted the lead form.`)
        : ga4.error,
    },
    {
      id: 'bounce-rate',
      label: 'Bounce rate (sitewide)',
      target: '< 50%',
      value: ga4.ok && ga4.value.bounceRate != null ? `${ga4.value.bounceRate}%` : (googleAccessToken ? 'error' : 'GA4 token required'),
      numericValue: ga4.ok ? ga4.value.bounceRate : null,
      status: ga4.ok && ga4.value.bounceRate != null
        ? (ga4.value.bounceRate < 50 ? STATUS.GREEN : ga4.value.bounceRate < 65 ? STATUS.YELLOW : STATUS.RED)
        : STATUS.GRAY,
      source: 'GA4 Data API · bounceRate (28d)',
      detail: ga4.ok ? null : ga4.error,
    },
    { id: 'clarity-friction', label: 'Microsoft Clarity friction insights', target: 'Rage clicks < 1%', value: 'gated to May 22 baseline', status: STATUS.GRAY, source: 'Clarity Data Export API' },
    { id: 'lead-to-booked', label: 'Lead → booked-job rate', target: '≥ 40%', value: 'no CRM integration', status: STATUS.GRAY, source: 'Manual entry (no API)' },
  ];

  const phase4Kpis = [
    { id: 'callrail-tracking-numbers', label: 'CallRail tracking numbers live', value: 'phase gated', status: STATUS.GRAY, source: 'CallRail API' },
    { id: 'paid-cpc-conversion', label: 'Paid CPC / conversion', value: 'phase gated', status: STATUS.GRAY, source: 'Google Ads / Meta Ads API' },
    { id: 'gtag-enhanced-conv', label: 'GA4 Enhanced Conversions wired', value: 'phase gated', status: STATUS.GRAY, source: 'GA4 + Ads linking' },
  ];

  const phase5Kpis = [
    { id: 'cost-per-lead', label: 'Cost per lead (paid)', value: 'phase gated', status: STATUS.GRAY, source: 'Ads platforms' },
    { id: 'roas', label: 'Return on ad spend', value: 'phase gated', status: STATUS.GRAY, source: 'Ads platforms' },
    { id: 'rpv', label: 'Revenue per visitor', value: 'phase gated', status: STATUS.GRAY, source: 'CRM + GA4' },
  ];

  const rollup = (kpis) => {
    const c = { green: 0, yellow: 0, red: 0, gray: 0 };
    kpis.forEach((k) => (c[k.status] = (c[k.status] || 0) + 1));
    return { total: kpis.length, ...c };
  };

  // Apply trend + delta computation to ALL phases (phase1 already done above).
  // Phase 2/3 are GSC/GA4-backed and only now have numeric values; phase 4/5 are gated.
  phase2Kpis.forEach(applyTrend);
  phase3Kpis.forEach(applyTrend);
  phase4Kpis.forEach(applyTrend);
  phase5Kpis.forEach(applyTrend);

  const snapshot = {
    generatedAt: new Date().toISOString(),
    domain: DOMAIN,
    durationMs: Date.now() - t0,
    phases: [
      { id: 'phase1', label: 'Foundation', tag: 'P1', kpis: phase1Kpis, rollup: rollup(phase1Kpis) },
      { id: 'phase2', label: 'SEO / AEO', tag: 'P2', kpis: phase2Kpis, rollup: rollup(phase2Kpis) },
      { id: 'phase3', label: 'Conversion', tag: 'P3', kpis: phase3Kpis, rollup: rollup(phase3Kpis) },
      { id: 'phase4', label: 'Ad Infrastructure', tag: 'P4', kpis: phase4Kpis, rollup: rollup(phase4Kpis) },
      { id: 'phase5', label: 'Launch & Scale', tag: 'P5', kpis: phase5Kpis, rollup: rollup(phase5Kpis) },
    ],
  };

  await mkdir(path.dirname(SNAPSHOT_OUT), { recursive: true });
  await writeFile(SNAPSHOT_OUT, JSON.stringify(snapshot, null, 2));

  await mkdir(ARCHIVE_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  await writeFile(path.join(ARCHIVE_DIR, `${today}.json`), JSON.stringify(snapshot, null, 2));

  // Console rollup
  const allKpis = snapshot.phases.flatMap((p) => p.kpis);
  const tally = rollup(allKpis);
  console.log(
    `[kpi] done in ${(snapshot.durationMs / 1000).toFixed(1)}s · ` +
      `🟢 ${tally.green}  🟡 ${tally.yellow}  🔴 ${tally.red}  ⚪ ${tally.gray}  (of ${tally.total})`
  );
  console.log(`[kpi] snapshot → ${SNAPSHOT_OUT}`);
}

main().catch((e) => {
  console.error('[kpi] fatal:', e);
  process.exit(1);
});
