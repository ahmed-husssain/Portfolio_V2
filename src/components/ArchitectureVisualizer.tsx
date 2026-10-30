import { useState, useRef, useEffect } from 'react'
import {
  Play,
  Reload,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Radio,
} from 'pixelarticons/react'

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
    tag: '.NET & SQL SERVER',
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
  const [isSimulating, setIsSimulating] = useState(false)
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current)
    }
  }, [])

  const selectStep = (idx: number) => {
    if (simTimerRef.current) clearInterval(simTimerRef.current)
    setIsSimulating(false)
    setActiveSim(null)
    setActiveStep(idx)
  }

  const runSimulation = (sim: Simulation) => {
    if (simTimerRef.current) clearInterval(simTimerRef.current)
    setActiveSim(sim)
    const targetStep = sim.highlightStep - 1

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setActiveStep(targetStep)
      setIsSimulating(false)
      return
    }

    setIsSimulating(true)
    setActiveStep(0)
    let cur = 0
    simTimerRef.current = setInterval(() => {
      cur += 1
      if (cur <= targetStep) {
        setActiveStep(cur)
      } else {
        if (simTimerRef.current) clearInterval(simTimerRef.current)
        setIsSimulating(false)
      }
    }, 220)
  }

  const resetSimulation = () => {
    if (simTimerRef.current) clearInterval(simTimerRef.current)
    setActiveSim(null)
    setIsSimulating(false)
    setActiveStep(0)
  }

  // Mobile horizontal swipe gestures (Apple fluid physics)
  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const threshold = 45 // 45px swipe distance
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && activeStep < flow.steps.length - 1) {
        selectStep(activeStep + 1) // Swipe left -> forward
      } else if (diffX < 0 && activeStep > 0) {
        selectStep(activeStep - 1) // Swipe right -> backward
      }
    }
    touchStartX.current = null
  }

  const currentStep = flow.steps[activeStep] || flow.steps[0]

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`p-3 sm:p-5 flex flex-col gap-2.5 sm:gap-3 font-sans text-foreground text-left select-none ${className}`}
    >
      {/* ─── 1. Header Line ─── */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <p className="text-secondary text-[11px] sm:text-xs font-medium truncate">
          {flow.subtitle}
        </p>
        <span className="inline-flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[9px] sm:text-[10px] font-semibold shrink-0">
          <Radio className="w-3.5 h-3.5 pixel-icon" />
          {flow.tag}
        </span>
      </div>

      {/* ─── 2. Kinetic SVG Architectural Data Rail + Pipeline Strip ─── */}
      <div className="p-2 sm:p-2.5 bg-page border border-border rounded-xs flex flex-col gap-1.5 pixel-corners">
        {/* Real-Time Bus Telemetry Readout */}
        <div className="flex items-center justify-between text-[10px] font-mono text-muted px-0.5">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSimulating ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'
              }`}
            />
            <span className="text-foreground font-semibold">BUS TELEMETRY</span>
            <span className="text-secondary hidden xs:inline">· PACKET IN FLIGHT</span>
          </span>
          <span className="text-emerald-500 font-bold">
            NODE 0{currentStep.number} ACTIVE · {currentStep.metric}
          </span>
        </div>

        {/* Scalable SVG Kinetic Pipeline Rail */}
        <div className="w-full h-7 flex items-center relative select-none">
          <svg
            viewBox="0 0 500 28"
            className="w-full h-7 block overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Inactive Bus Spine Track */}
            <line
              x1="50"
              y1="14"
              x2="450"
              y2="14"
              stroke="currentColor"
              strokeOpacity="0.16"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Active Energized Data Stream Line */}
            <line
              x1="50"
              y1="14"
              x2={50 + activeStep * 100}
              y2="14"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="data-flow-active transition-all duration-300 ease-out"
            />

            {/* 5 Bus Node Terminals */}
            {flow.steps.map((s, idx) => {
              const x = 50 + idx * 100
              const isPassed = idx < activeStep
              const isActive = idx === activeStep
              return (
                <g
                  key={s.id}
                  className="cursor-pointer"
                  onClick={() => selectStep(idx)}
                >
                  {/* Outer Ping Ripple on Active Terminal */}
                  {isActive && (
                    <circle
                      cx={x}
                      cy="14"
                      r="9"
                      fill="#10B981"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Terminal Node Circle */}
                  <circle
                    cx={x}
                    cy="14"
                    r={isActive ? '6' : '4'}
                    fill={isActive || isPassed ? '#10B981' : 'var(--bg-page)'}
                    stroke={isActive || isPassed ? '#10B981' : 'currentColor'}
                    strokeOpacity={isActive || isPassed ? '1' : '0.35'}
                    strokeWidth="1.5"
                    className="transition-all duration-200"
                  />

                  {/* Central Node Pixel Core */}
                  {isActive && (
                    <circle cx={x} cy="14" r="2.5" fill="#FFFFFF" />
                  )}
                </g>
              )
            })}

            {/* Traveling Kinetic Packet Marker */}
            <g
              style={{
                transform: `translateX(${activeStep * 100}px)`,
                transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Packet Aura Glow */}
              <circle
                cx="50"
                cy="14"
                r="11"
                fill="#10B981"
                fillOpacity="0.18"
                className="animate-pulse"
              />
              {/* Packet Ring */}
              <circle
                cx="50"
                cy="14"
                r="7"
                stroke="#10B981"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Packet High-Energy White Dot */}
              <circle cx="50" cy="14" r="3" fill="#FFFFFF" />
            </g>
          </svg>
        </div>

        {/* 5-Step Pipeline Button Grid (Anchored 1:1 with SVG terminals) */}
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 pt-1 border-t border-border/60">
          {flow.steps.map((step, idx) => {
            const isSelected = activeStep === idx
            const isPast = activeStep > idx

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => selectStep(idx)}
                className={`py-1.5 px-0.5 sm:px-1 min-h-[42px] sm:min-h-[36px] rounded-2xs text-center transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-foreground text-page border-foreground shadow-2xs font-semibold'
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
                <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium tracking-tight truncate w-full text-center px-0.5">
                  {step.short}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── 3. Two-Column Card: Step Details (Left) + Interactive Tests (Right) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
        {/* Left: Step Details (7 Cols) */}
        <div className="md:col-span-7 p-3 rounded-xs border border-border bg-page flex flex-col justify-between gap-2.5 pixel-corners">
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
            <span className="text-emerald-500 font-bold text-[11px] flex items-center gap-1">
              <Check className="w-3 h-3 pixel-icon" />
              <span>{currentStep.metric}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-muted sm:hidden mr-1">Swipe ← →</span>
              <button
                type="button"
                onClick={() => {
                  if (activeStep > 0) selectStep(activeStep - 1)
                }}
                disabled={activeStep === 0}
                className="p-1.5 sm:p-1 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-2xs border border-border bg-surface text-secondary hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed active:scale-95"
                title="Previous step"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-3.5 h-3.5 pixel-icon" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeStep < flow.steps.length - 1) selectStep(activeStep + 1)
                }}
                disabled={activeStep === flow.steps.length - 1}
                className="p-1.5 sm:p-1 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-2xs border border-border bg-surface text-secondary hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed active:scale-95"
                title="Next step"
                aria-label="Next step"
              >
                <ChevronRight className="w-3.5 h-3.5 pixel-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: 1-Click Interactive Test Scenarios (5 Cols) */}
        <div className="md:col-span-5 p-3 rounded-xs border border-border bg-surface-subtle/50 flex flex-col justify-between gap-2.5 pixel-corners">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-muted mb-1.5">
              <span className="flex items-center gap-1 font-semibold text-foreground uppercase text-[10px]">
                <Zap className="w-3.5 h-3.5 text-amber-500 pixel-icon" />
                <span>TEST SCENARIOS</span>
              </span>
              {activeSim && (
                <button
                  type="button"
                  onClick={resetSimulation}
                  className="text-muted hover:text-foreground inline-flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  <Reload className="w-3 h-3 pixel-icon" />
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
                    className={`w-full text-left px-2.5 py-2 sm:py-1.5 min-h-[38px] rounded-2xs border transition-all text-[11px] font-mono flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                      isActive
                        ? 'border-foreground bg-page font-bold text-foreground shadow-2xs'
                        : 'border-border bg-page/70 text-secondary hover:text-foreground hover:border-border-strong'
                    }`}
                  >
                    <span className="truncate">{sim.label}</span>
                    <Play className={`w-3 h-3 shrink-0 pixel-icon ${isActive ? 'text-foreground' : 'text-muted'}`} />
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
                  <Check className="w-3.5 h-3.5 shrink-0 pixel-icon" />
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
          <Shield className="w-3.5 h-3.5 text-emerald-500 pixel-icon" />
          <span>{flow.guarantee}</span>
        </span>
        <span className="hidden sm:inline">{flow.guaranteeTech}</span>
      </div>
    </div>
  )
}
