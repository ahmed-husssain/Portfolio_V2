import { useState } from 'react'
import { Code2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import { CAPABILITY_GROUPS } from '../data/capabilities'

export default function Capabilities() {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const toggleSnippet = (index: string) => {
    setExpandedIndex((prev) => (prev === index ? null : index))
  }

  const copyCode = (code: string, index: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <section id="capabilities" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        {/* ─── Section Header ─── */}
        <SectionHeading
          index="// 02"
          title="Capabilities"
          subtitle="A clear breakdown of the core technical domains, backend frameworks, and engineering tools I use to build production software."
          meta="[ 04 DOMAINS // INTERACTIVE CODE SPECS ]"
        />

        {/* ─── 2x2 Technical Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CAPABILITY_GROUPS.map((group) => {
            const isExpanded = expandedIndex === group.index
            const isCopied = copiedIndex === group.index

            return (
              <article
                key={group.index}
                className="border border-border bg-surface hover:bg-surface-hover hover:border-border-strong transition-all duration-200 rounded-sm overflow-hidden flex flex-col justify-between p-6 sm:p-8"
              >
                <div>
                  {/* Domain Header */}
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-5 text-xs font-mono text-muted">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold">#{group.index}</span>
                      <span className="text-border-strong" aria-hidden="true">|</span>
                      <span className="tracking-wider uppercase">{group.subtitle}</span>
                    </div>

                    {/* Spec Snippet Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleSnippet(group.index)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs border border-border bg-page text-[10px] font-mono text-secondary hover:text-foreground hover:border-border-strong transition-colors"
                      title="Inspect implementation code spec"
                    >
                      <Code2 className="w-3 h-3 text-emerald-500" />
                      <span>{isExpanded ? 'HIDE SPEC' : 'VIEW CODE SPEC'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-2.5 h-2.5" />
                      ) : (
                        <ChevronDown className="w-2.5 h-2.5" />
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                    {group.title}
                  </h3>

                  {/* Narrative Description */}
                  <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
                    {group.description}
                  </p>

                  {/* Key Focus Note */}
                  <div className="p-3 rounded-xs border border-border bg-page/50 text-xs font-mono mb-6">
                    <span className="text-muted uppercase tracking-wider block mb-1">
                      PRIMARY FOCUS:
                    </span>
                    <span className="text-foreground font-medium">
                      {group.keyFocus}
                    </span>
                  </div>

                  {/* Expandable Code Spec Preview */}
                  {isExpanded && group.specSnippet && (
                    <div className="mb-6 rounded-sm border border-border bg-page overflow-hidden animate-fadeIn">
                      <div className="px-3.5 py-2 border-b border-border bg-surface-subtle/70 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-foreground font-semibold text-[11px]">
                          <Code2 className="w-3 h-3 text-emerald-500" />
                          <span>{group.specSnippet.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => copyCode(group.specSnippet.code, group.index, e)}
                          className="inline-flex items-center gap-1 text-[10px] text-muted hover:text-foreground px-2 py-0.5 rounded-xs border border-border bg-page transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-emerald-500" />
                              <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3.5 text-foreground text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[220px]">
                        <code>{group.specSnippet.code}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Technologies / Disciplines Tags */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono text-muted tracking-widest uppercase mr-1">
                    ITEMS:
                  </span>
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-[11px] px-2.5 py-0.5 rounded-xs border border-border bg-surface-subtle text-secondary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
