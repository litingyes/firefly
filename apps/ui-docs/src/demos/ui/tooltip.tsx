import { Button } from '@firefly/ui/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@firefly/ui/components/ui/tooltip'

import { DemoSection } from '@/components/demo-section'

export function TooltipDemo() {
  return (
    <DemoSection title="Default">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button type="button" variant="outline">
                Hover me
              </Button>
            }
          />
          <TooltipContent>
            <p>Tooltip content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DemoSection>
  )
}
