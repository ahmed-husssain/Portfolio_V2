import { useState, useEffect } from 'react'
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Code2,
  Activity,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
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
      }, step?.durationMs || 400)

      return () => clearTimeout(timer)
    } else {
      setIsSimulating(false)
    }
  }, [isSimulating, simStepIndex, currentScenario, currentFlow.nodes])

  const handleStartSimulation = () => {
    if (!currentScenario) return
    setIsSimulating(true)
    setSimStepIndex(0)
    setSimLogs([`Starting test: ${currentScenario.title}`])
  }

  const handleResetSimulation = () => {
    setIsSimulating(false)
    setSimStepIndex(-1)
    setSimLogs([])
  }

  const handleNextStep = () => {
    if (activeStepIndex < currentFlow.nodes.length - 1) {
      setActiveStepIndex((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
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
      {/* ─── 1. Header (Minimal & Direct) ─── */}
      <div className="border-b border-border bg-surface-subtle/50 px-4 py-3 sm:px-5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-muted mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-foreground">SYSTEM ARCHITECTURE</span>
            <span>·</span>
            <span>GALLREX (.NET 8)</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {currentFlow.title}
          </h3>
          <p className="text-xs text-secondary mt-0.5">{currentFlow.subtitle}</p>
        </div>

        {/* Subsystem Switcher */}
        <div className="flex items-center gap-1 p-0.5 bg-page border border-border rounded-sm">
          {GALLREX_ARCHITECTURE.map((flow) => (
            <button
              key={flow.id}
              onClick={() => setSelectedFlowId(flow.id)}
              className={`px-2 py-1 text-xs font-mono rounded-xs transition-colors ${
                selectedFlowId === flow.id
                  ? 'bg-foreground text-page font-semibold'
                  : 'text-secondary hover:text-foreground'
              }`}
            >
              {flow.id === 'auction-concurrency' && 'Live Bids'}
              {flow.id === 'auth-pipeline' && 'OAuth Auth'}
              {flow.id === 'catalog-indexing' && 'Fast Search'}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 2. Clean Horizontal Stepper ─── */}
      <div className="px-4 py-2.5 sm:px-5 border-b border-border bg-page/70 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {currentFlow.nodes.map((node, idx) => {
            const isCurrent = activeStepIndex === idx
            const isPast = activeStepIndex > idx

            return (
              <div key={node.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`px-2 py-1 rounded-xs border text-xs font-mono transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-foreground text-page border-foreground font-semibold shadow-xs'
                      : isPast
                        ? 'bg-surface border-border-strong text-foreground hover:bg-surface-hover'
                        : 'bg-page border-border text-muted hover:text-foreground'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold ${
                      isCurrent
                        ? 'bg-page text-foreground'
                        : isPast
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : 'bg-surface-subtle text-muted'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="whitespace-nowrap">{node.shortLabel}</span>
                </button>

                {idx < currentFlow.nodes.length - 1 && (
                  <ArrowRight
                    className={`w-3 h-3 mx-1 shrink-0 ${
                      isPast ? 'text-foreground' : 'text-border-strong'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Prev/Next Arrows */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={activeStepIndex === 0}
            className="p-1 border border-border bg-page rounded-xs disabled:opacity-30 hover:bg-surface-hover transition-colors"
            title="Previous step"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNextStep}
            disabled={activeStepIndex === currentFlow.nodes.length - 1}
            className="p-1 border border-border bg-page rounded-xs disabled:opacity-30 hover:bg-surface-hover transition-colors"
            title="Next step"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── 3. View Mode Tabs ─── */}
      <div className="flex items-center gap-4 px-4 sm:px-5 pt-2 border-b border-border bg-surface-subtle/30 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('walkthrough')}
          className={`pb-2 border-b-2 font-medium transition-colors ${
            activeTab === 'walkthrough'
              ? 'border-foreground text-foreground font-bold'
              : 'border-transparent text-secondary hover:text-foreground'
          }`}
        >
          1. Step Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`pb-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'simulator'
              ? 'border-foreground text-foreground font-bold'
              : 'border-transparent text-secondary hover:text-foreground'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>2. Live Simulator</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`pb-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'code'
              ? 'border-foreground text-foreground font-bold'
              : 'border-transparent text-secondary hover:text-foreground'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>3. C# Code</span>
        </button>
      </div>

      {/* ─── 4. Main Body (Compact & Punchy) ─── */}
      <div className="p-4 sm:p-5 bg-surface">
        {/* TAB 1: STEP DETAILS */}
        {activeTab === 'walkthrough' && (
          <div className="space-y-3 max-w-2xl">
            {/* Step Title & Layer */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-muted uppercase">
                  STEP {activeStepIndex + 1} OF {currentFlow.nodes.length} · {activeNode.layer}
                </span>
                <h4 className="text-base font-bold text-foreground tracking-tight">
                  {activeNode.title}
                </h4>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-xs border border-border bg-page text-muted">
                {activeNode.tech}
              </span>
            </div>

            {/* What Happens & Benefit Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-sm border border-border bg-page space-y-1">
                <span className="text-[10px] font-mono text-muted uppercase font-bold block">
                  ACTION:
                </span>
                <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                  {activeNode.summary}
                </p>
              </div>

              <div className="p-3 rounded-sm border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold block">
                  WHY IT MATTERS:
                </span>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  {activeNode.benefit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-3">
            {/* 3 Simple Scenario Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                    className={`p-2.5 rounded-sm border text-left transition-all text-xs font-mono flex flex-col justify-between ${
                      isSelected
                        ? 'border-foreground bg-page shadow-xs font-bold text-foreground'
                        : 'border-border bg-surface text-secondary hover:border-border-strong hover:text-foreground'
                    }`}
                  >
                    <span>{sc.title}</span>
                    <span className="text-[11px] font-sans font-normal text-muted mt-1 leading-snug">
                      {sc.summary}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Controls & Log */}
            <div className="p-3 bg-page border border-border rounded-sm space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleStartSimulation}
                  disabled={isSimulating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-page text-xs font-mono font-semibold rounded-xs hover:bg-secondary disabled:opacity-50 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isSimulating ? 'TESTING...' : 'RUN SIMULATION'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetSimulation}
                  className="p-1.5 border border-border text-secondary hover:text-foreground text-xs font-mono rounded-xs transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Output Log */}
              <div className="p-2.5 bg-surface border border-border rounded-xs font-mono text-[11px] text-secondary space-y-1 min-h-[60px] max-h-[90px] overflow-y-auto">
                {simLogs.length === 0 ? (
                  <p className="text-muted italic">Click "RUN SIMULATION" to test this scenario.</p>
                ) : (
                  simLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1 leading-relaxed">
                      <span className="text-muted">[{idx + 1}]</span>
                      <span className="text-foreground">{log}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Outcome Banner */}
              {currentScenario && !isSimulating && simStepIndex >= currentScenario.steps.length && (
                <div className="p-2.5 rounded-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-mono flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">VERIFIED RESULT:</span>
                    <span className="text-secondary font-sans text-xs">{currentScenario.outcome}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CODE */}
        {activeTab === 'code' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-foreground font-semibold">{activeNode.codeTitle}</span>
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
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 bg-page text-foreground border border-border rounded-sm text-xs font-mono overflow-x-auto leading-relaxed max-h-[200px]">
              <code>{activeNode.codeSnippet}</code>
            </pre>
          </div>
        )}
      </div>

      {/* ─── 5. Compact Bottom Guarantee Bar ─── */}
      <div className="px-4 py-2 bg-surface-subtle/50 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted">
        <span className="flex items-center gap-1.5 text-foreground font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Collision-Proof Under Load</span>
        </span>
        <span className="hidden sm:inline">0.01ms Cache · RowVersion OCC · SignalR WebSockets</span>
      </div>
    </div>
  )
}
