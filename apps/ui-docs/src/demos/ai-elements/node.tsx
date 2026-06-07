import { DemoSection } from '@/components/demo-section'
import { FlowShell } from '@/demos/ai-elements/_flow-shell'

export function NodeDemo() {
  return (
    <DemoSection description="Custom node with header and content inside a flow." title="Flow node">
      <FlowShell showPanel={false} />
    </DemoSection>
  )
}
