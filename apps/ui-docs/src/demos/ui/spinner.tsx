import { Spinner } from '@firefly/ui/components/ui/spinner'

import { DemoSection } from '@/components/demo-section'

export function SpinnerDemo() {
  return (
    <DemoSection title="Default">
      <Spinner className="size-6" />
    </DemoSection>
  )
}
