import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from '@firefly/ui/components/ai-elements/chain-of-thought'

import { DemoSection } from '@/components/demo-section'

export function ChainOfThoughtDemo() {
  return (
    <DemoSection title="Reasoning steps">
      <ChainOfThought defaultOpen>
        <ChainOfThoughtHeader />
        <ChainOfThoughtContent>
          <ChainOfThoughtStep label="Searching docs" status="complete" />
          <ChainOfThoughtStep label="Synthesizing answer" status="active">
            <ChainOfThoughtSearchResults>
              <ChainOfThoughtSearchResult>react.dev</ChainOfThoughtSearchResult>
            </ChainOfThoughtSearchResults>
          </ChainOfThoughtStep>
        </ChainOfThoughtContent>
      </ChainOfThought>
    </DemoSection>
  )
}
