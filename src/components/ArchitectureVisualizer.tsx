import { useState, useEffect } from 'react'
import {
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Code2,
  Terminal,
  Activity,
  Copy,
  Check,
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

export default function ArchitectureVisualizer({
  initialFlowId = 'auction-concurrency',
  className = '',
}: ArchitectureVisualizerProps) {
  const [selectedFlowId, setSelectedFlowId] = useState(initialFlowId)
  const currentFlow: ArchitectureFlow =
    GALLREX_ARCHITECTURE.find((f) => f.id === selectedFlowId) || GALLREX_ARCHITECTURE[0]

  const [activeNodeId, setActiveNodeId] = useState<string>(currentFlow.nodes[0]?.id || '')
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    currentFlow.scenarios[0]?.id || ''
  )
  const [isSimulating, setIsSimulating] = useState(false)
  const [simStepIndex, setSimStepIndex] = useState<number>(-1)
  const [simLogs, setSimLogs] = useState<string[]>([])
  const [copiedCode, setCopiedCode] = useState(false)

  // Update active node when flow changes
  useEffect(() => {
    if (currentFlow.nodes.length > 0) {
      setActiveNodeId(currentFlow.nodes[0].id)
    }
    if (currentFlow.scenarios.length > 0) {
      setSelectedScenarioId(currentFlow.scenarios[0].id)
    }
    setIsSimulating(false)
    setSimStepIndex(-1)
    setSimLogs([])
  }, [selectedFlowId])

  const activeNode: ArchitectureNode =
    currentFlow.nodes.find((n) => n.id === activeNodeId) || currentFlow.nodes[0]

  const currentScenario: SimulationScenario | undefined = currentFlow.scenarios.find(
    (s) => s.id === selectedScenarioId
  )

  // Run simulation effect
  useEffect(() => {
    if (!isSimulating || !currentScenario) return

    if (simStepIndex < currentScenario.steps.length) {
      const step = currentScenario.steps[simStepIndex]
      if (step) {
        setActiveNodeId(step.nodeId)
        setSimLogs((prev) => [...prev, step.log])
      }

      const timer = setTimeout(() => {
        setSimStepIndex((prev) => prev + 1)
      }, step?.durationMs || 500)

      return () => clearTimeout(timer)
    } else {
      setIsSimulating(false)
    }
  }, [isSimulating, simStepIndex, currentScenario])

  const handleStartSimulation = () => {
    if (!currentScenario) return
    setIsSimulating(true)
    setSimStepIndex(0)
    setSimLogs([`[INIT] Starting "${currentScenario.title}"...`])
  }

  const handleResetSimulation = () => {
    setIsSimulating(false)
    setSimStepIndex(-1)
    setSimLogs([])
    if (currentFlow.nodes[0]) {
      setActiveNodeId(currentFlow.nodes[0].id)
    }
  }

  const handleCopyCode = () => {
    if (activeNode?.codeSnippet) {
      navigator.clipboard.writeText(activeNode.codeSnippet)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const getLayerColor = (layer: ArchitectureNode['layer']) => {
    switch (layer) {
      case 'Client':
        return 'text-sky-500 border-sky-500/30 bg-sky-500/5'
      case 'Security / Cache':
        return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
      case 'Application / CQRS':
        return 'text-amber-500 border-amber-500/30 bg-amber-500/5'
      case 'Domain / Validation':
        return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5'
      case 'Database / OCC':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/5'
      case 'Real-Time':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/5'
      case 'Worker':
        return 'text-teal-400 border-teal-500/30 bg-teal-500/5'
      default:
        return 'text-foreground border-border bg-surface'
    }
  }

  return (
    <div
      className={`border border-border bg-surface rounded-sm overflow-hidden flex flex-col font-sans ${className}`}
    >
      {/* ─── Header & Flow Switcher ─── */}
      <div className="border-b border-border bg-surface-subtle/50 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">// ARCHITECTURE INSPECTOR</span>
            <span>·</span>
            <span>GALLREX .NET 8 / SQL SERVER</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            {currentFlow.title}
          </h3>
          <p className="text-xs sm:text-sm text-secondary font-mono mt-0.5">
            {currentFlow.tagline}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-page border border-border rounded-sm self-start md:self-auto">
          {GALLREX_ARCHITECTURE.map((flow) => (
            <button
              key={flow.id}
              onClick={() => setSelectedFlowId(flow.id)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-xs transition-colors ${
                selectedFlowId === flow.id
                  ? 'bg-foreground text-page shadow-xs'
                  : 'text-secondary hover:text-foreground hover:bg-surface-subtle'
              }`}
            >
              {flow.id === 'auction-concurrency' && 'Bidding & Concurrency'}
              {flow.id === 'auth-pipeline' && 'OAuth & Identity'}
              {flow.id === 'catalog-indexing' && 'Catalog & Indexing'}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Metric Banner ─── */}
      <div className="px-5 py-2.5 bg-page/80 border-b border-border flex items-center justify-between text-xs font-mono text-secondary">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-foreground font-semibold">CORE INVARIANT:</span>
          <span className="hidden sm:inline">{currentFlow.highlightMetric}</span>
          <span className="sm:hidden truncate">{currentFlow.highlightMetric}</span>
        </div>
        <span className="text-[11px] text-muted">INTERACTIVE SIMULATION READY</span>
      </div>

      {/* ─── Node Pipeline Flow Chart ─── */}
      <div className="p-4 sm:p-6 border-b border-border bg-page/40">
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>REQUEST PIPELINE FLOW ({currentFlow.nodes.length} NODES)</span>
          <span className="text-secondary">CLICK ANY NODE TO INSPECT CODE & RATIONALE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {currentFlow.nodes.map((node, index) => {
            const isSelected = activeNodeId === node.id
            const isSimActive =
              isSimulating && currentScenario?.steps[simStepIndex]?.nodeId === node.id
            const isSimPast =
              isSimulating &&
              currentScenario?.steps.slice(0, simStepIndex).some((s) => s.nodeId === node.id)

            return (
              <button
                key={node.id}
                onClick={() => {
                  setActiveNodeId(node.id)
                  setIsSimulating(false)
                }}
                className={`relative p-3 rounded-sm border text-left transition-all duration-150 flex flex-col justify-between min-h-[96px] group ${
                  isSelected
                    ? 'border-foreground bg-surface shadow-xs ring-1 ring-foreground/20'
                    : isSimActive
                      ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500'
                      : isSimPast
                        ? 'border-border-strong bg-surface/70'
                        : 'border-border bg-surface hover:border-border-strong hover:bg-surface-hover'
                }`}
              >
                {/* Node Step Number & Layer Badge */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono font-bold text-muted">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-xs border ${getLayerColor(
                      node.layer
                    )}`}
                  >
                    {node.layer.split('/')[0].trim()}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground tracking-tight leading-snug group-hover:text-foreground">
                    {node.title}
                  </h4>
                  <p className="text-[10px] text-muted font-mono truncate mt-0.5">
                    {node.badge}
                  </p>
                </div>

                {/* Connection indicator */}
                {isSelected && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-foreground rounded-t-sm" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Node Inspector & Simulation Studio (Split View) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Left (7 Cols): Node Deep-Dive (Tradeoffs + Code) */}
        <div className="lg:col-span-7 p-5 sm:p-6 space-y-6">
          {/* Node Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted mb-1">
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono rounded-xs border uppercase ${getLayerColor(
                    activeNode.layer
                  )}`}
                >
                  LAYER: {activeNode.layer}
                </span>
                <span>·</span>
                <span className="text-foreground font-semibold">{activeNode.badge}</span>
              </div>
              <h4 className="text-xl font-bold text-foreground tracking-tight">
                {activeNode.title}
              </h4>
              <p className="text-xs text-secondary font-mono mt-0.5">{activeNode.subtitle}</p>
            </div>

            {/* Metrics Chips */}
            {activeNode.metrics && (
              <div className="flex items-center gap-2">
                {activeNode.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1 bg-page border border-border rounded-sm text-right"
                  >
                    <span className="text-[9px] font-mono text-muted block uppercase tracking-wider">
                      {m.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
              FUNCTIONAL ROLE
            </h5>
            <p className="text-sm text-secondary leading-relaxed">{activeNode.description}</p>
          </div>

          {/* Architectural Rationale */}
          <div className="p-4 bg-surface-subtle/70 border border-border rounded-sm space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeNode.rationaleTitle}</span>
            </div>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {activeNode.rationale}
            </p>
          </div>

          {/* Actual Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                <span>{activeNode.codeTitle}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-muted hover:text-foreground border border-border rounded-xs bg-page transition-colors"
                title="Copy code snippet"
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

            <pre className="p-4 bg-page text-foreground border border-border rounded-sm text-xs font-mono overflow-x-auto leading-relaxed max-h-[280px]">
              <code>{activeNode.codeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Right (5 Cols): Live Scenario Simulator & Telemetry */}
        <div className="lg:col-span-5 p-5 sm:p-6 bg-surface-subtle/30 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Simulator Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted mb-1">
                <Terminal className="w-3.5 h-3.5 text-foreground" />
                <span className="font-semibold text-foreground">// TELEMETRY SIMULATOR</span>
              </div>
              <h4 className="text-base font-bold text-foreground tracking-tight">
                Live Scenario Bench
              </h4>
              <p className="text-xs text-secondary leading-relaxed mt-1">
                Trigger real edge cases (concurrency collisions, idempotency caching, background
                heartbeats) and observe the architectural response.
              </p>
            </div>

            {/* Scenario Picker */}
            {currentFlow.scenarios.length > 0 ? (
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                  SELECT SCENARIO:
                </label>
                <div className="space-y-1.5">
                  {currentFlow.scenarios.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setSelectedScenarioId(sc.id)
                        handleResetSimulation()
                      }}
                      className={`w-full text-left p-3 rounded-sm border transition-all text-xs font-mono ${
                        selectedScenarioId === sc.id
                          ? 'border-foreground bg-surface shadow-2xs text-foreground font-semibold'
                          : 'border-border bg-page/60 text-secondary hover:border-border-strong hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{sc.title}</span>
                        {sc.outcomeType === 'collision' && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-xs">
                            OCC TEST
                          </span>
                        )}
                        {sc.outcomeType === 'cached' && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-xs">
                            IDEMPOTENCY
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted font-sans font-normal mt-1 leading-snug">
                        {sc.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-page border border-border rounded-sm text-xs text-secondary font-mono">
                No interactive simulation scripts configured for this flow. Click any node on the
                left to inspect its C# implementation.
              </div>
            )}

            {/* Simulation Controls */}
            {currentScenario && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleStartSimulation}
                  disabled={isSimulating}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-page text-xs font-mono font-semibold rounded-sm hover:bg-secondary disabled:opacity-50 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSimulating ? 'SIMULATING...' : 'RUN SCENARIO'}</span>
                </button>
                <button
                  onClick={handleResetSimulation}
                  disabled={isSimulating && simStepIndex === -1}
                  className="px-3 py-2 border border-border bg-page text-secondary hover:text-foreground text-xs font-mono rounded-sm transition-colors"
                  title="Reset telemetry"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Live Telemetry Console Log */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-muted uppercase tracking-wider">
                <span>SIMULATED AUDIT TRAIL</span>
                {isSimulating && (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    STREAMING
                  </span>
                )}
              </div>

              <div className="p-3 bg-page border border-border rounded-sm text-xs font-mono text-secondary space-y-1.5 min-h-[140px] max-h-[190px] overflow-y-auto">
                {simLogs.length === 0 ? (
                  <p className="text-muted text-[11px] italic">
                    Press "RUN SCENARIO" above to observe the request step execution across layers...
                  </p>
                ) : (
                  simLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed text-[11px]">
                      <span className="text-muted shrink-0">[{idx + 1}]</span>
                      <span
                        className={
                          log.includes('RACE CONDITION') || log.includes('DbUpdateConcurrencyException')
                            ? 'text-amber-500 font-bold'
                            : log.includes('INTERCEPTED') || log.includes('SUCCESS')
                              ? 'text-emerald-500 font-semibold'
                              : 'text-foreground'
                        }
                      >
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Simulation Outcome Box */}
            {currentScenario && !isSimulating && simStepIndex >= currentScenario.steps.length && (
              <div
                className={`p-3.5 rounded-sm border text-xs leading-relaxed font-mono flex items-start gap-2.5 ${
                  currentScenario.outcomeType === 'collision'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">SCENARIO VERIFIED</span>
                  <span className="text-secondary font-sans text-xs">
                    {currentScenario.outcomeMessage}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Footer Link to Case Study */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted">
            <span>PROVEN IN PRODUCTION</span>
            <span>.NET 8 / EF CORE 8</span>
          </div>
        </div>
      </div>
    </div>
  )
}
