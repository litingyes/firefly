import {
  Confirmation,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRequest,
  ConfirmationTitle,
} from '@firefly/ui/components/ai-elements/confirmation'

import { DemoSection } from '@/components/demo-section'

export function ConfirmationDemo() {
  return (
    <DemoSection title="Tool approval">
      <Confirmation approval={{ id: '1' }} state="approval-requested">
        <ConfirmationTitle>
          Allow tool <strong>delete_file</strong>?
        </ConfirmationTitle>
        <ConfirmationRequest>
          <ConfirmationActions>
            <ConfirmationAction variant="outline">Deny</ConfirmationAction>
            <ConfirmationAction>Allow</ConfirmationAction>
          </ConfirmationActions>
        </ConfirmationRequest>
      </Confirmation>
    </DemoSection>
  )
}
