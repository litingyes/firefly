import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from '@firefly/ui/components/ai-elements/checkpoint'

import { DemoSection } from '@/components/demo-section'

export function CheckpointDemo() {
  return (
    <DemoSection title="Conversation checkpoint">
      <Checkpoint>
        <CheckpointIcon />
        <CheckpointTrigger tooltip="Restore checkpoint">Turn 3</CheckpointTrigger>
      </Checkpoint>
    </DemoSection>
  )
}
