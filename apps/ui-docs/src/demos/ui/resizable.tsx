import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@firefly/ui/components/ui/resizable'

import { DemoSection } from '@/components/demo-section'

export function ResizableDemo() {
  return (
    <DemoSection title="Horizontal">
      <ResizablePanelGroup className="max-w-md rounded-lg border" orientation="horizontal">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-32 items-center justify-center p-4 text-sm">Panel A</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-32 items-center justify-center p-4 text-sm">Panel B</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </DemoSection>
  )
}
