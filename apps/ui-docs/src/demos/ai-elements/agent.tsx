import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
} from '@firefly/ui/components/ai-elements/agent'

import { DemoSection } from '@/components/demo-section'

export function AgentDemo() {
  return (
    <DemoSection title="Agent card">
      <Agent>
        <AgentHeader model="gpt-4o" name="Research Agent" />
        <AgentContent>
          <AgentInstructions>You summarize web search results concisely.</AgentInstructions>
          <AgentOutput schema="interface Result { summary: string }" />
        </AgentContent>
      </Agent>
    </DemoSection>
  )
}
