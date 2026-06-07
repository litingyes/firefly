import {
  Transcription,
  TranscriptionSegment,
} from '@firefly/ui/components/ai-elements/transcription'

import { DemoSection } from '@/components/demo-section'

export function TranscriptionDemo() {
  return (
    <DemoSection title="Timed segments">
      <Transcription
        currentTime={0.5}
        segments={[
          { text: 'Hello ', startSecond: 0, endSecond: 1 },
          { text: 'world', startSecond: 1, endSecond: 2 },
        ]}
      >
        {(segment, index) => <TranscriptionSegment key={index} index={index} segment={segment} />}
      </Transcription>
    </DemoSection>
  )
}
