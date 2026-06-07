import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@firefly/ui/components/ui/alert-dialog'
import { Button } from '@firefly/ui/components/ui/button'

import { DemoSection } from '@/components/demo-section'

export function AlertDialogDemo() {
  return (
    <DemoSection title="Default">
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button type="button" variant="destructive">
              Delete key
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API key?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the stored key from your device. You can add it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DemoSection>
  )
}
