import { Slider } from '@firefly/ui/components/ui/slider'

import { DemoSection } from '@/components/demo-section'

export function SliderDemo() {
  return (
    <DemoSection title="Default">
      <Slider className="max-w-sm" defaultValue={[50]} max={100} step={1} />
    </DemoSection>
  )
}
