/**
 * Slug redirects for URLs that changed under the Cloudera rebranding.
 *
 * `next.config.js` sets `output: 'export'` in production, so Next's `redirects()`
 * never runs — there is no server. GitHub Pages serves the exported `404.html`
 * for any unmatched path, so `app/not-found.tsx` is the only place a rename can
 * be covered. Add a rule here whenever a page slug moves.
 *
 * Rules are matched against the raw `window.location.pathname`, which in
 * production carries the `/cloudera-guides` basePath. Matching on a substring
 * rather than an anchored prefix keeps the basePath out of the table.
 */

/** `[old path, new path]`, both without basePath. Prefixes — children move too. */
export const REDIRECTS: ReadonlyArray<readonly [string, string]> = [
  // 2026-08-16 — "CDP Private Cloud" is now "Cloudera on premises".
  ['/installations/cdp-7-3-2/cdppvc', '/installations/cdp-7-3-2/on-premises'],
  // 2026-08-16 — page renamed for what it covers: the Data Services console.
  ['/installations/cdp-7-3-2/accessing-cloudera', '/installations/cdp-7-3-2/accessing-data-services'],
  // 2026-08-16 — "CDP Public Cloud" is now "Cloudera on cloud".
  ['/cdp-public-cloud', '/cloudera-on-cloud'],
]

/**
 * The path `pathname` should move to, or `null` if no rule applies.
 * A rule matches only on a segment boundary, so `/cdppvc-notes` is left alone.
 */
export function resolveRedirect(pathname: string): string | null {
  for (const [from, to] of REDIRECTS) {
    const at = pathname.indexOf(from)
    if (at === -1) continue

    const rest = pathname.slice(at + from.length)
    if (rest !== '' && !rest.startsWith('/')) continue

    return pathname.slice(0, at) + to + rest
  }
  return null
}
