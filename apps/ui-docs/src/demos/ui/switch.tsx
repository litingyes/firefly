import { Label } from '@firefly/ui/components/ui/label'
import { Switch } from '@firefly/ui/components/ui/switch'

import { DemoSection } from '@/components/demo-section'

export function SwitchDemo() {
  return (
    <DemoSection title="Default">
      <div className="flex items-center gap-2">
        <Switch defaultChecked id="airplane" />
        <Label htmlFor="airplane">Airplane mode</Label>
      </div>
    </DemoSection>
  )
}
