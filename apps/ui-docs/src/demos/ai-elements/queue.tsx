import {
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from '@firefly/ui/components/ai-elements/queue'

import { DemoSection } from '@/components/demo-section'

export function QueueDemo() {
  return (
    <DemoSection title="Task queue">
      <Queue>
        <QueueSection>
          <QueueSectionTrigger>
            <QueueSectionLabel count={2} label="tasks" />
          </QueueSectionTrigger>
          <QueueSectionContent>
            <QueueList>
              <QueueItem>
                <QueueItemIndicator />
                <QueueItemContent>Summarize search results</QueueItemContent>
              </QueueItem>
              <QueueItem>
                <QueueItemIndicator />
                <QueueItemContent>Draft follow-up reply</QueueItemContent>
              </QueueItem>
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      </Queue>
    </DemoSection>
  )
}
