import {
  PackageInfo,
  PackageInfoDependencies,
  PackageInfoDependency,
  PackageInfoDescription,
} from '@firefly/ui/components/ai-elements/package-info'

import { DemoSection } from '@/components/demo-section'

export function PackageInfoDemo() {
  return (
    <DemoSection title="Package diff">
      <PackageInfo changeType="minor" currentVersion="0.1.0" name="@firefly/ui" newVersion="0.2.0">
        <PackageInfoDescription>Shared UI primitives for Firefly apps.</PackageInfoDescription>
        <PackageInfoDependencies>
          <PackageInfoDependency name="react" version="^19.0.0" />
        </PackageInfoDependencies>
      </PackageInfo>
    </DemoSection>
  )
}
