import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@firefly/ui/components/ui/context-menu'

import { DemoSection } from '@/components/demo-section'

export function ContextMenuDemo() {
  return (
    <DemoSection title="Default">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-24 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem>Forward</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </DemoSection>
  )
}
