import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@firefly/ui/components/ui/input-group'
import { SearchIcon } from 'lucide-react'

import { DemoSection } from '@/components/demo-section'

export function InputGroupDemo() {
  return (
    <DemoSection title="With icon">
      <InputGroup className="max-w-sm">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search…" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>⌘K</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </DemoSection>
  )
}
