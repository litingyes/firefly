import { Input } from '@firefly/ui/components/ui/input'
import { Label } from '@firefly/ui/components/ui/label'

import { DemoSection } from '@/components/demo-section'

export function LabelDemo() {
  return (
    <DemoSection title="With input">
      <div className="grid max-w-sm gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Jane Doe" />
      </div>
    </DemoSection>
  )
}
