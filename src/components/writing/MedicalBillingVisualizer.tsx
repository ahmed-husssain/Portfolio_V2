import { useState } from 'react'
import { Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Database, Play, Users } from 'lucide-react'

type RenewalStrategy = 'buggy' | 'invariant'
type InvoicingStrategy = 'naive_max' | 'atomic_rpc'

export default function MedicalBillingVisualizer() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'invoicing'>('calendar')
  
  // Tab 1: Calendar Renewal States
  const [cycleLength, setCycleLength] = useState<number>(14)
  const [renewalStrategy, setRenewalStrategy] = useState<RenewalStrategy>('invariant')
  const [renewalDay, setRenewalDay] = useState<number>(8) // Triggered early on Day 8
  
  // Tab 2: Invoicing Concurrency States
  const [invoicingStrategy, setInvoicingStrategy] = useState<InvoicingStrategy>('atomic_rpc')
  const [isSimulatingInvoice, setIsSimulatingInvoice] = useState<boolean>(false)
  const [invoiceResults, setInvoiceResults] = useState<{
    nurse1: { status: 'idle' | 'success' | 'failed'; invoiceNo?: string }
    nurse2: { status: 'idle' | 'success' | 'failed'; invoiceNo?: string }
    log: string[]
  }>({
    nurse1: { status: 'idle' },
    nurse2: { status: 'idle' },
    log: [],
  })

  // Run Invoicing Simulation
  const runInvoicingSimulation = async () => {
    setIsSimulatingInvoice(true)
    setInvoiceResults({
      nurse1: { status: 'idle' },
      nurse2: { status: 'idle' },
      log: ['[10:14:02.100] Simultaneous HTTP POST /api/invoices dispatched by Nurse Fatima & Nurse Tariq...'],
    })

    await new Promise((res) => setTimeout(res, 400))

    if (invoicingStrategy === 'naive_max') {
      setInvoiceResults({
        nurse1: { status: 'success', invoiceNo: 'INV-2026-1043' },
        nurse2: { status: 'failed' },
        log: [
          '[10:14:02.100] Fatima: SELECT MAX(seq) FROM invoices -> Returns 1042',
          '[10:14:02.101] Tariq:  SELECT MAX(seq) FROM invoices -> Returns 1042 (Race condition!)',
          '[10:14:02.115] Fatima: INSERT INTO invoices (seq) VALUES (1043) -> SUCCESS',
          '[10:14:02.116] Tariq:  INSERT INTO invoices (seq) VALUES (1043) -> ERROR 23505: duplicate key value violates unique constraint "invoices_pkey"',
          '[CRITICAL] Nurse Tariq received 500 Internal Server Error. Patient billing interrupted.',
        ],
      })
    } else {
      setInvoiceResults({
        nurse1: { status: 'success', invoiceNo: 'INV-2026-1043' },
        nurse2: { status: 'success', invoiceNo: 'INV-2026-1044' },
        log: [
          '[10:14:02.100] Both execute RPC: create_invoice_atomic()',
          '[10:14:02.102] PostgreSQL RPC acquires SELECT next_val FOR UPDATE on sequence row',
          '[10:14:02.104] Fatima acquires lock. NextVal bumped 1042 -> 1043. Generates INV-2026-1043.',
          '[10:14:02.107] Fatima transaction committed in 3ms. Lock released.',
          '[10:14:02.108] Tariq unblocked immediately. NextVal bumped 1043 -> 1044. Generates INV-2026-1044.',
          '[SUCCESS] 0 Duplicate Invoices. 100% ACID Concurrency Safety across mobile devices.',
        ],
      })
    }
    setIsSimulatingInvoice(false)
  }

  // Days array for visual representation (Days 1 to 28)
  const totalDays = 28
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1)

  // Initial cycle: Day 1 to Day cycleLength
  // If buggy renewal on Day 8: Cycle 2 is Day 8 to Day (8 + cycleLength - 1)
  // If invariant renewal: Cycle 2 is Day (cycleLength + 1) to Day (cycleLength * 2)
  const cycle1Start = 1
  const cycle1End = cycleLength

  const cycle2Start = renewalStrategy === 'buggy' ? renewalDay : cycle1End + 1
  const cycle2End = cycle2Start + cycleLength - 1

  return (
    <div className="my-8 border border-border bg-page rounded-sm overflow-hidden font-sans not-prose shadow-sm">
      {/* Top Header */}
      <div className="bg-surface px-4 sm:px-6 py-3.5 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
            CLINICAL CONTINUITY WORKBENCH // SHIFAMANAGEMENT
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted bg-surface-subtle px-2 py-0.5 border border-border rounded-xs">
          FLUTTER / SUPABASE POSTGRESQL 15
        </span>
      </div>

      {/* Main Mode Navigation */}
      <div className="flex border-b border-border bg-surface-subtle text-xs font-mono">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 py-3 px-4 text-center border-b-2 font-semibold transition-colors ${
            activeTab === 'calendar'
              ? 'border-foreground text-foreground bg-surface'
              : 'border-transparent text-secondary hover:text-foreground'
          }`}
        >
          EXPERIMENT 1: EARLY RENEWAL DATE INVARIANT
        </button>
        <button
          onClick={() => setActiveTab('invoicing')}
          className={`flex-1 py-3 px-4 text-center border-b-2 font-semibold transition-colors ${
            activeTab === 'invoicing'
              ? 'border-foreground text-foreground bg-surface'
              : 'border-transparent text-secondary hover:text-foreground'
          }`}
        >
          EXPERIMENT 2: ATOMIC MULTI-NURSE INVOICE RPC
        </button>
      </div>

      {activeTab === 'calendar' ? (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border">
            <div>
              <label className="block text-xs font-mono text-secondary mb-2 uppercase">
                CALCULATED DATE STRATEGY:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRenewalStrategy('buggy')}
                  className={`p-2.5 text-left border rounded-xs transition-all ${
                    renewalStrategy === 'buggy'
                      ? 'border-red-500 bg-red-500/10 text-foreground font-semibold'
                      : 'border-border bg-surface text-secondary hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span>Naive Date Math</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <span className="text-[10px] text-muted block">StartDate = ClickDate</span>
                </button>

                <button
                  onClick={() => setRenewalStrategy('invariant')}
                  className={`p-2.5 text-left border rounded-xs transition-all ${
                    renewalStrategy === 'invariant'
                      ? 'border-emerald-500 bg-emerald-500/10 text-foreground font-semibold'
                      : 'border-border bg-surface text-secondary hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span>Zero-Gap Invariant</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[10px] text-muted block">ToDate_prev + 1 Day</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-secondary mb-2 uppercase">
                PLAN DURATION: <span className="text-foreground font-bold">{cycleLength} DAYS</span>
              </label>
              <div className="flex gap-2">
                {[10, 14, 21].map((days) => (
                  <button
                    key={days}
                    onClick={() => setCycleLength(days)}
                    className={`flex-1 py-2 text-xs font-mono rounded-xs border transition-colors ${
                      cycleLength === days
                        ? 'border-foreground bg-foreground text-page font-semibold'
                        : 'border-border bg-surface text-secondary hover:text-foreground'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-muted">
                <span>Trigger Renewal On:</span>
                {[5, 8, 11].map((d) => (
                  <button
                    key={d}
                    onClick={() => setRenewalDay(d)}
                    className={`px-1.5 py-0.5 rounded-2xs border font-mono transition-colors ${
                      renewalDay === d
                        ? 'border-foreground bg-foreground text-page font-bold'
                        : 'border-border bg-surface text-secondary hover:text-foreground'
                    }`}
                  >
                    Day {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Visual Timeline */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-muted mb-2">
              <span>CALENDAR TIMELINE // DAYS 01 - 28</span>
              <span className="text-foreground">
                {renewalStrategy === 'buggy' ? (
                  <span className="text-red-500 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> OVERLAP DISCREPANCY: {cycle1End - cycle2Start + 1} DAYS DOUBLE-BILLED
                  </span>
                ) : (
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ZERO-GAP INVARIANT GUARANTEED
                  </span>
                )}
              </span>
            </div>

            {/* Days Grid Strip */}
            <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1 p-2 bg-surface-subtle border border-border rounded-xs">
              {daysArray.map((day) => {
                const inCycle1 = day >= cycle1Start && day <= cycle1End
                const inCycle2 = day >= cycle2Start && day <= cycle2End
                const isOverlapping = inCycle1 && inCycle2
                const isEarlyRenewalTrigger = day === renewalDay

                return (
                  <div
                    key={day}
                    className={`h-14 sm:h-16 flex flex-col justify-between p-1 rounded-2xs text-[10px] font-mono border relative transition-all ${
                      isOverlapping
                        ? 'bg-red-500/20 border-red-500 text-red-600 dark:text-red-400 font-bold animate-pulse'
                        : inCycle1
                          ? 'bg-blue-500/15 border-blue-500/40 text-blue-600 dark:text-blue-300'
                          : inCycle2
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
                            : 'bg-surface border-border text-muted opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{day < 10 ? `0${day}` : day}</span>
                      {isEarlyRenewalTrigger && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Renewal Triggered" />
                      )}
                    </div>

                    <div className="text-[8px] leading-tight text-center font-bold">
                      {isOverlapping ? 'OVERLAP!' : inCycle1 ? 'CYCLE 1' : inCycle2 ? 'CYCLE 2' : 'OFF'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Explanation Alert */}
          <div className={`p-4 border rounded-xs text-xs font-mono leading-relaxed ${
            renewalStrategy === 'buggy'
              ? 'border-red-500/40 bg-red-500/10 text-foreground'
              : 'border-emerald-500/40 bg-emerald-500/10 text-foreground'
          }`}>
            {renewalStrategy === 'buggy' ? (
              <p>
                <strong>The Overlap Trap:</strong> Because renewal was triggered on Day {renewalDay}, setting <code>StartDate = Today</code> bills the patient twice for Days {renewalDay} through {cycle1End}. In medical billing, this creates disputed insurance claims and regulatory compliance audit failures.
              </p>
            ) : (
              <p>
                <strong>The Architectural Invariant:</strong> In ShifaManagement, the database strictly computes: <code>new_start_date = GREATEST(current_date, previous_end_date + INTERVAL '1 day')</code>. No matter how many days in advance a nurse clicks renew, the new cycle snaps seamlessly to <strong>Day {cycle1End + 1}</strong>.
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: Invoicing Concurrency */
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border">
            <div>
              <label className="block text-xs font-mono text-secondary mb-2 uppercase">
                INVOICE GENERATION ARCHITECTURE:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInvoicingStrategy('naive_max')}
                  className={`p-2.5 text-left border rounded-xs transition-all ${
                    invoicingStrategy === 'naive_max'
                      ? 'border-red-500 bg-red-500/10 text-foreground font-semibold'
                      : 'border-border bg-surface text-secondary hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span>SELECT MAX(seq)</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <span className="text-[10px] text-muted block">Client-side increment</span>
                </button>

                <button
                  onClick={() => setInvoicingStrategy('atomic_rpc')}
                  className={`p-2.5 text-left border rounded-xs transition-all ${
                    invoicingStrategy === 'atomic_rpc'
                      ? 'border-emerald-500 bg-emerald-500/10 text-foreground font-semibold'
                      : 'border-border bg-surface text-secondary hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span>Atomic Sequence RPC</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[10px] text-muted block">FOR UPDATE Row Lock</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <button
                onClick={runInvoicingSimulation}
                disabled={isSimulatingInvoice}
                className="w-full py-2.5 px-4 bg-foreground text-page text-xs font-mono font-semibold rounded-xs hover:bg-secondary disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>SIMULATE SIMULTANEOUS INVOICING (10:14:02.100 AM)</span>
              </button>
            </div>
          </div>

          {/* Two Nurse Devices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-border bg-surface rounded-xs p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
                <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" /> NURSE FATIMA (iPad)
                </span>
                <span className="text-[10px] font-mono text-muted">Field Caregiver A</span>
              </div>
              <div className="font-mono text-xs space-y-1">
                <div className="text-muted text-[10px]">ASSIGNED INVOICE RESULT:</div>
                <div className="text-base font-bold text-foreground">
                  {invoiceResults.nurse1.invoiceNo || 'WAITING FOR TRIGGER...'}
                </div>
              </div>
            </div>

            <div className="border border-border bg-surface rounded-xs p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
                <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" /> NURSE TARIQ (Android)
                </span>
                <span className="text-[10px] font-mono text-muted">Field Caregiver B</span>
              </div>
              <div className="font-mono text-xs space-y-1">
                <div className="text-muted text-[10px]">ASSIGNED INVOICE RESULT:</div>
                <div className={`text-base font-bold ${
                  invoiceResults.nurse2.status === 'failed' ? 'text-red-500' : 'text-foreground'
                }`}>
                  {invoiceResults.nurse2.status === 'failed'
                    ? 'ERROR 500 (DUPLICATE KEY)'
                    : invoiceResults.nurse2.invoiceNo || 'WAITING FOR TRIGGER...'}
                </div>
              </div>
            </div>
          </div>

          {/* Database Log Output */}
          <div className="bg-black/95 text-emerald-400 p-4 font-mono text-xs border border-neutral-800 rounded-xs">
            <div className="text-[10px] text-neutral-400 pb-2 mb-2 border-b border-neutral-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" /> SUPABASE POSTGRESQL 15 TRANSACTION LOG
              </span>
              <span>ISOLATION: READ COMMITTED</span>
            </div>
            <div className="space-y-1 text-[11px]">
              {invoiceResults.log.length === 0 ? (
                <div className="text-neutral-500">Press "Simulate Simultaneous Invoicing" to execute.</div>
              ) : (
                invoiceResults.log.map((line, idx) => (
                  <div key={idx} className={line.includes('ERROR') || line.includes('CRITICAL') ? 'text-red-400 font-bold' : line.includes('SUCCESS') ? 'text-emerald-300 font-bold' : 'text-neutral-300'}>
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
