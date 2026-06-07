import { Button } from '@firefly/ui/components/ui/button'
import { Spinner } from '@firefly/ui/components/ui/spinner'

import { DemoSection } from '@/components/demo-section'

export function ButtonDemo() {
  return (
    <div className="space-y-8">
      <DemoSection description="Primary actions and hierarchy." title="Variants">
        <div className="flex flex-wrap gap-2">
          <Button type="button">Default</Button>
          <Button type="button" variant="secondary">
            Secondary
          </Button>
          <Button type="button" variant="outline">
            Outline
          </Button>
          <Button type="button" variant="ghost">
            Ghost
          </Button>
          <Button type="button" variant="destructive">
            Destructive
          </Button>
          <Button type="button" variant="link">
            Link
          </Button>
        </div>
      </DemoSection>

      <DemoSection description="Density for toolbars and forms." title="Sizes">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs" type="button">
            Extra small
          </Button>
          <Button size="sm" type="button">
            Small
          </Button>
          <Button type="button">Default</Button>
          <Button size="lg" type="button">
            Large
          </Button>
        </div>
      </DemoSection>

      <DemoSection description="Pending actions and icon-only controls." title="States">
        <div className="flex flex-wrap items-center gap-2">
          <Button disabled type="button">
            Disabled
          </Button>
          <Button disabled type="button">
            <Spinner className="size-4" />
            Saving
          </Button>
          <Button aria-label="Add item" size="icon" type="button" variant="outline">
            +
          </Button>
        </div>
      </DemoSection>
    </div>
  )
}
