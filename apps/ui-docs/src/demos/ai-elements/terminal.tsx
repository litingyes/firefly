import { Terminal } from '@firefly/ui/components/ai-elements/terminal'

import { DemoSection } from '@/components/demo-section'

export function TerminalDemo() {
  return (
    <DemoSection title="Command output">
      <Terminal isStreaming output={'$ pnpm dev\n> Local: http://localhost:1520\n'} />
    </DemoSection>
  )
}
