# Cloudera CDP Guide

A documentation site for Cloudera Data Platform (CDP) — covering installations, upgrades, data services, and use cases.

Built with [Next.js 16](https://nextjs.org/), [Tailwind CSS v4](https://tailwindcss.com/), and [MDX](https://mdxjs.com/), using the [Cruip Docs template](https://cruip.com/docs-template/).

## Getting Started

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

## Scripts

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `pnpm run dev`   | Start development server                   |
| `pnpm run build` | Production build (static export to `out/`) |
| `pnpm run start` | Serve production build locally             |
| `pnpm run lint`  | Run ESLint                                 |

## Project Structure

```
app/                  → Next.js App Router (layouts, pages, providers)
components/ui/        → Layout & interactive components (header, sidebar, search)
components/mdx/       → Custom MDX components (accordion, banner, table, etc.)
content/docs/         → MDX documentation files (~61 pages)
lib/                  → Navigation tree & search index utilities
public/               → Static assets (images, fonts, videos)
```

## Adding Content

1. Create a `.mdx` file in the appropriate `content/docs/` subdirectory.
2. Add frontmatter (`title`, `summary`, `prevSlug`, `nextSlug`, etc.).
3. Register the page in `lib/navigation.ts`.
4. Place images in `public/images/`.

## Deployment

The site deploys to GitHub Pages via GitHub Actions on every push to `master`.

Live site: [maatouk-j1.github.io/cloudera-guides](https://maatouk-j1.github.io/cloudera-guides)
