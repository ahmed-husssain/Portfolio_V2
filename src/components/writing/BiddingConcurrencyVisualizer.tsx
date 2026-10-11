import { useState, useEffect, useRef } from 'react'
import { Play, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, Cpu, Zap, Radio, Database } from 'lucide-react'

type ConcurrencyMode = 'naive' | 'pessimistic' | 'occ'

interface PacketLog {
  id: string
  timestamp: string
  sender: string
  action: string
  status: 'info' | 'success' | 'error' | 'warning'
}

export default function BiddingConcurrencyVisualizer() {
  const [mode, setMode] = useState<ConcurrencyMode>('occ')
  const [latencyMs, setLatencyMs] = useState<number>(45)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  
  // Database State
  const [dbPrice, setDbPrice] = useState<number>(250)
  const [rowVersion, setRowVersion] = useState<string>('0x00000000000007D1')
  const [highestBidder, setHighestBidder] = useState<string>('Initial Seller')
  
  // Bidder Clients State
  const [bidder1Status, setBidder1Status] = useState<'idle' | 'submitting' | 'success' | 'rejected'>('idle')
  const [bidder2Status, setBidder2Status] = useState<'idle' | 'submitting' | 'success' | 'rejected'>('idle')
  
  // Logs
  const [logs, setLogs] = useState<PacketLog[]>([])
  const logContainerRef = useRef<HTMLDivElement>(null)

  const resetSimulation = () => {
    setIsRunning(false)
    setDbPrice(250)
    setRowVersion('0x00000000000007D1')
    setHighestBidder('Initial Seller')
    setBidder1Status('idle')
    setBidder2Status('idle')
    setLogs([
      {
        id: 'init-1',
        timestamp: '00:00.000',
        sender: 'SYSTEM',
        action: 'Auction item "Vintage Oil Painting" initialized. Current Price: $250.00',
        status: 'info',
      },
    ])
  }

  useEffect(() => {
    resetSimulation()
  }, [mode])

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  const addLog = (sender: string, action: string, status: PacketLog['status']) => {
    const now = new Date()
    const ms = String(now.getMilliseconds()).padStart(3, '0')
    const timeStr = `${String(now.getSeconds()).padStart(2, '0')}.${ms}s`
    setLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        sender,
        action,
        status,
      },
    ])
  }

  const triggerSimulation = async () => {
    if (isRunning) return
    setIsRunning(true)
    setBidder1Status('submitting')
    setBidder2Status('submitting')

    addLog('BIDDER 1', 'Submitting Bid: $260.00 (Read Version: 0x00000000000007D1)', 'info')
    addLog('BIDDER 2', 'Submitting Bid: $270.00 (Read Version: 0x00000000000007D1)', 'info')

    // Simulate Network Latency
    await new Promise((res) => setTimeout(res, latencyMs))

    if (mode === 'naive') {
      // NAIVE RACE CONDITION:
      // Both queries execute independently without version check
      addLog('SQL SERVER', 'Executing: UPDATE Products SET Price = 260 WHERE Id = 1', 'info')
      setDbPrice(260)
      setHighestBidder('Bidder 1 (Karachi)')
      setBidder1Status('success')

      await new Promise((res) => setTimeout(res, 30))

      addLog('SQL SERVER', 'Executing: UPDATE Products SET Price = 270 WHERE Id = 1', 'warning')
      setDbPrice(270)
      setHighestBidder('Bidder 2 (London)')
      setBidder2Status('success')

      addLog('DATA INTEGRITY ALERT', 'CRITICAL FLAW: Bidder 1 was silently overwritten without outbid event notification or escrow recalculation!', 'error')
      setIsRunning(false)
      return
    }

    if (mode === 'pessimistic') {
      // PESSIMISTIC LOCK:
      // Row lock held with UPDLOCK, blocking Bidder 2
      addLog('SQL SERVER', 'SELECT ... WITH (UPDLOCK, ROWLOCK) acquired exclusively by Bidder 1', 'warning')
      addLog('SQL SERVER', 'Bidder 2 request queued: Thread BLOCKED waiting for lock release', 'warning')

      await new Promise((res) => setTimeout(res, 120))

      setDbPrice(260)
      setHighestBidder('Bidder 1 (Karachi)')
      setBidder1Status('success')
      addLog('SQL SERVER', 'Bidder 1 committed. Lock released.', 'info')

      await new Promise((res) => setTimeout(res, 80))

      addLog('SQL SERVER', 'Bidder 2 unblocked: Validates price. New price is $260 >= $270 bid.', 'info')
      setDbPrice(270)
      setHighestBidder('Bidder 2 (London)')
      setBidder2Status('success')
      addLog('PERFORMANCE METRIC', 'Total latency: 280ms. High connection pool starvation risk under concurrent load.', 'warning')
      setIsRunning(false)
      return
    }

    if (mode === 'occ') {
      // OPTIMISTIC CONCURRENCY CONTROL (Ahmed's Gallrex implementation):
      // RowVersion check at 0.01ms
      addLog('SQL SERVER', 'UPDATE Products SET Price = 260, RowVersion = ++ WHERE Id = 1 AND RowVersion = 0x...7D1', 'info')
      
      // Bidder 1 arrives 2ms earlier and succeeds
      setDbPrice(260)
      setRowVersion('0x00000000000007D2')
      setHighestBidder('Bidder 1 (Karachi)')
      setBidder1Status('success')
      addLog('SQL SERVER', 'Rows Affected: 1. RowVersion bumped to 0x00000000000007D2 in 0.01ms.', 'success')

      // Microsecond delay
      await new Promise((res) => setTimeout(res, 25))

      // Bidder 2 tries with stale RowVersion 0x...7D1
      addLog('SQL SERVER', 'UPDATE Products SET Price = 270 WHERE Id = 1 AND RowVersion = 0x...7D1 -> Rows Affected: 0', 'error')
      addLog('EF CORE 8', 'DbUpdateConcurrencyException caught cleanly! Zero table deadlocks.', 'warning')
      setBidder2Status('rejected')

      // SignalR Push
      addLog('SIGNALR HUB', 'Multicasting real-time AuctionUpdated($260.00) to room auction-painting in 8ms.', 'success')
      addLog('CLIENT ADAPTATION', 'Bidder 2 UI smoothly informs: "New high bid is $260. Place your counter-bid."', 'info')
      setIsRunning(false)
    }
  }

  return (
    <div className="my-8 border border-border bg-page rounded-sm overflow-hidden font-sans not-prose shadow-sm">
      {/* Visualizer Top Bar */}
      <div className="bg-surface px-4 sm:px-6 py-3.5 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
            LIVE DEMONSTRATION // CONCURRENCY COLLISION SIMULATOR
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted bg-surface-subtle px-2 py-0.5 border border-border rounded-xs">
          GALLREX .NET 8 / EF CORE / SQL SERVER
        </span>
      </div>

      {/* Control Strategy Tabs */}
      <div className="p-4 sm:p-6 bg-surface-subtle border-b border-border">
        <p className="text-xs font-mono text-secondary mb-3 uppercase tracking-wider">
          SELECT CONCURRENCY STRATEGY TO TEST:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => setMode('naive')}
            disabled={isRunning}
            className={`p-3 text-left border rounded-xs transition-all ${
              mode === 'naive'
                ? 'border-red-500 bg-red-500/10 text-foreground font-medium shadow-2xs'
                : 'border-border bg-surface text-secondary hover:text-foreground hover:border-border-strong'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-bold">1. Naive Overwrite</span>
              <AlertTriangle className={`w-3.5 h-3.5 ${mode === 'naive' ? 'text-red-500' : 'text-muted'}`} />
            </div>
            <p className="text-[11px] text-muted leading-snug">No locks or version tokens. Causes silent lost bids.</p>
          </button>

          <button
            onClick={() => setMode('pessimistic')}
            disabled={isRunning}
            className={`p-3 text-left border rounded-xs transition-all ${
              mode === 'pessimistic'
                ? 'border-amber-500 bg-amber-500/10 text-foreground font-medium shadow-2xs'
                : 'border-border bg-surface text-secondary hover:text-foreground hover:border-border-strong'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-bold">2. Pessimistic Lock</span>
              <ShieldAlert className={`w-3.5 h-3.5 ${mode === 'pessimistic' ? 'text-amber-500' : 'text-muted'}`} />
            </div>
            <p className="text-[11px] text-muted leading-snug">UPDLOCK table locks. Blocks threads; causes lag.</p>
          </button>

          <button
            onClick={() => setMode('occ')}
            disabled={isRunning}
            className={`p-3 text-left border rounded-xs transition-all ${
              mode === 'occ'
                ? 'border-emerald-500 bg-emerald-500/10 text-foreground font-medium shadow-2xs'
                : 'border-border bg-surface text-secondary hover:text-foreground hover:border-border-strong'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-bold">3. OCC (Ahmed's Solution)</span>
              <CheckCircle2 className={`w-3.5 h-3.5 ${mode === 'occ' ? 'text-emerald-500' : 'text-muted'}`} />
            </div>
            <p className="text-[11px] text-muted leading-snug">8-byte RowVersion token + SignalR WebSocket broadcast.</p>
          </button>
        </div>
      </div>

      {/* Visual Arena: Bidder 1 | SQL Server Engine | Bidder 2 */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Client 1 */}
        <div className="border border-border bg-surface rounded-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
              <span className="text-xs font-mono font-bold text-foreground">BIDDER A (Karachi)</span>
              <span className="text-[10px] font-mono text-muted">Client #1</span>
            </div>
            <p className="text-xs text-secondary mb-2">Intent: Bid $260.00</p>
            <div className="bg-page border border-border p-2.5 rounded-xs font-mono text-xs space-y-1">
              <div className="text-muted text-[10px]">READ STATE:</div>
              <div className="text-foreground">$250.00</div>
              <div className="text-[10px] text-muted">TOKEN: 0x...7D1</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] font-mono text-muted">STATUS:</span>
            {bidder1Status === 'idle' && <span className="text-[11px] font-mono text-muted">READY</span>}
            {bidder1Status === 'submitting' && (
              <span className="text-[11px] font-mono text-amber-500 animate-pulse flex items-center gap-1">
                <Radio className="w-3 h-3 animate-spin" /> DISPATCHING
              </span>
            )}
            {bidder1Status === 'success' && (
              <span className="text-[11px] font-mono text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACCEPTED ($260)
              </span>
            )}
          </div>
        </div>

        {/* Central Database Kernel */}
        <div className="border-2 border-border bg-surface-subtle rounded-xs p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-blue-500" />
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-foreground" /> SQL SERVER
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-2xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                PORT 1433
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-surface border border-border rounded-xs">
                <div className="text-[10px] text-muted">CURRENT STORED PRICE:</div>
                <div className="text-xl font-bold text-foreground tracking-tight">${dbPrice}.00</div>
              </div>

              <div className="p-2.5 bg-surface border border-border rounded-xs">
                <div className="text-[10px] text-muted">HIGH BIDDER RECORD:</div>
                <div className="text-xs font-semibold text-foreground truncate">{highestBidder}</div>
              </div>

              <div className="p-2 bg-surface border border-border rounded-xs text-[11px]">
                <span className="text-muted text-[10px] block">ROWVERSION TOKEN:</span>
                <span className="text-emerald-500 font-bold">{rowVersion}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border text-[11px] font-mono text-center text-muted">
            OCC Overhead: <span className="text-foreground font-semibold">0.01ms</span> per row
          </div>
        </div>

        {/* Client 2 */}
        <div className="border border-border bg-surface rounded-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
              <span className="text-xs font-mono font-bold text-foreground">BIDDER B (London)</span>
              <span className="text-[10px] font-mono text-muted">Client #2</span>
            </div>
            <p className="text-xs text-secondary mb-2">Intent: Bid $270.00</p>
            <div className="bg-page border border-border p-2.5 rounded-xs font-mono text-xs space-y-1">
              <div className="text-muted text-[10px]">READ STATE:</div>
              <div className="text-foreground">$250.00</div>
              <div className="text-[10px] text-muted">TOKEN: 0x...7D1</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] font-mono text-muted">STATUS:</span>
            {bidder2Status === 'idle' && <span className="text-[11px] font-mono text-muted">READY</span>}
            {bidder2Status === 'submitting' && (
              <span className="text-[11px] font-mono text-amber-500 animate-pulse flex items-center gap-1">
                <Radio className="w-3 h-3 animate-spin" /> DISPATCHING
              </span>
            )}
            {bidder2Status === 'success' && (
              <span className="text-[11px] font-mono text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> OVERWROTE ($270)
              </span>
            )}
            {bidder2Status === 'rejected' && (
              <span className="text-[11px] font-mono text-red-500 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> REJECTED (STALE)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Controls & Latency Slider */}
      <div className="px-4 sm:px-6 py-4 bg-surface border-t border-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={triggerSimulation}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-page text-xs font-mono font-semibold rounded-xs hover:bg-secondary disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>TRIGGER SIMULTANEOUS CLICK (t=0.00ms)</span>
          </button>

          <button
            onClick={resetSimulation}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-mono text-secondary hover:text-foreground rounded-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted">Network Jitter:</span>
          <input
            type="range"
            min="10"
            max="250"
            step="10"
            value={latencyMs}
            onChange={(e) => setLatencyMs(Number(e.target.value))}
            className="w-24 sm:w-32 accent-foreground cursor-pointer"
          />
          <span className="text-xs font-mono text-foreground font-semibold w-12">{latencyMs}ms</span>
        </div>
      </div>

      {/* Packet Stream Console Log */}
      <div className="bg-black/95 text-emerald-400 p-4 font-mono text-xs border-t border-border">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-neutral-400 text-[10px]">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-emerald-400" /> KERNEL PACKET STREAM & TRANSACTION LOG
          </span>
          <span>{logs.length} EVENTS</span>
        </div>
        <div ref={logContainerRef} className="h-32 overflow-y-auto space-y-1.5 pr-2 select-text text-[11px]">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-neutral-500 shrink-0 font-mono">[{log.timestamp}]</span>
              <span className={`shrink-0 font-bold ${
                log.status === 'error' ? 'text-red-400' :
                log.status === 'warning' ? 'text-amber-300' :
                log.status === 'success' ? 'text-emerald-300' : 'text-neutral-400'
              }`}>
                {log.sender}:
              </span>
              <span className={
                log.status === 'error' ? 'text-red-300 font-semibold' :
                log.status === 'warning' ? 'text-amber-200' :
                log.status === 'success' ? 'text-emerald-200' : 'text-neutral-200'
              }>
                {log.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
