import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewUrl,
} from '@firefly/ui/components/ai-elements/web-preview'

import { DemoSection } from '@/components/demo-section'

export function WebPreviewDemo() {
  return (
    <DemoSection title="Embedded preview">
      <WebPreview className="h-96" defaultUrl="https://example.com">
        <WebPreviewNavigation>
          <WebPreviewUrl />
        </WebPreviewNavigation>
        <WebPreviewBody />
        <WebPreviewConsole
          logs={[{ level: 'log', message: 'Page loaded', timestamp: new Date() }]}
        />
      </WebPreview>
    </DemoSection>
  )
}
