import {
  Snippet,
  SnippetAddon,
  SnippetCopyButton,
  SnippetInput,
  SnippetText,
} from '@firefly/ui/components/ai-elements/snippet'

import { DemoSection } from '@/components/demo-section'

export function SnippetDemo() {
  return (
    <DemoSection title="Command snippet">
      <Snippet code="pnpm ui-docs:dev">
        <SnippetAddon align="inline-start">
          <SnippetText>$</SnippetText>
        </SnippetAddon>
        <SnippetInput />
        <SnippetAddon align="inline-end">
          <SnippetCopyButton />
        </SnippetAddon>
      </Snippet>
    </DemoSection>
  )
}
