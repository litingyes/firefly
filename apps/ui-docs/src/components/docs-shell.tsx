import { Button } from '@firefly/ui/components/ui/button'
import { Kbd } from '@firefly/ui/components/ui/kbd'
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
import { BoxesIcon, HomeIcon, PaletteIcon, SearchIcon, SparklesIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { DocsCommandPalette, useDocsCommandPalette } from '@/components/docs-command-palette'
import { DocsSearchProvider } from '@/components/docs-search-context'
import { ThemeToggle } from '@/components/theme-toggle'
import { useDocsDelight } from '@/hooks/use-docs-delight'
import { docsType } from '@/lib/docs-type'
import { AI_ELEMENT_GROUPS } from '@/registry/ai-element-groups'
import { aiElementRegistry } from '@/registry/ai-elements'
import { uiRegistry } from '@/registry/ui'
import { UI_COMPONENT_GROUPS } from '@/registry/ui-component-groups'

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
  return isActive ? 'docs-nav-active' : 'hover:text-primary/80'
}

export function DocsShell({ children }: DocsShellProps) {
  const pageTitle = usePageTitle()
  const { open, setOpen } = useDocsCommandPalette()
  useDocsDelight()

  return (
    <DocsSearchProvider openSearch={() => setOpen(true)}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <div className="docs-brand-interactive docs-brand-mark flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <SparklesIcon className="docs-brand-icon size-4" />
              </div>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className={`${docsType.sectionTitle} truncate`}>Firefly UI</p>
                <p className={`${docsType.meta} truncate text-muted-foreground`}>Component docs</p>
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

            {UI_COMPONENT_GROUPS.map((group) => {
              const entries = uiRegistry.filter((entry) => group.items.includes(entry.name))
              if (entries.length === 0) return null

              return (
                <SidebarGroup key={group.id}>
                  <SidebarGroupLabel className="text-primary/90">
                    <BoxesIcon className="size-3.5 text-primary" />
                    {group.label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {entries.map((entry) => (
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
              )
            })}

            {AI_ELEMENT_GROUPS.map((group) => {
              const entries = aiElementRegistry.filter((entry) => group.items.includes(entry.name))
              if (entries.length === 0) return null

              return (
                <SidebarGroup key={group.id}>
                  <SidebarGroupLabel className="text-primary/90">
                    <SparklesIcon className="size-3.5 text-primary" />
                    {group.label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {entries.map((entry) => (
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
              )
            })}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <p
              className={`${docsType.meta} px-2 text-muted-foreground group-data-[collapsible=icon]:hidden`}
            >
              <span className="text-primary">{uiRegistry.length}</span> UI ·{' '}
              <span className="text-primary">{aiElementRegistry.length}</span> AI elements
            </p>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="docs-shell-header flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <span className={docsType.shellTitle}>{pageTitle}</span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                className="hidden h-8 gap-2 text-muted-foreground hover:border-primary/35 hover:text-primary sm:inline-flex"
                onClick={() => setOpen(true)}
                size="sm"
                type="button"
                variant="outline"
              >
                <SearchIcon className="size-3.5" />
                <span>Search</span>
                <Kbd>⌘K</Kbd>
              </Button>
              <Button
                aria-label="Search components"
                className="hover:border-primary/35 hover:text-primary sm:hidden"
                onClick={() => setOpen(true)}
                size="icon"
                type="button"
                variant="outline"
              >
                <SearchIcon className="size-4" />
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </SidebarInset>

        <DocsCommandPalette onOpenChange={setOpen} open={open} />
      </SidebarProvider>
    </DocsSearchProvider>
  )
}
