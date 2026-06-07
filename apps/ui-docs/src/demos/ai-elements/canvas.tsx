import { DemoSection } from '@/components/demo-section'
import { FlowShell } from '@/demos/ai-elements/_flow-shell'

export function CanvasDemo() {
  return (
    <DemoSection description="React Flow canvas with custom nodes and edges." title="Workflow">
      <FlowShell showPanel panelContent="Agent flow" />
    </DemoSection>
  )
}
