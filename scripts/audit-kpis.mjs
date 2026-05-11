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

async function getPageSpeed() {
  const key = process.env.PAGESPEED_API_KEY;
  const url = new URL('https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed');
  url.searchParams.set('url', ORIGIN);
  url.searchParams.set('strategy', 'mobile');
  ['performance', 'accessibility', 'best-practices', 'seo'].forEach((c) =>
    url.searchParams.append('category', c)
  );
  if (key) url.searchParams.set('key', key);
  const r = await fetchWithTimeout(url, { timeout: 60_000 });
  if (!r.ok) throw new Error(`http ${r.status}`);
  const d = await r.json();
  const cats = d.lighthouseResult?.categories || {};
  return {
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
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

function computeTrend(prev, currentKey, currentValueNum) {
  if (!prev || currentValueNum == null) return '—';
  const prevKpi = prev.phases?.flatMap((p) => p.kpis).find((k) => k.id === currentKey);
  if (!prevKpi || prevKpi.numericValue == null) return '—';
  const delta = currentValueNum - prevKpi.numericValue;
  if (Math.abs(delta) < 2) return '→';
  return delta > 0 ? '▲' : '▼';
}

async function main() {
  console.log(`[kpi] audit start · ${DOMAIN} · ${new Date().toISOString()}`);
  const t0 = Date.now();

  const prior = await loadPriorSnapshot();

  // Parallelize all phase-1 calls
  const [
    sec,
    moz,
    ssl,
    ps,
    csp,
    sitemap,
    robots,
    schema,
    gitleaks,
    build,
  ] = await Promise.all([
    safe('SecurityHeaders', getSecurityHeadersGrade),
    safe('MozillaObservatory', getMozillaObservatoryGrade),
    safe('SSLLabs', getSSLLabsGrade),
    safe('PageSpeed', getPageSpeed),
    safe('CSP', getCsp),
    safe('Sitemap', getSitemapCount),
    safe('Robots', getRobotsAiAllowlist),
    safe('Schema', getSchemaCoverage),
    safe('Gitleaks', getGitleaksStatus),
    safe('BuildManifest', getBuildManifest),
  ]);

  const phase1Kpis = [
    {
      id: 'security-headers-grade',
      label: 'Security headers (self-computed)',
      target: 'A or A+',
      value: sec.ok ? `${sec.value.grade} (${sec.value.score}/100)` : 'unavailable',
      numericValue: sec.ok ? sec.value.score : null,
      status: sec.ok ? gradeStatus(sec.value.grade) : STATUS.GRAY,
      source: 'Live response-header inspection',
      detail: sec.ok
        ? sec.value.missing.length
          ? `missing: ${sec.value.missing.join(', ')}`
          : 'all core headers present'
        : sec.error,
    },
    {
      id: 'mozilla-observatory-grade',
      label: 'Mozilla Observatory grade',
      target: 'A',
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
      value: ssl.ok ? ssl.value : 'unavailable (cache miss)',
      numericValue: null,
      status: ssl.ok ? gradeStatus(ssl.value, ['A+'], ['A', 'A-']) : STATUS.GRAY,
      source: 'api.ssllabs.com',
      detail: ssl.ok ? null : ssl.error,
    },
    {
      id: 'pagespeed-performance-mobile',
      label: 'PageSpeed Performance (mobile)',
      target: '≥ 90',
      value: ps.ok ? `${ps.value.performance}` : 'unavailable',
      numericValue: ps.ok ? ps.value.performance : null,
      status: ps.ok ? statusForScore(ps.value.performance, { greenMin: 90, yellowMin: 75 }) : STATUS.GRAY,
      source: 'pagespeedonline.googleapis.com',
      detail: ps.ok ? null : ps.error,
    },
    {
      id: 'pagespeed-accessibility-mobile',
      label: 'PageSpeed Accessibility (mobile)',
      target: '≥ 95',
      value: ps.ok ? `${ps.value.accessibility}` : 'unavailable',
      numericValue: ps.ok ? ps.value.accessibility : null,
      status: ps.ok ? statusForScore(ps.value.accessibility, { greenMin: 95, yellowMin: 85 }) : STATUS.GRAY,
      source: 'pagespeedonline.googleapis.com',
    },
    {
      id: 'pagespeed-best-practices-mobile',
      label: 'PageSpeed Best Practices (mobile)',
      target: '≥ 95',
      value: ps.ok ? `${ps.value.bestPractices}` : 'unavailable',
      numericValue: ps.ok ? ps.value.bestPractices : null,
      status: ps.ok ? statusForScore(ps.value.bestPractices, { greenMin: 95, yellowMin: 85 }) : STATUS.GRAY,
      source: 'pagespeedonline.googleapis.com',
    },
    {
      id: 'pagespeed-seo-mobile',
      label: 'PageSpeed SEO (mobile)',
      target: '100',
      value: ps.ok ? `${ps.value.seo}` : 'unavailable',
      numericValue: ps.ok ? ps.value.seo : null,
      status: ps.ok ? statusForScore(ps.value.seo, { greenMin: 100, yellowMin: 90 }) : STATUS.GRAY,
      source: 'pagespeedonline.googleapis.com',
    },
    {
      id: 'csp-host-count',
      label: 'CSP whitelist host count',
      target: '≤ 25 hosts',
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
      value: sitemap.ok ? `${sitemap.value}` : 'unavailable',
      numericValue: sitemap.ok ? sitemap.value : null,
      status: sitemap.ok ? (sitemap.value > 50 ? STATUS.GREEN : STATUS.YELLOW) : STATUS.GRAY,
      source: '/sitemap.xml',
    },
    {
      id: 'robots-ai-allowlist',
      label: 'Robots.txt AI crawler directives',
      target: '≥ 3 AI bots declared',
      value: robots.ok ? `${robots.value.aiBotsDeclared} of 6 (${robots.value.list.join(', ') || 'none'})` : 'unavailable',
      numericValue: robots.ok ? robots.value.aiBotsDeclared : null,
      status: robots.ok ? (robots.value.aiBotsDeclared >= 3 ? STATUS.GREEN : STATUS.YELLOW) : STATUS.GRAY,
      source: '/robots.txt',
    },
    {
      id: 'schema-coverage',
      label: 'Schema coverage (5 sample pages)',
      target: '≥ 5 distinct @types, 0 invalid',
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
    {
      id: 'gitleaks-status',
      label: 'Gitleaks secret-scan (latest run)',
      target: 'success',
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
      target: '≥ 20 page routes (dynamic + static)',
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
      target: '≥ 99.9%',
      value: 'not measured',
      numericValue: null,
      status: STATUS.GRAY,
      source: 'Requires external uptime monitor (UptimeRobot/Better Stack)',
      detail: 'Scaffolded — no Vercel Hobby API. Add monitor or upgrade to Pro.',
    },
    {
      id: 'error-rate',
      label: 'Error rate (5xx / total)',
      target: '< 0.1%',
      value: 'not measured',
      numericValue: null,
      status: STATUS.GRAY,
      source: 'Vercel Analytics Pro tier or self-instrumentation',
      detail: 'Scaffolded.',
    },
  ];

  // Compute trend arrows
  phase1Kpis.forEach((k) => {
    k.trend = computeTrend(prior, k.id, k.numericValue);
  });

  const phase2Kpis = [
    {
      id: 'gsc-impressions',
      label: 'GSC impressions (28d)',
      target: 'trend ▲',
      value: 'token required',
      status: STATUS.GRAY,
      source: 'Google Search Console API',
      detail: 'Run GA4 service account setup (see GA4_SERVICE_ACCOUNT_SETUP.md). Same auth.',
    },
    {
      id: 'gsc-clicks',
      label: 'GSC clicks (28d)',
      target: 'trend ▲',
      value: 'token required',
      status: STATUS.GRAY,
      source: 'Google Search Console API',
    },
    {
      id: 'gsc-ctr',
      label: 'GSC CTR (28d)',
      target: '≥ 3%',
      value: 'token required',
      status: STATUS.GRAY,
      source: 'Google Search Console API',
    },
    {
      id: 'gsc-avg-position',
      label: 'GSC average position',
      target: '≤ 20',
      value: 'token required',
      status: STATUS.GRAY,
      source: 'Google Search Console API',
    },
    {
      id: 'sitemap-indexing-rate',
      label: 'Sitemap indexing rate',
      target: '≥ 90%',
      value: 'token required',
      status: STATUS.GRAY,
      source: 'GSC URL Inspection API',
    },
    {
      id: 'gbp-impressions',
      label: 'GBP impressions / calls / directions',
      target: 'trend ▲',
      value: 'token + admin auth required',
      status: STATUS.GRAY,
      source: 'Google Business Profile API',
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
    { id: 'overall-cr', label: 'Overall conversion rate', target: '≥ 4%', value: 'GA4 token required', status: STATUS.GRAY, source: 'GA4 Data API' },
    { id: 'form-submission-rate', label: 'Form submission rate', target: '≥ 6%', value: 'GA4 token required', status: STATUS.GRAY, source: 'GA4 Data API' },
    { id: 'phone-click-rate', label: 'Phone click rate', target: '≥ 8%', value: 'GA4 token required', status: STATUS.GRAY, source: 'GA4 Data API' },
    { id: 'per-page-cr', label: 'Per-page CR (top 10 entry pages)', target: 'top 3 ≥ 5%', value: 'GA4 token required', status: STATUS.GRAY, source: 'GA4 Data API' },
    { id: 'mobile-desktop-cr-parity', label: 'Mobile vs desktop CR parity', target: 'within 20%', value: 'GA4 token required', status: STATUS.GRAY, source: 'GA4 Data API' },
    { id: 'estimator-completion', label: 'Estimator completion / opt-in rate', target: '≥ 25%', value: 'GA4 token required', status: STATUS.GRAY, source: 'GA4 Data API' },
    { id: 'bounce-rate', label: 'Bounce rate (mobile)', target: '< 50%', value: 'GA4 token required', status: STATUS.GRAY, source: 'GA4 Data API' },
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
