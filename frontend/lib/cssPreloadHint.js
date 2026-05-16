// CSS preload hint resolver — P2.20 Step 5 (Feb 16, 2026)
//
// Next.js 16 emits the main Tailwind CSS chunk as a render-blocking
// `<link rel="stylesheet" data-precedence="next">`. The browser only starts
// downloading that file after the parser discovers the link, which adds
// hundreds of ms of latency on cold visits (PSI May 14: 543 ms critical-path
// for the 12.7 KiB-gzipped Tailwind chunk).
//
// Emitting a `<link rel="preload" as="style" fetchPriority="high">` *earlier*
// in `<head>` (above the stylesheet link) tells the browser to start the
// download during HTML parse, well before the stylesheet `<link>` is
// encountered. Render-blocking semantics on the actual `<link rel="stylesheet">`
// are unchanged — but its byte arrival ends sooner, which advances LCP paint.
//
// Why not just hardcode the URL? The chunk hash changes on every build
// (Next 16 Turbopack content-hashes CSS). We read `.next/static/chunks/` at
// process boot, find the largest `.css` file (= main Tailwind chunk; the only
// other .css is the tiny Sanity Studio override at <100 B), and cache the URL.
//
// Dev mode / missing build dir → returns null and the layout renders no
// preload hint (no harm done; dev mode already short-circuits FOUC via HMR).

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

let cached

/**
 * @returns {string|null} URL like '/_next/static/chunks/04gzhz1yr05qp.css'
 *                       or null if the build artifacts aren't on disk.
 */
export function getMainCssChunkHref() {
  if (cached !== undefined) return cached

  try {
    const chunksDir = join(process.cwd(), '.next', 'static', 'chunks')
    const css = readdirSync(chunksDir)
      .filter((f) => f.endsWith('.css'))
      .map((f) => ({ name: f, size: statSync(join(chunksDir, f)).size }))
      .sort((a, b) => b.size - a.size)

    cached = css.length > 0 ? `/_next/static/chunks/${css[0].name}` : null
  } catch {
    cached = null
  }

  return cached
}
