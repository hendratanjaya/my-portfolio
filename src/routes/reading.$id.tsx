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
    <main className="mx-auto max-w-2xl px-6 py-16 border border-zinc-800 rounded-xl my-8 bg-zinc-950">
      <p className="text-zinc-500">Case not found.</p>
      <Link to="/" className="mt-4 inline-block text-zinc-400 hover:text-zinc-100 hover:underline text-sm">
        ← Back
      </Link>
    </main>
  ),
  component: CaseReader,
})

function CaseReader() {
  const entry = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 border border-zinc-800 rounded-xl my-8 bg-zinc-950">
      <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-100 hover:underline mb-8 inline-block">
        ← Back
      </Link>
      <article className="mt-8 space-y-4 leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold text-zinc-100 mt-8 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-semibold text-zinc-200 mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-medium text-zinc-200 mt-4 mb-2">{children}</h3>,
            p: ({ children }) => <p className="mb-4 text-zinc-400">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-zinc-400">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-zinc-400">{children}</ol>,
            code: ({ children }) => (
              <code className="bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
            ),
          }}
        >
          {entry.content}
        </ReactMarkdown>
      </article>
    </main>
  )
}
