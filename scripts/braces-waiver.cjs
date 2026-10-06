/**
 * Dated exception for braces GHSA-vfj7-8cjw-p6xm (added 2026-10-06).
 *
 * npm has no patched release. yarn audit reports patched versions as <0.0.0
 * and latest is 3.0.3. The dependency is Sanity CLI only
 * (@sanity/codegen → chokidar / micromatch): a stack-exhaustion DoS, not on
 * the public request path.
 *
 * The waiver applies only while the npm `latest` dist-tag is exactly
 * `unfixedVersion`. A newer publish ends it. `.github/workflows/braces-watch.yml`
 * checks the registry every day and opens an issue the day that happens.
 *
 * Fail closed: a registry error means the advisory still counts.
 * `BRACES_LATEST_FIXTURE` skips the registry for local parser tests only.
 * The daily watch calls `fetchBracesLatest` and ignores that variable.
 */

const https = require('https')

const BRACES_WAIVER = {
  ghsa: 'GHSA-vfj7-8cjw-p6xm',
  module: 'braces',
  unfixedVersion: '3.0.3',
  added: '2026-10-06',
  registryUrl: 'https://registry.npmjs.org/braces',
}

function fetchBracesLatest() {
  return new Promise((resolve, reject) => {
    const req = https.get(
      BRACES_WAIVER.registryUrl,
      { headers: { accept: 'application/json' }, timeout: 15000 },
      (res) => {
        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`npm registry braces status ${res.statusCode}`))
            return
          }
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
            const latest = body['dist-tags'] && body['dist-tags'].latest
            if (!latest) reject(new Error('npm registry braces missing dist-tags.latest'))
            else resolve(String(latest))
          } catch (err) {
            reject(err)
          }
        })
      }
    )
    req.on('timeout', () => req.destroy(new Error('npm registry braces timeout')))
    req.on('error', reject)
  })
}

function resolveBracesLatest() {
  const fixture = process.env.BRACES_LATEST_FIXTURE
  if (fixture) {
    console.warn(
      `::warning::BRACES_LATEST_FIXTURE=${fixture} — npm registry was not queried. Tests only. Do not set this in GitHub Actions.`
    )
    return Promise.resolve(fixture)
  }
  return fetchBracesLatest()
}

function waiverApplies(latest) {
  return latest === BRACES_WAIVER.unfixedVersion
}

function isWaivedBracesFinding(finding, latest) {
  if (!waiverApplies(latest)) return false
  return finding.module === BRACES_WAIVER.module && finding.ghsa === BRACES_WAIVER.ghsa
}

module.exports = {
  BRACES_WAIVER,
  fetchBracesLatest,
  resolveBracesLatest,
  waiverApplies,
  isWaivedBracesFinding,
}
