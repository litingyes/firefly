import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@firefly/ui/components/ai-elements/sources'

import { DemoSection } from '@/components/demo-section'

export function SourcesDemo() {
  return (
    <DemoSection title="Citations">
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source href="https://react.dev" title="React Docs" />
          <Source href="https://ai-sdk.dev" title="AI SDK" />
        </SourcesContent>
      </Sources>
    </DemoSection>
  )
}
