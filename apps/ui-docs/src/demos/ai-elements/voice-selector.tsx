import {
  VoiceSelector,
  VoiceSelectorAccent,
  VoiceSelectorContent,
  VoiceSelectorGender,
  VoiceSelectorGroup,
  VoiceSelectorInput,
  VoiceSelectorItem,
  VoiceSelectorList,
  VoiceSelectorName,
  VoiceSelectorPreview,
  VoiceSelectorTrigger,
} from '@firefly/ui/components/ai-elements/voice-selector'
import { Button } from '@firefly/ui/components/ui/button'

import { DemoSection } from '@/components/demo-section'

export function VoiceSelectorDemo() {
  return (
    <DemoSection title="Voice picker">
      <VoiceSelector>
        <VoiceSelectorTrigger render={<Button variant="outline">Select voice</Button>} />
        <VoiceSelectorContent>
          <VoiceSelectorInput placeholder="Search voices..." />
          <VoiceSelectorList>
            <VoiceSelectorGroup heading="English">
              <VoiceSelectorItem value="alloy">
                <VoiceSelectorPreview />
                <VoiceSelectorName>Alloy</VoiceSelectorName>
                <VoiceSelectorGender value="non-binary" />
                <VoiceSelectorAccent value="american" />
              </VoiceSelectorItem>
            </VoiceSelectorGroup>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    </DemoSection>
  )
}
