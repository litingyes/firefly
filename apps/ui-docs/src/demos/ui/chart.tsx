import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@firefly/ui/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { DemoSection } from '@/components/demo-section'

const chartData = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
]

const chartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function ChartDemo() {
  return (
    <DemoSection title="Bar chart">
      <ChartContainer className="max-w-md" config={chartConfig}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis axisLine={false} dataKey="month" tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        </BarChart>
      </ChartContainer>
    </DemoSection>
  )
}
