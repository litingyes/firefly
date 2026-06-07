import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@firefly/ui/components/ui/combobox'

import { DemoSection } from '@/components/demo-section'

const frameworks = ['Next.js', 'Remix', 'Astro']

export function ComboboxDemo() {
  return (
    <DemoSection title="Default">
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Select framework…" />
        <ComboboxContent>
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </DemoSection>
  )
}
