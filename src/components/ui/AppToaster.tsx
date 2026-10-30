import { Toaster as Sonner } from 'sonner'
import 'sonner/dist/styles.css'
import { useTheme } from '../../lib/theme'

export default function AppToaster() {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      position="bottom-center"
      duration={2600}
      gap={8}
      offset={24}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-surface group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border-strong group-[.toaster]:shadow-2xl group-[.toaster]:rounded-sm group-[.toaster]:p-3.5 pixel-corners text-xs font-mono',
          title: 'group-[.toast]:font-semibold group-[.toast]:text-foreground text-xs',
          description: 'group-[.toast]:text-secondary text-[11px] font-sans mt-0.5',
        },
      }}
    />
  )
}
