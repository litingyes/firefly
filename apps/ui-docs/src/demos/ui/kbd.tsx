import { Kbd, KbdGroup } from '@firefly/ui/components/ui/kbd'

import { DemoSection } from '@/components/demo-section'

export function KbdDemo() {
  return (
    <DemoSection title="Shortcuts">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </DemoSection>
  )
}
