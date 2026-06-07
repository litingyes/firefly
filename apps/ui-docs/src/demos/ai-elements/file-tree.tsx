import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from '@firefly/ui/components/ai-elements/file-tree'

import { DemoSection } from '@/components/demo-section'

export function FileTreeDemo() {
  return (
    <DemoSection title="Project tree">
      <FileTree defaultExpanded={new Set(['src'])}>
        <FileTreeFolder name="src" path="src">
          <FileTreeFile name="App.tsx" path="src/App.tsx" />
        </FileTreeFolder>
      </FileTree>
    </DemoSection>
  )
}
