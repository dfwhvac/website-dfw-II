#!/usr/bin/env node
/**
 * Parse yarn classic `yarn audit --json` JSONL for CI.
 *
 * Env:
 *   AUDIT_JSONL   path to yarn audit JSONL (default /tmp/yarn-audit.jsonl)
 *   FAIL_ON_FINDINGS  "true" to exit 1 on high/critical (PR/push gate)
 *                     "false" for Monday schedule soft-fail (default true)
 *   GITHUB_STEP_SUMMARY  if set by Actions, append markdown summary
 *   GITHUB_OUTPUT        if set, write critical=/high=/findings_json=
 *   BRACES_LATEST_FIXTURE  test-only stand-in for the npm latest dist-tag.
 *                     Do not set this in GitHub Actions. See scripts/braces-waiver.cjs.
 *
 * Prints one actionable line per unique high/critical advisory:
 *   SEV module vulnerable→patched GHSA path
 *
 * GHSA-vfj7-8cjw-p6xm is waived only while npm braces latest is 3.0.3.
 */

const fs = require('fs')
const {
  BRACES_WAIVER,
  resolveBracesLatest,
  isWaivedBracesFinding,
} = require('./braces-waiver.cjs')

const jsonlPath = process.env.AUDIT_JSONL || '/tmp/yarn-audit.jsonl'
const failOnFindings = process.env.FAIL_ON_FINDINGS !== 'false'

function ghsaOf(advisory) {
  return (
    advisory.github_advisory_id ||
    (typeof advisory.url === 'string' && advisory.url.includes('GHSA-')
      ? advisory.url.split('/').pop()
      : advisory.url) ||
    'unknown'
  )
}

async function main() {
  if (!fs.existsSync(jsonlPath)) {
    console.error(`::error::Missing audit JSONL at ${jsonlPath}`)
    process.exit(1)
  }

  const lines = fs.readFileSync(jsonlPath, 'utf8').split('\n').filter(Boolean)
  if (lines.length === 0) {
    console.error('::error::yarn audit produced no JSON output — check yarn version / network.')
    process.exit(1)
  }

  let bracesLatest = null
  try {
    bracesLatest = await resolveBracesLatest()
  } catch (err) {
    console.warn(
      `::warning::braces waiver not applied: ${err.message || err}. High findings still count.`
    )
  }

  let critical = 0
  let high = 0
  let moderate = 0
  let waived = 0
  const findings = []
  const seen = new Set()

  for (const line of lines) {
    let o
    try {
      o = JSON.parse(line)
    } catch {
      continue
    }
    if (o.type !== 'auditAdvisory') continue

    const advisory = (o.data && o.data.advisory) || {}
    const resolution = (o.data && o.data.resolution) || {}
    const sev = advisory.severity
    if (sev === 'moderate') {
      moderate += 1
      continue
    }
    if (sev !== 'critical' && sev !== 'high') continue

    const moduleName = advisory.module_name || 'unknown'
    const ghsa = ghsaOf(advisory)
    if (isWaivedBracesFinding({ module: moduleName, ghsa }, bracesLatest)) {
      waived += 1
      continue
    }

    if (sev === 'critical') critical += 1
    else high += 1

    const key = `${sev}|${moduleName}|${ghsa}|${resolution.path || ''}`
    if (seen.has(key)) continue
    seen.add(key)

    findings.push({
      severity: sev,
      module: moduleName,
      title: advisory.title || '',
      vulnerable: advisory.vulnerable_versions || '',
      patched: advisory.patched_versions || '',
      ghsa,
      path: resolution.path || '',
    })
  }

  console.log(
    `Production dependency advisories: critical=${critical} high=${high} moderate=${moderate} waived=${waived}`
  )

  if (waived > 0) {
    console.log(
      `::notice::Waived ${waived} ${BRACES_WAIVER.module} ${BRACES_WAIVER.ghsa} finding(s). npm latest is ${bracesLatest}. Exception added ${BRACES_WAIVER.added}. Daily Braces patch watch fails when a newer version publishes.`
    )
  }

  for (const f of findings) {
    const line = `${f.severity.toUpperCase()} ${f.module} ${f.vulnerable} → ${f.patched} ${f.ghsa} path=${f.path}`
    console.log(line)
    if (failOnFindings) {
      console.error(`::error::${line}`)
    } else {
      console.warn(`::warning::${line}`)
    }
  }

  const summaryPath = process.env.GITHUB_STEP_SUMMARY
  if (summaryPath) {
    const rows = findings.length
      ? findings
          .map(
            (f) =>
              `| ${f.severity} | \`${f.module}\` | ${f.vulnerable} | ${f.patched} | ${f.ghsa} | \`${f.path}\` |`
          )
          .join('\n')
      : '| _(none)_ | | | | | |'
    const waiverNote =
      waived > 0
        ? `- waived: **${waived}** \`${BRACES_WAIVER.module}\` ${BRACES_WAIVER.ghsa} while npm latest is \`${bracesLatest}\` (exception ${BRACES_WAIVER.added}; daily Braces patch watch)`
        : '- waived: **0**'
    const md = [
      '## yarn audit (production deps)',
      '',
      `- critical: **${critical}**`,
      `- high: **${high}**`,
      `- moderate: **${moderate}** (allowed)`,
      waiverNote,
      `- gate: ${failOnFindings ? 'fail on high/critical (PR/push)' : 'report only (Monday schedule)'}`,
      '',
      '| Severity | Module | Vulnerable | Patched | GHSA | Path |',
      '|---|---|---|---|---|---|',
      rows,
      '',
    ].join('\n')
    fs.appendFileSync(summaryPath, md)
  }

  const outPath = process.env.GITHUB_OUTPUT
  if (outPath) {
    const findingsJson = JSON.stringify(findings)
    fs.appendFileSync(outPath, `critical=${critical}\n`)
    fs.appendFileSync(outPath, `high=${high}\n`)
    fs.appendFileSync(outPath, `has_blockers=${critical > 0 || high > 0}\n`)
    fs.appendFileSync(outPath, `findings_json<<EOF\n${findingsJson}\nEOF\n`)
  }

  if (critical > 0 || high > 0) {
    const msg = `yarn audit: ${critical} critical + ${high} high in production dependencies. Run 'cd frontend && yarn audit --groups dependencies' locally.`
    if (failOnFindings) {
      console.error(`::error::${msg}`)
      process.exit(1)
    }
    console.warn(`::warning::${msg} (schedule soft-fail — see job summary / open issue)`)
    process.exit(0)
  }

  const waivedNote = waived
    ? `; waived braces=${waived} while npm latest is ${bracesLatest}`
    : ''
  console.log(
    `::notice::yarn audit clean of high/critical production advisories (moderate=${moderate} allowed${waivedNote}).`
  )
  process.exit(0)
}

main().catch((err) => {
  console.error(`::error::${err.message || err}`)
  process.exit(1)
})
