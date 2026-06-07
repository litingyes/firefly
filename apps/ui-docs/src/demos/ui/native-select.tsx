import { Label } from '@firefly/ui/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@firefly/ui/components/ui/native-select'

import { DemoSection } from '@/components/demo-section'

export function NativeSelectDemo() {
  return (
    <DemoSection title="Default">
      <div className="grid max-w-xs gap-2">
        <Label htmlFor="fruit">Fruit</Label>
        <NativeSelect defaultValue="apple" id="fruit">
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="orange">Orange</NativeSelectOption>
        </NativeSelect>
      </div>
    </DemoSection>
  )
}
