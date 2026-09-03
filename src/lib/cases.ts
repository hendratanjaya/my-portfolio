const modules = import.meta.glob('../cases/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
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
