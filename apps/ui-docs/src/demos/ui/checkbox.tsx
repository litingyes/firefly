import { Checkbox } from '@firefly/ui/components/ui/checkbox'
import { Label } from '@firefly/ui/components/ui/label'

import { DemoSection } from '@/components/demo-section'

export function CheckboxDemo() {
  return (
    <DemoSection title="States">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Checkbox defaultChecked id="terms" />
          <Label htmlFor="terms">Accept terms</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox disabled id="disabled" />
          <Label htmlFor="disabled">Disabled</Label>
        </div>
      </div>
    </DemoSection>
  )
}
