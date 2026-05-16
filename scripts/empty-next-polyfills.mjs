#!/usr/bin/env node
/**
 * empty-next-polyfills.mjs — Drop legacy JS polyfills before `next build`.
 *
 * WHY: Next.js ships two polyfill files regardless of `browserslist`:
 *   1. polyfill-nomodule.js (~110 KiB) — loaded with `<script nomodule>`,
 *      so spec-compliant modern browsers skip it. 0-byte cost in practice
 *      for our Chrome 110+/Edge 110+/FF 110+/Safari 16+ audience.
 *   2. polyfill-module.js (~1.4 KiB) — bundled into the Turbopack runtime
 *      chunk and loaded on every page. Every polyfill in it is already
 *      native in our browserslist target (String.trimStart, Array.flat,
 *      Array.at, Object.fromEntries, Symbol.description, Promise.finally,
 *      etc.). Dead weight on every page load AND flagged by Lighthouse's
 *      "Avoid serving legacy JavaScript to modern browsers" audit.
 *
 * This script overwrites both polyfill source files with an empty module
 * before each `next build`, so the resulting chunk wrappers carry zero
 * polyfill payload. Re-runs are idempotent.
 *
 * Wired via `yarn prebuild` → runs automatically before `yarn build`.
 *
 * Reversal: re-run `yarn install` (npm/yarn rewrites node_modules from
 * lockfile, restoring the original Next.js polyfill files).
 */
import { writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.resolve(__dirname, '..', 'frontend');
const FILES = [
  path.join(FRONTEND, 'node_modules', 'next', 'dist', 'build', 'polyfills', 'polyfill-module.js'),
  path.join(FRONTEND, 'node_modules', 'next', 'dist', 'esm', 'build', 'polyfills', 'polyfill-module.js'),
  path.join(FRONTEND, 'node_modules', 'next', 'dist', 'build', 'polyfills', 'polyfill-nomodule.js'),
];

const EMPTY = '/* polyfills disabled — see /app/scripts/empty-next-polyfills.mjs */\n';

for (const file of FILES) {
  if (!existsSync(file)) {
    console.warn(`[polyfill-cleanup] skip (not found): ${file}`);
    continue;
  }
  const before = (await stat(file)).size;
  if (before <= EMPTY.length + 4) {
    console.log(`[polyfill-cleanup] already empty: ${path.basename(file)}`);
    continue;
  }
  await writeFile(file, EMPTY);
  console.log(`[polyfill-cleanup] emptied ${path.basename(file)} (${before} → ${EMPTY.length} bytes)`);
}
