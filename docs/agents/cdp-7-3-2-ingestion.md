# CDP 7.3.2 ingestion playbook

The single reference for all 16 execution tickets (E1–E16) of the CDP 7.3.2 ECS deployment guide
ingestion. Each execution ticket links here rather than restating any of it. Read this file end to
end before touching the PDF.

Map: [Wayfinder: Regroup docs by installation version and ingest the Cloudera 7.3.2 ECS deployment
guide](https://github.com/maatouk-j1/cloudera-guides/issues/10).

---

## 1. Source and tooling

Source PDF: `sources/cloudera-on-premise-deployment-guide-ecs-20260907-0958.pdf` — **251 pages**,
git-ignored. The 254-page edition the guide was first ingested from is kept beside it as
`…-ecs-original.pdf`. Two intermediate editions this playbook used to name — 255-page, then
256-page — are both gone and cannot be re-derived, so the 256-page page ranges that section 6
carried until 2026-09-03 can no longer be checked against anything.

**Section 6's page ranges are the 251-page edition's**, re-derived on 2026-09-03 by locating every
section heading in `pdftotext -layout` output and taking each section's end as the page before the
next one's start. Page indices were validated against the printed `Page N of 251` footer on all 251
pages, with no mismatch. This is a firmer derivation than the one it replaces — that one aligned two
files page by page without re-reading headings — but the caveat is unchanged: **a section boundary
does not always fall on a page break**, so confirm with `pdftotext` before extracting.

This edition is not simply the old one restructured. Three things moved:

- **Solution Summary and VM Creation swapped.** The front matter (title, introduction, service
  dependencies) now runs pp. 7–10, Solution Summary pp. 11–17, VM Creation pp. 18–26. Every earlier
  edition opened with VM Creation on p. 7. **The site keeps its own order** — `vm.mdx` still precedes
  `summary.mdx`, and `prevSlug`/`nextSlug` are unchanged — so section 6 is listed in site order and
  its page numbers run backwards across those two rows. That is expected, not an error.
- **The back half shifted earlier**, by up to 6 pages, because the front matter is tighter and the
  reflow accumulates. **38 of the 43 rows in section 6 changed.** The five that did not are
  `on-premises.mdx` (57), `on-premises/prerequisites.mdx` (57-58),
  `on-premises/repos-and-parcels.mdx` (59-64), `on-premises/cm/kerberos.mdx` (80-85) and
  `on-premises/cm/mgmt-services.mdx` (86-88) — they sit in a stretch where two shifts cancelled.
  Coincidence, not stability: re-check them like any other.
- **The versions changed** — see the versions table below. All three product versions are newer than
  the ones the site documents.

**Table numbers are stable across the last two editions; only their pages moved.** The MDX carries no
table numbers of its own, so this affects extraction only — but a caption is the fastest way to
confirm you are on the page you meant to be on. Pages below are this edition's, read off the
captions themselves.

| Table | Page | Caption |
|:--|:--|:--|
| Table 7 | 90 | **FreeIPA** LDAP Integration |
| Table 8 | 91 | AD LDAP Integration |
| Table 9 | 127 | User LDAP Integration (Ranger admin) |
| Table 10 | 131 | UserSync LDAP Integration |
| Table 11 | 132 | UserSync AD Integration |
| Table 12 | 138 | Atlas LDAP Integration |
| Table 13 | 140 | LDAP Integration-Hive |
| Table 14 | 189 | LDAP **FreeIPA** Integration |
| Table 15 | 190 | LDAP AD Integration |

Tables 1–4 keep their numbers; the version table is Table 2 on p. 16. No edition has a Table 5, and
none has a table captioned Table 6 — the caption sequence skips both. The "see Table 6" on p. 82
still points at the table captioned Table 4 on that same page; that page number survived the reflow
by coincidence.

### macOS toolchain

Poppler comes from Homebrew — `brew install poppler` — and lands on `PATH` at
`/opt/homebrew/bin`. Run the tools straight from Bash; there is no shadowed build to work around.

### Four tools, four jobs

No single tool does the whole job.

| Tool | Job |
|:--|:--|
| `Read(file_path, pages:"N-M")` | **Comprehension.** Renders pages visually so you actually see each screenshot, understand what it depicts, and know where it belongs and how to caption it. **Max 20 pages per call.** |
| `pdftotext -layout -f N -l M` | **Verbatim text.** Commands, hostnames, paths, config values, tables. `-layout` preserves column alignment. |
| `pdfimages -png -p -f N -l M` | **Assets.** Embedded screenshots at native resolution; `-p` puts the page number in each filename so images can be matched back to pages. The default path — figures are embedded whole (144 illustrated pages, max 5 content images on any one; 70% carry 1–2; multi-image pages are distinct figures plus callout crops, not shards of one picture). |
| `pdftoppm -png -r 150 -f N -l M` | **Fallback, exception only.** For the rare figure built from vector art plus text overlays, which `pdfimages` fragments. Renders the whole page instead; crop after. |

Run `pdfimages -list -f N -l M` over your range *before* extracting, so you know what exists.

> **Never retype a command from the visual render.** Screenshots and rendered pages are for
> understanding only. Every command, hostname, path and config value must come out of `pdftotext`.

### Known source quirks

- **No monospace font anywhere.** The 254-page edition embedded `CourierNew`, `Consolas`, `FreeMono`
  and `RobotoMono`; **this one embeds none** — `pdffonts` lists only Arial, Calibri, Times, Roboto,
  MS-PGothic, FreeSerif and NotoColorEmoji. Every shell command, config snippet and terminal
  transcript renders in Calibri or Arial, so a code block is not visually distinguishable from prose
  in a page render — the boxed border is the only cue. `pdftotext -layout` is unaffected because it
  works from glyph positions, which makes **the verbatim-extraction rule below more important than
  ever**: you cannot tell by eye where a command starts and ends.
- **The contents pages drop the letter `f`.** On pp. 3–5 only, `pdftotext` renders `Configuration` as
  `Coniguration`, `Software` as `Sotware`, `of` as `o` and `for` as `or` — the `fi`/`fl`/`ff`/`ft`/`fo`
  ligatures have no mapping in that font's encoding. Body pages are unaffected. Never grep the
  contents pages for a literal string containing `f`; match against the body, or strip `f` from both
  sides before comparing.
- **Header banner on every page.** A 700×7 decorative rule is embedded on every page — 251
  placements from 2 objects — and always extracts as `p-NNN-000.png` at ~98 bytes. It is never
  content — delete it. Note `find -size -1k` does not match it on macOS (BSD `find` rounds up); use
  `-size -200c`.
- **Correction crops are overlaid on screenshots.** Where the source fixes a wrong value in a
  capture, it pastes a magnified crop over the offending row rather than re-shooting it. `pdfimages`
  extracts the two as separate objects, so the base capture alone shows the **wrong** value. In this
  edition the case is **p. 128**: two full captures plus a 665×159 crop (object 618) pasted over the
  `ranger.ldap.ad.referral` block, which reads `follow` only once the crop is composited. A page
  render shows the composite and therefore cannot tell you a crop is there — to detect one, look for
  a small image listed alongside a large one in `pdfimages -list`. Eight other pages have that
  shape and are worth checking before extraction: 48, 75, 134, 156, 191, 206, 217, 219. Always check
  the `pdftoppm` render before trusting an extracted capture, and stitch composites from renders.
- **One image object can be placed on several pages.** Usually that means a figure straddling a page
  break — the object appears twice in `pdfimages -list` with identical size, so render and
  concatenate both halves. But reuse is not always adjacent: object 213 is still placed on both p. 34
  and p. 46, and four others repeat across a gap (225 on 37/47, 377 on 79/81, 443 on 94/155, 667 on
  142/172). This edition carries **300 content placements from 228 distinct objects**, so any script
  that counts figures by unique object ID undercounts by 72. **Count placements, not objects.**
- **Screenshots can show stale versions.** Some captures are recycled from an older lab build. Prose
  and the version table win over what a screenshot displays. Never transcribe a version out of an
  image. The two examples this playbook used to cite were page references into the retired 256-page
  edition and have **not** been re-located in this one — the rule stands, the page numbers are gone.
  Note that the `7.11.3` on p. 145 is not an instance: it is the checklist's stated *minimum*
  Cloudera Manager version, in text, and is correct as printed.

### Versions

**The site and the current source no longer agree, and this is an open decision, not a settled one.**
The site documents the deployment that was actually built and verified. The 251-page edition
documents a newer one. Nothing in `content/` has been changed to match it.

| Component | Site documents | 251-page source says (Table 2, p. 16) |
|:--|:--|:--|
| Cloudera Base on premises Runtime | **7.3.2.100** (`CDH-7.3.2-1.cdh7.3.2.p100.81274879`) | **7.3.2.10000 / 7.3.2 SP1** (`7.3.2-1.cdh7.3.2.p10000.82216952`) |
| Data Services | **1.5.5 SP3 CHF1** (`1.5.5-h3200-b238`) | **1.5.5 SP3 CHF3** (`1.5.5-h3300-b26`) |
| Cloudera Manager | **7.13.2.100** (`7.13.2.100-81323056`) | **7.13.2.10000 / 7.13.2 SP1** (`7.13.2.10000-82229633`) |
| OS | **RHEL 9.7** | **RHEL 9.7** ("Verify with SupportMatrix first") |

Do not half-apply this. Bumping the version strings without re-reading the procedures that carry
them — the repo and parcel download scripts (pp. 59–64), the Data Services download (pp. 156–158)
and the ECS parcel paths pinned in `kubernetes-commands.mdx` — would leave the site internally
inconsistent, which is worse than being consistently one service pack behind. Decide it as its own
piece of work.

**Two of the three self-contradictions this playbook used to record are fixed in this edition.**

| | Status in the 251-page source |
|:--|:--|
| Cloudera Manager build | **Consistent.** The download script sets `CM_VERSION="7.13.2.10000"` (p. 59) and the RPM listing on p. 61 shows `cloudera-manager-server-7.13.2.10000-82229633`. The three-way disagreement between version table, script and listing is gone. |
| Data Services | **Consistent.** Version table and download procedure both say `1.5.5-h3300` (pp. 16, 156–158). The old `h2000`-vs-`h3200` split is gone. |
| OS | **Still contradictory, but narrower.** The version table, the "Solution 1" heading and the `--set=` lock commands all say 9.7 (pp. 16, 27). The prose sentence on p. 28 still says the lock pins "9.5 content", and the sample `cat /etc/*rel*` output on p. 29 still shows 9.5. The site says 9.7 everywhere; that stays. |

**One value still cannot be read out of any edition.** The Ranger Database JDBC URL Override on
**p. 123** overflows its table cell and is clipped mid-string at `…&sslr`. The intended value is:

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
| 1 | 0) VM Creation | 18-26 | `vm.mdx` | `/vm` |
| 1 | 1) Solution Summary | 11-17 | `summary.mdx` | `/summary` |
| 2 | 2) Post OS Installation - Preliminary Work | 27-56 | `post-os-work.mdx` | `/post-os-work` |
| 3 | 3) Install CDP Private Cloud - Overview | 57 | `on-premises.mdx` | `/on-premises` |
| 3 | 3-1) Prerequisites Overview | 57-58 | `on-premises/prerequisites.mdx` | `/on-premises/prerequisites` |
| 3 | 3-2) Setup Repositories and Parcels | 59-64 | `on-premises/repos-and-parcels.mdx` | `/on-premises/repos-and-parcels` |
| 4 | 3-3) Setup Cloudera Manager Server - Overview | 59 | `on-premises/cm.mdx` | `/on-premises/cm` |
| 4 | 3-3-1) Setup Database for Cloudera Manager | 65-73 | `on-premises/cm/database.mdx` | `/on-premises/cm/database` |
| 4 | 3-3-2) Install Cloudera Manager Server | 74-76 | `on-premises/cm/server.mdx` | `/on-premises/cm/server` |
| 5 | 3-3-3) Enable Auto-TLS | 77-79 | `on-premises/cm/auto-tls.mdx` | `/on-premises/cm/auto-tls` |
| 5 | 3-3-4) Enable Kerberos | 80-85 | `on-premises/cm/kerberos.mdx` | `/on-premises/cm/kerberos` |
| 5 | 3-3-5) Setup Cloudera Management Services | 86-88 | `on-premises/cm/mgmt-services.mdx` | `/on-premises/cm/mgmt-services` |
| 5 | 3-3-6) Configure CM for external authentication using LDAP | 89-93 | `on-premises/cm/ldap-auth.mdx` | `/on-premises/cm/ldap-auth` |
| 6 | 3-4) Setup CDP PvC Base Cluster - Overview | 94 | `on-premises/base.mdx` | `/on-premises/base` |
| 6 | 3-4-1) Install CDP PvC Base using the CM Web UI | 94-102 | `on-premises/base/installation.mdx` | `/on-premises/base/installation` |
| 7 | 3-4-2) Data Lake Creation | 103-117 | `on-premises/base/data-lake.mdx` | `/on-premises/base/data-lake` |
| 7 | 3-4-3) Additional Requirements and Details | 118-122 | `on-premises/base/additional-requirements.mdx` | `/on-premises/base/additional-requirements` |
| 8 | 3-4-4) Configure services with SSL/TLS-enabled Metadata Database | 123-125 | `on-premises/base/services-metadata-db-tls.mdx` | `/on-premises/base/services-metadata-db-tls` |
| 8 | 3-4-5) Scale the Cluster (Optional) | 126 | `on-premises/base/scale-cluster.mdx` | `/on-premises/base/scale-cluster` |
| 8 | 3-4-6) Enable High Availability (Optional) | 126 | `on-premises/base/high-availability.mdx` | `/on-premises/base/high-availability` |
| 8 | 3-4-7) Configure Services authentication for LDAP (Optional) | 127-140 | `on-premises/base/ldap-auth.mdx` | `/on-premises/base/ldap-auth` |
| 8 | 3-4-8) Optimize Log Collection | 141 | `on-premises/base/optimize-log-collection.mdx` | `/on-premises/base/optimize-log-collection` |
| 9 | 4) CDP Data Services Installation (ECS) - Overview | 142 | `ds.mdx` | `/ds` |
| 9 | 4-1) Embedded Container Service (ECS) Requirements | 142-144 | `ds/ecs-requirements.mdx` | `/ds/ecs-requirements` |
| 9 | 4-2) Checklist **(table only)** | 145-152 | `ds/checklist.mdx` | `/ds/checklist` |
| 10 | 4-3) Install CDP Data Services using ECS - Overview | 153 | `ds/ecs.mdx` | `/ds/ecs` |
| 10 | 4-3-1) Install ECS Cluster | 154-182 | `ds/ecs/installation.mdx` | `/ds/ecs/installation` |
| 11 | 4-3-2) Additional Steps for ECS Cluster Setup | 183-184 | `ds/ecs/additional-steps.mdx` | `/ds/ecs/additional-steps` |
| 11 | 4-3-3) Dedicating ECS Nodes for Specific Workloads (Optional) | 185-186 | `ds/ecs/specific-workloads.mdx` | `/ds/ecs/specific-workloads` |
| 12 | 5) Accessing Cloudera | 187-195 | `accessing-data-services.mdx` | `/accessing-data-services` |
| 13 | 6) Cloudera AI (CAI) | 196-212 | `cai.mdx` | `/cai` |
| 14 | 7) Cloudera Data Warehouse (CDW) | 213-216 | `cdw.mdx` | `/cdw` |
| 14 | 8) Cloudera Data Engineering (CDE) | 217-222 | `cde.mdx` | `/cde` |
| 15 | 9) Appendix - Overview | 223 | `appendix.mdx` | `/appendix` |
| 15 | 9-1) References Used in Guide | 223 | `appendix/references.mdx` | `/appendix/references` |
| 15 | 9-2) Glossary of Terms | 223-224 | `appendix/glossary-terms.mdx` | `/appendix/glossary-terms` |
| 15 | 9-3) Glossary of Acronyms | 225 | `appendix/glossary-acronyms.mdx` | `/appendix/glossary-acronyms` |
| 15 | 9-4) FreeIPA Reference | 226-229 | `appendix/freeipa.mdx` | `/appendix/freeipa` |
| 16 | 10) Cluster Validation | 230-233 | `validation.mdx` | `/validation` |
| 16 | 11) Cluster Cleanup | 234-237 | `cleanup.mdx` | `/cleanup` |
| 16 | 12) Error Handling | 238-249 | `error-handling.mdx` | `/error-handling` |
| 16 | 13) Kubernetes Command Reference | 250 | `kubernetes-commands.mdx` | `/kubernetes-commands` |
| 16 | 14) Acknowledgements | 251 | `acknowledgements.mdx` | `/acknowledgements` |

**43 pages across 16 phases.**

Page ranges are the **251-page 2026-09-07 edition's**, re-derived 2026-09-03. **38 of the 43 rows
moved** from the 256-page ranges they replace — this is not the ±2 drift the previous edition
brought, it is a shift of up to 6 pages plus a reordered front section. Section 1 lists the five
rows that happen to be unchanged, and covers how all of them were derived and what that does not
guarantee.

Two rows need reading carefully:

- **`summary.mdx` (11-17) comes before `vm.mdx` (18-26) in the source.** The table is in site order,
  so those two page ranges run backwards. The site's order is deliberate and unchanged.
- **`on-premises/cm.mdx` (59) and `on-premises/repos-and-parcels.mdx` (59-64) overlap.** In the
  source the repo and parcel procedures sit *inside* the "Cloudera on premises Cloudera Manager
  Server Setup" section, which opens on p. 59; the site splits them into two pages. Extract the
  heading and its intro for `cm.mdx`, the procedures for `repos-and-parcels.mdx`.

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
