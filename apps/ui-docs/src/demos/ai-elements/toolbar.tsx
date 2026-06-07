import { DemoSection } from '@/components/demo-section'
import { FlowShell } from '@/demos/ai-elements/_flow-shell'

export function ToolbarDemo() {
  return (
    <DemoSection
      description="Node toolbar appears when a flow node is selected."
      title="Node toolbar"
    >
      <FlowShell showPanel={false} />
    </DemoSection>
  )
}
