import { Message, MessageContent } from '@firefly/ui/components/ai-elements/message'

import { DemoSection } from '@/components/demo-section'

export function MessageDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="User message">
        <Message from="user">
          <MessageContent>How do I connect OpenAI in Firefly?</MessageContent>
        </Message>
      </DemoSection>

      <DemoSection title="Assistant message">
        <Message from="assistant">
          <MessageContent>
            Open Settings, choose Providers, then paste your API key and run the connection test.
          </MessageContent>
        </Message>
      </DemoSection>
    </div>
  )
}
