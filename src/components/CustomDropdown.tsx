import { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface CustomDropdownProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  id?: string
  helperText?: string
}

export default function CustomDropdown({
  label,
  options,
  value,
  onChange,
  disabled = false,
  id,
  helperText,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const generatedId = useId()
  const componentId = id || generatedId

  const selectedIndex = options.indexOf(value)

  // Sync highlighted index with current value when opened
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    }
  }, [isOpen, selectedIndex])

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
      document.addEventListener('touchstart', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < options.length) {
          onChange(options[highlightedIndex])
          setIsOpen(false)
        } else {
          setIsOpen(true)
        }
        break

      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
        }
        break

      case 'Escape':
        if (isOpen) {
          e.preventDefault()
          setIsOpen(false)
        }
        break

      case 'Tab':
        setIsOpen(false)
        break

      default:
        break
    }
  }

  // Scroll active item into view when keyboard navigating
  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const activeEl = listboxRef.current.children[highlightedIndex] as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        id={`${componentId}-label`}
        htmlFor={`${componentId}-btn`}
        className="block text-xs font-mono text-foreground font-medium uppercase tracking-wider mb-2"
      >
        {label}
      </label>

      {/* Trigger Button */}
      <button
        id={`${componentId}-btn`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${componentId}-label ${componentId}-btn`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full min-h-[44px] px-3.5 py-2.5 bg-page border text-xs sm:text-sm font-mono text-foreground rounded-sm transition-all duration-150 flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen
            ? 'border-foreground ring-1 ring-foreground/20'
            : 'border-border hover:border-border-strong'
        }`}
      >
        <span className="truncate">{value || 'Select an option'}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-foreground' : 'group-hover:text-foreground'
          }`}
          aria-hidden="true"
        />
      </button>

      {helperText && (
        <p className="mt-1 text-[11px] font-mono text-muted">{helperText}</p>
      )}

      {/* Options Listbox */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={`${componentId}-listbox`}
          role="listbox"
          aria-labelledby={`${componentId}-label`}
          className="absolute left-0 right-0 z-40 mt-1.5 max-h-60 overflow-y-auto border border-border bg-surface shadow-lg rounded-sm py-1 focus:outline-none animate-page-in divide-y divide-border/30"
          tabIndex={-1}
        >
          {options.map((option, idx) => {
            const isSelected = option === value
            const isHighlighted = idx === highlightedIndex

            return (
              <li
                key={option}
                id={`${componentId}-opt-${idx}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`w-full min-h-[42px] px-3.5 py-2.5 text-xs sm:text-sm font-mono cursor-pointer flex items-center justify-between gap-3 transition-colors text-left ${
                  isSelected
                    ? 'text-foreground font-semibold bg-surface-hover/80'
                    : isHighlighted
                    ? 'text-foreground bg-surface-hover/40'
                    : 'text-secondary hover:text-foreground hover:bg-surface-hover/30'
                }`}
              >
                <span className="truncate">{option}</span>
                {isSelected && (
                  <Check
                    className="w-3.5 h-3.5 text-foreground shrink-0"
                    aria-hidden="true"
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
