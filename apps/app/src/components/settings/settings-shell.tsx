import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@firefly/ui'
import { ArrowLeftIcon, LayersIcon, SparklesIcon, WaypointsIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type SettingsPageId = 'providers' | 'scenes'

interface SettingsShellProps {
  activePage: SettingsPageId
  children: ReactNode
  connectedProviders: number
  enabledModels: number
  onBackToWorkspace: () => void
  onNavigate: (page: SettingsPageId) => void
}

const PAGE_LABELS: Record<SettingsPageId, string> = {
  providers: 'Providers',
  scenes: 'Scenes',
}

export function SettingsShell({
  activePage,
  children,
  connectedProviders,
  enabledModels,
  onBackToWorkspace,
  onNavigate,
}: SettingsShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <SparklesIcon className="size-4" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate font-semibold text-sm">Firefly</p>
              <p className="truncate text-muted-foreground text-xs">AI workspace</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="sm:hidden">
                  <SidebarMenuButton onClick={onBackToWorkspace} tooltip="Back to chat">
                    <ArrowLeftIcon />
                    <span>Back to chat</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    aria-current={activePage === 'providers' ? 'page' : undefined}
                    isActive={activePage === 'providers'}
                    onClick={() => onNavigate('providers')}
                    tooltip="Providers"
                  >
                    <WaypointsIcon />
                    <span>Providers</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    aria-current={activePage === 'scenes' ? 'page' : undefined}
                    isActive={activePage === 'scenes'}
                    onClick={() => onNavigate('scenes')}
                    tooltip="Scenes"
                  >
                    <LayersIcon />
                    <span>Scenes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <p className="px-2 text-muted-foreground text-xs group-data-[collapsible=icon]:hidden">
            {connectedProviders === 0
              ? 'No providers connected'
              : `${connectedProviders} provider${connectedProviders === 1 ? '' : 's'} connected`}
            {enabledModels > 0
              ? ` · ${enabledModels} model${enabledModels === 1 ? '' : 's'} enabled`
              : ''}
          </p>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Button
            className="hidden sm:inline-flex"
            onClick={onBackToWorkspace}
            size="sm"
            type="button"
            variant="ghost"
          >
            <ArrowLeftIcon className="size-4" />
            Back to chat
          </Button>
          <span className="text-muted-foreground text-sm">{PAGE_LABELS[activePage]}</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
