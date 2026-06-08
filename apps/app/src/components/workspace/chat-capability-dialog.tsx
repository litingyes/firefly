import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@firefly/ui/components/ui/dialog'

import { ChatWebSearchFields } from '@/components/scenes/chat-web-search-fields'

interface ChatCapabilityDialogProps {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function ChatCapabilityDialog({ onOpenChange, open }: ChatCapabilityDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Capabilities</DialogTitle>
          <DialogDescription>
            Configure tools available to the chat agent for this conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-muted/20 p-4">
          <ChatWebSearchFields providerSelectId="chat-capability-web-search-provider" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
