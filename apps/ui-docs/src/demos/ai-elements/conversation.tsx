import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from '@firefly/ui/components/ai-elements/conversation'
import { Message, MessageContent } from '@firefly/ui/components/ai-elements/message'

import { DemoSection } from '@/components/demo-section'

export function ConversationDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="With messages">
        <Conversation className="h-64 rounded-lg border border-border">
          <ConversationContent>
            <Message from="user">
              <MessageContent>Hello</MessageContent>
            </Message>
            <Message from="assistant">
              <MessageContent>Hi. What would you like to work on?</MessageContent>
            </Message>
          </ConversationContent>
        </Conversation>
      </DemoSection>

      <DemoSection title="Empty state">
        <Conversation className="h-48 rounded-lg border border-border">
          <ConversationEmptyState description="Send a message to start." title="No messages yet" />
        </Conversation>
      </DemoSection>
    </div>
  )
}
