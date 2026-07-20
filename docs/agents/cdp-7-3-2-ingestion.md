# CDP 7.3.2 ingestion playbook

The single reference for all 16 execution tickets (E1–E16) of the CDP 7.3.2 ECS deployment guide
ingestion. Each execution ticket links here rather than restating any of it. Read this file end to
end before touching the PDF.

Map: [Wayfinder: Regroup docs by installation version and ingest the Cloudera 7.3.2 ECS deployment
guide](https://github.com/maatouk-j1/cloudera-guides/issues/10).

---

## 1. Source and tooling

Source PDF: `sources/Cloudera_On-Premise_Deployment_Guide-ECS.pdf` — **254 pages**, git-ignored,
acquired and verified in P1. Every page range in section 6 is valid against this file.

### PowerShell only

Run **all** PDF work from PowerShell. Bash resolves `pdftotext` to Git Bash's bundled
`/mingw64/bin` build — **version 4.00 (© 1996–2017)** — which silently shadows the installed
**Poppler 26.02.0** that PowerShell resolves at `D:\poppler-26.02.0\Library\bin`. Using Bash
degrades both text and image extraction, quietly.

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

- **Header banner on every page.** A 700×7 decorative rule (PDF object 176) is embedded on all 254
  pages and always extracts as `p-NNN-000.png` at ~134 bytes. It is never content — delete it.
- **Screenshots can show stale versions.** Some captures are recycled from an older lab build
  (p. 98 shows Cloudera Manager `7.11.3`; p. 159 shows Data Services `1.5.4-h5-b104`). Prose and
  the version table win over what a screenshot displays. Never transcribe a version out of an image.

### Versions (from the guide's own version table, ~p. 26; corrected in P1)

| Component | Version |
|:--|:--|
| Cloudera on premises Base Runtime | **7.3.2.0** (`7.3.2-1.cdh7.3.2.p0.77083870`) — but **7.3.1 SP3 CHF2** if Cloudera AI is in play |
| Data Services | **1.5.5 SP2** (`1.5.5-h2000-b238`) |
| Cloudera Manager | **7.13.2.0** (`7.13.2.0-77091850`; repo paths use `7.13.2.400`) |
| OS | **RHEL 9.5** |

The folder slug is `cdp-7-3-2` — no SP/CHF, because service packs churn. The nav title is
"CDP 7.3.2". Precise product names and full version strings live on the version landing page.

## 2. Structure is fixed, not discovered

All 43 URLs, titles and page ranges are fixed by the index in [section 6](#6-the-phase-index-authoritative).
Do not re-derive structure from the PDF's own headings, and do not invent grouping.

A page's slug is **literally its path under `content/docs/`, minus the `.mdx`**
(`components/mdx/utils.ts:67`). There is no `index.mdx` stripping — `content/docs/installations/index.mdx`
really does serve at `/installations/index`. So section landing pages use the **sibling-file
pattern**: `cdppvc.mdx` sits *beside* the `cdppvc/` folder, giving `/…/cdppvc` for the landing and
`/…/cdppvc/prerequisites` for its children.

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

- **Body starts at `h2`** — the page shell already renders `title` as the `h1`.
- Headings `h1`–`h4` are auto-anchored. The anchor id lowercases, replaces spaces with `-` and
  strips non-word characters (`components/mdx/mdx.tsx:14-24`), so avoid duplicate headings on a page
  if you intend to link to them.
- GFM tables and syntax-highlighted code fences are available. **Always tag a code fence with a
  language** (`bash`, `sql`, `yaml`, `ini`, `text`) — untagged fences lose highlighting.
- Custom components: `Banner`, `Accordion`, `Tag`, `Table`/`THead`/`TBody`/`ThRow`/`TbRow`/`Th`/`Td`,
  `Image`, `Link`, `ModalVideo`.
- Match the tone and density of the existing 7.1.7 pages (`content/docs/cdppvc/`, moving to
  `content/docs/installations/cdp-7-1-7/cdppvc/` under P2): numbered procedure steps, with code
  fences and images indented four spaces under their step so they stay inside the list item.

## 5. Rules of engagement

- **Never edit `lib/navigation.ts`.** It is pre-built once by P3. Your nav entries already exist;
  your job is to make the files they point at exist.
- Touch **only** your own phase's `.mdx` files and your own `public/images/cdp-7-3-2/<section>/`
  folder. All 16 phases are disjoint by construction — that is what makes parallel execution safe.
- Branch `feat/cdp-7-3-2-phase-N`, one PR per phase, linked to its ticket.

## 6. The phase index (authoritative)

Paths are relative to `content/docs/installations/cdp-7-3-2/`; URLs are prefixed
`/installations/cdp-7-3-2/`.

| Phase | Section | Pages | File | URL suffix |
|:--|:--|:--|:--|:--|
| 1 | 0) VM Creation | 7-15 | `vm.mdx` | `/vm` |
| 1 | 1) Solution Summary | 16-27 | `summary.mdx` | `/summary` |
| 2 | 2) Post OS Installation - Preliminary Work | 28-58 | `post-os-work.mdx` | `/post-os-work` |
| 3 | 3) Install CDP Private Cloud - Overview | 58 | `cdppvc.mdx` | `/cdppvc` |
| 3 | 3-1) Prerequisites Overview | 58-59 | `cdppvc/prerequisites.mdx` | `/cdppvc/prerequisites` |
| 3 | 3-2) Setup Repositories and Parcels | 60-65 | `cdppvc/repos-and-parcels.mdx` | `/cdppvc/repos-and-parcels` |
| 4 | 3-3) Setup Cloudera Manager Server - Overview | 65 | `cdppvc/cm.mdx` | `/cdppvc/cm` |
| 4 | 3-3-1) Setup Database for Cloudera Manager | 65-73 | `cdppvc/cm/database.mdx` | `/cdppvc/cm/database` |
| 4 | 3-3-2) Install Cloudera Manager Server | 73-76 | `cdppvc/cm/server.mdx` | `/cdppvc/cm/server` |
| 5 | 3-3-3) Enable Auto-TLS | 77-80 | `cdppvc/cm/auto-tls.mdx` | `/cdppvc/cm/auto-tls` |
| 5 | 3-3-4) Enable Kerberos | 80-86 | `cdppvc/cm/kerberos.mdx` | `/cdppvc/cm/kerberos` |
| 5 | 3-3-5) Setup Cloudera Management Services | 87-89 | `cdppvc/cm/mgmt-services.mdx` | `/cdppvc/cm/mgmt-services` |
| 5 | 3-3-6) Configure CM for external authentication using LDAP | 90-95 | `cdppvc/cm/ldap-auth.mdx` | `/cdppvc/cm/ldap-auth` |
| 6 | 3-4) Setup CDP PvC Base Cluster - Overview | 96 | `cdppvc/base.mdx` | `/cdppvc/base` |
| 6 | 3-4-1) Install CDP PvC Base using the CM Web UI | 96-105 | `cdppvc/base/installation.mdx` | `/cdppvc/base/installation` |
| 7 | 3-4-2) Data Lake Creation | 105-119 | `cdppvc/base/data-lake.mdx` | `/cdppvc/base/data-lake` |
| 7 | 3-4-3) Additional Requirements and Details | 120-124 | `cdppvc/base/additional-requirements.mdx` | `/cdppvc/base/additional-requirements` |
| 8 | 3-4-4) Configure services with SSL/TLS-enabled Metadata Database | 125-127 | `cdppvc/base/services-metadata-db-tls.mdx` | `/cdppvc/base/services-metadata-db-tls` |
| 8 | 3-4-5) Scale the Cluster (Optional) | 128 | `cdppvc/base/scale-cluster.mdx` | `/cdppvc/base/scale-cluster` |
| 8 | 3-4-6) Enable High Availability (Optional) | 128 | `cdppvc/base/high-availability.mdx` | `/cdppvc/base/high-availability` |
| 8 | 3-4-7) Configure Services authentication for LDAP (Optional) | 129-142 | `cdppvc/base/ldap-auth.mdx` | `/cdppvc/base/ldap-auth` |
| 8 | 3-4-8) Optimize Log Collection | 143 | `cdppvc/base/optimize-log-collection.mdx` | `/cdppvc/base/optimize-log-collection` |
| 9 | 4) CDP Data Services Installation (ECS) - Overview | 144 | `ds.mdx` | `/ds` |
| 9 | 4-1) Embedded Container Service (ECS) Requirements | 144-147 | `ds/ecs-requirements.mdx` | `/ds/ecs-requirements` |
| 9 | 4-2) Checklist **(table only)** | 147-154 | `ds/checklist.mdx` | `/ds/checklist` |
| 10 | 4-3) Install CDP Data Services using ECS - Overview | 155 | `ds/ecs.mdx` | `/ds/ecs` |
| 10 | 4-3-1) Install ECS Cluster | 156-185 | `ds/ecs/installation.mdx` | `/ds/ecs/installation` |
| 11 | 4-3-2) Additional Steps for ECS Cluster Setup | 186-188 | `ds/ecs/additional-steps.mdx` | `/ds/ecs/additional-steps` |
| 11 | 4-3-3) Dedicating ECS Nodes for Specific Workloads (Optional) | 189-190 | `ds/ecs/specific-workloads.mdx` | `/ds/ecs/specific-workloads` |
| 12 | 5) Accessing Cloudera | 191-198 | `accessing-cloudera.mdx` | `/accessing-cloudera` |
| 13 | 6) Cloudera AI (CAI) | 199-215 | `cai.mdx` | `/cai` |
| 14 | 7) Cloudera Data Warehouse (CDW) | 216-219 | `cdw.mdx` | `/cdw` |
| 14 | 8) Cloudera Data Engineering (CDE) | 220-225 | `cde.mdx` | `/cde` |
| 15 | 9) Appendix - Overview | 226 | `appendix.mdx` | `/appendix` |
| 15 | 9-1) References Used in Guide | 226 | `appendix/references.mdx` | `/appendix/references` |
| 15 | 9-2) Glossary of Terms | 226-228 | `appendix/glossary-terms.mdx` | `/appendix/glossary-terms` |
| 15 | 9-3) Glossary of Acronyms | 228-229 | `appendix/glossary-acronyms.mdx` | `/appendix/glossary-acronyms` |
| 15 | 9-4) FreeIPA Reference | 229-232 | `appendix/freeipa.mdx` | `/appendix/freeipa` |
| 16 | 10) Cluster Validation | 233-236 | `validation.mdx` | `/validation` |
| 16 | 11) Cluster Cleanup | 237-240 | `cleanup.mdx` | `/cleanup` |
| 16 | 12) Error Handling | 241-252 | `error-handling.mdx` | `/error-handling` |
| 16 | 13) Kubernetes Command Reference | 253 | `kubernetes-commands.mdx` | `/kubernetes-commands` |
| 16 | 14) Acknowledgements | 254 | `acknowledgements.mdx` | `/acknowledgements` |

**43 pages across 16 phases.**

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
