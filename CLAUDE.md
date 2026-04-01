# CLAUDE.md - Cloudera CDP Documentation Site

## Project Overview

This is the **Cloudera CDP Guide** documentation site — a modern rewrite of Dennis Lee's technical blog ([dennislee22.github.io](https://dennislee22.github.io/)) using the **Cruip "Docs" template** for Next.js. The original blog (Jekyll + "Just the Docs" theme) covered Cloudera Data Platform (CDP) Private Cloud deployment, operations, and data services. This project ports that content into a Next.js 16 static site with improved design, dark mode, and search.

### Origin and Design Template

- **Original content**: [github.com/dennislee22/dennislee22.github.io](https://github.com/dennislee22/dennislee22.github.io) — a Jekyll blog titled "All I know about DATA"
- **Design template**: Cruip "Docs" template ([cruip.com/docs-template](https://cruip.com/docs-template/?nc=1)) — a Next.js + Tailwind CSS documentation template
- **Template customization guide**: [cruip.com/docs/next-js-templates-tailwind-css](https://cruip.com/docs/next-js-templates-tailwind-css/?nc=1)

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | Framework (App Router, static export) |
| React | 19.2.3 | UI library |
| TypeScript | 5.3.3 | Type safety |
| Tailwind CSS | 4.0.0 | Utility-first styling |
| MDX | via @next/mdx + next-mdx-remote-client | Content rendering |
| rehype-pretty-code | 0.14.0 | Syntax highlighting (one-dark-pro theme) |
| rehype-slug | 6.0.0 | Auto heading IDs |
| remark-gfm | 4.0.0 | GitHub Flavored Markdown |
| @headlessui/react | 2.1.1 | Accessible UI components (modals) |
| next-themes | 0.4.4 | Dark/light mode |
| pnpm | — | Package manager |

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Dev server at localhost:3000
pnpm run build        # Production build (static export to /out/)
pnpm run start        # Serve production build locally
pnpm run lint         # Run ESLint
```

## Project Structure

```
docs-next/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout (font, providers, header, sidebar)
│   ├── page.tsx                    # Home — redirects to /cdppvc/cdppvc
│   ├── [...slug]/page.tsx          # Dynamic catch-all route for all doc pages
│   ├── theme-provider.tsx          # Dark mode context (next-themes)
│   ├── app-provider.tsx            # Sidebar open/close state context
│   └── css/
│       ├── style.css               # Main CSS entry point
│       └── additional-styles/      # theme.css, utility-patterns.css, etc.
├── components/
│   ├── ui/                         # Layout & interactive components
│   │   ├── header.tsx              # Top navigation bar with logo & search
│   │   ├── sidebar.tsx             # Left navigation (collapsible, recursive)
│   │   ├── sidebar-link.tsx        # Nav link with active state
│   │   ├── sidebar-link-group.tsx  # Grouping wrapper
│   │   ├── sidebar-link-subgroup.tsx
│   │   ├── search.tsx              # Search trigger button
│   │   ├── search-modal.tsx        # Full search dialog
│   │   ├── secondary-nav.tsx       # Right-side table of contents (scrollspy)
│   │   ├── page-navigation.tsx     # Prev/Next article links
│   │   ├── logo.tsx                # Cloudera logo + brand
│   │   ├── theme-toggle.tsx        # Dark/light toggle
│   │   ├── hamburger.tsx           # Mobile menu button
│   │   ├── footer.tsx              # Page footer
│   │   └── back-to-top.tsx         # Floating scroll-to-top button
│   └── mdx/                        # MDX rendering components
│       ├── mdx.tsx                 # MDXRemote wrapper, custom component registry
│       ├── utils.ts                # Frontmatter parsing, MDX file discovery
│       ├── accordion.tsx           # <Accordion> collapsible sections
│       ├── banner.tsx              # <Banner type="info|important"> callouts
│       ├── modal-video.tsx         # <ModalVideo> video player modal
│       ├── table.tsx               # <Table>, <THead>, <TBody>, <Th>, <Td>
│       ├── image.tsx               # <Image> with captions
│       ├── link.tsx                # <Link> wrapper
│       └── tag.tsx                 # <Tag color="blue|teal|rose|purple">
├── content/docs/                   # MDX documentation files (~61 files)
│   ├── cdppvc/                     # CDP Private Cloud Base (34 files)
│   ├── cml/                        # Cloudera Machine Learning (11 files)
│   ├── cdw/                        # Data Warehouse (4 files)
│   ├── longhorn/                   # Storage benchmarking (2 files)
│   ├── installations/              # Version-specific installs (3 files)
│   ├── upgrades/                   # Upgrade guides (4 files)
│   ├── use-cases/                  # Reference architectures (5 files)
│   ├── troubleshooting/            # Troubleshooting (1 file)
│   └── cdp-public-cloud.mdx       # External link placeholder
├── lib/
│   ├── navigation.ts               # Hardcoded navigation tree (NavItem[])
│   └── search-index.ts             # Build-time search index from MDX metadata
├── public/
│   ├── fonts/                      # Aspekta font (WOFF2, weights 350/400/500/650)
│   ├── images/                     # ~334 PNG/SVG images for docs
│   └── videos/                     # Video files
├── package.json
├── next.config.js
├── postcss.config.js
├── tsconfig.json
└── pnpm-lock.yaml
```

## Key Architecture Decisions

### Routing

- **App Router** with a single catch-all route `app/[...slug]/page.tsx` that serves all documentation pages.
- The home page (`app/page.tsx`) redirects to `/cdppvc/cdppvc`.
- All routes are statically generated at build time via `generateStaticParams()`.

### Content Management

- Documentation is written in **MDX** files under `content/docs/`.
- Each MDX file has YAML frontmatter:
  ```yaml
  ---
  title: "Page Title"
  summary: "Brief description"
  topicTitle: "Section Parent Title"
  topicSlug: "section-slug"
  prevTitle: "Previous Page"
  prevSlug: "path/to/prev"
  nextTitle: "Next Page"
  nextSlug: "path/to/next"
  ---
  ```
- The filename (minus `.mdx`) becomes the URL slug. E.g., `content/docs/cdppvc/cm.mdx` -> `/cdppvc/cm`.

### Navigation

- The sidebar navigation tree is **hardcoded** in `lib/navigation.ts` as a `NavItem[]` structure.
- When adding/removing/moving pages, update both the MDX file and `lib/navigation.ts`.

### Search

- Client-side search built from MDX metadata at build time (`lib/search-index.ts`).
- Keyboard shortcut `/` opens the search modal.
- No backend search service — all filtering happens in the browser.

### Deployment

- **Static export** for GitHub Pages in production (`output: 'export'` in `next.config.js`).
- Production base path: `/cloudera` (set via `basePath`).
- Image optimization disabled (`unoptimized: true`) for static compatibility.
- Dev mode has no `basePath` or static export constraints.

## How to Add a New Documentation Page

1. Create a new `.mdx` file in the appropriate `content/docs/` subdirectory.
2. Add frontmatter with `title`, `summary`, and prev/next navigation fields.
3. Add the page to `lib/navigation.ts` in the correct position in the tree.
4. Place any images in `public/images/` and reference them in MDX.

## How to Modify the Template (Cruip Guidelines)

Per the [Cruip documentation](https://cruip.com/docs/next-js-templates-tailwind-css/?nc=1):

- **Styles**: Edit files in `app/css/`. Tailwind CSS v4 with `@theme` variables.
- **Components**: Modify files in `components/`. Server Components by default; add `'use client'` for interactivity.
- **Layouts**: Edit `app/layout.tsx` or create route-group layouts in `app/`.
- **Static assets**: Place in `public/` — directly URL-accessible at runtime.
- **MDX components**: Register custom components in `components/mdx/mdx.tsx`.

## Custom MDX Components

Available in all MDX files:

| Component | Usage |
|-----------|-------|
| `<Accordion title="...">content</Accordion>` | Collapsible section |
| `<Banner type="info\|important">content</Banner>` | Callout box with icon |
| `<ModalVideo thumb={img} video="url" />` | Video player modal |
| `<Table>`, `<THead>`, `<TBody>`, `<Th>`, `<Td>` | Structured tables |
| `<Tag color="blue\|teal\|rose\|purple">text</Tag>` | Colored label |
| `<Image src={img} alt="" caption="" />` | Image with caption |
| `<Link href="">text</Link>` | Internal link |

## Branding & Colors

- **Primary**: Cloudera Orange `#f26622`
- **Light Orange**: `#f5854e`
- **Dark Orange**: `#d4551a`
- **Neutrals**: Tailwind slate scale (50-900)
- **Font**: Aspekta (custom, weights 350-650) + PT Mono (code blocks)
- **Code theme**: one-dark-pro (via rehype-pretty-code)

## Content Topics

The documentation covers Cloudera CDP Private Cloud:

- **CDP PvC Base**: Installation, Cloudera Manager, Base Cluster, ECS, OpenShift deployments
- **Data Services**: CML, CDW, CDE on both ECS and OpenShift
- **Day-2 Operations**: GPU enablement, disk management, node scaling
- **Data Warehouse**: File format benchmarking, compression, autoscaling
- **Machine Learning**: PyTorch, TensorFlow, Ray, Dask, custom images, GPU dashboards
- **Longhorn**: Storage performance benchmarking
- **Upgrades**: CDP 7.1.9 to 7.3.1 upgrade paths
- **Use Cases**: Medallion architecture (bronze/silver/gold layers)
