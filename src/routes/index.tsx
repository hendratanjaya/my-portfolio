import { createFileRoute, Link } from '@tanstack/react-router'
import { projects } from '#/data/projects'
import { getAllCases } from '#/lib/cases'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const cases = getAllCases()

  return (
    <main className="mx-auto max-w-3xl px-8 py-14 space-y-10 border border-zinc-800 rounded-2xl my-10 bg-zinc-900 shadow-2xl shadow-black/60">
      <section className="flex flex-col items-center text-center gap-4">
        <img
          src="/profile.jpeg"
          alt="Profile photo"
          className="w-28 h-28 rounded-full object-cover ring-2 ring-zinc-700 ring-offset-4 ring-offset-zinc-900"
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-100">Hendra Tanu Wijaya</h1>
          <p className="text-sm text-zinc-500 tracking-wide">Pragmatic Software Engineer (wannabe)</p>
          <div className="pt-1 flex items-center justify-center gap-2 text-sm text-zinc-600">
            <a
              href="https://www.linkedin.com/in/hendra-tanuwijaya-a4787b23b"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 hover:underline transition-colors"
            >
              linkedin
            </a>
            <span>·</span>
            <a
              href="https://github.com/hendratanjaya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 hover:underline transition-colors"
            >
              github
            </a>
            <span>·</span>
            <a
              href="mailto:hendratanjaya1@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 hover:underline transition-colors"
            >
              email
            </a>
          </div>
        </div>
      </section>

      <hr className="border-zinc-800" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4 border-l-2 border-zinc-600 pl-3">
          About Me
        </h2>
        <p className="text-zinc-400 leading-relaxed text-justify">
          I started with C because apparently suffering through pointers was a reasonable way to spend my time. Then came console games, SQL, full-stack web development, and eventually, somehow, a job.
          
          Now I'm a Software Engineer, which mostly means I spend my days convincing computers to do what I want, and occasionally wondering why they decided to do something completely different.
          
          These days, I'm poking around backend systems, data processing, LLMs, and agent orchestration. I'm particularly interested in systems where intelligent agents don't just talk about doing things, but actually go out there and do them.
          
          I don't really know what's next yet. That's kind of the fun part.
        </p>
      </section>

      <hr className="border-zinc-800" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4 border-l-2 border-zinc-600 pl-3">
          Projects
        </h2>
        <ul className="space-y-5">
          {projects.map((project) => (
            <li key={project.name}>
              <div className="flex items-center gap-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-100 hover:text-white hover:underline"
                >
                  {project.name}
                </a>
                {project.github && (
                  <>
                    <span className="text-zinc-700">|</span>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-500 hover:text-zinc-300 hover:underline"
                    >
                      github
                    </a>
                  </>
                )}
              </div>
              <p className="text-sm text-zinc-500 mt-0.5">{project.description}</p>
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-zinc-800" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4 border-l-2 border-zinc-600 pl-3">
          Readings
        </h2>
         <p className="text-sm text-zinc-500 mt-0.5">Coming sooooon</p>
      </section>
    </main>
  )
}
