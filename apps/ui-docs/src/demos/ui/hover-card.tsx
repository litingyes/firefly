import { Button } from '@firefly/ui/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@firefly/ui/components/ui/hover-card'

import { DemoSection } from '@/components/demo-section'

export function HoverCardDemo() {
  return (
    <DemoSection title="Default">
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button type="button" variant="link">
              @firefly
            </Button>
          }
        />
        <HoverCardContent>
          <p className="text-sm">The Firefly UI component library.</p>
        </HoverCardContent>
      </HoverCard>
    </DemoSection>
  )
}
