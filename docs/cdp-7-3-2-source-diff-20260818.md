# CDP 7.3.2 source PDF — outstanding work from the 2026-08-18 edition

Cloudera delivered a new edition of the deployment guide on 2026-08-18. It was diffed
against the edition the guide was ingested from, and the resulting changes have been
partly applied to the site. **This file is a worklist: it carries only what is still
outstanding.** Items are deleted as they are finished rather than marked closed.

| | File | Pages | Size | Producer |
|:--|:--|:--|:--|:--|
| Old | `sources/cloudera-on-premise-deployment-guide-ecs-original.pdf` | 254 | 15.6 MB | GPL Ghostscript 10.05.1 |
| New | `sources/cloudera-on-premise-deployment-guide-ecs-20260818.pdf` | 256 | 54.2 MB | Skia/PDF Google Docs Renderer |

Both are git-ignored. **Page numbers below are the new edition's.**

---

## Settled rulings — do not revert these

The site deliberately departs from the source on four points. Each was decided
deliberately; a later ingestion pass must not "fix" the site back to match the PDF.

1. **AD and LDAP tables stay merged.** The source splits AD variants out into
   standalone tables (new Table 8 *AD LDAP Integration* p. 91, new Table 15 *LDAP AD
   Integration* p. 195, with Tables 7 and 14 retitled *FreeIPA*). The site instead
   carries one row per property holding both values, AD first — commits `1b6d6d2` and
   `c50f717`. Fold any new AD value into the existing merged row; do not add a table.
   The standing rule is in `docs/agents/cdp-7-3-2-ingestion.md` §5, which also names
   the two deliberate exceptions (the Ranger admin and Atlas tables, and the Active
   Directory Domain rows).
2. **Cloudera Manager build is `81323056` everywhere.** The source names three
   different builds for 7.13.2.100 — `77091850` in the version table (p. 25),
   `80024490` in the download script (p. 59), `81323056` in the RPM listing (p. 62).
   The site uses `81323056` throughout, including in the download script, so the
   script fetches the files the listing shows.
3. **Data Services is `h3200` everywhere.** The source's version table says
   `1.5.5 SP3 CHF1 (1.5.5-h3200-b238)` but its download procedure (p. 161–162) still
   says `1.5.5-h2000`. The site uses `h3200` in both.
4. **RHEL is 9.7 everywhere.** The source contradicts itself: the requirements table
   and lock commands say 9.7, but the surrounding prose, the "Solution 1" heading and
   the closing sentence still say 9.5, and the sample `cat /etc/*rel*` output on p. 29
   says 9.5. The site is 9.7 throughout.

---

## Outstanding — content

### `on-premises/cm/kerberos.mdx`

The KDC setup table (p. 82–83) now fills in two values that were blank before: Active
Directory Suffix `OU=cloudera,DC=cldrsetup,DC=local` and credentials
`Administrator / Cloudera@123`. The site still carries the clipped row.

### `on-premises/cm/ldap-auth.mdx` and `accessing-data-services.mdx`

New AD values only — read the source's new Tables 8 (p. 91) and 15 (p. 195) and fold
any genuinely new value into the existing merged rows, per ruling 1 above.

**Table 15 uses a different lab from the rest of the document**: `ldap://dc.ntnxlab.local:389/`,
`Administrator@ntnxlab.local`, `OU=cloudera,DC=ntnxlab,DC=local`. It is not a drop-in.

### `ds/ecs-requirements.mdx`

`nvidia-container-runtime` wording was reordered on p. 147. Not yet checked against the
site.

---

## Outstanding — `docs/agents/cdp-7-3-2-ingestion.md`

### Section 1 — pagination and table numbering

- The pagination note is wrong in the other direction. It says *"the Ranger LDAP
  section that section 6 lists at 129-142 starts at **128** in this file."* In this
  edition it starts at **129** again — but ends at **143**, not 142.
- The table-renumbering note is understated. *"Old Table 8 is Table 9 here"* still
  holds, but the shift now runs all the way through Table 14, and there are two
  entirely new tables:

| Old | New | Page (new) | Caption |
|:--|:--|:--|:--|
| Table 7 | Table 7 | 90 | *FreeIPA* LDAP Integration (retitled) |
| — | **Table 8** | 91 | **AD LDAP Integration** (new) |
| Table 8 | Table 9 | 129 | Admin LDAP Integration (Ranger) |
| Table 9 | Table 10 | 133 | UserSync LDAP Integration |
| Table 10 | Table 11 | 134 | UserSync AD Integration |
| Table 11 | Table 12 | 141 | Atlas LDAP Integration |
| Table 12 | Table 13 | 143 | LDAP Integration-Hive |
| Table 13 | Table 14 | 194 | LDAP *FreeIPA* Integration (retitled) |
| — | **Table 15** | 195 | **LDAP AD Integration** (new) |

Tables 1–4 keep their numbers. The site carries no table numbers of its own, so this
affects the playbook's note, not the MDX.

### Section 1 — Known source quirks

- **Add: no monospace fonts.** The old file embedded `CourierNew`, `Consolas`,
  `FreeMono` and `RobotoMono`. **The new file embeds no monospace font at all** — every
  shell command, config snippet and terminal transcript renders in Calibri or Arial.
  Code blocks are no longer visually distinguishable from prose in a page render; the
  boxed border is the only cue. `pdftotext -layout` still reconstructs columns
  correctly because it works from glyph positions, so **the verbatim-extraction rule
  holds and is now more important than ever.**
- **Add: the exporter deduplicates images by object ID.** One XObject can now be placed
  on pages far apart (object 213 appears on both p. 34 and p. 46). Any script that
  counts figures by unique object ID will undercount. Count placements, not objects.
- **Stale versions inside screenshots.** Page numbers shift — CM `7.11.3` is still
  p. 98, but Data Services `1.5.4-h5-b104` moves from p. 159 to p. **160**.

### Section 6 — the phase index

**36 of the 43 rows shift.** Replacement page ranges:

| Phase | Section | Old range | New range | File |
|:--|:--|:--|:--|:--|
| 1 | 0) VM Creation | 7-15 | 7-15 | `vm.mdx` |
| 1 | 1) Solution Summary | 16-27 | **16-26** | `summary.mdx` |
| 2 | 2) Post OS Installation - Preliminary Work | 28-58 | **27-57** | `post-os-work.mdx` |
| 3 | 3) Install CDP Private Cloud - Overview | 58 | **57** | `on-premises.mdx` |
| 3 | 3-1) Prerequisites Overview | 58-59 | **57-58** | `on-premises/prerequisites.mdx` |
| 3 | 3-2) Setup Repositories and Parcels | 60-65 | **59-64** | `on-premises/repos-and-parcels.mdx` |
| 4 | 3-3) Setup Cloudera Manager Server - Overview | 65 | **64** | `on-premises/cm.mdx` |
| 4 | 3-3-1) Setup Database for Cloudera Manager | 65-73 | **64-73** | `on-premises/cm/database.mdx` |
| 4 | 3-3-2) Install Cloudera Manager Server | 73-76 | 73-76 | `on-premises/cm/server.mdx` |
| 5 | 3-3-3) Enable Auto-TLS | 77-80 | 77-80 | `on-premises/cm/auto-tls.mdx` |
| 5 | 3-3-4) Enable Kerberos | 80-86 | **80-85** | `on-premises/cm/kerberos.mdx` |
| 5 | 3-3-5) Setup Cloudera Management Services | 87-89 | **86-88** | `on-premises/cm/mgmt-services.mdx` |
| 5 | 3-3-6) Configure CM for external authentication using LDAP | 90-95 | **89-95** | `on-premises/cm/ldap-auth.mdx` |
| 6 | 3-4) Setup CDP PvC Base Cluster - Overview | 96 | 96 | `on-premises/base.mdx` |
| 6 | 3-4-1) Install CDP PvC Base using the CM Web UI | 96-105 | 96-105 | `on-premises/base/installation.mdx` |
| 7 | 3-4-2) Data Lake Creation | 105-119 | 105-119 | `on-premises/base/data-lake.mdx` |
| 7 | 3-4-3) Additional Requirements and Details | 120-124 | 120-124 | `on-premises/base/additional-requirements.mdx` |
| 8 | 3-4-4) Configure services with SSL/TLS-enabled Metadata Database | 125-127 | 125-127 | `on-premises/base/services-metadata-db-tls.mdx` |
| 8 | 3-4-5) Scale the Cluster (Optional) | 128 | 128 | `on-premises/base/scale-cluster.mdx` |
| 8 | 3-4-6) Enable High Availability (Optional) | 128 | 128 | `on-premises/base/high-availability.mdx` |
| 8 | 3-4-7) Configure Services authentication for LDAP (Optional) | 129-142 | **129-143** | `on-premises/base/ldap-auth.mdx` |
| 8 | 3-4-8) Optimize Log Collection | 143 | **144** | `on-premises/base/optimize-log-collection.mdx` |
| 9 | 4) CDP Data Services Installation (ECS) - Overview | 144 | **145** | `ds.mdx` |
| 9 | 4-1) Embedded Container Service (ECS) Requirements | 144-147 | **145-148** | `ds/ecs-requirements.mdx` |
| 9 | 4-2) Checklist (table only) | 147-154 | **148-155** | `ds/checklist.mdx` |
| 10 | 4-3) Install CDP Data Services using ECS - Overview | 155 | **156** | `ds/ecs.mdx` |
| 10 | 4-3-1) Install ECS Cluster | 156-185 | **157-186** | `ds/ecs/installation.mdx` |
| 11 | 4-3-2) Additional Steps for ECS Cluster Setup | 186-188 | **187-189** | `ds/ecs/additional-steps.mdx` |
| 11 | 4-3-3) Dedicating ECS Nodes for Specific Workloads (Optional) | 189-190 | **190-191** | `ds/ecs/specific-workloads.mdx` |
| 12 | 5) Accessing Cloudera | 191-198 | **192-200** | `accessing-data-services.mdx` |
| 13 | 6) Cloudera AI (CAI) | 199-215 | **201-216** | `cai.mdx` |
| 14 | 7) Cloudera Data Warehouse (CDW) | 216-219 | **217-220** | `cdw.mdx` |
| 14 | 8) Cloudera Data Engineering (CDE) | 220-225 | **221-226** | `cde.mdx` |
| 15 | 9) Appendix - Overview | 226 | **228** | `appendix.mdx` |
| 15 | 9-1) References Used in Guide | 226 | **228** | `appendix/references.mdx` |
| 15 | 9-2) Glossary of Terms | 226-228 | **228-230** | `appendix/glossary-terms.mdx` |
| 15 | 9-3) Glossary of Acronyms | 228-229 | **230-231** | `appendix/glossary-acronyms.mdx` |
| 15 | 9-4) FreeIPA Reference | 229-232 | **231-234** | `appendix/freeipa.mdx` |
| 16 | 10) Cluster Validation | 233-236 | **235-238** | `validation.mdx` |
| 16 | 11) Cluster Cleanup | 237-240 | **239-242** | `cleanup.mdx` |
| 16 | 12) Error Handling | 241-252 | **243-254** | `error-handling.mdx` |
| 16 | 13) Kubernetes Command Reference | 253 | **255** | `kubernetes-commands.mdx` |
| 16 | 14) Acknowledgements | 254 | **256** | `acknowledgements.mdx` |

**These ranges were derived by page alignment, not by re-reading each heading.** The
playbook's standing instruction — *"treat every page range in section 6 as approximate,
confirm with `pdftotext` before extracting"* — applies to this table too.

---

## Constraints on the remaining work

- **All 232 figures are unchanged** — same screenshots, same order, re-encoded only
  (largest perceptual difference 6.6 on a 0–255 scale). Nothing needs re-extracting.
- **Screenshots are exempt as a source of findings.** Per
  `docs/cdp-7-3-2-consistency-audit.md`, anything that would only be fixed by
  recapturing a screenshot is not a finding, and that includes alt text. Since no
  screenshot changed, the exemption applies unchanged here.
- **Document structure is unchanged.** The table of contents is identical entry for
  entry — no sections added, removed, renamed or reordered. Only page numbers shift.
- **The Ranger Database JDBC URL Override on p. 125 cannot be read out of either PDF.**
  It overflows its table cell and is clipped mid-string in the new edition
  (`…verify-full&ssl` / `=/var/lib/ranger/root.crt`); the old edition wrapped it and
  lost a different span. The intended value is
  `jdbc:postgresql://cldr-mngr.cldrsetup.local:5432/ranger?ssl=true&sslmode=verify-full&sslrootcert=/var/lib/ranger/root.crt`.

---

## Appendix — method

The diff was produced by comparing the two PDFs directly with Poppler
(`brew install poppler`) and stock Python 3; Cloudera supplied no changelog. No content
was judged from a visual render.

```bash
# text, normalised (footers and zero-width joiners stripped), then word-level diff
pdftotext -layout old.pdf old.txt
pdftotext -layout new.pdf new.txt

# page alignment: banded DP over per-page similarity, to survive the ±1 drift
# result: 3 old-only pages (22, 81, 209), 5 new-only (66, 94, 140, 195, 227)

# figures
pdfimages -list old.pdf   # 306 placements, 232 distinct
pdfimages -list new.pdf   # 306 placements, 232 distinct

# fonts
pdffonts new.pdf | awk '{print $1}' | sed 's/^[A-Z]*+//' | sort -u
```

Two caveats if the diff is ever re-run:

- The old file loses `fi`/`fl`/`ff` ligatures in headings and the table of contents
  (Ghostscript re-encoding), producing artefacts like `Con gure` and `Ni` for `Nifi`.
  Any `Con gure` → `Configure` style difference is an extraction artefact, not an edit.
- Word-order differences inside table rows (`Kafka ZooKeeper Service Dependencies`
  vs `Service Dependencies Kafka ZooKeeper`) come from cell reading order changing with
  the reflow. They are not edits either.
