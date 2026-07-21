#!/usr/bin/env node
/**
 * check:nav — link integrity for the docs site.
 *
 * `next build` cannot catch these: under `output: 'export'` a <Link> to a route
 * that was never generated is not a build error. This script is the gate instead,
 * and is deliberately NOT wired into `build` — run it at P2, P3, and V1.
 *
 * Asserts three things, printing every offending path:
 *   1. every nav href in lib/navigation.ts resolves to a file under content/docs/
 *   2. every .mdx under content/docs/ is reachable from some nav href
 *   3. every image under the versioned image trees is referenced by at least one MDX
 *
 * Rule 3 is scoped to public/images/cdp-7-1-7/ and public/images/cdp-7-3-2/ only —
 * site chrome at the public/images/ root is referenced from .tsx, never from MDX.
 */

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const DOCS = path.join(root, 'content/docs');
const NAV = path.join(root, 'lib/navigation.ts');
const IMAGE_TREES = ['public/images/cdp-7-1-7', 'public/images/cdp-7-3-2'];

/** Pages that render but sit in no nav, by design. */
const UNREACHABLE_ALLOWLIST = new Set([
  // Not an on-premises installation; lives at the site root, outside version grouping.
  'cdp-public-cloud',
  // Superseded by app/page.tsx as the home page; kept as a plain /index route.
  'index',
]);

function walk(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, ext));
    else if (!ext || path.extname(entry.name) === ext) out.push(full);
  }
  return out;
}

const toPosix = (p) => p.split(path.sep).join('/');

const mdxFiles = walk(DOCS, '.mdx');
const slugs = new Set(
  mdxFiles.map((f) => toPosix(path.relative(DOCS, f)).replace(/\.mdx$/, '')),
);

const navSource = fs.readFileSync(NAV, 'utf8');
const hrefs = [...navSource.matchAll(/href:\s*["'](\/[^"']*)["']/g)].map((m) => m[1]);

const failures = [];

// 1. every nav href resolves to a file under content/docs/
const unresolved = hrefs.filter((h) => !slugs.has(h.replace(/^\//, '')));
if (unresolved.length) {
  failures.push([
    `${unresolved.length} nav href(s) resolve to no file under content/docs/`,
    unresolved,
  ]);
}

// 2. every .mdx is reachable from some nav href
const linked = new Set(hrefs.map((h) => h.replace(/^\//, '')));
const unreachable = [...slugs]
  .filter((s) => !linked.has(s) && !UNREACHABLE_ALLOWLIST.has(s))
  .sort();
if (unreachable.length) {
  failures.push([
    `${unreachable.length} page(s) under content/docs/ are reachable from no nav href`,
    unreachable.map((s) => `content/docs/${s}.mdx`),
  ]);
}

// 3. every image in the versioned trees is referenced by at least one MDX
const mdxBlob = mdxFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
const referenced = new Set(
  [...mdxBlob.matchAll(/\/images\/[^)\s"'<>]+/g)].map((m) => m[0]),
);
const orphanImages = [];
for (const tree of IMAGE_TREES) {
  for (const file of walk(path.join(root, tree))) {
    const url = '/' + toPosix(path.relative(path.join(root, 'public'), file));
    if (!referenced.has(url)) orphanImages.push(url);
  }
}
if (orphanImages.length) {
  failures.push([
    `${orphanImages.length} image(s) in the versioned trees are referenced by no MDX`,
    orphanImages.sort(),
  ]);
}

if (failures.length) {
  for (const [headline, items] of failures) {
    console.error(`\n✗ ${headline}:`);
    for (const item of items) console.error(`    ${item}`);
  }
  console.error('');
  process.exit(1);
}

console.log(
  `✓ check:nav clean — ${hrefs.length} nav links, ${slugs.size} pages, ` +
    `${referenced.size} image references.`,
);
