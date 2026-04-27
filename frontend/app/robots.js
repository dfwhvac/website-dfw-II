/**
 * robots.txt — DFW HVAC
 *
 * Policy (S1, Apr 27, 2026):
 *
 * 1. Default `User-agent: *` allows the public site, blocks admin + internal-only paths.
 * 2. AI/answer-engine crawlers are EXPLICITLY allowed (intentional AEO posture):
 *    — GPTBot (ChatGPT/OpenAI search index)
 *    — ChatGPT-User (ChatGPT browsing tool, on-demand fetches)
 *    — OAI-SearchBot (OpenAI's search index crawler)
 *    — ClaudeBot (Anthropic Claude training/search)
 *    — Claude-Web (Anthropic's on-demand fetcher)
 *    — anthropic-ai (legacy Anthropic UA — kept for back-compat)
 *    — PerplexityBot (Perplexity search index)
 *    — Perplexity-User (Perplexity on-demand fetches)
 *    — Google-Extended (Google Bard / Gemini training corpus opt-in)
 *    — Applebot-Extended (Apple Intelligence / Siri opt-in)
 *    — CCBot (Common Crawl, used by many LLM training pipelines)
 *    — Bytespider (TikTok / Doubao)
 *    — Diffbot, FacebookBot, Meta-ExternalAgent (other index/training UAs)
 *
 * Most agencies leave these blocked-by-default because of generic "no-AI-scraping"
 * policies. For a local-services brand, this is upside-down: AI answer engines are
 * an emerging top-of-funnel channel ("hvac contractor near me", "best ac repair
 * dallas") and being citable in those answers is high-leverage. We choose visibility.
 *
 * If a future business decision requires opting out of any specific crawler,
 * add a dedicated `User-agent: <name>` block with `Disallow: /` ABOVE the
 * "*" wildcard rule.
 */
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dfwhvac.com'

  // Crawlers explicitly allowed (default Allow: / is the same as the wildcard
  // rule, but we list them by UA so the policy is self-documenting in the
  // public robots.txt — search engines and AI vendors both inspect it).
  const aiAllowed = [
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
    'Bytespider',
    'Diffbot',
    'FacebookBot',
    'Meta-ExternalAgent',
  ]

  const baselineDisallow = [
    '/studio/',                // Sanity Studio admin UI - no SEO value
    '/api/',                   // API routes (leads, cron) - never index
    '/internal/',              // Internal review/planning files (audits, previews) - noindex
    '/sitemap-preview.html',   // Internal sitemap preview - noindex
    // NOTE: /_next/ intentionally NOT blocked.
    // Next.js serves CSS, JS, images, and fonts from /_next/static/.
    // Googlebot needs these to render pages properly for indexing,
    // measure Core Web Vitals, and evaluate mobile-friendliness.
    // Blocking /_next/ is a common legacy anti-pattern that hurts SEO.
  ]

  return {
    rules: [
      // Wildcard rule (default policy for any UA not named below).
      {
        userAgent: '*',
        allow: '/',
        disallow: baselineDisallow,
      },
      // Per-UA explicit allow for AI / answer-engine crawlers.
      // Same disallow list — we want them in the public site, not /api or /studio.
      ...aiAllowed.map((ua) => ({
        userAgent: ua,
        allow: '/',
        disallow: baselineDisallow,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
