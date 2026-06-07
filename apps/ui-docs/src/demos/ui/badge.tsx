import { Badge } from '@firefly/ui/components/ui/badge'

import { DemoSection } from '@/components/demo-section'

export function BadgeDemo() {
  return (
    <DemoSection title="Variants">
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
    </DemoSection>
  )
}
