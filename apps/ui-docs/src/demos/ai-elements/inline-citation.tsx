import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationSource,
  InlineCitationText,
} from '@firefly/ui/components/ai-elements/inline-citation'

import { DemoSection } from '@/components/demo-section'

export function InlineCitationDemo() {
  return (
    <DemoSection title="Inline source">
      <InlineCitation>
        <InlineCitationText>Firefly uses shared UI primitives</InlineCitationText>
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={['https://ui.shadcn.com']} />
          <InlineCitationCardBody>
            <InlineCitationSource
              description="Re-usable components."
              title="shadcn/ui"
              url="https://ui.shadcn.com"
            />
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
    </DemoSection>
  )
}
