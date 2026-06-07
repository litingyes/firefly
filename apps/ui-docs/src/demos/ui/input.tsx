import { Input } from '@firefly/ui/components/ui/input'
import { Label } from '@firefly/ui/components/ui/label'

import { DemoSection } from '@/components/demo-section'

export function InputDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Default">
        <div className="grid max-w-sm gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="you@example.com" type="email" />
        </div>
      </DemoSection>

      <DemoSection title="Disabled">
        <Input disabled placeholder="Disabled" />
      </DemoSection>

      <DemoSection title="Invalid">
        <Input aria-invalid placeholder="Invalid state" />
      </DemoSection>
    </div>
  )
}
