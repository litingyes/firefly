import { Progress } from '@firefly/ui/components/ui/progress'

import { DemoSection } from '@/components/demo-section'

export function ProgressDemo() {
  return (
    <DemoSection title="Default">
      <Progress value={62} />
    </DemoSection>
  )
}
