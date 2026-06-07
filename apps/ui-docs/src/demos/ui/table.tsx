import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@firefly/ui/components/ui/table'

import { DemoSection } from '@/components/demo-section'

const models = [
  { id: 'gpt-4', provider: 'OpenAI', status: 'Connected' },
  { id: 'claude-3', provider: 'Anthropic', status: 'Connected' },
  { id: 'gemini', provider: 'Google', status: 'Idle' },
]

export function TableDemo() {
  return (
    <DemoSection title="Default">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id}>
              <TableCell className="font-medium">{model.id}</TableCell>
              <TableCell>{model.provider}</TableCell>
              <TableCell>{model.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DemoSection>
  )
}
