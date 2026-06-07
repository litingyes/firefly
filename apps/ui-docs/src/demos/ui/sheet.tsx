import { Button } from '@firefly/ui/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@firefly/ui/components/ui/sheet'

import { DemoSection } from '@/components/demo-section'

export function SheetDemo() {
  return (
    <DemoSection title="Right">
      <Sheet>
        <SheetTrigger
          render={
            <Button type="button" variant="outline">
              Open sheet
            </Button>
          }
        />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet title</SheetTitle>
            <SheetDescription>Sheet description.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </DemoSection>
  )
}
