import { cases as caseData, type Case } from '#/data/cases'

const contentModules = import.meta.glob('../cases/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

export type { Case }

export function getAllCases(): (Case & { content: string })[] {
  return caseData.map((c) => ({
    ...c,
    content: contentModules[c.contentPath] ?? '',
  }))
}

export function getCaseBySlug(slug: string): (Case & { content: string }) | undefined {
  return getAllCases().find((c) => c.slug === slug)
}
