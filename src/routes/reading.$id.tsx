import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { getCaseBySlug } from '#/lib/cases'

const BackToHome = () => {
  return (
    <Link to="/" className="text-sm text-zinc-400 border border-zinc-700 rounded-lg px-3 py-1.5 hover:bg-zinc-800 hover:text-zinc-100 transition-colors inline-block">
      Back to home
    </Link>
  )
}

export const Route = createFileRoute('/reading/$id')({
  loader: ({ params }) => {
    const entry = getCaseBySlug(params.id)
    if (!entry) throw notFound()
    return entry
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-6 py-16 border border-zinc-800 rounded-xl my-8 bg-zinc-950">
      <p className="text-zinc-500">Case not found.</p>
      <BackToHome />
    </main>
  ),
  component: CaseReader,
})

function CaseReader() {
  const entry = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-4xl px-6 pt-16 pb-5 border border-zinc-800 rounded-xl my-8 bg-zinc-950">
      <BackToHome/>

      <header className="mt-10 mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">{entry.title}</h1>
        <p className="mt-2 text-zinc-500">{entry.description}</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
          <span>Hendra Tanuwijaya</span>
          <span>·</span>
          <span>{Math.ceil(entry.content.split(/\s+/).length / 200)} min read</span>
        </div>
      </header>

      <hr className="border-zinc-800 mb-8" />

      <article className="space-y-4 leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: () => null,
            h2: ({ children }) => <h2 className="text-xl font-semibold text-zinc-200 mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-medium text-zinc-200 mt-4 mb-2">{children}</h3>,
            p: ({ children }) => <p className="mb-4 text-zinc-400">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-zinc-400">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-zinc-400">{children}</ol>,
            pre: ({ children }) => (
              <pre className="my-4 p-4 rounded-lg bg-zinc-950 border border-zinc-800 overflow-x-auto text-sm font-mono text-zinc-300 leading-relaxed">
                {children}
              </pre>
            ),
            code: ({ children }) => (
              <code className="text-zinc-300 font-mono text-sm">{children}</code>
            ),
            table: ({ children }) => <table className="w-full border-collapse mb-4 text-sm text-zinc-400">{children}</table>,
            thead: ({ children }) => <thead className="border-b border-zinc-700">{children}</thead>,
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => <tr className="border-b border-zinc-800">{children}</tr>,
            th: ({ children }) => <th className="text-left py-2 px-3 font-medium text-zinc-300">{children}</th>,
            td: ({ children }) => <td className="py-2 px-3">{children}</td>,
            img: ({ src, alt }) => (
              <img src={src} alt={alt} className="w-full max-h-96 rounded-lg object-contain my-6" />
            ),
          }}
        >
          {entry.content}
        </ReactMarkdown>
      </article>
      <section className='flex w-full justify-center'>
        <BackToHome />
      </section>
    </main>
  )
}
