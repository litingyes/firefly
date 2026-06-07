import { ToggleGroup, ToggleGroupItem } from '@firefly/ui/components/ui/toggle-group'
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react'

import { DemoSection } from '@/components/demo-section'

export function ToggleGroupDemo() {
  return (
    <DemoSection title="Single">
      <ToggleGroup defaultValue={['left']} variant="outline">
        <ToggleGroupItem aria-label="Align left" value="left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align center" value="center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align right" value="right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </DemoSection>
  )
}
