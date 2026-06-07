import {
  Commit,
  CommitAuthor,
  CommitAuthorAvatar,
  CommitContent,
  CommitFile,
  CommitFilePath,
  CommitFileStatus,
  CommitFiles,
  CommitHash,
  CommitHeader,
  CommitMessage,
  CommitMetadata,
  CommitTimestamp,
} from '@firefly/ui/components/ai-elements/commit'

import { DemoSection } from '@/components/demo-section'

export function CommitDemo() {
  return (
    <DemoSection title="Git commit">
      <Commit defaultOpen>
        <CommitHeader>
          <CommitHash>abc1234</CommitHash>
          <CommitMessage>Fix provider settings</CommitMessage>
          <CommitMetadata>
            <CommitAuthor>
              <CommitAuthorAvatar initials="LT" />
            </CommitAuthor>
            <CommitTimestamp date={new Date()} />
          </CommitMetadata>
        </CommitHeader>
        <CommitContent>
          <CommitFiles>
            <CommitFile>
              <CommitFileStatus status="modified" />
              <CommitFilePath>apps/app/src/App.tsx</CommitFilePath>
            </CommitFile>
          </CommitFiles>
        </CommitContent>
      </Commit>
    </DemoSection>
  )
}
