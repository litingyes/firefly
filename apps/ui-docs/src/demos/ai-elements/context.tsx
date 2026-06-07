import {
  Context,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextTrigger,
} from '@firefly/ui/components/ai-elements/context'

import { DemoSection } from '@/components/demo-section'

export function ContextDemo() {
  return (
    <DemoSection title="Token usage">
      <Context maxTokens={128000} modelId="openai/gpt-4o" usedTokens={4200}>
        <ContextTrigger />
        <ContextContent>
          <ContextContentHeader />
          <ContextContentBody>
            <ContextInputUsage />
            <ContextOutputUsage />
          </ContextContentBody>
          <ContextContentFooter />
        </ContextContent>
      </Context>
    </DemoSection>
  )
}
