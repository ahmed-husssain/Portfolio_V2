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

const STEPS: Step[] = [
  {
    id: 'bid',
    number: 1,
    short: 'User Bids',
    title: 'Client Submission',
    layer: 'Client UI',
    action: 'Collector clicks "Place Bid".',
    protection: 'Attaches unique UUID key to prevent duplicate charges.',
    metric: 'Payload < 150 B',
  },
  {
    id: 'cache',
    number: 2,
    short: 'Anti-Spam',
    title: 'In-Memory RAM Filter',
    layer: 'IMemoryCache',
    action: 'Checks RAM before database.',
    protection: 'Catches rapid double-clicks in 0.01ms with zero database load.',
    metric: '0.01ms speed',
  },
  {
    id: 'validation',
    number: 3,
    short: 'Rule Check',
    title: 'Domain Validation',
    layer: 'Business Logic',
    action: 'Verifies auction rules.',
    protection: 'Confirms active countdown, card on file, and bid increment.',
    metric: '4 rule checks',
  },
  {
    id: 'sql',
    number: 4,
    short: 'SQL Guard',
    title: 'Concurrency Guard',
    layer: 'SQL Server & EF Core',
    action: 'Saves bid with RowVersion.',
    protection: 'If 2 bids collide at the same millisecond, 1st commits; 2nd retries safely.',
    metric: 'Zero deadlocks',
  },
  {
    id: 'signalr',
    number: 5,
    short: 'Live Push',
    title: 'SignalR WebSockets',
    layer: 'Real-Time Multicast',
    action: 'Broadcasts price to all viewers.',
    protection: 'All screens update in under 10ms with zero page reloads.',
    metric: '< 10ms latency',
  },
]

interface Simulation {
  id: string
  label: string
  highlightStep: number
  result: string
}

const SIMULATIONS: Simulation[] = [
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
    result: 'Caught in RAM in 0.01ms. Exactly 1 database write happens.',
  },
  {
    id: 'timeout',
    label: 'Countdown Hits 0:00',
    highlightStep: 5,
    result: 'Background worker finalizes winner and creates order automatically.',
  },
]

export interface ArchitectureVisualizerProps {
  className?: string
  initialFlowId?: string
}

export default function ArchitectureVisualizer({ className = '' }: ArchitectureVisualizerProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [activeSim, setActiveSim] = useState<Simulation | null>(null)

  const currentStep = STEPS[activeStep]

  const runSimulation = (sim: Simulation) => {
    setActiveSim(sim)
    setActiveStep(sim.highlightStep - 1)
  }

  const resetSimulation = () => {
    setActiveSim(null)
    setActiveStep(0)
  }

  return (
    <div className={`p-4 sm:p-5 flex flex-col gap-3 font-sans text-foreground text-left select-none ${className}`}>
      {/* ─── 1. Header Line ─── */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <p className="text-secondary text-xs font-medium truncate">
          Live auction pipeline: from click to sub-millisecond database commit.
        </p>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] font-semibold shrink-0">
          <Activity className="w-3 h-3 animate-pulse" />
          ACTIVE ENGINE
        </span>
      </div>

      {/* ─── 2. 5-Step Pipeline Strip ─── */}
      <div className="grid grid-cols-5 gap-1.5 p-1 bg-page border border-border rounded-xs">
        {STEPS.map((step, idx) => {
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
              className={`py-1.5 px-1 rounded-2xs text-center transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer ${
                isSelected
                  ? 'bg-foreground text-page border-foreground shadow-2xs'
                  : isPast
                    ? 'bg-surface border-border-strong text-foreground hover:bg-surface-hover'
                    : 'bg-page border-transparent text-muted hover:text-foreground'
              }`}
            >
              <span
                className={`text-[10px] font-mono font-bold leading-none ${
                  isSelected ? 'text-page' : isPast ? 'text-emerald-500' : 'text-muted'
                }`}
              >
                0{step.number}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-tight truncate w-full text-center">
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
                STEP {currentStep.number} OF {STEPS.length}
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
                  if (activeStep < STEPS.length - 1) setActiveStep(activeStep + 1)
                  setActiveSim(null)
                }}
                disabled={activeStep === STEPS.length - 1}
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
              {SIMULATIONS.map((sim) => {
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
          <span>Zero Deadlocks Guarantee</span>
        </span>
        <span className="hidden sm:inline">0.01ms Cache · RowVersion OCC · WebSockets</span>
      </div>
    </div>
  )
}
