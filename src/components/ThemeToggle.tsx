import { Sun, Moon } from 'lucide-react'
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
      className={`group inline-flex items-center justify-center p-2 rounded-sm border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-hover hover:border-border-strong active:scale-95 transition-all duration-150 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-12" aria-hidden="true" />
      )}
      <span className="sr-only">
        {isDark ? 'Toggle light mode' : 'Toggle dark mode'}
      </span>
    </button>
  )
}
