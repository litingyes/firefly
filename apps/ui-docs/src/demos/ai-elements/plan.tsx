import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from '@firefly/ui/components/ai-elements/plan'

import { DemoSection } from '@/components/demo-section'

export function PlanDemo() {
  return (
    <DemoSection title="Task plan">
      <Plan defaultOpen>
        <PlanHeader>
          <div>
            <PlanTitle>Implement chat transport</PlanTitle>
            <PlanDescription>Wire AI SDK streaming into the workspace shell.</PlanDescription>
          </div>
          <PlanAction>
            <PlanTrigger />
          </PlanAction>
        </PlanHeader>
        <PlanContent>
          <ol className="list-decimal pl-4 text-sm">
            <li>Add provider config</li>
            <li>Connect useChat</li>
          </ol>
        </PlanContent>
      </Plan>
    </DemoSection>
  )
}
