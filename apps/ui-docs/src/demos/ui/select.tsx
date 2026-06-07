import { Label } from '@firefly/ui/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@firefly/ui/components/ui/select'

import { DemoSection } from '@/components/demo-section'

export function SelectDemo() {
  return (
    <DemoSection title="Default">
      <div className="grid max-w-xs gap-2">
        <Label>Model</Label>
        <Select defaultValue="gpt-4">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="claude">Claude</SelectItem>
            <SelectItem value="gemini">Gemini</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </DemoSection>
  )
}
