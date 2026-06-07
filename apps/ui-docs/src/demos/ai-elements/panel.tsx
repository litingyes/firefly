import { DemoSection } from '@/components/demo-section'
import { FlowShell } from '@/demos/ai-elements/_flow-shell'

export function PanelDemo() {
  return (
    <DemoSection description="Overlay panel positioned on the flow canvas." title="Flow panel">
      <FlowShell panelContent="Legend" showPanel />
    </DemoSection>
  )
}
