import { Button } from '@firefly/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@firefly/ui/components/ui/dialog'

import { DemoSection } from '@/components/demo-section'

export function DialogDemo() {
  return (
    <DemoSection title="Default">
      <Dialog>
        <DialogTrigger render={<Button type="button">Open dialog</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save changes?</DialogTitle>
            <DialogDescription>
              Your provider settings will be updated on this device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="button">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DemoSection>
  )
}
