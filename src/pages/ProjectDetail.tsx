import {
  ArrowLeft,
  ExternalLink,
  Check,
  Layout,
  Terminal,
  WarningDiamond,
  Cpu,
  Shield,
  Image,
  Github,
} from 'pixelarticons/react'
import { Link, useParams } from 'react-router-dom'
import Container from '../components/Container'
import { PROJECTS } from '../data/projects'
import { CASE_STUDIES } from '../data/caseStudies'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import ArchitectureVisualizer from '../components/ArchitectureVisualizer'
import { useGitHubCommit } from '../hooks/useGitHubCommit'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = PROJECTS.find((p) => p.slug === slug)
  const caseStudy = slug ? CASE_STUDIES[slug] : undefined

  const { commitLabel } = useGitHubCommit(
    project?.githubUrl,
    project?.lastCommitLabel,
    project?.lastCommitDate
  )

  useDocumentTitle(
    project ? `${project.title} — Architecture & Case Study | Syed Ahmed Hussain` : 'Project Not Found // 404'
  )

  if (!project) {
    return (
      <div className="py-24 sm:py-36 min-h-[60vh] flex items-center">
        <Container>
          <div className="border border-border bg-surface rounded-sm p-8 sm:p-14 max-w-2xl pixel-corners">
            <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-4">
              <span className="pixel-beacon bg-red-500" aria-hidden="true" />
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
              <ArrowLeft className="w-4 h-4 pixel-icon" aria-hidden="true" />
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
    <article className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-secondary hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 pixel-icon transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <span>BACK TO ALL PROJECTS</span>
          </Link>
        </div>

        {/* ─── 1. Project Header ─── */}
        <header className="border-b border-border pb-10 sm:pb-14 mb-12 sm:mb-16">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted uppercase tracking-wider mb-4">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">// PROJECT CASE STUDY</span>
              <span>·</span>
              <span>{project.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="pixel-beacon bg-emerald-500" aria-hidden="true" />
              <span>{project.status || 'PRODUCTION'}</span>
              {commitLabel && (
                <>
                  <span>·</span>
                  <span className="text-foreground font-semibold">COMMIT: {commitLabel}</span>
                </>
              )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-surface border border-border rounded-sm text-xs font-mono mb-6 pixel-corners">
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
                <ExternalLink className="w-4 h-4 pixel-icon" aria-hidden="true" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-surface text-foreground text-xs sm:text-sm font-mono font-semibold rounded-sm hover:border-border-strong transition-colors"
              >
                <Github className="w-4 h-4 pixel-icon" />
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
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-1 pixel-icon" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ─── 6. Technical Architecture / Approach ─── */}
          {architecture && architecture.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <span className="text-foreground font-semibold">// 04</span>
                <span className="uppercase tracking-wider">DATA FLOW & DESIGN CHOICES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Technical Implementation & Approach
              </h2>

              {/* Interactive Architecture Visualizer for Gallrex & Shifa */}
              {(project.slug === 'online-art-gallery' || project.slug === 'shifamanagement') && (
                <div className="pt-2 mb-6">
                  <div className="mb-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-foreground font-semibold flex items-center gap-2">
                      <span className="pixel-beacon bg-emerald-500" />
                      {project.slug === 'shifamanagement'
                        ? 'INTERACTIVE CLINICAL DATA FLOW & BILLING SIMULATOR'
                        : 'INTERACTIVE BID CONCURRENCY & DATA FLOW SIMULATOR'}
                    </span>
                    <span className="text-muted text-[11px] hidden sm:inline">
                      {project.slug === 'shifamanagement'
                        ? 'DOCUMENTED SUPABASE & POSTGRESQL 15 FLOW'
                        : 'DOCUMENTED .NET 8 & SQL SERVER DATA FLOW'}
                    </span>
                  </div>
                  <ArchitectureVisualizer projectSlug={project.slug} />
                </div>
              )}

              <ul className="space-y-3 pt-2">
                {architecture.map((arch, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-secondary">
                    <Cpu className="w-4 h-4 text-foreground shrink-0 mt-1 pixel-icon" aria-hidden="true" />
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
                    <WarningDiamond className="w-4 h-4 text-foreground shrink-0 mt-1 pixel-icon" aria-hidden="true" />
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
              <div className="p-5 sm:p-6 bg-surface border border-border rounded-sm pixel-corners">
                <p className="text-foreground text-sm sm:text-base leading-relaxed font-medium">
                  {outcome}
                </p>
              </div>
            </section>
          )}

          {/* ─── 9. Visual Architecture & Specification Gallery ─── */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <Image className="w-4 h-4 pixel-icon" aria-hidden="true" />
                <span className="text-foreground font-semibold uppercase">SYSTEM WORKFLOWS & INTERFACE PREVIEWS</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                  System Workflows & Interface Screens
                </h2>
                <p className="text-secondary text-sm leading-relaxed mt-1">
                  Feature walkthroughs, database-backed user flows, and core UI interfaces.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {project.gallery.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="group rounded-sm overflow-hidden border border-border bg-surface hover:border-border-strong transition-all flex flex-col pixel-corners"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-page flex items-center justify-center">
                      <img
                        src={imgSrc}
                        alt={`${project.title} Architectural Specification Slide ${idx + 1}`}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 border-t border-border/60 bg-surface flex items-center justify-between text-xs font-mono">
                      <span className="text-muted text-[11px] uppercase tracking-wider">
                        SPECIFICATION // SLIDE 0{idx + 1}
                      </span>
                      <span className="text-foreground font-medium text-[11px]">
                        {project.slug === 'online-art-gallery' && idx === 0 && 'Hero & 3D Artwork Showcase'}
                        {project.slug === 'online-art-gallery' && idx === 1 && 'Curated Artwork Catalog & Bidding'}
                        {project.slug === 'shifamanagement' && idx === 0 && 'System 2.0 Dashboard'}
                        {project.slug === 'shifamanagement' && idx === 1 && '1-Click WhatsApp Dispatch'}
                        {project.slug === 'shifamanagement' && idx === 2 && 'Intelligent Care Alerts'}
                        {project.slug === 'shifamanagement' && idx === 3 && 'Atomic Soft-Delete & Audit'}
                        {project.slug === 'shifamanagement' && idx === 4 && 'Zero-Cost Spark Architecture'}
                        {project.slug !== 'online-art-gallery' && project.slug !== 'shifamanagement' && `System Slide ${idx + 1}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── 10. Technology ─── */}
          {project.technologies && project.technologies.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <Terminal className="w-4 h-4 pixel-icon" aria-hidden="true" />
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
                <Shield className="w-4 h-4 pixel-icon" aria-hidden="true" />
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
                    <ExternalLink className="w-4 h-4 pixel-icon" aria-hidden="true" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-surface text-foreground text-xs sm:text-sm font-mono font-semibold rounded-sm hover:border-border-strong transition-colors"
                  >
                    <Github className="w-4 h-4 pixel-icon" />
                    <span>INSPECT REPOSITORY</span>
                  </a>
                )}
              </div>
            </section>
          )}

          {/* ─── 11. Next Project Navigation ─── */}
          <nav aria-label="Next Case Study" className="pt-10 border-t border-border">
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 hover:border-border-strong transition-all pixel-corners">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-4 border-b border-border">
                <Layout className="w-4 h-4 pixel-icon" aria-hidden="true" />
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
