import { Button } from '@firefly/ui/components/ui/button'
import { DirectionProvider } from '@firefly/ui/components/ui/direction'

import { DemoSection } from '@/components/demo-section'

export function DirectionDemo() {
  return (
    <DemoSection title="RTL layout">
      <DirectionProvider direction="rtl">
        <div className="flex gap-2">
          <Button type="button">First</Button>
          <Button type="button" variant="outline">
            Second
          </Button>
        </div>
      </DirectionProvider>
    </DemoSection>
  )
}
