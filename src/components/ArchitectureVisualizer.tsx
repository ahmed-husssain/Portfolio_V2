import { useState } from 'react'
import {
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
} from 'lucide-react'

interface Step {
  id: string
  number: number
  short: string
  title: string
  layer: string
  action: string
  protection: string
  metric: string
}

interface Simulation {
  id: string
  label: string
  highlightStep: number
  result: string
}

interface FlowData {
  subtitle: string
  tag: string
  guarantee: string
  guaranteeTech: string
  steps: Step[]
  simulations: Simulation[]
}

const FLOWS: Record<string, FlowData> = {
  'online-art-gallery': {
    subtitle: 'Live auction pipeline: request validation, concurrency guard, and real-time push.',
    tag: '.NET 8 & SQL SERVER',
    guarantee: 'Bid Concurrency Safety',
    guaranteeTech: 'In-Memory Cache · RowVersion OCC · SignalR WebSockets',
    steps: [
      {
        id: 'bid',
        number: 1,
        short: 'User Bids',
        title: 'Client Submission',
        layer: 'Client UI',
        action: 'Collector clicks "Place Bid".',
        protection: 'Attaches unique UUID key to prevent duplicate charges.',
        metric: 'Idempotency UUID',
      },
      {
        id: 'cache',
        number: 2,
        short: 'Anti-Spam',
        title: 'In-Memory RAM Filter',
        layer: 'IMemoryCache',
        action: 'Checks RAM before database.',
        protection: 'Catches rapid double-clicks in RAM before hitting the database.',
        metric: 'In-Memory Filter',
      },
      {
        id: 'validation',
        number: 3,
        short: 'Rule Check',
        title: 'Domain Validation',
        layer: 'Business Logic',
        action: 'Verifies auction rules.',
        protection: 'Confirms active countdown, card on file, and bid increment.',
        metric: 'Rule Validation',
      },
      {
        id: 'sql',
        number: 4,
        short: 'SQL Guard',
        title: 'Concurrency Guard',
        layer: 'SQL Server & EF Core',
        action: 'Saves bid with RowVersion.',
        protection: 'If 2 bids collide at the same millisecond, 1st commits; 2nd retries safely.',
        metric: 'OCC RowVersion',
      },
      {
        id: 'signalr',
        number: 5,
        short: 'Live Push',
        title: 'SignalR WebSockets',
        layer: 'Real-Time Multicast',
        action: 'Broadcasts price to all viewers.',
        protection: 'All screens update in under 10ms with zero page reloads.',
        metric: '< 10ms Multicast',
      },
    ],
    simulations: [
      {
        id: 'collision',
        label: '2 Bids at Same Millisecond',
        highlightStep: 4,
        result: '1st bid commits with RowVersion. 2nd gets instant retry notice with zero deadlocks.',
      },
      {
        id: 'double-click',
        label: 'Fast Double-Click Spam',
        highlightStep: 2,
        result: 'Caught in memory cache. Exactly 1 database write commits, preventing duplicate bids.',
      },
      {
        id: 'timeout',
        label: 'Countdown Hits 0:00',
        highlightStep: 5,
        result: 'Background worker finalizes winner and creates order automatically.',
      },
    ],
  },
  'shifamanagement': {
    subtitle: 'Clinical operations & billing: from staff intake to ACID database commit.',
    tag: 'FLUTTER · SUPABASE · POSTGRES 15',
    guarantee: 'Strict Sequential Invoice Safety',
    guaranteeTech: 'PostgreSQL Atomic RPCs · Row-Level Security · Realtime CDC',
    steps: [
      {
        id: 'input',
        number: 1,
        short: 'Staff Input',
        title: 'Clinical Action',
        layer: 'Flutter & Riverpod',
        action: 'Staff issues invoice or intake.',
        protection: 'Attaches UUID idempotency key to prevent double submissions.',
        metric: 'Client Validation',
      },
      {
        id: 'gateway',
        number: 2,
        short: 'Fast Gate',
        title: 'Pre-Lock Idempotency',
        layer: 'Supabase Gateway',
        action: 'Intercepts duplicate network retry.',
        protection: 'Returns existing invoice payload without incrementing database sequence counters.',
        metric: 'Idempotent Replay',
      },
      {
        id: 'rowlock',
        number: 3,
        short: 'Row Lock',
        title: 'Atomic Counter Lock',
        layer: 'PostgreSQL FOR UPDATE',
        action: 'Locks sequence row exclusively.',
        protection: 'Guarantees consecutive gapless numbering (SHHC-5001) with zero collisions.',
        metric: 'Atomic Sequence Lock',
      },
      {
        id: 'rls',
        number: 4,
        short: 'RLS Guard',
        title: 'Row Level Security',
        layer: 'PostgreSQL Row Level Security',
        action: 'Filters query by JWT role.',
        protection: 'Blocks staff from accessing agency profit margins and unassigned patients.',
        metric: 'Row-Level Isolation',
      },
      {
        id: 'stream',
        number: 5,
        short: 'Live Stream',
        title: 'Realtime Broadcast',
        layer: 'Postgres CDC & WebSocket',
        action: 'Streams updates to all devices.',
        protection: 'Pushes 7-day care plan expiration alerts instantly across Android, iOS & Desktop.',
        metric: 'Live CDC Alert',
      },
    ],
    simulations: [
      {
        id: 'concurrent-invoice',
        label: '2 Invoices at Same Millisecond',
        highlightStep: 3,
        result: 'Postgres locks invoice_counters row. 1st gets SHHC-5001, 2nd gets SHHC-5002 with zero gaps or duplicates.',
      },
      {
        id: 'staff-access-violation',
        label: 'Staff Queries Agency Margins',
        highlightStep: 4,
        result: 'PostgreSQL Row Level Security blocks request at database level. 0 restricted records returned.',
      },
      {
        id: 'plan-expiration-event',
        label: 'Plan Enters 7-Day Window',
        highlightStep: 5,
        result: 'Postgres CDC trigger emits WebSocket push. Care plan badge turns 🟡 Upcoming across devices.',
      },
    ],
  },
}

export interface ArchitectureVisualizerProps {
  className?: string
  projectSlug?: string
  initialFlowId?: string
}

export default function ArchitectureVisualizer({
  className = '',
  projectSlug = 'online-art-gallery',
  initialFlowId,
}: ArchitectureVisualizerProps) {
  // Resolve key from projectSlug or initialFlowId
  const flowKey =
    projectSlug === 'shifamanagement' || initialFlowId === 'shifa-architecture'
      ? 'shifamanagement'
      : 'online-art-gallery'

  const flow = FLOWS[flowKey] || FLOWS['online-art-gallery']
  const [activeStep, setActiveStep] = useState(0)
  const [activeSim, setActiveSim] = useState<Simulation | null>(null)

  const currentStep = flow.steps[activeStep] || flow.steps[0]

  const runSimulation = (sim: Simulation) => {
    setActiveSim(sim)
    setActiveStep(sim.highlightStep - 1)
  }

  const resetSimulation = () => {
    setActiveSim(null)
    setActiveStep(0)
  }

  return (
    <div className={`p-3 sm:p-5 flex flex-col gap-2.5 sm:gap-3 font-sans text-foreground text-left select-none ${className}`}>
      {/* ─── 1. Header Line ─── */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <p className="text-secondary text-[11px] sm:text-xs font-medium truncate">
          {flow.subtitle}
        </p>
        <span className="inline-flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[9px] sm:text-[10px] font-semibold shrink-0">
          <Activity className="w-3 h-3 animate-pulse" />
          {flow.tag}
        </span>
      </div>

      {/* ─── 2. 5-Step Pipeline Strip ─── */}
      <div className="grid grid-cols-5 gap-1 sm:gap-1.5 p-1 bg-page border border-border rounded-xs">
        {flow.steps.map((step, idx) => {
          const isSelected = activeStep === idx
          const isPast = activeStep > idx

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                setActiveStep(idx)
                setActiveSim(null)
              }}
              className={`py-1.5 px-0.5 sm:px-1 rounded-2xs text-center transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer ${
                isSelected
                  ? 'bg-foreground text-page border-foreground shadow-2xs'
                  : isPast
                    ? 'bg-surface border-border-strong text-foreground hover:bg-surface-hover'
                    : 'bg-page border-transparent text-muted hover:text-foreground'
              }`}
            >
              <span
                className={`text-[9px] sm:text-[10px] font-mono font-bold leading-none ${
                  isSelected ? 'text-page' : isPast ? 'text-emerald-500' : 'text-muted'
                }`}
              >
                0{step.number}
              </span>
              <span className="text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-tight truncate w-full text-center px-0.5">
                {step.short}
              </span>
            </button>
          )
        })}
      </div>

      {/* ─── 3. Two-Column Card: Step Details (Left) + Interactive Tests (Right) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
        {/* Left: Step Details (7 Cols) */}
        <div className="md:col-span-7 p-3 rounded-xs border border-border bg-page flex flex-col justify-between gap-2.5">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-muted uppercase text-[10px]">
                STEP {currentStep.number} OF {flow.steps.length}
              </span>
              <span className="px-1.5 py-0.5 rounded-2xs border border-border bg-surface text-secondary text-[10px]">
                {currentStep.layer}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-foreground tracking-tight mb-2">
              {currentStep.title}
            </h4>

            {/* Action & Guard in 2 clean lines */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-muted font-mono font-bold uppercase text-[10px] shrink-0 pt-0.5">
                  ACTION:
                </span>
                <span className="text-foreground font-medium leading-relaxed">{currentStep.action}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-mono font-bold uppercase text-[10px] shrink-0 pt-0.5">
                  GUARD:
                </span>
                <span className="text-secondary leading-relaxed">{currentStep.protection}</span>
              </div>
            </div>
          </div>

          {/* Step Footer with Metric & Next/Prev Controls */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-500 font-bold text-[11px]">
              ✓ {currentStep.metric}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (activeStep > 0) setActiveStep(activeStep - 1)
                  setActiveSim(null)
                }}
                disabled={activeStep === 0}
                className="p-1 rounded-2xs border border-border bg-surface text-secondary hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                title="Previous step"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeStep < flow.steps.length - 1) setActiveStep(activeStep + 1)
                  setActiveSim(null)
                }}
                disabled={activeStep === flow.steps.length - 1}
                className="p-1 rounded-2xs border border-border bg-surface text-secondary hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                title="Next step"
                aria-label="Next step"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: 1-Click Interactive Test Scenarios (5 Cols) */}
        <div className="md:col-span-5 p-3 rounded-xs border border-border bg-surface-subtle/50 flex flex-col justify-between gap-2.5">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-muted mb-1.5">
              <span className="flex items-center gap-1 font-semibold text-foreground uppercase text-[10px]">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>TEST SCENARIOS</span>
              </span>
              {activeSim && (
                <button
                  type="button"
                  onClick={resetSimulation}
                  className="text-muted hover:text-foreground inline-flex items-center gap-0.5 text-[10px] cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>RESET</span>
                </button>
              )}
            </div>

            {/* 3 Compact Test Buttons */}
            <div className="space-y-1">
              {flow.simulations.map((sim) => {
                const isActive = activeSim?.id === sim.id
                return (
                  <button
                    key={sim.id}
                    type="button"
                    onClick={() => runSimulation(sim)}
                    className={`w-full text-left px-2 py-1.5 rounded-2xs border transition-all text-[11px] font-mono flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'border-foreground bg-page font-bold text-foreground shadow-2xs'
                        : 'border-border bg-page/70 text-secondary hover:text-foreground hover:border-border-strong'
                    }`}
                  >
                    <span className="truncate">{sim.label}</span>
                    <Play className={`w-2.5 h-2.5 shrink-0 ${isActive ? 'fill-current' : 'text-muted'}`} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Test Result Box */}
          <div className="p-2 rounded-2xs border border-border bg-page text-[11px] font-mono">
            {activeSim ? (
              <div className="space-y-0.5">
                <span className="text-emerald-500 font-bold flex items-center gap-1 text-[10px]">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>RESULT:</span>
                </span>
                <p className="text-foreground leading-snug font-sans text-xs">
                  {activeSim.result}
                </p>
              </div>
            ) : (
              <p className="text-muted text-[11px] italic leading-snug font-sans">
                Click any scenario above to see how the architecture responds.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── 4. Minimal Bottom Guarantee Bar ─── */}
      <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-muted">
        <span className="flex items-center gap-1.5 text-foreground font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>{flow.guarantee}</span>
        </span>
        <span className="hidden sm:inline">{flow.guaranteeTech}</span>
      </div>
    </div>
  )
}
