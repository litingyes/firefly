import { Button } from '@firefly/ui/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@firefly/ui/components/ui/empty'
import { InboxIcon } from 'lucide-react'

import { DemoSection } from '@/components/demo-section'

export function EmptyDemo() {
  return (
    <DemoSection title="Default">
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No messages</EmptyTitle>
          <EmptyDescription>Your inbox is empty.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button">Compose</Button>
        </EmptyContent>
      </Empty>
    </DemoSection>
  )
}
