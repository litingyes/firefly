import { Button } from '@firefly/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@firefly/ui/components/ui/card'

import { DemoSection } from '@/components/demo-section'

export function CardDemo() {
  return (
    <DemoSection title="Default">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Provider</CardTitle>
          <CardDescription>Connect a model vendor to start chatting.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Keys stay on this device.</p>
        </CardContent>
        <CardFooter>
          <Button type="button">Configure</Button>
        </CardFooter>
      </Card>
    </DemoSection>
  )
}
