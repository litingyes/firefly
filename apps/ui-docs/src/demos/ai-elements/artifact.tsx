import {
  Artifact,
  ArtifactClose,
  ArtifactContent,
  ArtifactHeader,
  ArtifactTitle,
} from '@firefly/ui/components/ai-elements/artifact'

import { DemoSection } from '@/components/demo-section'

export function ArtifactDemo() {
  return (
    <DemoSection title="Default">
      <Artifact className="max-w-md">
        <ArtifactHeader>
          <ArtifactTitle>Generated report</ArtifactTitle>
          <ArtifactClose />
        </ArtifactHeader>
        <ArtifactContent>Preview content goes here.</ArtifactContent>
      </Artifact>
    </DemoSection>
  )
}
