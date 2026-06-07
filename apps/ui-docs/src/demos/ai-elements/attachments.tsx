import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  Attachments,
} from '@firefly/ui/components/ai-elements/attachments'

import { DemoSection } from '@/components/demo-section'

export function AttachmentsDemo() {
  return (
    <DemoSection title="File list">
      <Attachments variant="list">
        <Attachment
          data={{
            id: '1',
            type: 'file',
            filename: 'notes.pdf',
            mediaType: 'application/pdf',
            url: 'https://example.com/notes.pdf',
          }}
        >
          <AttachmentPreview />
          <AttachmentInfo showMediaType />
        </Attachment>
      </Attachments>
    </DemoSection>
  )
}
