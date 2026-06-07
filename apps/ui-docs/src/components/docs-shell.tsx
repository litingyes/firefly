import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@firefly/ui/components/ui/sidebar'
import { BoxesIcon, HomeIcon, PaletteIcon, SparklesIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { ThemeToggle } from '@/components/theme-toggle'
import { aiElementRegistry } from '@/registry/ai-elements'
import { uiRegistry } from '@/registry/ui'

interface DocsShellProps {
  children: ReactNode
}

function usePageTitle(): string {
  const { pathname } = useLocation()

  if (pathname === '/') return 'Overview'
  if (pathname === '/theme') return 'Theme'

  const match = pathname.match(/^\/components\/(ui|ai-elements)\/([^/]+)$/)
  if (match) {
    const [, category, name] = match
    const registry = category === 'ui' ? uiRegistry : aiElementRegistry
    return registry.find((entry) => entry.name === name)?.title ?? name
  }

  return 'Firefly UI'
}

function navClassName({ isActive }: { isActive: boolean }) {
  return isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
}

export function DocsShell({ children }: DocsShellProps) {
  const pageTitle = usePageTitle()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <SparklesIcon className="size-4" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate font-semibold text-sm">Firefly UI</p>
              <p className="truncate text-muted-foreground text-xs">Component docs</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pageTitle === 'Overview'}
                    render={
                      <NavLink className={navClassName} to="/">
                        <HomeIcon />
                        <span>Overview</span>
                      </NavLink>
                    }
                    tooltip="Overview"
                  />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pageTitle === 'Theme'}
                    render={
                      <NavLink className={navClassName} to="/theme">
                        <PaletteIcon />
                        <span>Theme</span>
                      </NavLink>
                    }
                    tooltip="Theme"
                  />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              <BoxesIcon className="size-3.5" />
              UI Components
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {uiRegistry.map((entry) => (
                  <SidebarMenuItem key={entry.name}>
                    <SidebarMenuButton
                      isActive={pageTitle === entry.title}
                      render={
                        <NavLink className={navClassName} to={`/components/ui/${entry.name}`}>
                          <span className="truncate">{entry.title}</span>
                        </NavLink>
                      }
                      tooltip={entry.title}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              <SparklesIcon className="size-3.5" />
              AI Elements
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {aiElementRegistry.map((entry) => (
                  <SidebarMenuItem key={entry.name}>
                    <SidebarMenuButton
                      isActive={pageTitle === entry.title}
                      render={
                        <NavLink
                          className={navClassName}
                          to={`/components/ai-elements/${entry.name}`}
                        >
                          <span className="truncate">{entry.title}</span>
                        </NavLink>
                      }
                      tooltip={entry.title}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <p className="px-2 text-muted-foreground text-xs group-data-[collapsible=icon]:hidden">
            {uiRegistry.length} UI · {aiElementRegistry.length} AI elements
          </p>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <span className="font-medium text-sm">{pageTitle}</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
