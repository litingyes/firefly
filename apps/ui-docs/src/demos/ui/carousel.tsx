import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@firefly/ui/components/ui/carousel'

import { DemoSection } from '@/components/demo-section'

export function CarouselDemo() {
  return (
    <DemoSection title="Default">
      <Carousel className="mx-auto w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 3 }, (_, i) => (
            <CarouselItem key={i}>
              <div className="flex aspect-square items-center justify-center rounded-lg border p-6">
                Slide {i + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </DemoSection>
  )
}
