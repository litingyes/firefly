import { Label } from '@firefly/ui/components/ui/label'
import { Textarea } from '@firefly/ui/components/ui/textarea'

import { DemoSection } from '@/components/demo-section'

export function TextareaDemo() {
  return (
    <DemoSection title="Default">
      <div className="grid max-w-md gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Write a short note..." rows={4} />
      </div>
    </DemoSection>
  )
}
