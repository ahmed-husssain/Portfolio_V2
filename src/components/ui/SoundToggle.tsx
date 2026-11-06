import { useState, useEffect } from 'react'
import { Volume, VolumeX } from 'pixelarticons/react'
import { sound } from '../../lib/sound/soundEngine'

interface SoundToggleProps {
  className?: string
  showLabel?: boolean
}

export default function SoundToggle({ className = '', showLabel = false }: SoundToggleProps) {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setEnabled(sound.isEnabled())
  }, [])

  const handleToggle = () => {
    const nextState = sound.toggle()
    setEnabled(nextState)
  }

  if (showLabel) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={enabled ? 'Mute tactile audio' : 'Unmute tactile audio'}
        title={enabled ? 'Tactile Audio: ON (Click to mute)' : 'Tactile Audio: OFF (Click to unmute)'}
        className={`group inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono rounded-xs border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-hover hover:border-border-strong active:scale-95 transition-all duration-150 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none cursor-pointer ${className}`}
      >
        {enabled ? (
          <>
            <Volume className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 pixel-icon" aria-hidden="true" />
            <span>SFX: ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-muted pixel-icon" aria-hidden="true" />
            <span className="text-muted">SFX: OFF</span>
          </>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={enabled ? 'Mute tactile audio' : 'Unmute tactile audio'}
      title={enabled ? 'Tactile Audio: ON (Click to mute)' : 'Tactile Audio: OFF (Click to unmute)'}
      className={`group w-8 h-8 flex items-center justify-center rounded-xs border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-hover hover:border-border-strong active:scale-95 transition-all duration-150 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none cursor-pointer ${className}`}
    >
      {enabled ? (
        <Volume className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 pixel-icon transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-muted pixel-icon transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      )}
      <span className="sr-only">
        {enabled ? 'Mute tactile audio' : 'Unmute tactile audio'}
      </span>
    </button>
  )
}
