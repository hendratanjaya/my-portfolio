# Portfolio Site Design

**Date:** 2026-07-26  
**Stack:** TanStack Start + Cloudflare Workers + Tailwind v4  
**Status:** Approved

## Overview

A minimal personal portfolio with two pages: a home page and a markdown case reader. Deployed to Cloudflare Workers via `bun run deploy`.

## Routing

File-based routing via TanStack Start. Normal history mode (no hash URLs — Cloudflare handles SPA routing).

| Route | File | Purpose |
|---|---|---|
| `/` | `src/routes/index.tsx` | Home page |
| `/reading/$id` | `src/routes/reading.$id.tsx` | Case reader |

## Pages

### Home (`/`)

Four sections in order:

1. **Hero** — profile photo + short bio text
2. **Projects** — card list of deployed/live work, each with name, description, and a link to the live URL
3. **Cases** — list of all case entries discovered from `src/cases/*.md`, each linking to `/reading/$id`

### Case Reader (`/reading/$id`)

- Matches `$id` to a markdown filename (e.g. `my-case` → `src/cases/my-case.md`)
- Renders markdown content with `react-markdown`
- Returns a 404 / not-found state if `$id` doesn't match any file

## Data

### Cases

Markdown files in `src/cases/`. Discovered at build time:

```ts
import.meta.glob('./cases/*.md', { eager: true, query: '?raw' })
```

Filename (without `.md`) becomes the URL slug and display title (with hyphens replaced by spaces). Adding a new case = drop a `.md` file, commit, deploy.

### Projects

A plain TypeScript array in `src/data/projects.ts`:

```ts
export type Project = {
  name: string
  description: string
  url: string
  tags?: string[]
}
```

Edited manually when a new project ships.

## Styling

Tailwind v4 (already installed). No component library. Keep it minimal.

## Deployment

```bash
bun run deploy   # builds + deploys to Cloudflare Workers
```
