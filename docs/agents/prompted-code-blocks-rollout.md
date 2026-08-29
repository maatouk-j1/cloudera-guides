# Prompted code blocks — rollout prompt and tracker

Fenced blocks that carry a shell prompt (`[root@cldr-mngr ~]# systemctl stop x`) render with no
syntax colour at all. This file holds the prompt that fixes them, and the tracker that records which
pages are done.

The fix is the `transcript` fence: it colours the command after the prompt and leaves the prompt and
the output alone. Nothing inside the block changes.

Reference implementation: `/installations/cdp-7-3-2/cleanup` — every prompted block on that page is
converted. Standard: `docs/typography.md` §6.

---

## How to use this file

Copy everything between the `PROMPT START` and `PROMPT END` markers below and give it to one agent.
The whole remaining scope goes to that one agent: the change is mechanical, so splitting it across
agents buys nothing and costs consistency.

**The agent must update the tracker itself.** That instruction is inside the prompt, but check it.

---

<!-- PROMPT START -->

# Task

Retag every prompted code block in the **CDP 7.3.2 installation guide**, then update the tracker.

## Scope

In scope: **`content/docs/installations/cdp-7-3-2/`** — 17 pages, 252 prompted blocks. The tracker
below lists every one with its expected block count.

Out of scope, and you must not touch them:

- `content/docs/installations/cdp-7-1-7/` — deferred by decision, not oversight. Six of its pages
  carry prompted blocks and are listed in a separate table below. Leave them alone.
- `content/docs/installations/cdp-7-3-2/cleanup.mdx` — already converted. It is your worked example.
- Every other page in `content/`. They have no prompted blocks.

## Read these first

1. `docs/typography.md` §6 — authoritative for MDX formatting in this repo.
2. `content/docs/installations/cdp-7-3-2/cleanup.mdx` — the worked example, fully converted. Do not
   modify it.
3. `components/mdx/transcript.ts` — implements the `transcript` language, wired in at
   `components/mdx/mdx.tsx:77`. It works and is tested. Do not reimplement, modify, or touch
   `mdx.tsx`.

## Why this exists

Shiki's shell grammar only opens a command at the start of a line or straight after `;` `|` `&` `!`
`(` `{` or a backtick. A consumed prompt leaves a space in front of the command, so the rule never
fires. That is why `[root@host ~]# systemctl stop x` renders completely uncoloured — and why it
renders identically whether the fence is tagged `text` or `bash`.

`transcript.ts` splits each line itself and hands only the command to the `bash` grammar, where it
starts a fresh string and tokenises normally. The prompt renders grey `#7f848e`, the command colours
as bash, and any line without a prompt stays plain.

## The rule

**A fence containing a prompt is tagged `transcript`. Change nothing else.**

Retag the fence and stop there. Every character inside the block stays byte-identical: prompts stay
exactly as transcribed, commands stay exactly as transcribed. Do not strip a prompt, do not reword,
reorder, reflow or hand-wrap a command, do not add a `$` or any other sigil, and do not add a header
or comment line to the block.

The prompt is what the fence keys on. Removing it loses the colour, and loses the only record of
which host each command was run on.

## Decision procedure, per fence

1. Does any line match `^\s*(?:\[[^\]\n]*\]|[\w.-]+@[\w.-]+:\S*)\s*[$#%>]\s` ?
   - **No** → leave the fence exactly as it is. Pure command lists stay `bash`; pure output and
     pasted file contents stay `text`; `ini` / `yaml` / `xml` / `python` fences stay as they are.
   - **Yes** → tag it `transcript`, whatever it is tagged now.

That is the whole procedure. There is no second option and no judgement call: a prompt in the block
means `transcript`, every time. A block that moves between hosts, a block that is commands end to
end, a block with 40 lines of `dnf` output in it — all the same tag.

In scope, 251 of the 252 prompted fences are currently tagged `text`. The one exception is the
`CREATE ROLE` block in `on-premises/cm/database.mdx`, tagged `sql`, which opens with a single
`[root@cldr-mngr data]# sudo -u postgres psql` line. It has a prompt, so it becomes `transcript` and
its SQL goes plain. This is decided — do not re-litigate it.

## ⚠ Most fences are indented — do not anchor on column 0

This is the one way to get this task wrong and have every check still pass. Fences live inside
numbered steps, so most of them are indented:

| Indent | Prompted fences in scope |
|--:|--:|
| 0 spaces | 77 |
| 4 spaces | 174 |
| 8 spaces | 1 |

A pattern anchored as `^```text` matches **77 of 252**. It silently skips the other 175, and the
build, the typecheck and the plaintext check all still pass on the result. Match leading whitespace
and preserve it: `^([ \t]*)```text$` → `\1```transcript`.

The closing fence of an indented block is also indented. Match it accordingly when you parse blocks.

## Prose

Prompts are preserved, so sentences that point at them stay true and need no edit. Do not rewrite
prose. If you believe a sentence is genuinely wrong, leave it and report it instead of changing it.

## Verify before reporting

Run all five. The last two are the ones that catch a partial conversion.

1. `pnpm build` succeeds and `npx tsc --noEmit` is clean.
2. In the built pages under `out/`, `data-language="plaintext"` occurs 0 times. A plaintext fallback
   means a fence tag was mistyped.
3. `git diff` shows **only** fence-tag lines changed — no other line of any page differs. A correct
   conversion touches nothing else, so this should pass exactly.
4. **Reconcile every page against its tracker count.** For each of the 17 pages, the number of
   `transcript` fences you have created must equal the `Blocks` figure in the tracker. Report the
   per-page numbers. If any page disagrees, you have missed indented fences — go back to the warning
   above.
5. **No prompted fence is left untagged.** Re-scan all of `content/docs/installations/cdp-7-3-2/`
   for fences matching the prompt regex whose tag is not `transcript`. The expected result is zero.

## Update the tracker — mandatory

When the work is done you **must** edit the in-scope tracker table in
`docs/agents/prompted-code-blocks-rollout.md`, setting every row you converted to:

- **Status** — `Done`.
- **Notes** — the number of fences you retagged on that page.

Do not touch the deferred CDP 7.1.7 table.

## Constraints

- Do not commit. Leave changes in the working tree for review.
- Do not touch `components/`, `docs/typography.md`, or anything outside the scope above.

<!-- PROMPT END -->

---

## Scale

93 pages. 69 have no prompted blocks. `cleanup.mdx` is converted and is the reference. That leaves 23
pages carrying 272 prompted blocks: **17 pages / 252 blocks in scope**, and 6 pages / 20 blocks
deferred with CDP 7.1.7.

## Tracker — CDP 7.3.2, in scope

Status is one of `Not started`, `In progress`, `Done`.

| Page | File | Blocks | Status | Notes |
|:--|:--|--:|:--|:--|
| [/installations/cdp-7-3-2/post-os-work](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/post-os-work) | `installations/cdp-7-3-2/post-os-work.mdx` | 89 | Done | 89 fences retagged |
| [/installations/cdp-7-3-2/on-premises/cm/database](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/cm/database) | `installations/cdp-7-3-2/on-premises/cm/database.mdx` | 38 | Done | 38 fences retagged |
| [/installations/cdp-7-3-2/ds/ecs-requirements](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/ds/ecs-requirements) | `installations/cdp-7-3-2/ds/ecs-requirements.mdx` | 24 | Done | 24 fences retagged |
| [/installations/cdp-7-3-2/cde](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/cde) | `installations/cdp-7-3-2/cde.mdx` | 14 | Done | 14 fences retagged |
| [/installations/cdp-7-3-2/error-handling](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/error-handling) | `installations/cdp-7-3-2/error-handling.mdx` | 14 | Done | 14 fences retagged |
| [/installations/cdp-7-3-2/validation](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/validation) | `installations/cdp-7-3-2/validation.mdx` | 13 | Done | 13 fences retagged |
| [/installations/cdp-7-3-2/ds/ecs/installation](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/ds/ecs/installation) | `installations/cdp-7-3-2/ds/ecs/installation.mdx` | 13 | Done | 13 fences retagged |
| [/installations/cdp-7-3-2/on-premises/cm/server](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/cm/server) | `installations/cdp-7-3-2/on-premises/cm/server.mdx` | 13 | Done | 13 fences retagged |
| [/installations/cdp-7-3-2/on-premises/repos-and-parcels](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/repos-and-parcels) | `installations/cdp-7-3-2/on-premises/repos-and-parcels.mdx` | 11 | Done | 11 fences retagged |
| [/installations/cdp-7-3-2/on-premises/cm/kerberos](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/cm/kerberos) | `installations/cdp-7-3-2/on-premises/cm/kerberos.mdx` | 6 | Done | 6 fences retagged |
| [/installations/cdp-7-3-2/on-premises/base/installation](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/base/installation) | `installations/cdp-7-3-2/on-premises/base/installation.mdx` | 4 | Done | 4 fences retagged |
| [/installations/cdp-7-3-2/appendix/freeipa](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/appendix/freeipa) | `installations/cdp-7-3-2/appendix/freeipa.mdx` | 3 | Done | 3 fences retagged |
| [/installations/cdp-7-3-2/on-premises/cm/ldap-auth](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/cm/ldap-auth) | `installations/cdp-7-3-2/on-premises/cm/ldap-auth.mdx` | 3 | Done | 3 fences retagged |
| [/installations/cdp-7-3-2/on-premises/base/services-metadata-db-tls](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/base/services-metadata-db-tls) | `installations/cdp-7-3-2/on-premises/base/services-metadata-db-tls.mdx` | 3 | Done | 3 fences retagged |
| [/installations/cdp-7-3-2/on-premises/cm/auto-tls](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/cm/auto-tls) | `installations/cdp-7-3-2/on-premises/cm/auto-tls.mdx` | 2 | Done | 2 fences retagged |
| [/installations/cdp-7-3-2/cai](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/cai) | `installations/cdp-7-3-2/cai.mdx` | 1 | Done | 1 fence retagged |
| [/installations/cdp-7-3-2/ds/ecs/additional-steps](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/ds/ecs/additional-steps) | `installations/cdp-7-3-2/ds/ecs/additional-steps.mdx` | 1 | Done | 1 fence retagged |

## Deferred — CDP 7.1.7, out of scope

Not part of this rollout. Listed so the remaining work is visible, and so nobody converts them by
accident. **Do not work on these.**

| Page | File | Blocks |
|:--|:--|--:|
| [/installations/cdp-7-1-7/cdppvc/gpuocp](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/gpuocp) | `installations/cdp-7-1-7/cdppvc/gpuocp.mdx` | 7 |
| [/installations/cdp-7-1-7/cdppvc/gpuecs](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/gpuecs) | `installations/cdp-7-1-7/cdppvc/gpuecs.mdx` | 4 |
| [/installations/cdp-7-1-7/cdppvc/cdwocp](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/cdwocp) | `installations/cdp-7-1-7/cdppvc/cdwocp.mdx` | 3 |
| [/installations/cdp-7-1-7/cdppvc/ocpcdwdisk](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/ocpcdwdisk) | `installations/cdp-7-1-7/cdppvc/ocpcdwdisk.mdx` | 3 |
| [/installations/cdp-7-1-7/cdppvc/dsocp](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/dsocp) | `installations/cdp-7-1-7/cdppvc/dsocp.mdx` | 2 |
| [/installations/cdp-7-1-7/longhorn/benchmarking](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/longhorn/benchmarking) | `installations/cdp-7-1-7/longhorn/benchmarking.mdx` | 1 |

## Pages with no prompted blocks

No work needed. Listed so the rollout can be shown to be complete rather than merely unfinished.

| Page | File |
|:--|:--|
| [/cloudera-on-cloud](https://maatouk-j1.github.io/cloudera-guides/cloudera-on-cloud) | `cloudera-on-cloud.mdx` |
| [/](https://maatouk-j1.github.io/cloudera-guides/) | `index.mdx` |
| [/installations](https://maatouk-j1.github.io/cloudera-guides/installations) | `installations.mdx` |
| [/installations/cdp-7-1-7](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7) | `installations/cdp-7-1-7.mdx` |
| [/installations/cdp-7-1-7/cdppvc/addecs](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/addecs) | `installations/cdp-7-1-7/cdppvc/addecs.mdx` |
| [/installations/cdp-7-1-7/cdppvc/base](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/base) | `installations/cdp-7-1-7/cdppvc/base.mdx` |
| [/installations/cdp-7-1-7/cdppvc/baseconfig](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/baseconfig) | `installations/cdp-7-1-7/cdppvc/baseconfig.mdx` |
| [/installations/cdp-7-1-7/cdppvc/basedeploy](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/basedeploy) | `installations/cdp-7-1-7/cdppvc/basedeploy.mdx` |
| [/installations/cdp-7-1-7/cdppvc/cdeecs](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/cdeecs) | `installations/cdp-7-1-7/cdppvc/cdeecs.mdx` |
| [/installations/cdp-7-1-7/cdppvc/cdeocp](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/cdeocp) | `installations/cdp-7-1-7/cdppvc/cdeocp.mdx` |
| [/installations/cdp-7-1-7/cdppvc/cdppvc](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/cdppvc) | `installations/cdp-7-1-7/cdppvc/cdppvc.mdx` |
| [/installations/cdp-7-1-7/cdppvc/cdwecs](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/cdwecs) | `installations/cdp-7-1-7/cdppvc/cdwecs.mdx` |
| [/installations/cdp-7-1-7/cdppvc/cm](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/cm) | `installations/cdp-7-1-7/cdppvc/cm.mdx` |
| [/installations/cdp-7-1-7/cdppvc/cmlds](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/cmlds) | `installations/cdp-7-1-7/cdppvc/cmlds.mdx` |
| [/installations/cdp-7-1-7/cdppvc/demo](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/demo) | `installations/cdp-7-1-7/cdppvc/demo.mdx` |
| [/installations/cdp-7-1-7/cdppvc/ds](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/ds) | `installations/cdp-7-1-7/cdppvc/ds.mdx` |
| [/installations/cdp-7-1-7/cdppvc/dsconsole](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/dsconsole) | `installations/cdp-7-1-7/cdppvc/dsconsole.mdx` |
| [/installations/cdp-7-1-7/cdppvc/ecs](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/ecs) | `installations/cdp-7-1-7/cdppvc/ecs.mdx` |
| [/installations/cdp-7-1-7/cdppvc/ecsday2](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/ecsday2) | `installations/cdp-7-1-7/cdppvc/ecsday2.mdx` |
| [/installations/cdp-7-1-7/cdppvc/ecsenv](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/ecsenv) | `installations/cdp-7-1-7/cdppvc/ecsenv.mdx` |
| [/installations/cdp-7-1-7/cdppvc/longhornscale](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/longhornscale) | `installations/cdp-7-1-7/cdppvc/longhornscale.mdx` |
| [/installations/cdp-7-1-7/cdppvc/lvm](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/lvm) | `installations/cdp-7-1-7/cdppvc/lvm.mdx` |
| [/installations/cdp-7-1-7/cdppvc/nexus](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/nexus) | `installations/cdp-7-1-7/cdppvc/nexus.mdx` |
| [/installations/cdp-7-1-7/cdppvc/ocp](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/ocp) | `installations/cdp-7-1-7/cdppvc/ocp.mdx` |
| [/installations/cdp-7-1-7/cdppvc/ocpday2](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/ocpday2) | `installations/cdp-7-1-7/cdppvc/ocpday2.mdx` |
| [/installations/cdp-7-1-7/cdppvc/prerequisites](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/prerequisites) | `installations/cdp-7-1-7/cdppvc/prerequisites.mdx` |
| [/installations/cdp-7-1-7/cdppvc/vault](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdppvc/vault) | `installations/cdp-7-1-7/cdppvc/vault.mdx` |
| [/installations/cdp-7-1-7/cdw/benchmarkfs](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdw/benchmarkfs) | `installations/cdp-7-1-7/cdw/benchmarkfs.mdx` |
| [/installations/cdp-7-1-7/cdw/cdw](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdw/cdw) | `installations/cdp-7-1-7/cdw/cdw.mdx` |
| [/installations/cdp-7-1-7/cdw/cdwautoscaling](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdw/cdwautoscaling) | `installations/cdp-7-1-7/cdw/cdwautoscaling.mdx` |
| [/installations/cdp-7-1-7/cdw/snappy](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cdw/snappy) | `installations/cdp-7-1-7/cdw/snappy.mdx` |
| [/installations/cdp-7-1-7/cml/cml](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/cml) | `installations/cdp-7-1-7/cml/cml.mdx` |
| [/installations/cdp-7-1-7/cml/customimage](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/customimage) | `installations/cdp-7-1-7/cml/customimage.mdx` |
| [/installations/cdp-7-1-7/cml/dask](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/dask) | `installations/cdp-7-1-7/cml/dask.mdx` |
| [/installations/cdp-7-1-7/cml/imagep](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/imagep) | `installations/cdp-7-1-7/cml/imagep.mdx` |
| [/installations/cdp-7-1-7/cml/mprocess](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/mprocess) | `installations/cdp-7-1-7/cml/mprocess.mdx` |
| [/installations/cdp-7-1-7/cml/mthread](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/mthread) | `installations/cdp-7-1-7/cml/mthread.mdx` |
| [/installations/cdp-7-1-7/cml/noisyneighbour](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/noisyneighbour) | `installations/cdp-7-1-7/cml/noisyneighbour.mdx` |
| [/installations/cdp-7-1-7/cml/nvdashboard](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/nvdashboard) | `installations/cdp-7-1-7/cml/nvdashboard.mdx` |
| [/installations/cdp-7-1-7/cml/pytorch](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/pytorch) | `installations/cdp-7-1-7/cml/pytorch.mdx` |
| [/installations/cdp-7-1-7/cml/ray](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/ray) | `installations/cdp-7-1-7/cml/ray.mdx` |
| [/installations/cdp-7-1-7/cml/tensorflow](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/cml/tensorflow) | `installations/cdp-7-1-7/cml/tensorflow.mdx` |
| [/installations/cdp-7-1-7/longhorn/longhorn](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-1-7/longhorn/longhorn) | `installations/cdp-7-1-7/longhorn/longhorn.mdx` |
| [/installations/cdp-7-3-2](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2) | `installations/cdp-7-3-2.mdx` |
| [/installations/cdp-7-3-2/accessing-data-services](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/accessing-data-services) | `installations/cdp-7-3-2/accessing-data-services.mdx` |
| [/installations/cdp-7-3-2/acknowledgements](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/acknowledgements) | `installations/cdp-7-3-2/acknowledgements.mdx` |
| [/installations/cdp-7-3-2/appendix](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/appendix) | `installations/cdp-7-3-2/appendix.mdx` |
| [/installations/cdp-7-3-2/appendix/glossary-acronyms](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/appendix/glossary-acronyms) | `installations/cdp-7-3-2/appendix/glossary-acronyms.mdx` |
| [/installations/cdp-7-3-2/appendix/glossary-terms](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/appendix/glossary-terms) | `installations/cdp-7-3-2/appendix/glossary-terms.mdx` |
| [/installations/cdp-7-3-2/appendix/references](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/appendix/references) | `installations/cdp-7-3-2/appendix/references.mdx` |
| [/installations/cdp-7-3-2/cdw](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/cdw) | `installations/cdp-7-3-2/cdw.mdx` |
| [/installations/cdp-7-3-2/ds](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/ds) | `installations/cdp-7-3-2/ds.mdx` |
| [/installations/cdp-7-3-2/ds/checklist](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/ds/checklist) | `installations/cdp-7-3-2/ds/checklist.mdx` |
| [/installations/cdp-7-3-2/ds/ecs](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/ds/ecs) | `installations/cdp-7-3-2/ds/ecs.mdx` |
| [/installations/cdp-7-3-2/ds/ecs/specific-workloads](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/ds/ecs/specific-workloads) | `installations/cdp-7-3-2/ds/ecs/specific-workloads.mdx` |
| [/installations/cdp-7-3-2/kubernetes-commands](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/kubernetes-commands) | `installations/cdp-7-3-2/kubernetes-commands.mdx` |
| [/installations/cdp-7-3-2/on-premises](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises) | `installations/cdp-7-3-2/on-premises.mdx` |
| [/installations/cdp-7-3-2/on-premises/base](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/base) | `installations/cdp-7-3-2/on-premises/base.mdx` |
| [/installations/cdp-7-3-2/on-premises/base/additional-requirements](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/base/additional-requirements) | `installations/cdp-7-3-2/on-premises/base/additional-requirements.mdx` |
| [/installations/cdp-7-3-2/on-premises/base/data-lake](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/base/data-lake) | `installations/cdp-7-3-2/on-premises/base/data-lake.mdx` |
| [/installations/cdp-7-3-2/on-premises/base/high-availability](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/base/high-availability) | `installations/cdp-7-3-2/on-premises/base/high-availability.mdx` |
| [/installations/cdp-7-3-2/on-premises/base/ldap-auth](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/base/ldap-auth) | `installations/cdp-7-3-2/on-premises/base/ldap-auth.mdx` |
| [/installations/cdp-7-3-2/on-premises/base/optimize-log-collection](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/base/optimize-log-collection) | `installations/cdp-7-3-2/on-premises/base/optimize-log-collection.mdx` |
| [/installations/cdp-7-3-2/on-premises/base/scale-cluster](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/base/scale-cluster) | `installations/cdp-7-3-2/on-premises/base/scale-cluster.mdx` |
| [/installations/cdp-7-3-2/on-premises/cm](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/cm) | `installations/cdp-7-3-2/on-premises/cm.mdx` |
| [/installations/cdp-7-3-2/on-premises/cm/mgmt-services](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/cm/mgmt-services) | `installations/cdp-7-3-2/on-premises/cm/mgmt-services.mdx` |
| [/installations/cdp-7-3-2/on-premises/prerequisites](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/on-premises/prerequisites) | `installations/cdp-7-3-2/on-premises/prerequisites.mdx` |
| [/installations/cdp-7-3-2/summary](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/summary) | `installations/cdp-7-3-2/summary.mdx` |
| [/installations/cdp-7-3-2/vm](https://maatouk-j1.github.io/cloudera-guides/installations/cdp-7-3-2/vm) | `installations/cdp-7-3-2/vm.mdx` |
