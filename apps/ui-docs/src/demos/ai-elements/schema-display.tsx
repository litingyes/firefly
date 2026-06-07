import { SchemaDisplay } from '@firefly/ui/components/ai-elements/schema-display'

import { DemoSection } from '@/components/demo-section'

export function SchemaDisplayDemo() {
  return (
    <DemoSection title="API schema">
      <SchemaDisplay
        description="Retrieve a model by ID"
        method="GET"
        parameters={[{ name: 'model', type: 'string', required: true, location: 'path' }]}
        path="/v1/models/{model}"
      />
    </DemoSection>
  )
}
