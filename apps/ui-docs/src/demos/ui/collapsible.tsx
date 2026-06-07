import { Button } from '@firefly/ui/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@firefly/ui/components/ui/collapsible'

import { DemoSection } from '@/components/demo-section'

export function CollapsibleDemo() {
  return (
    <DemoSection title="Default">
      <Collapsible>
        <CollapsibleTrigger
          render={
            <Button type="button" variant="outline">
              Toggle
            </Button>
          }
        />
        <CollapsibleContent className="pt-2 text-muted-foreground text-sm">
          Hidden content revealed on expand.
        </CollapsibleContent>
      </Collapsible>
    </DemoSection>
  )
}
