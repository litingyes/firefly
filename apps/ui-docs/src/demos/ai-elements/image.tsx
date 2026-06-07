import { Image } from '@firefly/ui/components/ai-elements/image'

import { DemoSection } from '@/components/demo-section'

const placeholderBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

export function ImageDemo() {
  return (
    <DemoSection title="Generated image">
      <Image
        alt="1×1 placeholder"
        base64={placeholderBase64}
        className="w-32 rounded-lg border"
        mediaType="image/png"
        uint8Array={new Uint8Array()}
      />
    </DemoSection>
  )
}
