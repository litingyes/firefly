import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@firefly/ui/components/ai-elements/prompt-input'
import { toast } from 'sonner'

import { DemoSection } from '@/components/demo-section'

export function PromptInputDemo() {
  return (
    <DemoSection title="Chat input">
      <PromptInput
        className="max-w-xl"
        onSubmit={({ text }) => {
          toast(`Submitted: ${text}`)
        }}
      >
        <PromptInputBody>
          <PromptInputTextarea placeholder="Ask Firefly anything..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
    </DemoSection>
  )
}
