import { Avatar, AvatarFallback, AvatarImage } from '@firefly/ui/components/ui/avatar'

import { DemoSection } from '@/components/demo-section'

export function AvatarDemo() {
  return (
    <DemoSection title="Default">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage alt="Firefly" src="https://github.com/shadcn.png" />
          <AvatarFallback>FF</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      </div>
    </DemoSection>
  )
}
