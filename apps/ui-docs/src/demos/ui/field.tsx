import { Field, FieldDescription, FieldGroup, FieldLabel } from '@firefly/ui/components/ui/field'
import { Input } from '@firefly/ui/components/ui/input'

import { DemoSection } from '@/components/demo-section'

export function FieldDemo() {
  return (
    <DemoSection title="Vertical">
      <FieldGroup className="max-w-sm">
        <Field>
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" placeholder="you@example.com" type="email" />
          <FieldDescription>We never share your email.</FieldDescription>
        </Field>
      </FieldGroup>
    </DemoSection>
  )
}
