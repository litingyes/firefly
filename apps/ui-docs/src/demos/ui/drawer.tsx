import { Button } from '@firefly/ui/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@firefly/ui/components/ui/drawer'

import { DemoSection } from '@/components/demo-section'

export function DrawerDemo() {
  return (
    <DemoSection title="Bottom">
      <Drawer>
        <DrawerTrigger asChild>
          <Button type="button" variant="outline">
            Open drawer
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer title</DrawerTitle>
            <DrawerDescription>Drawer description.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button type="button">Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DemoSection>
  )
}
