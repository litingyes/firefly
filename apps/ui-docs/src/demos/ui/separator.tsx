import { Separator } from '@firefly/ui/components/ui/separator'

import { DemoSection } from '@/components/demo-section'

export function SeparatorDemo() {
  return (
    <DemoSection title="Horizontal and vertical">
      <div className="space-y-2 text-sm">
        <p>Above</p>
        <Separator />
        <p>Below</p>
      </div>
      <div className="mt-4 flex h-8 items-center gap-2 text-sm">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </DemoSection>
  )
}
