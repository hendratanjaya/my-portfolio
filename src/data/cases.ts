export type Case = {
  slug: string
  title: string
  description: string,
  duration: string,
  date: Date,
  contentPath: string
}

export const cases: Case[] = [
  {
    slug: 'how-i-increased-api-performance',
    title: 'I Removed 99% of My API Latency with One MongoDB $project',
    description: 'Slow API? what possibly happened here? slow query? latency? this is how I figured it out..',
    duration: "7 minutes",
    date: new Date("09-04-2026"),
    contentPath: '../cases/how-i-increased-api-performance.md',
  },
]
