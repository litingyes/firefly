import { Tabs, TabsContent, TabsList, TabsTrigger } from '@firefly/ui/components/ui/tabs'

import { DemoSection } from '@/components/demo-section'

export function TabsDemo() {
  return (
    <DemoSection title="Default">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent className="text-sm" value="account">
          Manage your account settings.
        </TabsContent>
        <TabsContent className="text-sm" value="password">
          Change your password here.
        </TabsContent>
      </Tabs>
    </DemoSection>
  )
}
