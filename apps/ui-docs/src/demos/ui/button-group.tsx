import { Button } from '@firefly/ui/components/ui/button'
import { ButtonGroup, ButtonGroupText } from '@firefly/ui/components/ui/button-group'

import { DemoSection } from '@/components/demo-section'

export function ButtonGroupDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Horizontal">
        <ButtonGroup>
          <Button type="button" variant="outline">
            Left
          </Button>
          <Button type="button" variant="outline">
            Center
          </Button>
          <Button type="button" variant="outline">
            Right
          </Button>
        </ButtonGroup>
      </DemoSection>
      <DemoSection title="With text addon">
        <ButtonGroup>
          <ButtonGroupText>https://</ButtonGroupText>
          <Button type="button" variant="outline">
            Copy
          </Button>
        </ButtonGroup>
      </DemoSection>
    </div>
  )
}
