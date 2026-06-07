import { DemoSection } from '@/components/demo-section'
import { FlowShell } from '@/demos/ai-elements/_flow-shell'

export function ControlsDemo() {
  return (
    <DemoSection description="Zoom and fit controls for the flow canvas." title="Flow controls">
      <FlowShell showPanel={false} />
    </DemoSection>
  )
}
