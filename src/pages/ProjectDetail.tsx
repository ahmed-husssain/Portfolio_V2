import { ArrowLeft, ArrowUpRight, CheckCircle2, Layers, Terminal, AlertCircle, Cpu, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Container from '../components/Container'
import { PROJECTS } from '../data/projects'
import { CASE_STUDIES } from '../data/caseStudies'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// GitHub inline SVG icon
function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = PROJECTS.find((p) => p.slug === slug)
  const caseStudy = slug ? CASE_STUDIES[slug] : undefined

  useDocumentTitle(
    project ? `${project.title} — Case Study | Ahmed` : 'Project Not Found // 404'
  )

  if (!project) {
    return (
      <div className="py-24 sm:py-36 min-h-[60vh] flex items-center">
        <Container>
          <div className="border border-border bg-surface rounded-sm p-8 sm:p-14 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
              <span>ERROR 404 // CASE STUDY NOT FOUND</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-4">
              Project Record Not Found
            </h1>

            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-8">
              No project matching the slug <code className="text-foreground bg-page px-2 py-0.5 rounded text-xs font-mono border border-border">"{slug}"</code> exists in the central portfolio registry.
            </p>

            <Link
              to="/work"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-semibold px-5 py-2.5 bg-foreground text-page hover:bg-secondary transition-colors rounded-sm"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>RETURN TO WORK CATALOG</span>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  // Data-driven next project navigation derived from collection order
  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug)
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length]

  const problem = caseStudy?.problem || project.problem
  const solution = caseStudy?.solution || project.solution
  const highlights = caseStudy?.highlights || project.highlights
  const architecture = caseStudy?.architecture || project.architecture
  const challenges = caseStudy?.challenges || project.challenges
  const outcome = caseStudy?.outcome || project.outcome
  const overview = caseStudy?.overview

  return (
    <article className="py-14 sm:py-20 md:py-28">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-secondary hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <span>BACK TO ALL PROJECTS</span>
          </Link>
        </div>

        {/* ─── 1. Project Header ─── */}
        <header className="border-b border-border pb-10 sm:pb-14 mb-12 sm:mb-16">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted uppercase tracking-wider mb-4">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">// ARCHITECTURAL CASE STUDY</span>
              <span>·</span>
              <span>{project.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span>{project.status || 'PRODUCTION'}</span>
              {project.year && (
                <>
                  <span>·</span>
                  <span>{project.year}</span>
                </>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-tight mb-6">
            {project.title}
          </h1>

          <p className="text-secondary text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed mb-8">
            {project.description}
          </p>

          {/* Quick Spec Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-surface border border-border rounded-sm text-xs font-mono mb-6">
            <div>
              <span className="text-muted block text-[10px] uppercase tracking-wider mb-1">ROLE</span>
              <span className="text-foreground font-medium">{project.role || 'Full-Stack Developer'}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase tracking-wider mb-1">YEAR</span>
              <span className="text-foreground font-medium">{project.year || '2025'}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase tracking-wider mb-1">CATEGORY</span>
              <span className="text-foreground font-medium">{project.category}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase tracking-wider mb-1">STATUS</span>
              <span className="text-foreground font-medium uppercase">{project.status || 'PRODUCTION'}</span>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page text-xs sm:text-sm font-mono font-semibold rounded-sm hover:bg-secondary transition-colors"
              >
                <span>VISIT PRODUCTION SYSTEM</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-surface text-foreground text-xs sm:text-sm font-mono font-semibold rounded-sm hover:border-border-strong transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>INSPECT REPOSITORY</span>
              </a>
            )}
          </div>
        </header>

        {/* Project Visual Display Banner (if image exists) */}
        {project.image && (
          <div className="mb-14 sm:mb-20">
            <div className="relative rounded-sm overflow-hidden border border-border bg-surface aspect-[16/9] sm:aspect-[21/9] max-h-[500px]">
              <img
                src={project.image}
                alt={`${project.title} Interface & Architecture Preview`}
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-page/90 backdrop-blur-sm border border-border text-[10px] font-mono text-muted tracking-wider uppercase rounded-sm">
                PRODUCTION INTERFACE PREVIEW
              </div>
            </div>
          </div>
        )}

        {/* ─── Case Study Narrative Flow ─── */}
        <div className="max-w-3xl mx-auto space-y-12 sm:space-y-16">
          {/* ─── 2. Project Overview ─── */}
          {overview && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <span className="text-foreground font-semibold">// OVERVIEW</span>
                <span className="uppercase tracking-wider">PROJECT INTENT & CONTEXT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Project Overview
              </h2>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">
                {overview}
              </p>
            </section>
          )}

          {/* ─── 3. Problem ─── */}
          {problem && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <span className="text-foreground font-semibold">// 01</span>
                <span className="uppercase tracking-wider">THE PROBLEM & CONTEXT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                The Problem
              </h2>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">
                {problem}
              </p>
            </section>
          )}

          {/* ─── 4. What I Built / Solution ─── */}
          {solution && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <span className="text-foreground font-semibold">// 02</span>
                <span className="uppercase tracking-wider">WHAT I BUILT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Engineering Solution
              </h2>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">
                {solution}
              </p>
            </section>
          )}

          {/* ─── 5. Key Highlights ─── */}
          {highlights && highlights.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <span className="text-foreground font-semibold">// 03</span>
                <span className="uppercase tracking-wider">KEY DELIVERABLES & FEATURES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Key Highlights
              </h2>
              <ul className="space-y-3 pt-2">
                {highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-foreground shrink-0 mt-1" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ─── 6. Technical Architecture / Approach ─── */}
          {architecture && architecture.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <span className="text-foreground font-semibold">// 04</span>
                <span className="uppercase tracking-wider">DATA FLOW & DESIGN CHOICES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Technical Architecture & Approach
              </h2>
              <ul className="space-y-3 pt-2">
                {architecture.map((arch, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-secondary">
                    <Cpu className="w-4 h-4 text-foreground shrink-0 mt-1" aria-hidden="true" />
                    <span>{arch}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ─── 7. Challenges ─── */}
          {challenges && challenges.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <span className="text-foreground font-semibold">// 05</span>
                <span className="uppercase tracking-wider">TECHNICAL HURDLES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Challenges & Mitigations
              </h2>
              <ul className="space-y-3 pt-2">
                {challenges.map((challenge, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-secondary">
                    <AlertCircle className="w-4 h-4 text-foreground shrink-0 mt-1" aria-hidden="true" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ─── 8. Outcome / Current Status ─── */}
          {outcome && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <span className="text-foreground font-semibold">// 06</span>
                <span className="uppercase tracking-wider">RESULTS & CURRENT STATUS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Outcome & Status
              </h2>
              <div className="p-5 sm:p-6 bg-surface border border-border rounded-sm">
                <p className="text-foreground text-sm sm:text-base leading-relaxed font-medium">
                  {outcome}
                </p>
              </div>
            </section>
          )}

          {/* ─── 9. Technology ─── */}
          {project.technologies && project.technologies.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-foreground font-semibold uppercase">TECHNOLOGY STACK</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Technologies Employed
              </h2>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-mono bg-surface border border-border text-foreground rounded-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ─── 10. Links ─── */}
          {(project.liveUrl || project.githubUrl) && (
            <section className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-foreground font-semibold uppercase">EXTERNAL VERIFICATION & ACCESS</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Project Links
              </h2>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page text-xs sm:text-sm font-mono font-semibold rounded-sm hover:bg-secondary transition-colors"
                  >
                    <span>VISIT PRODUCTION SYSTEM</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-surface text-foreground text-xs sm:text-sm font-mono font-semibold rounded-sm hover:border-border-strong transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>INSPECT REPOSITORY</span>
                  </a>
                )}
              </div>
            </section>
          )}

          {/* ─── 11. Next Project Navigation ─── */}
          <nav aria-label="Next Case Study" className="pt-10 border-t border-border">
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 hover:border-border-strong transition-all">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-4 border-b border-border">
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-foreground font-semibold">NEXT CASE STUDY</span>
              </div>

              <p className="text-xs font-mono text-muted uppercase mb-1">
                {nextProject.category}
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                {nextProject.title}
              </h3>
              <p className="text-sm text-secondary leading-relaxed mb-6">
                {nextProject.shortDescription}
              </p>

              <Link
                to={`/work/${nextProject.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-page text-xs sm:text-sm font-mono font-semibold rounded-sm hover:bg-secondary transition-colors"
              >
                <span>READ NEXT CASE STUDY ({nextProject.title})</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </nav>
        </div>
      </Container>
    </article>
  )
}
