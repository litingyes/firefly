import {
  StackTrace,
  StackTraceActions,
  StackTraceContent,
  StackTraceCopyButton,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceExpandButton,
  StackTraceFrames,
  StackTraceHeader,
} from '@firefly/ui/components/ai-elements/stack-trace'

import { DemoSection } from '@/components/demo-section'

const trace = `TypeError: Cannot read properties of undefined
  at App (src/App.tsx:12:5)`

export function StackTraceDemo() {
  return (
    <DemoSection title="Error trace">
      <StackTrace defaultOpen trace={trace}>
        <StackTraceHeader>
          <StackTraceError>
            <StackTraceErrorType />
            <StackTraceErrorMessage />
          </StackTraceError>
          <StackTraceActions>
            <StackTraceCopyButton />
            <StackTraceExpandButton />
          </StackTraceActions>
        </StackTraceHeader>
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    </DemoSection>
  )
}
