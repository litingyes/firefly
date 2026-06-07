import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from '@firefly/ui/components/ai-elements/model-selector'
import { Button } from '@firefly/ui/components/ui/button'

import { DemoSection } from '@/components/demo-section'

export function ModelSelectorDemo() {
  return (
    <DemoSection title="Model picker">
      <ModelSelector>
        <ModelSelectorTrigger render={<Button variant="outline">Choose model</Button>} />
        <ModelSelectorContent>
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorList>
            <ModelSelectorGroup heading="OpenAI">
              <ModelSelectorItem value="gpt-4o">
                <ModelSelectorLogo provider="openai" />
                <ModelSelectorName>gpt-4o</ModelSelectorName>
              </ModelSelectorItem>
            </ModelSelectorGroup>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    </DemoSection>
  )
}
