import { Button } from '@firefly/ui/components/ui/button'
import { Input } from '@firefly/ui/components/ui/input'
import { Label } from '@firefly/ui/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@firefly/ui/components/ui/popover'

import { DemoSection } from '@/components/demo-section'

export function PopoverDemo() {
  return (
    <DemoSection title="Default">
      <Popover>
        <PopoverTrigger
          render={
            <Button type="button" variant="outline">
              Open popover
            </Button>
          }
        />
        <PopoverContent className="w-72">
          <div className="grid gap-3">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Dimensions</h4>
              <p className="text-muted-foreground text-xs">Set the canvas size.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="width">Width</Label>
              <Input defaultValue="100%" id="width" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </DemoSection>
  )
}
