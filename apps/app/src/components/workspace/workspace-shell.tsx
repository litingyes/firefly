import { Badge, Button } from '@firefly/ui'
import { SettingsIcon, SparklesIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { ThemeToggle } from '@/components/workspace/theme-toggle'

interface WorkspaceShellProps {
  children: ReactNode
  connectedProviders: number
  enabledModels: number
  onOpenSettings: () => void
}

export function WorkspaceShell({
  children,
  connectedProviders,
  enabledModels,
  onOpenSettings,
}: WorkspaceShellProps) {
  const isReady = connectedProviders > 0 && enabledModels > 0

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--firefly-glow-subtle),transparent)]"
      />

      <header className="relative z-10 flex h-12 shrink-0 items-center justify-between border-b px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <SparklesIcon className="size-3.5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sm">Firefly</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Badge
            className="hidden font-normal sm:inline-flex"
            variant={isReady ? 'secondary' : 'outline'}
          >
            {isReady
              ? `${enabledModels} model${enabledModels === 1 ? '' : 's'} ready`
              : 'Setup required'}
          </Badge>
          <ThemeToggle />
          <Button
            aria-label="Open settings"
            onClick={onOpenSettings}
            size="icon"
            type="button"
            variant="ghost"
          >
            <SettingsIcon className="size-4" />
          </Button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  )
}
