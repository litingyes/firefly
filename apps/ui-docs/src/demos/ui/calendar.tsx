import { Calendar } from '@firefly/ui/components/ui/calendar'

import { DemoSection } from '@/components/demo-section'

export function CalendarDemo() {
  return (
    <DemoSection title="Single select">
      <Calendar className="rounded-lg border" mode="single" />
    </DemoSection>
  )
}
