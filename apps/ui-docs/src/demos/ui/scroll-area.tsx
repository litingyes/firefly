import { ScrollArea } from '@firefly/ui/components/ui/scroll-area'

import { DemoSection } from '@/components/demo-section'

export function ScrollAreaDemo() {
  return (
    <DemoSection title="Vertical">
      <ScrollArea className="h-32 w-48 rounded-lg border p-4">
        <div className="space-y-2 text-sm">
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i}>Scrollable line {i + 1}</p>
          ))}
        </div>
      </ScrollArea>
    </DemoSection>
  )
}
