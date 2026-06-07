import { Shimmer } from '@firefly/ui/components/ai-elements/shimmer'

import { DemoSection } from '@/components/demo-section'

export function ShimmerDemo() {
  return (
    <DemoSection title="Text shimmer">
      <Shimmer className="text-lg">Generating response...</Shimmer>
    </DemoSection>
  )
}
