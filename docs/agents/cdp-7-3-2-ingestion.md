# CDP 7.3.2 ingestion playbook

The single reference for all 16 execution tickets (E1–E16) of the CDP 7.3.2 ECS deployment guide
ingestion. Each execution ticket links here rather than restating any of it. Read this file end to
end before touching the PDF.

Map: [Wayfinder: Regroup docs by installation version and ingest the Cloudera 7.3.2 ECS deployment
guide](https://github.com/maatouk-j1/cloudera-guides/issues/10).

---

## 1. Source and tooling

Source PDF: `sources/cloudera-on-premise-deployment-guide-ecs-20260818.pdf` — **256 pages**, git-ignored.
The 254-page edition the guide was first ingested from is kept beside it as
`…-ecs-original.pdf`. The 255-page intermediate edition this playbook used to name is gone and
cannot be re-derived. The two editions were diffed with Poppler and everything that came out of it
is folded into this playbook; the worklist that tracked the diff was deleted once empty and is
recoverable with `git log --diff-filter=D -- docs/cdp-7-3-2-source-diff-20260818.md`.

**Section 6's page ranges are this edition's** — re-derived by aligning the two files page by page,
then spot-checked against the section headings themselves. Keep confirming with `pdftotext` before
extracting anyway: the ranges were aligned, not re-read line by line, and a section boundary does
not always fall on a page break.

The two-page growth is three old pages with no counterpart here (22, 81, 209) against five new ones
(66, 94, 140, 195, 227). The drift they cause never exceeds ±2 and is already folded into section 6.

Table numbers shifted too, and **two tables are new**. The MDX carries no table numbers of its own,
so this affects extraction only — but a caption is the fastest way to confirm you are on the page
you meant to be on.

| Old | New | Page | Caption |
|:--|:--|:--|:--|
| Table 7 | Table 7 | 90 | LDAP Integration → **FreeIPA** LDAP Integration (retitled) |
| — | **Table 8** | 91 | **AD LDAP Integration** (new) |
| Table 8 | Table 9 | 129 | User LDAP Integration (Ranger admin) |
| Table 9 | Table 10 | 133 | UserSync LDAP Integration |
| Table 10 | Table 11 | 134 | UserSync AD Integration |
| Table 11 | Table 12 | 141 | Atlas LDAP Integration |
| Table 12 | Table 13 | 143 | LDAP Integration-Hive |
| Table 13 | Table 14 | 194 | LDAP Integration → LDAP **FreeIPA** Integration (retitled) |
| — | **Table 15** | 195 | **LDAP AD Integration** (new) |

Tables 1–4 keep their numbers. Neither edition has a Table 5 or Table 6 — the caption sequence skips
them, and the "see Table 6" on p. 82 points at the table captioned Table 4 on that same page.

### macOS toolchain

Poppler comes from Homebrew — `brew install poppler` — and lands on `PATH` at
`/opt/homebrew/bin`. Run the tools straight from Bash; there is no shadowed build to work around.

### Four tools, four jobs

No single tool does the whole job.

| Tool | Job |
|:--|:--|
| `Read(file_path, pages:"N-M")` | **Comprehension.** Renders pages visually so you actually see each screenshot, understand what it depicts, and know where it belongs and how to caption it. **Max 20 pages per call.** |
| `pdftotext -layout -f N -l M` | **Verbatim text.** Commands, hostnames, paths, config values, tables. `-layout` preserves column alignment. |
| `pdfimages -png -p -f N -l M` | **Assets.** Embedded screenshots at native resolution; `-p` puts the page number in each filename so images can be matched back to pages. The default path — P1 confirmed figures are embedded whole (max 4 images/page; 89% of illustrated pages carry 1–2; multi-image pages are distinct figures plus callout crops, not shards of one picture). |
| `pdftoppm -png -r 150 -f N -l M` | **Fallback, exception only.** For the rare figure built from vector art plus text overlays, which `pdfimages` fragments. Renders the whole page instead; crop after. |

Run `pdfimages -list -f N -l M` over your range *before* extracting, so you know what exists.

> **Never retype a command from the visual render.** Screenshots and rendered pages are for
> understanding only. Every command, hostname, path and config value must come out of `pdftotext`.

### Known source quirks

- **No monospace font anywhere.** The 254-page edition embedded `CourierNew`, `Consolas`, `FreeMono`
  and `RobotoMono`; **this one embeds none**. Every shell command, config snippet and terminal
  transcript renders in Calibri or Arial, so a code block is not visually distinguishable from prose
  in a page render — the boxed border is the only cue. `pdftotext -layout` is unaffected because it
  works from glyph positions, which makes **the verbatim-extraction rule below more important than
  ever**: you cannot tell by eye where a command starts and ends.
- **Header banner on every page.** A 700×7 decorative rule is embedded on every page and always
  extracts as `p-NNN-000.png` at ~134 bytes. It is never content — delete it. Note `find -size -1k`
  does not match it on macOS (BSD `find` rounds up); use `-size -200c`.
- **Correction crops are overlaid on screenshots.** Where the source fixes a wrong value in a
  capture, it pastes a magnified crop over the offending row rather than re-shooting it. `pdfimages`
  extracts the two as separate objects, so the base capture alone shows the **wrong** value — p. 130
  shows `ranger.ldap.ad.referral` as `ignore` under a crop reading `follow`. Always check the
  `pdftoppm` page render before trusting an extracted capture, and stitch the composite from renders.
- **One image object can be placed on several pages.** Usually that means a figure straddling a page
  break — the object appears twice in `pdfimages -list` with identical size, so render and
  concatenate both halves. But reuse is not always adjacent: object 213 is placed on both p. 34 and
  p. 46. Both editions carry **306 placements from 232 distinct objects**, so any script that counts
  figures by unique object ID undercounts by 74. **Count placements, not objects.**
- **Screenshots can show stale versions.** Some captures are recycled from an older lab build
  (p. 98 shows Cloudera Manager `7.11.3`; p. 160 shows Data Services `1.5.4-h5-b104`). Prose and
  the version table win over what a screenshot displays. Never transcribe a version out of an image.

### Versions (from the guide's own version table, p. 25; corrected in P1)

| Component | Version |
|:--|:--|
| Cloudera Base on premises Runtime | **7.3.2.100** (`CDH-7.3.2-1.cdh7.3.2.p100.81274879`) — the Cloudera AI / 7.3.1 SP3 CHF2 caveat no longer exists in the source |
| Data Services | **1.5.5 SP3 CHF1** (`1.5.5-h3200-b238`) |
| Cloudera Manager | **7.13.2.100** (`7.13.2.100-81323056`) |
| OS | **RHEL 9.7** |

**The source contradicts itself on all three, and the site does not.** These are settled; do not
"fix" the site back to match a page of the PDF.

| | Site uses | Source also says |
|:--|:--|:--|
| Cloudera Manager build | `81323056` **everywhere, including the download script** | `77091850` in the version table (p. 25) and `80024490` in the download script (p. 59). `81323056` is what the RPM listing on p. 61 shows, so the script fetches the files the listing names. |
| Data Services | `h3200` **everywhere** | `1.5.5-h2000` in the download procedure (p. 161–162), against `1.5.5-h3200-b238` in the version table (p. 25). |
| OS | `9.7` **everywhere** | 9.7 in the requirements table and the lock commands (pp. 25, 27); 9.5 in the surrounding prose, the "Solution 1" heading, the closing sentence, and the sample `cat /etc/*rel*` output (pp. 27–29). |

**One value cannot be read out of either PDF.** The Ranger Database JDBC URL Override on p. 125
overflows its table cell and is clipped mid-string — the new edition loses
`…verify-full&sslrootcert=/var/lib/ranger/root.crt`, the old edition wrapped it and lost a different
span. The intended value is:

```text
jdbc:postgresql://cldr-mngr.cldrsetup.local:5432/ranger?ssl=true&sslmode=verify-full&sslrootcert=/var/lib/ranger/root.crt
```

The folder slug is `cdp-7-3-2` — no SP/CHF, because service packs churn. The nav title is
"CDP 7.3.2". Precise product names and full version strings live on the version landing page.

### Product names (Cloudera renamed everything in February 2025)

Use the current names in prose. `on premises` / `on cloud` is a **suffix**, never an infix —
it is "Cloudera Base on premises", never "Cloudera on premises Base".

| Former name | Current name |
|:--|:--|
| Cloudera Data Platform (CDP) | Cloudera Platform |
| CDP Private Cloud | Cloudera on premises |
| CDP Private Cloud Base | Cloudera Base on premises |
| CDP Private Cloud Data Services | Cloudera Data Services on premises |
| CDP Public Cloud | Cloudera on cloud |
| Cloudera Machine Learning (CML) | Cloudera AI |

Three things keep the old names deliberately, so do not "fix" them:

- **On-screen text.** The 7.3.2 product UI still says "Add Private Cloud Containerized Cluster",
  "Welcome to CDP Private Cloud", "Launch CDP" and so on. Step text and image alt text must match
  the screenshots, so transcribe what the UI shows. The rule: rename the product in the author's
  voice, keep it in the reader's field of view.
- **URLs.** `docs.cloudera.com` paths still contain `cdp-private-cloud-base` and
  `cdp-private-cloud-data-services`. Never rewrite a URL to match the new branding.
- **Identifiers.** `PvCBaseCluster1`, `pvcbase-master`, `CDP-INFRA-SOLR`, `cdp-pvc-ds` and the
  `cdp-7-3-2` slug itself are literal strings in the deployment or the site routes.

**Slugs.** Page slugs follow the current names too. On 2026-08-16 the 7.3.2 tree's `cdppvc`
segment became `on-premises` (`/installations/cdp-7-3-2/on-premises/…`, image directory included)
and the root `/cdp-public-cloud` page became `/cloudera-on-cloud`. Two slugs are deliberately
**not** renamed: the version folders `cdp-7-3-2` and `cdp-7-1-7`, and everything under
`cdp-7-1-7/`, which documents a 2022-era release on its contemporaneous naming.

Old URLs are mapped forward client-side by `app/not-found.tsx` — a static export has no server,
so that 404 page is the only redirect mechanism available. Add a rule there for any future rename.

The phase index below and `docs/misc/gen.py` transcribe the **source PDF's** section titles
against its page numbers. Those stay on the old names — they are a citation, not prose.

## 2. Structure is fixed, not discovered

All 43 URLs, titles and page ranges are fixed by the index in [section 6](#6-the-phase-index-authoritative).
Do not re-derive structure from the PDF's own headings, and do not invent grouping.

A page's slug is **literally its path under `content/docs/`, minus the `.mdx`**
(`components/mdx/utils.ts:67`). There is no `index.mdx` stripping — `content/docs/installations/index.mdx`
really does serve at `/installations/index`. So section landing pages use the **sibling-file
pattern**: `on-premises.mdx` sits *beside* the `on-premises/` folder, giving `/…/on-premises` for the landing and
`/…/on-premises/prerequisites` for its children.

## 3. File and image conventions

- Content root: `content/docs/installations/cdp-7-3-2/`
- Images: `public/images/cdp-7-3-2/<section>/`, **PNG only**, referenced absolutely as
  `![Meaningful alt text](/images/cdp-7-3-2/<section>/<name>.png)`.
- **Never hardcode `/cloudera-guides`.** `basePath` is prepended at render to any `img` `src` or
  `a` `href` that starts with `/` (`components/mdx/mdx.tsx:41,50,53`). Hardcoding it double-prefixes
  in production.
- Every image needs alt text that describes what the screenshot actually shows.

Frontmatter on every page:

```yaml
---
title: <page title from the index>
topicTitle: <section this page sits under>
topicSlug: <section slug>
summary: <one line>
prevSlug: <from P3 canonical ordering>
prevTitle: <...>
nextSlug: <...>
nextTitle: <...>
---
```

> **Frontmatter is not parsed as YAML.** `components/mdx/utils.ts:17-36` splits each line on the
> first `": "` and strips one pair of surrounding quotes. Consequences: exactly one line per key;
> no block scalars, no lists, no nesting, no comments. A `: ` *inside* a value is fine (the
> remainder is rejoined), but keep summaries to a single line.

## 4. MDX authoring

**`docs/typography.md` is authoritative for all MDX formatting.** Read it before writing any
page. The essentials it covers, in brief:

- **Body starts at `h2`** — the page shell already renders `title` as the `h1`. `h5` and deeper are
  unmapped; headings must be plain text (inline code in a heading renders `[object Object]`).
- **GFM tables only**, and **always tag a code fence with a language**.
- **`<Banner type="warning">` / `type="important">` is the only sanctioned component.** Blockquotes
  are banned (unreadable in dark mode); `Accordion`, `Tag`, `Table`, `Image` and `ModalVideo` are not
  used — the last two are technically unusable from string-rendered MDX.
- Match the tone and density of the existing 7.1.7 pages (`content/docs/cdppvc/`, moving to
  `content/docs/installations/cdp-7-1-7/cdppvc/` under P2): numbered procedure steps, with code
  fences and images indented four spaces under their step so they stay inside the list item.

## 5. Rules of engagement

- **Never edit `lib/navigation.ts`.** It is pre-built once by P3. Your nav entries already exist;
  your job is to make the files they point at exist.
- Touch **only** your own phase's `.mdx` files and your own `public/images/cdp-7-3-2/<section>/`
  folder. All 16 phases are disjoint by construction — that is what makes parallel execution safe.
- Branch `feat/cdp-7-3-2-phase-N`, one PR per phase, linked to its ticket.

### AD and LDAP tables stay merged — do not split them

**Settled decision. Do not revert it, and do not propose splitting again without new
information.** Where an LDAP property takes a different value depending on directory type,
the site carries **one row holding both values, AD first**:

```markdown
| LDAP User Search Base | For AD: OU=cloudera,DC=cldrsetup,DC=local — For LDAP: cn=users,cn=accounts,dc=cldrsetup,dc=local |
```

Implemented in `1b6d6d2` (the two Ranger UserSync tables merged into one) and `c50f717`
(the remaining paired rows). It affects exactly three pages —
`on-premises/cm/ldap-auth.mdx`, `on-premises/base/ldap-auth.mdx` and
`accessing-data-services.mdx`. Read both commit messages before editing any of them.

Two things are deliberately **not** merged. Do not "finish the job" on them:

- Rows where the AD field is a genuinely separate property rather than the same field
  taking an AD value — the Ranger admin and Atlas tables on `on-premises/base/ldap-auth.mdx`.
- The **Active Directory Domain** rows, which exist only for AD. On
  `on-premises/cm/ldap-auth.mdx` that row is labelled "(For AD Setup only)".

**The 2026-08-18 source edition pushes the other way — ignore it on this point.** It
splits the AD variants back out into standalone tables: a new Table 8 *AD LDAP
Integration* (p. 91) and a new Table 15 *LDAP AD Integration* (p. 195), with Tables 7
and 14 retitled *FreeIPA*. Fold any genuinely new AD value out of those tables into the
existing merged row instead of adding a table. The site's captions do not track the
source's table numbering anyway — see the renumbering note in section 1.

## 6. The phase index (authoritative)

Paths are relative to `content/docs/installations/cdp-7-3-2/`; URLs are prefixed
`/installations/cdp-7-3-2/`.

| Phase | Section | Pages | File | URL suffix |
|:--|:--|:--|:--|:--|
| 1 | 0) VM Creation | 7-15 | `vm.mdx` | `/vm` |
| 1 | 1) Solution Summary | 16-26 | `summary.mdx` | `/summary` |
| 2 | 2) Post OS Installation - Preliminary Work | 27-57 | `post-os-work.mdx` | `/post-os-work` |
| 3 | 3) Install CDP Private Cloud - Overview | 57 | `on-premises.mdx` | `/on-premises` |
| 3 | 3-1) Prerequisites Overview | 57-58 | `on-premises/prerequisites.mdx` | `/on-premises/prerequisites` |
| 3 | 3-2) Setup Repositories and Parcels | 59-64 | `on-premises/repos-and-parcels.mdx` | `/on-premises/repos-and-parcels` |
| 4 | 3-3) Setup Cloudera Manager Server - Overview | 64 | `on-premises/cm.mdx` | `/on-premises/cm` |
| 4 | 3-3-1) Setup Database for Cloudera Manager | 64-73 | `on-premises/cm/database.mdx` | `/on-premises/cm/database` |
| 4 | 3-3-2) Install Cloudera Manager Server | 73-76 | `on-premises/cm/server.mdx` | `/on-premises/cm/server` |
| 5 | 3-3-3) Enable Auto-TLS | 77-80 | `on-premises/cm/auto-tls.mdx` | `/on-premises/cm/auto-tls` |
| 5 | 3-3-4) Enable Kerberos | 80-85 | `on-premises/cm/kerberos.mdx` | `/on-premises/cm/kerberos` |
| 5 | 3-3-5) Setup Cloudera Management Services | 86-88 | `on-premises/cm/mgmt-services.mdx` | `/on-premises/cm/mgmt-services` |
| 5 | 3-3-6) Configure CM for external authentication using LDAP | 89-95 | `on-premises/cm/ldap-auth.mdx` | `/on-premises/cm/ldap-auth` |
| 6 | 3-4) Setup CDP PvC Base Cluster - Overview | 96 | `on-premises/base.mdx` | `/on-premises/base` |
| 6 | 3-4-1) Install CDP PvC Base using the CM Web UI | 96-105 | `on-premises/base/installation.mdx` | `/on-premises/base/installation` |
| 7 | 3-4-2) Data Lake Creation | 105-119 | `on-premises/base/data-lake.mdx` | `/on-premises/base/data-lake` |
| 7 | 3-4-3) Additional Requirements and Details | 120-124 | `on-premises/base/additional-requirements.mdx` | `/on-premises/base/additional-requirements` |
| 8 | 3-4-4) Configure services with SSL/TLS-enabled Metadata Database | 125-127 | `on-premises/base/services-metadata-db-tls.mdx` | `/on-premises/base/services-metadata-db-tls` |
| 8 | 3-4-5) Scale the Cluster (Optional) | 128 | `on-premises/base/scale-cluster.mdx` | `/on-premises/base/scale-cluster` |
| 8 | 3-4-6) Enable High Availability (Optional) | 128 | `on-premises/base/high-availability.mdx` | `/on-premises/base/high-availability` |
| 8 | 3-4-7) Configure Services authentication for LDAP (Optional) | 129-143 | `on-premises/base/ldap-auth.mdx` | `/on-premises/base/ldap-auth` |
| 8 | 3-4-8) Optimize Log Collection | 144 | `on-premises/base/optimize-log-collection.mdx` | `/on-premises/base/optimize-log-collection` |
| 9 | 4) CDP Data Services Installation (ECS) - Overview | 145 | `ds.mdx` | `/ds` |
| 9 | 4-1) Embedded Container Service (ECS) Requirements | 145-148 | `ds/ecs-requirements.mdx` | `/ds/ecs-requirements` |
| 9 | 4-2) Checklist **(table only)** | 148-155 | `ds/checklist.mdx` | `/ds/checklist` |
| 10 | 4-3) Install CDP Data Services using ECS - Overview | 156 | `ds/ecs.mdx` | `/ds/ecs` |
| 10 | 4-3-1) Install ECS Cluster | 157-186 | `ds/ecs/installation.mdx` | `/ds/ecs/installation` |
| 11 | 4-3-2) Additional Steps for ECS Cluster Setup | 187-189 | `ds/ecs/additional-steps.mdx` | `/ds/ecs/additional-steps` |
| 11 | 4-3-3) Dedicating ECS Nodes for Specific Workloads (Optional) | 190-191 | `ds/ecs/specific-workloads.mdx` | `/ds/ecs/specific-workloads` |
| 12 | 5) Accessing Cloudera | 192-200 | `accessing-data-services.mdx` | `/accessing-data-services` |
| 13 | 6) Cloudera AI (CAI) | 201-216 | `cai.mdx` | `/cai` |
| 14 | 7) Cloudera Data Warehouse (CDW) | 217-220 | `cdw.mdx` | `/cdw` |
| 14 | 8) Cloudera Data Engineering (CDE) | 221-226 | `cde.mdx` | `/cde` |
| 15 | 9) Appendix - Overview | 228 | `appendix.mdx` | `/appendix` |
| 15 | 9-1) References Used in Guide | 228 | `appendix/references.mdx` | `/appendix/references` |
| 15 | 9-2) Glossary of Terms | 228-230 | `appendix/glossary-terms.mdx` | `/appendix/glossary-terms` |
| 15 | 9-3) Glossary of Acronyms | 230-231 | `appendix/glossary-acronyms.mdx` | `/appendix/glossary-acronyms` |
| 15 | 9-4) FreeIPA Reference | 231-234 | `appendix/freeipa.mdx` | `/appendix/freeipa` |
| 16 | 10) Cluster Validation | 235-238 | `validation.mdx` | `/validation` |
| 16 | 11) Cluster Cleanup | 239-242 | `cleanup.mdx` | `/cleanup` |
| 16 | 12) Error Handling | 243-254 | `error-handling.mdx` | `/error-handling` |
| 16 | 13) Kubernetes Command Reference | 255 | `kubernetes-commands.mdx` | `/kubernetes-commands` |
| 16 | 14) Acknowledgements | 256 | `acknowledgements.mdx` | `/acknowledgements` |

**43 pages across 16 phases.**

Page ranges are the **256-page 2026-08-18 edition's**. 33 of the 43 rows shifted from the 254-page
edition the guide was first ingested from, by at most ±2; section 1 covers how they were derived and
what that does not guarantee.

## 7. Definition of done (identical for all 16 tickets)

1. Every MDX file for the phase exists at its **exact** path — its pre-built nav link resolves, no 404.
2. Frontmatter complete, with `prevSlug`/`nextSlug` taken from P3's canonical ordering.
3. All screenshots extracted as **PNG** into `public/images/cdp-7-3-2/<section>/`, referenced
   absolutely, with meaningful alt text, and the 700×7 banner artefacts deleted.
4. Commands, hostnames and config values transcribed **verbatim** via `pdftotext` — never retyped
   from the visual render.
5. Body starts at `h2`; every code fence has a language tag.
6. `pnpm build` passes.
7. Page ranges honoured exactly, including the quirks: **Phase 9's `4-2` is the table only**;
   **Phases 2, 7 and 10 exceed 20 pages** and need multiple `Read` calls.
