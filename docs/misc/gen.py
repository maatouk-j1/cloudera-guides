"""
Generates the GitHub issue bodies for the 16 CDP 7.3.2 ingestion execution
tickets (E1-E16) from the authoritative phase index.

Context: wayfinder map
https://github.com/maatouk-j1/cloudera-guides/issues/10

The tickets it produced are already live as issues #16-#31, so this script is
kept only for REGENERATION - most plausibly if the source PDF turns out not to
be exactly 254 pages, which invalidates every page range at once (see the stop
condition in P1, issue #11).

Usage:
    python gen.py [output_dir]      # default: ./generated

Then push a regenerated body with:
    gh issue edit <number> --body-file <output_dir>/e<phase>.md

The phase index below is the single source of truth for page ranges, file paths
and URLs. Keep it in sync with section 6 of the P4 playbook (issue #14).
"""

import os, sys, json

SP = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "generated")
os.makedirs(SP, exist_ok=True)

# phase -> (list of (section, pages, file, url), notes)
PH = {
 1: ([("0) VM Creation","7-15","vm.mdx","/vm"),
      ("1) Solution Summary","16-27","summary.mdx","/summary")], []),
 2: ([("2) Post OS Installation - Preliminary Work","28-58","post-os-work.mdx","/post-os-work")],
     ["**31 pages — exceeds the 20-page `Read` limit.** Split into at least two `Read` calls (e.g. 28-47, 48-58). This is the single largest page range in the guide feeding one output page; expect a long, dense document and keep the structure faithful to the source ordering."]),
 3: ([("3) Install CDP Private Cloud - Overview","58","cdppvc.mdx","/cdppvc"),
      ("3-1) Prerequisites Overview","58-59","cdppvc/prerequisites.mdx","/cdppvc/prerequisites"),
      ("3-2) Setup Repositories and Parcels","60-65","cdppvc/repos-and-parcels.mdx","/cdppvc/repos-and-parcels")],
     ["`cdppvc.mdx` is a **section landing page** and must sit *beside* the `cdppvc/` folder (sibling-file pattern), not inside it.",
      "Page 58 is shared between sections 3 and 3-1 — read it once, split the content sensibly between the overview and the prerequisites page."]),
 4: ([("3-3) Setup Cloudera Manager Server - Overview","65","cdppvc/cm.mdx","/cdppvc/cm"),
      ("3-3-1) Setup Database for Cloudera Manager","65-73","cdppvc/cm/database.mdx","/cdppvc/cm/database"),
      ("3-3-2) Install Cloudera Manager Server","73-76","cdppvc/cm/server.mdx","/cdppvc/cm/server")],
     ["`cm.mdx` is a **section landing page** and sits beside the `cm/` folder.",
      "Pages 65 and 73 are each shared across two sections — read once, split at the section boundary."]),
 5: ([("3-3-3) Enable Auto-TLS","77-80","cdppvc/cm/auto-tls.mdx","/cdppvc/cm/auto-tls"),
      ("3-3-4) Enable Kerberos","80-86","cdppvc/cm/kerberos.mdx","/cdppvc/cm/kerberos"),
      ("3-3-5) Setup Cloudera Management Services","87-89","cdppvc/cm/mgmt-services.mdx","/cdppvc/cm/mgmt-services"),
      ("3-3-6) Configure Cloudera Manager for external authentication using LDAP","90-95","cdppvc/cm/ldap-auth.mdx","/cdppvc/cm/ldap-auth")],
     ["Security-critical content (TLS, Kerberos, LDAP). Transcribe every principal, keytab path, realm, DN and config key **verbatim** from `pdftotext` — a single altered character here breaks authentication cluster-wide."]),
 6: ([("3-4) Setup CDP PvC Base Cluster - Overview","96","cdppvc/base.mdx","/cdppvc/base"),
      ("3-4-1) Install CDP PvC Base using the Cloudera Manager Web UI","96-105","cdppvc/base/installation.mdx","/cdppvc/base/installation")],
     ["`base.mdx` is a **section landing page** and sits beside the `base/` folder.",
      "This is a Web-UI walkthrough — screenshot-heavy. Expect most of the value to be in correctly extracted, well-captioned images in wizard order."]),
 7: ([("3-4-2) Data Lake Creation","105-119","cdppvc/base/data-lake.mdx","/cdppvc/base/data-lake"),
      ("3-4-3) Additional Requirements and Details","120-124","cdppvc/base/additional-requirements.mdx","/cdppvc/base/additional-requirements")],
     ["**Data Lake Creation spans 15 pages and the phase totals 20** — right at the `Read` limit. Read the two sections in separate calls rather than one 105-124 call."]),
 8: ([("3-4-4) Configure services with SSL/TLS-enabled Metadata Database","125-127","cdppvc/base/services-metadata-db-tls.mdx","/cdppvc/base/services-metadata-db-tls"),
      ("3-4-5) Scale the Cluster (Optional)","128","cdppvc/base/scale-cluster.mdx","/cdppvc/base/scale-cluster"),
      ("3-4-6) Enable High Availability (Optional)","128","cdppvc/base/high-availability.mdx","/cdppvc/base/high-availability"),
      ("3-4-7) Configure Services authentication for LDAP (Optional)","129-142","cdppvc/base/ldap-auth.mdx","/cdppvc/base/ldap-auth"),
      ("3-4-8) Optimize Log Collection","143","cdppvc/base/optimize-log-collection.mdx","/cdppvc/base/optimize-log-collection")],
     ["**Sections 3-4-5 and 3-4-6 share page 128** and must still become two separate pages. Read page 128 once and split it at the section heading — do not merge them.",
      "Mark the three `(Optional)` sections as optional in the page text so readers know they can skip them.",
      "Note `cdppvc/base/ldap-auth.mdx` (service auth, this phase) is a **different page** from `cdppvc/cm/ldap-auth.mdx` (Cloudera Manager auth, Phase 5). Do not conflate them."]),
 9: ([("4) CDP Data Services Installation (ECS) - Overview","144","ds.mdx","/ds"),
      ("4-1) Embedded Container Service (ECS) Requirements","144-147","ds/ecs-requirements.mdx","/ds/ecs-requirements"),
      ("4-2) Checklist","147-154","ds/checklist.mdx","/ds/checklist")],
     ["**Section 4-2 is the table ONLY.** Pages 147-154 are a checklist; extract the table and nothing else. Use `pdftotext -layout` so column alignment survives, and render it as a GFM table.",
      "Page 154 was confirmed by the repo owner as belonging to the checklist (the range is 147-154, not 147-153).",
      "`ds.mdx` is a **section landing page** and sits beside the `ds/` folder.",
      "Pages 144 and 147 are each shared across two sections."]),
 10:([("4-3) Install CDP Data Services using ECS - Overview","155","ds/ecs.mdx","/ds/ecs"),
      ("4-3-1) Install ECS Cluster","156-185","ds/ecs/installation.mdx","/ds/ecs/installation")],
     ["**30 pages — exceeds the 20-page `Read` limit.** Split into at least two calls (e.g. 156-175, 176-185).",
      "This is the longest and most screenshot-dense procedure in the guide. Budget effort accordingly and keep wizard steps in exact source order.",
      "`ecs.mdx` is a **section landing page** and sits beside the `ecs/` folder."]),
 11:([("4-3-2) Additional Steps for ECS Cluster Setup","186-188","ds/ecs/additional-steps.mdx","/ds/ecs/additional-steps"),
      ("4-3-3) Dedicating ECS Nodes for Specific Workloads (Optional)","189-190","ds/ecs/specific-workloads.mdx","/ds/ecs/specific-workloads")],
     ["Mark 4-3-3 as optional in the page text."]),
 12:([("5) Accessing Cloudera","191-198","accessing-cloudera.mdx","/accessing-cloudera")],
     ["The URL is **`accessing-cloudera`** (double `c`). An earlier draft of the phase index misspelled it with a single `c`; the repo owner confirmed that was a typo. Use the corrected spelling — it matches P3's nav and the P4 playbook."]),
 13:([("6) Cloudera AI (CAI)","199-215","cai.mdx","/cai")],
     ["17 pages into a single page — fits one `Read` call but will be a long document.",
      "**Cloudera AI (CAI)** is the rebrand of what 7.1.7 called Cloudera Machine Learning (CML). Use the guide's current naming; do not silently substitute CML."]),
 14:([("7) Cloudera Data Warehouse (CDW)","216-219","cdw.mdx","/cdw"),
      ("8) Cloudera Data Engineering (CDE)","220-225","cde.mdx","/cde")], []),
 15:([("9) Appendix - Overview","226","appendix.mdx","/appendix"),
      ("9-1) References Used in Guide","226","appendix/references.mdx","/appendix/references"),
      ("9-2) Glossary of Terms","226-228","appendix/glossary-terms.mdx","/appendix/glossary-terms"),
      ("9-3) Glossary of Acronyms","228-229","appendix/glossary-acronyms.mdx","/appendix/glossary-acronyms"),
      ("9-4) FreeIPA Reference","229-232","appendix/freeipa.mdx","/appendix/freeipa")],
     ["**Page 226 carries three sections** (9, 9-1 and the start of 9-2) and page 228 carries two. Read once and split carefully at section headings.",
      "`appendix.mdx` is a **section landing page** and sits beside the `appendix/` folder.",
      "Glossaries are reference material — render them as GFM tables or definition lists, not prose."]),
 16:([("10) Cluster Validation","233-236","validation.mdx","/validation"),
      ("11) Cluster Cleanup","237-240","cleanup.mdx","/cleanup"),
      ("12) Error Handling","241-252","error-handling.mdx","/error-handling"),
      ("13) Kubernetes Command Reference","253","kubernetes-commands.mdx","/kubernetes-commands"),
      ("14) Acknowledgements","254","acknowledgements.mdx","/acknowledgements")],
     ["Five output pages spanning 233-254 (22 pages) — split across two `Read` calls.",
      "**Error Handling (12 pages) is the bulk of this phase** and is command-heavy; transcribe remediation commands verbatim.",
      "Sections 13 and 14 are one page each — keep them short rather than padding them."]),
}

TITLES = {
 1:"Phase 1 · VM Creation + Solution Summary (pp. 7-27)",
 2:"Phase 2 · Post OS Installation - Preliminary Work (pp. 28-58)",
 3:"Phase 3 · Install CDP Private Cloud: overview, prerequisites, repos and parcels (pp. 58-65)",
 4:"Phase 4 · Cloudera Manager Server: overview, database, install (pp. 65-76)",
 5:"Phase 5 · Cloudera Manager: Auto-TLS, Kerberos, Management Services, LDAP (pp. 77-95)",
 6:"Phase 6 · CDP PvC Base Cluster: overview and Web UI installation (pp. 96-105)",
 7:"Phase 7 · Data Lake Creation + Additional Requirements (pp. 105-124)",
 8:"Phase 8 · Base Cluster: metadata DB TLS, scaling, HA, LDAP, log collection (pp. 125-143)",
 9:"Phase 9 · CDP Data Services (ECS): overview, requirements, checklist (pp. 144-154)",
 10:"Phase 10 · Install CDP Data Services using ECS: overview and cluster install (pp. 155-185)",
 11:"Phase 11 · ECS: additional setup steps and dedicated workload nodes (pp. 186-190)",
 12:"Phase 12 · Accessing Cloudera (pp. 191-198)",
 13:"Phase 13 · Cloudera AI (CAI) (pp. 199-215)",
 14:"Phase 14 · Cloudera Data Warehouse (CDW) + Cloudera Data Engineering (CDE) (pp. 216-225)",
 15:"Phase 15 · Appendix: references, glossaries, FreeIPA (pp. 226-232)",
 16:"Phase 16 · Validation, cleanup, error handling, k8s reference, acknowledgements (pp. 233-254)",
}

for ph,(rows,notes) in PH.items():
    lines = []
    lines.append("Part of #10")
    lines.append("")
    lines.append("## Question")
    lines.append("")
    lines.append("Ingest **Phase %d** of the Cloudera on-premises 7.3.2 ECS deployment guide: read the PDF page ranges below and produce exactly the pages listed, with their screenshots.")
    lines[-1] = lines[-1] % ph
    lines.append("")
    lines.append("## Pages to produce")
    lines.append("")
    lines.append("Paths are relative to `content/docs/installations/cdp-7-3-2/`; URLs are prefixed `/installations/cdp-7-3-2/`.")
    lines.append("")
    lines.append("| PDF section | Pages | File | URL suffix |")
    lines.append("|:--|:--|:--|:--|")
    for s,p,f,u in rows:
        lines.append("| %s | %s | `%s` | `%s` |" % (s,p,f,u))
    lines.append("")
    lines.append("**%d page%s to produce.**" % (len(rows), "" if len(rows)==1 else "s"))
    lines.append("")
    if notes:
        lines.append("## Watch out for")
        lines.append("")
        for n in notes:
            lines.append("- " + n)
        lines.append("")
    lines.append("## How to work this ticket")
    lines.append("")
    lines.append("Follow the **P4 chunk-agent playbook** (#14) exactly — it carries the toolchain, frontmatter schema, MDX conventions and the definition of done. In short:")
    lines.append("")
    lines.append("1. **PowerShell only** for all PDF work. Bash silently shadows Poppler 26.02.0 with a v4.00 build from 2017.")
    lines.append("2. `Read(pages:\"N-M\")` to *see* the pages; `pdftotext -layout` for **verbatim** commands and config; `pdfimages -png -p` for screenshots (`pdftoppm` as fallback).")
    lines.append("3. Images go to `public/images/cdp-7-3-2/<section>/` as **PNG**, referenced absolutely with meaningful alt text.")
    lines.append("4. Take `prevSlug`/`nextSlug` from **P3**'s canonical 43-page ordering (#13).")
    lines.append("5. **Never edit `lib/navigation.ts`** — your nav entries already exist; make the files they point at exist.")
    lines.append("6. Branch `feat/cdp-7-3-2-phase-%d`, one PR, linked to this ticket." % ph)
    lines.append("")
    lines.append("## Definition of done")
    lines.append("")
    lines.append("1. Every file above exists at its **exact** path and its pre-built nav link resolves.")
    lines.append("2. Frontmatter complete, including prev/next from P3.")
    lines.append("3. Screenshots extracted as PNG, correctly placed and captioned.")
    lines.append("4. Commands and config values transcribed **verbatim** — never retyped from the visual render.")
    lines.append("5. Body starts at `h2`; every code fence has a language tag.")
    lines.append("6. `pnpm build` passes.")
    lines.append("")
    lines.append("## Answer records")
    lines.append("")
    lines.append("Files created, images extracted, PR link, and any source ambiguity worth flagging to later phases.")
    open(os.path.join(SP, "e%d.md" % ph), "w", encoding="utf-8").write("\n".join(lines) + "\n")

open(os.path.join(SP,"titles.json"),"w",encoding="utf-8").write(json.dumps(TITLES))
print("wrote", len(PH), "execution ticket bodies")
