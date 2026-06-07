import { DemoSection } from '@/components/demo-section'
import { FlowShell } from '@/demos/ai-elements/_flow-shell'

export function EdgeDemo() {
  return (
    <DemoSection description="Animated edge between workflow nodes." title="Animated edge">
      <FlowShell showPanel={false} />
    </DemoSection>
  )
}
