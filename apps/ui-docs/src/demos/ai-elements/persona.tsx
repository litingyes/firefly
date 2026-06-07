import { Persona } from '@firefly/ui/components/ai-elements/persona'

import { DemoSection } from '@/components/demo-section'

export function PersonaDemo() {
  return (
    <DemoSection
      description="Loads remote Rive assets. Requires network."
      title="Assistant persona"
    >
      <Persona state="thinking" variant="obsidian" />
    </DemoSection>
  )
}
