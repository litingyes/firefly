import { Toggle } from '@firefly/ui/components/ui/toggle'
import { BoldIcon } from 'lucide-react'

import { DemoSection } from '@/components/demo-section'

export function ToggleDemo() {
  return (
    <DemoSection title="Default">
      <Toggle aria-label="Toggle bold" variant="outline">
        <BoldIcon />
      </Toggle>
    </DemoSection>
  )
}
