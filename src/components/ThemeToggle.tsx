import { Sun, Moon } from 'pixelarticons/react'
import { useTheme } from '../lib/theme'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group w-8 h-8 flex items-center justify-center rounded-xs border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-hover hover:border-border-strong active:scale-95 transition-all duration-150 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 animate-icon-swap transition-transform duration-200 group-hover:rotate-12" aria-hidden="true" />
      ) : (
        <Moon className="w-3.5 h-3.5 animate-icon-swap transition-transform duration-200 group-hover:-rotate-12" aria-hidden="true" />
      )}
      <span className="sr-only">
        {isDark ? 'Toggle light mode' : 'Toggle dark mode'}
      </span>
    </button>
  )
}
