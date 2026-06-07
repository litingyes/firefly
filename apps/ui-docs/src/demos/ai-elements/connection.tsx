import { DemoSection } from '@/components/demo-section'
import { FlowShell } from '@/demos/ai-elements/_flow-shell'

export function ConnectionDemo() {
  return (
    <DemoSection
      description="Drag between nodes to preview the custom connection line."
      title="Connection line"
    >
      <FlowShell showPanel={false} />
    </DemoSection>
  )
}
