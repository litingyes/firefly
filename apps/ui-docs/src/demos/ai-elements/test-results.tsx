import {
  Test,
  TestError,
  TestErrorMessage,
  TestResults,
  TestResultsContent,
  TestResultsProgress,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
} from '@firefly/ui/components/ai-elements/test-results'

import { DemoSection } from '@/components/demo-section'

export function TestResultsDemo() {
  return (
    <DemoSection title="Test run">
      <TestResults summary={{ passed: 8, failed: 1, skipped: 0, total: 9, duration: 1240 }}>
        <TestResultsContent>
          <TestResultsProgress />
          <TestSuite defaultOpen name="chat-workspace" status="failed">
            <TestSuiteName />
            <TestSuiteContent>
              <Test duration={42} name="renders messages" status="passed" />
              <Test duration={118} name="streams assistant reply" status="failed">
                <TestError>
                  <TestErrorMessage>Expected chunk, got none</TestErrorMessage>
                </TestError>
              </Test>
            </TestSuiteContent>
          </TestSuite>
        </TestResultsContent>
      </TestResults>
    </DemoSection>
  )
}
