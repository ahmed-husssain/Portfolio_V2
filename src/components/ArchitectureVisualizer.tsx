import { useState, useEffect } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Code2,
  Activity,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react'
import {
  GALLREX_ARCHITECTURE,
  type ArchitectureFlow,
  type ArchitectureNode,
  type SimulationScenario,
} from '../data/architectureFlows'

interface ArchitectureVisualizerProps {
  initialFlowId?: string
  className?: string
}

type ViewTab = 'walkthrough' | 'simulator' | 'code'

export default function ArchitectureVisualizer({
  initialFlowId = 'auction-concurrency',
  className = '',
}: ArchitectureVisualizerProps) {
  const [selectedFlowId, setSelectedFlowId] = useState(initialFlowId)
  const currentFlow: ArchitectureFlow =
    GALLREX_ARCHITECTURE.find((f) => f.id === selectedFlowId) || GALLREX_ARCHITECTURE[0]

  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<ViewTab>('walkthrough')

  // Auto-tour state
  const [isTourPlaying, setIsTourPlaying] = useState(false)

  // Simulator state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    currentFlow.scenarios[0]?.id || ''
  )
  const [isSimulating, setIsSimulating] = useState(false)
  const [simStepIndex, setSimStepIndex] = useState<number>(-1)
  const [simLogs, setSimLogs] = useState<string[]>([])
  const [copiedCode, setCopiedCode] = useState(false)

  // Reset when flow changes
  useEffect(() => {
    setActiveStepIndex(0)
    setIsTourPlaying(false)
    setIsSimulating(false)
    setSimStepIndex(-1)
    setSimLogs([])
    if (currentFlow.scenarios.length > 0) {
      setSelectedScenarioId(currentFlow.scenarios[0].id)
    }
  }, [selectedFlowId])

  const activeNode: ArchitectureNode = currentFlow.nodes[activeStepIndex] || currentFlow.nodes[0]

  const currentScenario: SimulationScenario | undefined = currentFlow.scenarios.find(
    (s) => s.id === selectedScenarioId
  )

  // Auto-Tour effect: advance step every 3 seconds
  useEffect(() => {
    if (!isTourPlaying) return
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev >= currentFlow.nodes.length - 1) {
          setIsTourPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 3200)

    return () => clearInterval(interval)
  }, [isTourPlaying, currentFlow.nodes.length])

  // Simulation execution effect
  useEffect(() => {
    if (!isSimulating || !currentScenario) return

    if (simStepIndex < currentScenario.steps.length) {
      const step = currentScenario.steps[simStepIndex]
      if (step) {
        const foundIndex = currentFlow.nodes.findIndex((n) => n.id === step.nodeId)
        if (foundIndex !== -1) setActiveStepIndex(foundIndex)
        setSimLogs((prev) => [...prev, step.log])
      }

      const timer = setTimeout(() => {
        setSimStepIndex((prev) => prev + 1)
      }, step?.durationMs || 500)

      return () => clearTimeout(timer)
    } else {
      setIsSimulating(false)
    }
  }, [isSimulating, simStepIndex, currentScenario, currentFlow.nodes])

  const handleStartSimulation = () => {
    if (!currentScenario) return
    setIsTourPlaying(false)
    setIsSimulating(true)
    setSimStepIndex(0)
    setSimLogs([`[TEST BENCH] Launching scenario: "${currentScenario.title}"`])
  }

  const handleResetSimulation = () => {
    setIsSimulating(false)
    setSimStepIndex(-1)
    setSimLogs([])
  }

  const handleNextStep = () => {
    setIsTourPlaying(false)
    if (activeStepIndex < currentFlow.nodes.length - 1) {
      setActiveStepIndex((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    setIsTourPlaying(false)
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1)
    }
  }

  const handleCopyCode = () => {
    if (activeNode?.codeSnippet) {
      navigator.clipboard.writeText(activeNode.codeSnippet)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  return (
    <div
      className={`border border-border bg-surface rounded-sm overflow-hidden flex flex-col font-sans text-foreground text-left ${className}`}
    >
      {/* ─── 1. Purpose & Orientation Header ─── */}
      <div className="border-b border-border bg-surface-subtle/60 p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-muted mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-foreground">// ARCHITECTURE INSPECTOR</span>
              <span>·</span>
              <span className="text-secondary">GALLREX .NET 8</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {currentFlow.title}
            </h3>
            {/* Friendly Purpose Explanation in Plain English */}
            <p className="text-xs sm:text-sm text-secondary mt-1 leading-relaxed">
              <strong className="text-foreground font-semibold">What this is:</strong> In live art
              auctions, hundreds of collectors submit bids in the final seconds. Traditional
              websites crash with database deadlocks or charge cards twice. This interactive guide
              shows how Gallrex prevents collisions and double-charges across{' '}
              <span className="text-foreground font-semibold">
                {currentFlow.nodes.length} resilient steps
              </span>
              .
            </p>
          </div>

          {/* Subsystem Switcher */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-page border border-border rounded-sm self-start shrink-0">
            {GALLREX_ARCHITECTURE.map((flow) => (
              <button
                key={flow.id}
                onClick={() => setSelectedFlowId(flow.id)}
                className={`px-2.5 py-1 text-xs font-mono rounded-xs transition-colors ${
                  selectedFlowId === flow.id
                    ? 'bg-foreground text-page font-semibold shadow-xs'
                    : 'text-secondary hover:text-foreground hover:bg-surface-subtle'
                }`}
              >
                {flow.id === 'auction-concurrency' && 'Live Bidding'}
                {flow.id === 'auth-pipeline' && 'OAuth Identity'}
                {flow.id === 'catalog-indexing' && 'Catalog Index'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 2. Responsive Horizontal Stepper Pipeline ─── */}
      <div className="p-3 sm:p-4 border-b border-border bg-page/70">
        <div className="flex items-center justify-between gap-2 mb-2.5 text-xs font-mono">
          <span className="text-muted text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-foreground" />
            <span>STEP-BY-STEP FLOW ({currentFlow.nodes.length} STAGES)</span>
          </span>

          {/* Quick Tour Auto-Play Trigger */}
          <button
            type="button"
            onClick={() => setIsTourPlaying(!isTourPlaying)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs border text-[11px] font-mono transition-colors ${
              isTourPlaying
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 font-semibold'
                : 'bg-page border-border text-secondary hover:text-foreground hover:border-border-strong'
            }`}
          >
            {isTourPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>PAUSE TOUR</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>AUTO-TOUR (PLAY)</span>
              </>
            )}
          </button>
        </div>

        {/* Horizontal Steps Trail (Horizontal scrolling on mobile, clean wrapping grid on desktop) */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {currentFlow.nodes.map((node, idx) => {
            const isCurrent = activeStepIndex === idx
            const isCompleted = activeStepIndex > idx

            return (
              <div key={node.id} className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsTourPlaying(false)
                    setActiveStepIndex(idx)
                  }}
                  className={`px-2.5 py-1.5 rounded-xs border text-xs font-mono transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-foreground text-page border-foreground font-semibold shadow-xs'
                      : isCompleted
                        ? 'bg-surface border-border-strong text-foreground hover:bg-surface-hover'
                        : 'bg-page border-border text-muted hover:text-foreground hover:border-border-strong'
                  }`}
                  title={node.title}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isCurrent
                        ? 'bg-page text-foreground'
                        : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : 'bg-surface-subtle text-muted'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="whitespace-nowrap">{node.shortLabel}</span>
                </button>

                {/* Arrow separator */}
                {idx < currentFlow.nodes.length - 1 && (
                  <ArrowRight
                    className={`w-3 h-3 mx-0.5 shrink-0 ${
                      isCompleted ? 'text-foreground' : 'text-border-strong'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── 3. View Mode Tabs (Walkthrough vs Live Simulator vs Code) ─── */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-3 border-b border-border bg-surface-subtle/30 text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('walkthrough')}
            className={`pb-2.5 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'walkthrough'
                ? 'border-foreground text-foreground font-bold'
                : 'border-transparent text-secondary hover:text-foreground'
            }`}
          >
            1. Plain-English Walkthrough
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`pb-2.5 px-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'border-foreground text-foreground font-bold'
                : 'border-transparent text-secondary hover:text-foreground'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>2. Live Edge-Case Simulator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-foreground text-foreground font-bold'
                : 'border-transparent text-secondary hover:text-foreground'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>3. Production C# Code</span>
          </button>
        </div>

        {/* Step Counter */}
        <span className="text-muted text-[11px] hidden sm:inline">
          STAGE {activeStepIndex + 1} OF {currentFlow.nodes.length}
        </span>
      </div>

      {/* ─── 4. Tab Content Area (Clean, Compact, Never Overflowing) ─── */}
      <div className="p-4 sm:p-6 bg-surface">
        {/* ── TAB 1: PLAIN-ENGLISH WALKTHROUGH ── */}
        {activeTab === 'walkthrough' && (
          <div className="space-y-4 max-w-3xl">
            {/* Step Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted mb-0.5">
                  <span className="text-foreground font-semibold">
                    STAGE {activeStepIndex + 1}:
                  </span>
                  <span className="uppercase text-secondary">{activeNode.layer}</span>
                  <span>·</span>
                  <span className="text-emerald-500 font-semibold">{activeNode.badge}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                  {activeNode.title}
                </h4>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  className="inline-flex items-center gap-1 px-2.5 py-1 border border-border bg-page text-xs font-mono rounded-xs disabled:opacity-40 hover:bg-surface-hover hover:border-border-strong transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>PREV</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={activeStepIndex === currentFlow.nodes.length - 1}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-foreground text-page text-xs font-mono font-semibold rounded-xs disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  <span>NEXT STAGE</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Plain English Story */}
            <div className="p-3.5 sm:p-4 rounded-sm border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-bold block">
                WHAT HAPPENS HERE (PLAIN ENGLISH):
              </span>
              <p className="text-sm sm:text-base text-foreground leading-relaxed font-medium">
                {activeNode.plainEnglish}
              </p>
            </div>

            {/* Architectural Rationale & Why It Matters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-page border border-border rounded-sm space-y-1">
                <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                  TECHNICAL INVARIANT:
                </span>
                <h5 className="text-xs font-bold text-foreground">
                  {activeNode.rationaleTitle}
                </h5>
                <p className="text-xs text-secondary leading-relaxed pt-0.5">
                  {activeNode.rationale}
                </p>
              </div>

              <div className="p-3.5 bg-page border border-border rounded-sm space-y-1">
                <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                  OPERATIONAL METRICS:
                </span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {activeNode.metrics?.map((m, i) => (
                    <div key={i} className="p-2 bg-surface border border-border/80 rounded-xs">
                      <span className="text-[9px] font-mono text-muted block uppercase">
                        {m.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: LIVE EDGE-CASE SIMULATOR ── */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            <div className="p-3 bg-surface-subtle border border-border rounded-sm">
              <h4 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>INTERACTIVE RESILIENCE SIMULATOR</span>
              </h4>
              <p className="text-xs text-secondary leading-relaxed">
                Choose a high-concurrency disaster scenario below. Click{' '}
                <strong className="text-foreground">"Run Scenario"</strong> to see how the
                system architecture handles colliding traffic in real time.
              </p>
            </div>

            {/* Scenario Picker (Card Radio) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {currentFlow.scenarios.map((sc) => {
                const isSelected = selectedScenarioId === sc.id
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setSelectedScenarioId(sc.id)
                      handleResetSimulation()
                    }}
                    className={`p-3 rounded-sm border text-left transition-all text-xs font-mono flex flex-col justify-between ${
                      isSelected
                        ? 'border-foreground bg-page shadow-xs ring-1 ring-foreground/20'
                        : 'border-border bg-surface hover:border-border-strong hover:bg-surface-hover text-secondary'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground">{sc.title}</span>
                      </div>
                      <p className="text-[11px] text-secondary font-sans leading-snug">
                        {sc.subtitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px]">
                      <span
                        className={`px-1.5 py-0.2 rounded-xs border uppercase font-bold ${
                          sc.outcomeType === 'collision'
                            ? 'text-amber-500 border-amber-500/30 bg-amber-500/10'
                            : 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
                        }`}
                      >
                        {sc.outcomeType === 'collision' ? 'OCC Collision Test' : 'Idempotency Test'}
                      </span>
                      {isSelected && <span className="text-foreground font-bold">ACTIVE</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Controls Bar & Telemetry */}
            <div className="p-3.5 bg-page border border-border rounded-sm space-y-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleStartSimulation}
                  disabled={isSimulating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-page text-xs font-mono font-semibold rounded-xs hover:bg-secondary disabled:opacity-50 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSimulating ? 'SIMULATING COLLISION...' : 'RUN SCENARIO TEST'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetSimulation}
                  className="px-2.5 py-2 border border-border text-secondary hover:text-foreground text-xs font-mono rounded-xs transition-colors"
                  title="Reset simulator"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Telemetry Output Log */}
              <div className="p-3 bg-surface border border-border/80 rounded-xs font-mono text-[11px] text-secondary space-y-1 min-h-[90px] max-h-[140px] overflow-y-auto">
                {simLogs.length === 0 ? (
                  <p className="text-muted italic">
                    Press "RUN SCENARIO TEST" to view simulated HTTP packets moving across the 7
                    layers...
                  </p>
                ) : (
                  simLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-muted">[{idx + 1}]</span>
                      <span
                        className={
                          log.includes('RACE CONDITION') || log.includes('DbUpdateConcurrencyException')
                            ? 'text-amber-500 font-bold'
                            : log.includes('INTERCEPTED') || log.includes('SUCCESS')
                              ? 'text-emerald-500 font-bold'
                              : 'text-foreground'
                        }
                      >
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Simulation Result Banner */}
              {currentScenario && !isSimulating && simStepIndex >= currentScenario.steps.length && (
                <div
                  className={`p-3 rounded-xs border text-xs font-mono flex items-start gap-2 ${
                    currentScenario.outcomeType === 'collision'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">ARCHITECTURAL PROOF:</span>
                    <span className="text-secondary font-sans text-xs">
                      {currentScenario.outcomeMessage}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: PRODUCTION CODE INSPECTOR ── */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{activeNode.codeTitle}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-muted hover:text-foreground border border-border rounded-xs bg-page transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-page text-foreground border border-border rounded-sm text-xs font-mono overflow-x-auto leading-relaxed max-h-[260px]">
              <code>{activeNode.codeSnippet}</code>
            </pre>
            <p className="text-[11px] text-muted font-mono">
              Direct implementation from the Gallrex .NET 8 repository.
            </p>
          </div>
        )}
      </div>

      {/* ─── 5. Compact Bottom Status Bar ─── */}
      <div className="px-4 sm:px-6 py-2.5 bg-surface-subtle/50 border-t border-border flex items-center justify-between text-xs font-mono text-muted">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-foreground font-semibold">SAFE UNDER PEAK CONCURRENCY</span>
        </span>
        <span className="hidden sm:inline">ZERO TABLE LOCKS · 0.01MS CACHE · SIGNALR 10MS</span>
      </div>
    </div>
  )
}
