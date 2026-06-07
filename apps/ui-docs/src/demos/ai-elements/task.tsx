import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from '@firefly/ui/components/ai-elements/task'

import { DemoSection } from '@/components/demo-section'

export function TaskDemo() {
  return (
    <DemoSection title="Agent task">
      <Task>
        <TaskTrigger title="Searching documentation" />
        <TaskContent>
          <TaskItem>Found 3 relevant pages</TaskItem>
          <TaskItemFile>AGENTS.md</TaskItemFile>
        </TaskContent>
      </Task>
    </DemoSection>
  )
}
