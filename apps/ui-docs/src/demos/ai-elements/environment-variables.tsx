import {
  EnvironmentVariable,
  EnvironmentVariables,
  EnvironmentVariablesContent,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
} from '@firefly/ui/components/ai-elements/environment-variables'

import { DemoSection } from '@/components/demo-section'

export function EnvironmentVariablesDemo() {
  return (
    <DemoSection title="Env vars">
      <EnvironmentVariables>
        <EnvironmentVariablesHeader>
          <EnvironmentVariablesTitle />
          <EnvironmentVariablesToggle />
        </EnvironmentVariablesHeader>
        <EnvironmentVariablesContent>
          <EnvironmentVariable name="OPENAI_API_KEY" value="sk-demo-key" />
        </EnvironmentVariablesContent>
      </EnvironmentVariables>
    </DemoSection>
  )
}
