import {
  JSXPreview,
  JSXPreviewContent,
  JSXPreviewError,
} from '@firefly/ui/components/ai-elements/jsx-preview'

import { DemoSection } from '@/components/demo-section'

export function JsxPreviewDemo() {
  return (
    <DemoSection title="Live JSX">
      <JSXPreview jsx={'<div className="rounded border p-4">Hello from JSX</div>'}>
        <JSXPreviewContent />
        <JSXPreviewError />
      </JSXPreview>
    </DemoSection>
  )
}
