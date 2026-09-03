export type Project = {
  name: string
  description: string
  url: string
  github?: string
  tags?: string[]
}

export const projects: Project[] = [
  {
    name: 'my-quant',
    description: 'An experimental agentic quantitative research tool for Indonesian stocks',
    url: 'https://my-quant.site',
    github: "https://github.com/hendratanjaya/my-quant",
    tags: ['react', 'typescript', "python", "fastAPI", "openai"],
  },
]
