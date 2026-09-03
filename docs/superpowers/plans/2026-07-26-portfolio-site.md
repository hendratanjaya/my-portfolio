# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-page portfolio site — a home page with bio/projects/cases and a markdown case reader — deployed to Cloudflare Workers.

**Architecture:** TanStack Start file-based routing with two routes (`/` and `/reading/$id`). Markdown cases are discovered at build time via `import.meta.glob` and rendered client-side with `react-markdown`. Projects are a static TypeScript array edited manually.

**Tech Stack:** TanStack Start, React 19, Tailwind v4, react-markdown, Biome, Cloudflare Workers

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/data/projects.ts` | Create | Project type + list |
| `src/lib/cases.ts` | Create | Case discovery and lookup |
| `src/cases/my-first-case.md` | Create | Sample case entry |
| `src/routes/reading.$id.tsx` | Create | Case reader route |
| `src/routes/__root.tsx` | Modify | Update site title and meta |
| `src/routes/index.tsx` | Modify | Full home page |
| `public/photo.jpg` | Add manually | Your profile photo |

---

### Task 1: Install react-markdown

- [ ] **Step 1: Install react-markdown**

```bash
bun add react-markdown
```

- [ ] **Step 2: Verify installation**

```bash
grep 'react-markdown' package.json
```

Expected: entry appears in dependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add react-markdown"
```

---

### Task 2: Create projects data

**Files:**
- Create: `src/data/projects.ts`

- [ ] **Step 1: Create the projects module**

```ts
// src/data/projects.ts
export type Project = {
  name: string
  description: string
  url: string
  tags?: string[]
}

export const projects: Project[] = [
  {
    name: 'Example Project',
    description: 'A short description of what this project does.',
    url: 'https://example.com',
    tags: ['react', 'typescript'],
  },
]
```

Replace the example entry with your actual live projects.

- [ ] **Step 2: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat: add projects data"
```

---

### Task 3: Create cases utility + sample case

**Files:**
- Create: `src/cases/my-first-case.md`
- Create: `src/lib/cases.ts`

- [ ] **Step 1: Add sample case file**

```markdown
# My First Case

A brief description of the situation you encountered.

## What Happened

Write about what you ran into on the job here.

## What I Learned

Key takeaways.
```

Save as `src/cases/my-first-case.md`.

- [ ] **Step 2: Implement cases utility**

```ts
// src/lib/cases.ts
const modules = import.meta.glob('../cases/*.md', {
  eager: true,
  query: '?raw',
}) as Record<string, string>

export type Case = {
  slug: string
  title: string
  content: string
}

export function parseCases(raw: Record<string, string>): Case[] {
  return Object.entries(raw).map(([path, content]) => {
    const slug = path.replace('../cases/', '').replace('.md', '')
    const title = slug.replace(/-/g, ' ')
    return { slug, title, content }
  })
}

export function getAllCases(): Case[] {
  return parseCases(modules)
}

export function getCaseBySlug(slug: string): Case | undefined {
  return getAllCases().find((c) => c.slug === slug)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/cases/my-first-case.md src/lib/cases.ts
git commit -m "feat: add case discovery utility"
```

---

### Task 4: Update root document

**Files:**
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Replace entire file content**

```tsx
// src/routes/__root.tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Your Name' },
      { name: 'description', content: 'Portfolio of Your Name' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

Replace `'Your Name'` in both `title` and `description` with your actual name.

- [ ] **Step 2: Commit**

```bash
git add src/routes/__root.tsx
git commit -m "feat: update root document meta"
```

---

### Task 5: Build the home page

**Files:**
- Modify: `src/routes/index.tsx`

Before this task: add your profile photo at `public/photo.jpg`.

- [ ] **Step 1: Replace entire file content**

```tsx
// src/routes/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { projects } from '#/data/projects'
import { getAllCases } from '#/lib/cases'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const cases = getAllCases()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 space-y-16">
      <section className="flex flex-col items-center text-center gap-6">
        <img
          src="/photo.jpg"
          alt="Profile photo"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">Your Name</h1>
          <p className="mt-2 text-gray-600 max-w-sm">
            Short bio goes here. What you do, what you care about.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Projects</h2>
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                {project.name}
              </a>
              <p className="text-sm text-gray-600">{project.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Cases</h2>
        <ul className="space-y-2">
          {cases.map((c) => (
            <li key={c.slug}>
              <Link
                to="/reading/$id"
                params={{ id: c.slug }}
                className="hover:underline capitalize"
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
```

Replace `'Your Name'` and the bio text with your actual info.

- [ ] **Step 2: Regenerate route tree**

```bash
bun run generate-routes
```

- [ ] **Step 3: Run dev server and verify**

```bash
bun run dev
```

Open `http://localhost:3000`. Verify: photo renders, projects list appears, cases list shows a link for `my first case`.

- [ ] **Step 4: Commit**

```bash
git add src/routes/index.tsx src/routeTree.gen.ts
git commit -m "feat: build home page"
```

---

### Task 6: Build the case reader route

**Files:**
- Create: `src/routes/reading.$id.tsx`

- [ ] **Step 1: Create the case reader route**

```tsx
// src/routes/reading.$id.tsx
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import { getCaseBySlug } from '#/lib/cases'

export const Route = createFileRoute('/reading/$id')({
  loader: ({ params }) => {
    const entry = getCaseBySlug(params.id)
    if (!entry) throw notFound()
    return entry
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-gray-500">Case not found.</p>
      <Link to="/" className="mt-4 inline-block hover:underline text-sm">
        ← Back
      </Link>
    </main>
  ),
  component: CaseReader,
})

function CaseReader() {
  const entry = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/" className="text-sm text-gray-500 hover:underline mb-8 inline-block">
        ← Back
      </Link>
      <article className="mt-8 space-y-4 leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
            p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
            code: ({ children }) => (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
            ),
          }}
        >
          {entry.content}
        </ReactMarkdown>
      </article>
    </main>
  )
}
```

- [ ] **Step 2: Regenerate route tree**

```bash
bun run generate-routes
```

- [ ] **Step 3: Run dev server and verify**

```bash
bun run dev
```

1. Click the case link on the home page — verify markdown renders correctly.
2. Navigate to `http://localhost:3000/reading/nonexistent` — verify "Case not found" appears.

- [ ] **Step 4: Commit**

```bash
git add "src/routes/reading.\$id.tsx" src/routeTree.gen.ts
git commit -m "feat: build case reader route"
```

---

### Task 7: Deploy to Cloudflare

- [ ] **Step 1: Log in to Cloudflare (first time only)**

```bash
bunx wrangler login
```

Follow the browser prompt to authenticate.

- [ ] **Step 2: Deploy**

```bash
bun run deploy
```

Expected: build succeeds, wrangler outputs a `*.workers.dev` URL.

- [ ] **Step 3: Verify the deployed site**

Open the deployed URL. Check:
- Home page loads with photo, projects, and cases
- Clicking a case navigates to `/reading/my-first-case` and renders markdown
- Navigating to a nonexistent case slug shows "Case not found"
