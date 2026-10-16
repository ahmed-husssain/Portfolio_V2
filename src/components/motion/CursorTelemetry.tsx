import { useEffect, useRef } from 'react'

interface CursorTelemetryProps {
  className?: string
}

export default function CursorTelemetry({ className = '' }: CursorTelemetryProps) {
  const coordRef = useRef<HTMLSpanElement>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Only bind on fine pointer devices
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isFinePointer) return

    const handlePointerMove = (e: MouseEvent) => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }

      rafIdRef.current = requestAnimationFrame(() => {
        if (coordRef.current) {
          coordRef.current.textContent = `X: ${e.clientX}PX  Y: ${e.clientY}PX`
        }
      })
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-micro-caps text-muted select-none ${className}`}
      aria-label="Cursor viewport coordinate telemetry"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" aria-hidden="true" />
      <span ref={coordRef} className="tabular-nums tracking-wider text-secondary">
        X: 0PX  Y: 0PX
      </span>
    </div>
  )
}
