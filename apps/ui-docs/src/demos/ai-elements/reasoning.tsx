import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@firefly/ui/components/ai-elements/reasoning'

import { DemoSection } from '@/components/demo-section'

export function ReasoningDemo() {
  return (
    <DemoSection title="Collapsible reasoning">
      <Reasoning defaultOpen duration={4}>
        <ReasoningTrigger />
        <ReasoningContent>
          The user asked about provider setup. I should mention settings navigation, API key
          storage, and the connection test flow.
        </ReasoningContent>
      </Reasoning>
    </DemoSection>
  )
}
