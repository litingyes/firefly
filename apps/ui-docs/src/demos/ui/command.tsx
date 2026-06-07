import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@firefly/ui/components/ui/command'

import { DemoSection } from '@/components/demo-section'

export function CommandDemo() {
  return (
    <DemoSection title="Default">
      <Command className="max-w-sm rounded-lg border">
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </DemoSection>
  )
}
