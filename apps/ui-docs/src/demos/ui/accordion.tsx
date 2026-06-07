import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@firefly/ui/components/ui/accordion'

import { DemoSection } from '@/components/demo-section'

export function AccordionDemo() {
  return (
    <DemoSection title="Default">
      <Accordion defaultValue={['item-1']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It follows WAI-ARIA patterns.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>Yes. It uses your design tokens.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </DemoSection>
  )
}
