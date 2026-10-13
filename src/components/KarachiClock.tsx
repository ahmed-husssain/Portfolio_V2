import { useState, useEffect } from 'react'

interface KarachiClockProps {
  showIcon?: boolean
  className?: string
  format?: 'full' | 'compact'
}

export default function KarachiClock({
  showIcon = true,
  className = '',
  format = 'full',
}: KarachiClockProps) {
  const [time, setTime] = useState<{ hours: number; minutes: number; seconds: number; formatted: string }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    formatted: '--:--',
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Karachi is UTC+5 (Asia/Karachi)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }
      const formatter = new Intl.DateTimeFormat('en-GB', options)
      const formatted = formatter.format(now)

      // Get exact hours and minutes in Karachi for analog clock hands
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Karachi',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }).formatToParts(now)

      let h = now.getUTCHours() + 5
      let m = now.getUTCMinutes()
      let s = now.getUTCSeconds()

      for (const part of parts) {
        if (part.type === 'hour') h = parseInt(part.value, 10)
        if (part.type === 'minute') m = parseInt(part.value, 10)
        if (part.type === 'second') s = parseInt(part.value, 10)
      }

      setTime({ hours: h % 12, minutes: m, seconds: s, formatted })
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const minuteDeg = (time.minutes + time.seconds / 60) * 6
  const hourDeg = (time.hours + time.minutes / 60) * 30

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-micro-caps text-muted select-none ${className}`}
      title="Karachi Local Time (PKT, UTC+5)"
      aria-label={`Current local time in Karachi, Pakistan is ${time.formatted} PKT`}
    >
      {showIcon && (
        <svg
          className="w-3.5 h-3.5 text-muted shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          {/* Clock face */}
          <circle cx="8" cy="8" r="6.5" className="stroke-border-strong" />
          {/* Center pin */}
          <circle cx="8" cy="8" r="0.8" fill="currentColor" />
          {/* Hour hand */}
          <line
            x1="8"
            y1="8"
            x2="8"
            y2="4.5"
            stroke="currentColor"
            strokeLinecap="round"
            transform={`rotate(${hourDeg} 8 8)`}
          />
          {/* Minute hand */}
          <line
            x1="8"
            y1="8"
            x2="8"
            y2="3"
            stroke="currentColor"
            strokeLinecap="round"
            transform={`rotate(${minuteDeg} 8 8)`}
          />
        </svg>
      )}
      <span className="tabular-nums font-mono text-secondary">
        {format === 'full' ? `Local time ${time.formatted} PKT` : `${time.formatted} PKT`}
      </span>
    </div>
  )
}
