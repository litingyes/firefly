import { Button } from '@firefly/ui/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@firefly/ui/components/ui/sidebar'
import { HomeIcon } from 'lucide-react'

import { DemoSection } from '@/components/demo-section'

export function SidebarDemo() {
  return (
    <DemoSection title="Inset layout">
      <div className="overflow-hidden rounded-lg border">
        <SidebarProvider defaultOpen>
          <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border p-2">
              <span className="font-semibold text-sm">App</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <HomeIcon />
                        <span>Home</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="flex h-12 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <span className="text-sm">Main content</span>
            </header>
            <div className="p-4">
              <Button type="button">Action</Button>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </DemoSection>
  )
}
