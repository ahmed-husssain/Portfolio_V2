import { Link } from 'react-router-dom'
import { ArrowLeft } from 'pixelarticons/react'
import { sound } from '../../lib/sound/soundEngine'

interface BackLinkProps {
  to: string
  label: string
  className?: string
}

export default function BackLink({ to, label, className = 'mb-6 sm:mb-8' }: BackLinkProps) {
  return (
    <div className={className}>
      <Link
        to={to}
        onClick={() => sound.playTap()}
        className="inline-flex items-center gap-2 text-xs font-mono font-medium text-secondary hover:text-foreground active:translate-x-[-2px] transition-[color,transform] duration-100 ease-out group select-none"
      >
        <ArrowLeft className="w-3.5 h-3.5 pixel-icon transition-transform group-hover:-translate-x-1" aria-hidden="true" />
        <span>{label}</span>
      </Link>
    </div>
  )
}
