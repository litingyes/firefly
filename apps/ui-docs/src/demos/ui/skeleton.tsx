import { Skeleton } from '@firefly/ui/components/ui/skeleton'

import { DemoSection } from '@/components/demo-section'

export function SkeletonDemo() {
  return (
    <DemoSection title="Loading placeholder">
      <div className="flex items-center gap-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </DemoSection>
  )
}
