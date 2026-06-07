import {
  Sandbox,
  SandboxContent,
  SandboxHeader,
  SandboxTabContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
} from '@firefly/ui/components/ai-elements/sandbox'

import { DemoSection } from '@/components/demo-section'

export function SandboxDemo() {
  return (
    <DemoSection title="Code sandbox">
      <Sandbox>
        <SandboxHeader state="output-available" title="run_code" />
        <SandboxContent>
          <SandboxTabs defaultValue="output">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
            <SandboxTabContent value="output">Hello, world!</SandboxTabContent>
            <SandboxTabContent value="code">console.log(&apos;Hello&apos;)</SandboxTabContent>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    </DemoSection>
  )
}
