import { AspectRatio } from '@firefly/ui/components/ui/aspect-ratio'

import { DemoSection } from '@/components/demo-section'

export function AspectRatioDemo() {
  return (
    <DemoSection title="16:9">
      <AspectRatio className="max-w-sm overflow-hidden rounded-lg bg-muted" ratio={16 / 9}>
        <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
          16:9 content
        </div>
      </AspectRatio>
    </DemoSection>
  )
}
