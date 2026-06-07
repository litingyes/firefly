import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInTrigger,
} from '@firefly/ui/components/ai-elements/open-in-chat'

import { DemoSection } from '@/components/demo-section'

export function OpenInChatDemo() {
  return (
    <DemoSection title="Open in chat">
      <OpenIn query="Explain Firefly monorepo layout">
        <OpenInTrigger />
        <OpenInContent>
          <OpenInChatGPT />
          <OpenInClaude />
        </OpenInContent>
      </OpenIn>
    </DemoSection>
  )
}
