import { Badge } from '@firefly/ui/components/ui/badge'
import { Button } from '@firefly/ui/components/ui/button'
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
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
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
            className="gap-1.5 px-2"
            onClick={onOpenSettings}
            size="sm"
            type="button"
            variant="ghost"
          >
            <SettingsIcon className="size-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}
