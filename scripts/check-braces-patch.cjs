#!/usr/bin/env node
/**
 * Daily watch for the braces waiver in scripts/braces-waiver.cjs.
 *
 * Writes GitHub Actions outputs when GITHUB_OUTPUT is set:
 *   latest, waiver=present|absent, patch_published=true|false
 *
 * Exits 0 when latest is still the unfixed version, or when the waiver
 * module has already been removed. Exits 1 only when the registry itself
 * cannot be read (the workflow then fails closed, without filing a false
 * "patch published" issue).
 */

const fs = require('fs')
const path = require('path')

function setOutput(key, value) {
  const line = `${key}=${value}`
  console.log(line)
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${line}\n`)
  }
}

async function main() {
  const waiverPath = path.join(__dirname, 'braces-waiver.cjs')
  if (!fs.existsSync(waiverPath)) {
    setOutput('waiver', 'absent')
    setOutput('latest', 'unknown')
    setOutput('patch_published', 'false')
    console.log('scripts/braces-waiver.cjs is gone. Watch is idle.')
    return
  }

  const { fetchBracesLatest, BRACES_WAIVER, waiverApplies } = require('./braces-waiver.cjs')
  setOutput('waiver', 'present')
  setOutput('unfixed', BRACES_WAIVER.unfixedVersion)

  const latest = await fetchBracesLatest()
  setOutput('latest', latest)
  const published = !waiverApplies(latest)
  setOutput('patch_published', published ? 'true' : 'false')

  if (!published) {
    console.log(
      `braces latest is still ${BRACES_WAIVER.unfixedVersion}. Waiver stays until a newer version publishes.`
    )
    return
  }

  console.log(
    `braces latest is ${latest}. Waiver applied only to ${BRACES_WAIVER.unfixedVersion}. Remove scripts/braces-waiver.cjs and bump the lockfile.`
  )
}

main().catch((err) => {
  console.error(`::error::${err.message || err}`)
  process.exit(1)
})
