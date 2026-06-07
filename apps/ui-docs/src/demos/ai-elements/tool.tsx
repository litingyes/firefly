import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@firefly/ui/components/ai-elements/tool'

import { DemoSection } from '@/components/demo-section'

export function ToolDemo() {
  return (
    <DemoSection title="Tool call">
      <Tool defaultOpen>
        <ToolHeader state="output-available" title="web_search" type="tool-web_search" />
        <ToolContent>
          <ToolInput input={{ query: 'firefly ai desktop app' }} />
          <ToolOutput
            errorText={undefined}
            output={{ results: [{ title: 'Firefly', url: 'https://example.com' }] }}
          />
        </ToolContent>
      </Tool>
    </DemoSection>
  )
}
