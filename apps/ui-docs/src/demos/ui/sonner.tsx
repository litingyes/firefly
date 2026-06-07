import { Button } from '@firefly/ui/components/ui/button'
import { toast } from 'sonner'

import { DemoSection } from '@/components/demo-section'

export function SonnerDemo() {
  return (
    <DemoSection title="Toast triggers">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast('Settings saved')} type="button">
          Show toast
        </Button>
        <Button
          onClick={() => toast.success('Connection test passed')}
          type="button"
          variant="outline"
        >
          Success
        </Button>
        <Button
          onClick={() => toast.error('API key is invalid')}
          type="button"
          variant="destructive"
        >
          Error
        </Button>
      </div>
    </DemoSection>
  )
}
