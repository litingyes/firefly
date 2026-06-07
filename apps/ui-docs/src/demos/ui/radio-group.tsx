import { Label } from '@firefly/ui/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@firefly/ui/components/ui/radio-group'

import { DemoSection } from '@/components/demo-section'

export function RadioGroupDemo() {
  return (
    <DemoSection title="Default">
      <RadioGroup defaultValue="comfortable">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="r1" value="default" />
          <Label htmlFor="r1">Default</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="r2" value="comfortable" />
          <Label htmlFor="r2">Comfortable</Label>
        </div>
      </RadioGroup>
    </DemoSection>
  )
}
