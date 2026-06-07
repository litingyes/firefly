import { SpeechInput } from '@firefly/ui/components/ai-elements/speech-input'
import { toast } from 'sonner'

import { DemoSection } from '@/components/demo-section'

export function SpeechInputDemo() {
  return (
    <DemoSection description="Uses browser speech APIs when available." title="Voice input">
      <SpeechInput onTranscriptionChange={(text) => toast(text || 'Listening…')} />
    </DemoSection>
  )
}
