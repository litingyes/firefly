import { Alert, AlertDescription, AlertTitle } from '@firefly/ui/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

import { DemoSection } from '@/components/demo-section'

export function AlertDemo() {
  return (
    <DemoSection title="Default">
      <Alert>
        <AlertCircleIcon />
        <AlertTitle>Connection failed</AlertTitle>
        <AlertDescription>Check your API key and try the test again.</AlertDescription>
      </Alert>
    </DemoSection>
  )
}
