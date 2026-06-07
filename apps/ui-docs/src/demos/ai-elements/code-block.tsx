import { CodeBlock } from '@firefly/ui/components/ai-elements/code-block'

import { DemoSection } from '@/components/demo-section'

const sample = `import { Button } from '@firefly/ui/components/ui/button'

export function Example() {
  return <Button type="button">Send</Button>
}`

export function CodeBlockDemo() {
  return (
    <DemoSection title="Syntax highlighting">
      <CodeBlock code={sample} language="tsx" />
    </DemoSection>
  )
}
