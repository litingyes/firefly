import { Button } from '@firefly/ui/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@firefly/ui/components/ui/item'

import { DemoSection } from '@/components/demo-section'

export function ItemDemo() {
  return (
    <DemoSection title="Default">
      <ItemGroup className="max-w-md">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Firefly UI</ItemTitle>
            <ItemDescription>Shared component library.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" type="button" variant="outline">
              Open
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </DemoSection>
  )
}
